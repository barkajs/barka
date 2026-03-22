import fs from 'node:fs';
import path from 'node:path';
import { createContentEngine, resolveContentPath } from '../content-engine.js';
import { loadSites, filterContentBySite } from '../lib/multisite.js';
import { createThemeResolver } from '../lib/theme-loader.js';
import { renderContent } from '../lib/template-renderer.js';
import { loadLanguages, loadTranslations, createT } from '../lib/i18n.js';
import type { Content, SiteConfig, ContentType } from '../lib/types.js';
import {
  generateSitemap,
  generateRobotsTxt,
  generateRssFeed,
} from '../lib/seo.js';

export interface BuildOptions {
  contentDir: string;
  configDir: string;
  themesDir: string;
  publicDir: string;
  dataDir: string;
  distDir: string;
  site?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function copyDirSync(src: string, dest: string): void {
  if (!fs.existsSync(src)) return;
  fs.cpSync(src, dest, { recursive: true });
}

function writeFile(filePath: string, data: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, data, 'utf-8');
}

// ---------------------------------------------------------------------------
// Listing routes (mirrors app.ts)
// ---------------------------------------------------------------------------

const listingRoutes: Record<string, { type: string; title: string; subtitle?: string }> = {
  '/articles': { type: 'article', title: 'Insights', subtitle: 'Engineering perspectives, technical deep-dives, and industry analysis' },
  '/services': { type: 'service', title: 'Our Services' },
  '/industries': { type: 'industry', title: 'Industries', subtitle: 'Deep domain expertise across regulated and high-growth sectors' },
  '/case-studies': { type: 'case_study', title: 'Case Studies', subtitle: 'Real results for real enterprises' },
};

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export async function runBuild(opts: BuildOptions): Promise<void> {
  const startTime = performance.now();
  const siteId = opts.site;
  const baseDistDir = path.resolve(opts.distDir);
  const distDir = siteId ? path.join(baseDistDir, siteId) : baseDistDir;

  console.log('');
  console.log('  \x1b[1m\x1b[35m⬡ Barka\x1b[0m build');
  if (siteId) {
    const sites = loadSites(path.resolve(opts.configDir));
    const site = sites.find((s) => s.id === siteId);
    console.log(`  Site: ${site?.label ?? siteId} (${siteId})`);
  }
  console.log('');

  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  const engine = createContentEngine({
    contentDir: path.resolve(opts.contentDir),
    configDir: path.resolve(opts.configDir),
    dataDir: path.resolve(opts.dataDir),
    siteId,
  });

  const siteConfig = await engine.getSiteConfig();

  // Allow BASE_URL env to override settings.yaml for production deploys
  if (process.env.BASE_URL) {
    siteConfig.base_url = process.env.BASE_URL.replace(/\/+$/, '');
  }

  const contentTypes = await engine.getContentTypes();
  const allContent = await engine.listContent();
  const filtered = siteId ? filterContentBySite(allContent, siteId) : allContent;
  const published = filtered.filter((c) => c.status === 'published');

  // --- Set up theme engine (same as app.ts) --------------------------------

  const themeName = siteConfig.theme ?? 'starter';
  const themesDir = path.resolve(opts.themesDir);
  const themeResolver = createThemeResolver(themesDir, themeName);
  const themeConfig = themeResolver.getConfig();
  const themeDefaults = themeConfig.settings
    ? Object.fromEntries(
        Object.entries(themeConfig.settings)
          .filter(([_, v]) => v && typeof v === 'object' && 'default' in (v as any))
          .map(([k, v]) => [k, (v as any).default]),
      )
    : {};

  // Load translations and languages (same as app.ts)
  loadTranslations(path.resolve(opts.configDir));
  const langsConfig = loadLanguages(path.resolve(opts.configDir));
  const defaultLang = langsConfig.default;
  const languages = Object.keys(langsConfig.languages);

  let pagesBuilt = 0;

  // --- Build pages for each language ---------------------------------------

  for (const lang of languages) {
    const isDefault = lang === defaultLang;
    const prefix = isDefault ? '' : `/${lang}`;
    const langDistDir = isDefault ? distDir : path.join(distDir, lang);

    const t = createT(lang, defaultLang);

    const langSettings: Record<string, any> = {
      ...themeDefaults,
      ...siteConfig.theme_settings,
      _lang: lang,
      _defaultLang: defaultLang,
      _languages: langsConfig.languages,
      _currentPath: '/',
      _t: t,
    };

    // Filter content for this language:
    // - Content with matching langcode
    // - Content with no langcode (only for default language)
    const langContent = published.filter((c) => {
      if (c.langcode === lang) return true;
      if (!c.langcode && isDefault) return true;
      return false;
    });

    if (!isDefault && langContent.length === 0) continue;

    // --- Deduplicate by slug (first match wins) ----------------------------

    const seenSlugs = new Set<string>();
    const dedupedContent: Content[] = [];
    for (const content of langContent) {
      const urlPath = resolveContentPath(content, contentTypes);
      if (seenSlugs.has(urlPath)) continue;
      seenSlugs.add(urlPath);
      dedupedContent.push(content);
    }

    // --- Individual content pages ------------------------------------------

    for (const content of dedupedContent) {
      const urlPath = resolveContentPath(content, contentTypes);
      const outPath = path.join(langDistDir, urlPath, 'index.html');
      const fullUrlPath = `${prefix}${urlPath}`;

      try {
        const html = await renderContent(content, siteConfig, themeResolver, {
          ...langSettings,
          _currentPath: fullUrlPath,
        });
        writeFile(outPath, html);
        pagesBuilt++;
        console.log(`  \x1b[32m✓\x1b[0m ${fullUrlPath}`);
      } catch (err) {
        console.error(`  \x1b[31m✗\x1b[0m ${fullUrlPath}: ${(err as Error).message}`);
      }
    }

    // --- Listing pages -----------------------------------------------------

    for (const [routePath, listing] of Object.entries(listingRoutes)) {
      const items = dedupedContent
        .filter((item) => item.type === listing.type)
        .map((item) => ({
          ...item,
          url: `${prefix}${resolveContentPath(item, contentTypes)}`,
        }));

      if (items.length === 0) continue;

      const now = new Date();
      const virtualContent: Content = {
        id: `virtual-${lang}-${routePath.replace(/^\//, '')}`,
        slug: routePath.replace(/^\//, ''),
        title: listing.title,
        type: 'index',
        status: 'published',
        langcode: lang,
        body: '',
        bodyHtml: '',
        fields: {
          subtitle: listing.subtitle,
          items,
        },
        sections: [],
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
      };

      const fullRoutePath = `${prefix}${routePath}`;
      const outPath = path.join(langDistDir, routePath, 'index.html');
      try {
        const html = await renderContent(virtualContent, siteConfig, themeResolver, {
          ...langSettings,
          _currentPath: fullRoutePath,
        });
        writeFile(outPath, html);
        pagesBuilt++;
        console.log(`  \x1b[32m✓\x1b[0m ${fullRoutePath}`);
      } catch (err) {
        console.error(`  \x1b[31m✗\x1b[0m ${fullRoutePath}: ${(err as Error).message}`);
      }
    }

    // --- Homepage ----------------------------------------------------------

    const homepage = dedupedContent.find(
      (c) =>
        c.slug === 'homepage' ||
        c.slug === 'home' ||
        c.slug === 'front' ||
        (c.type === 'landing_page' && c.fields.is_front === true),
    );

    if (homepage) {
      const outPath = path.join(langDistDir, 'index.html');
      const fullPath = prefix || '/';
      try {
        const html = await renderContent(homepage, siteConfig, themeResolver, {
          ...langSettings,
          _currentPath: fullPath,
        });
        writeFile(outPath, html);
        pagesBuilt++;
        console.log(`  \x1b[32m✓\x1b[0m ${fullPath}`);
      } catch (err) {
        console.error(`  \x1b[31m✗\x1b[0m ${fullPath}: ${(err as Error).message}`);
      }
    } else if (isDefault) {
      // Fallback index for default lang only
      const indexContent: Content = {
        id: 'virtual-index',
        slug: '',
        title: siteConfig.site_name,
        type: 'index',
        status: 'published',
        langcode: lang,
        body: '',
        bodyHtml: '',
        fields: {
          items: dedupedContent.map((item) => ({
            ...item,
            url: resolveContentPath(item, contentTypes),
          })),
        },
        sections: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      };

      const outPath = path.join(langDistDir, 'index.html');
      try {
        const html = await renderContent(indexContent, siteConfig, themeResolver, {
          ...langSettings,
          _currentPath: '/',
        });
        writeFile(outPath, html);
        pagesBuilt++;
        console.log('  \x1b[32m✓\x1b[0m /');
      } catch (err) {
        console.error(`  \x1b[31m✗\x1b[0m /: ${(err as Error).message}`);
      }
    }
  }

  // --- Copy static assets --------------------------------------------------

  const publicDir = path.resolve(opts.publicDir);
  copyDirSync(publicDir, distDir);

  // Copy theme static assets to /static/ (mirrors dev server: /static/* → themes/<name>/static/)
  const themeStatic = path.resolve(themesDir, themeName, 'static');
  copyDirSync(themeStatic, path.join(distDir, 'static'));

  // Collect and write component CSS (SDC styles)
  const componentCssFiles = themeResolver.collectComponentCss();
  if (componentCssFiles.length > 0) {
    const combinedCss = componentCssFiles
      .map((f) => fs.readFileSync(f, 'utf-8'))
      .join('\n\n');
    writeFile(path.join(distDir, 'static', 'components.css'), combinedCss);
  }

  // --- SEO files -----------------------------------------------------------

  const sitemap = generateSitemap(published, siteConfig, contentTypes);
  writeFile(path.join(distDir, 'sitemap.xml'), sitemap);
  console.log('  \x1b[32m✓\x1b[0m /sitemap.xml');

  const robots = generateRobotsTxt(siteConfig);
  writeFile(path.join(distDir, 'robots.txt'), robots);
  console.log('  \x1b[32m✓\x1b[0m /robots.txt');

  const feeds = siteConfig.seo?.feeds ?? [];
  for (const feedCfg of feeds) {
    const rss = generateRssFeed(allContent, siteConfig, feedCfg, contentTypes);
    const feedPath = feedCfg.path ?? '/feed.xml';
    writeFile(path.join(distDir, feedPath), rss);
    console.log(`  \x1b[32m✓\x1b[0m ${feedPath}`);
  }

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);

  console.log('');
  console.log(
    `  \x1b[1mDone.\x1b[0m ${pagesBuilt} pages → \x1b[2m${distDir}\x1b[0m  (${elapsed}s)`,
  );
  console.log('');
}
