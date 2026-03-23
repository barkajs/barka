import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import {
  createContentEngine,
  resolveContentPath,
  type ContentEngine,
} from './content-engine.js';
import { hasDatabase, getDb } from './db/connection.js';
import * as schema from './db/schema.js';
import { loadSiteConfig } from './lib/config-files.js';
import type { Content, SiteConfig, ContentType } from './lib/types.js';
import {
  generateMetaTags,
  generateJsonLd,
  generateSitemap,
  generateRobotsTxt,
  generateRssFeed,
} from './lib/seo.js';
import { createThemeResolver } from './lib/theme-loader.js';
import { renderContent } from './lib/template-renderer.js';
import { createAdminRoutes } from './routes/admin/index.js';
import { loadLanguages, loadTranslations, createT, type Language, type TranslationFn } from './lib/i18n.js';
import { loadSites, resolveSite, filterContentBySite, type SiteDefinition } from './lib/multisite.js';
import { generateTokenCss } from './lib/design-tokens.js';

function render404Fallback(siteConfig: SiteConfig): string {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page not found | ${siteConfig.site_name}</title>
<style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;color:#1a1a1a;text-align:center}h1{font-size:4rem;font-weight:700}a{color:#2563eb}</style>
</head><body><div><h1>404</h1><p>Page not found. <a href="/">Go home</a></p></div></body></html>`;
}

// ---------------------------------------------------------------------------
// App factory
// ---------------------------------------------------------------------------

type AppVariables = {
  site: SiteDefinition | null;
  siteId: string | undefined;
};

export function createApp(options: {
  contentDir: string;
  configDir: string;
  themesDir: string;
  publicDir: string;
  dataDir: string;
  distDir?: string;
}): { app: Hono<{ Variables: AppVariables }>; engine: ContentEngine } {
  const app = new Hono<{ Variables: AppVariables }>();
  const engine = createContentEngine({
    contentDir: path.resolve(options.contentDir),
    configDir: path.resolve(options.configDir),
    dataDir: path.resolve(options.dataDir),
  });

  const siteConfig = loadSiteConfig(path.resolve(options.configDir));
  const themeName = siteConfig.theme ?? 'starter';
  const themesDir = path.resolve(options.themesDir);
  const themeStaticRoot = path.resolve(themesDir, themeName, 'static');
  const publicRoot = path.resolve(options.publicDir);
  const dataDir = path.resolve(options.dataDir);

  const themeResolver = createThemeResolver(themesDir, themeName);
  const themeConfig = themeResolver.getConfig();
  const themeDefaults = themeConfig.settings
    ? Object.fromEntries(
        Object.entries(themeConfig.settings)
          .map(([k, v]) => [
            k,
            typeof v === 'object' && v !== null && 'default' in v
              ? (v as any).default
              : typeof v === 'object' ? undefined : v,
          ])
          .filter(([, v]) => v !== undefined),
      )
    : {};
  const themeSettings = { ...themeDefaults, ...siteConfig.theme_settings };
  const tokenCss = generateTokenCss(themeConfig, themeSettings);
  const languagesConfig = loadLanguages(path.resolve(options.configDir));
  const availableLanguages = Object.keys(languagesConfig.languages);
  const nonDefaultLangs = availableLanguages.filter((l) => l !== languagesConfig.default);
  loadTranslations(path.resolve(options.configDir));

  const sites = loadSites(path.resolve(options.configDir));

  function getSiteLanguages(site: SiteDefinition | null): {
    default: string;
    languages: Record<string, Language>;
    nonDefault: string[];
  } {
    const siteLangs = site?.languages;
    if (!siteLangs || siteLangs.length === 0) {
      return {
        default: languagesConfig.default,
        languages: languagesConfig.languages,
        nonDefault: nonDefaultLangs,
      };
    }
    const defaultLang = site!.default_lang;
    const filtered: Record<string, Language> = {};
    for (const code of siteLangs) {
      if (languagesConfig.languages[code]) {
        filtered[code] = languagesConfig.languages[code];
      }
    }
    return {
      default: defaultLang,
      languages: filtered,
      nonDefault: siteLangs.filter((l) => l !== defaultLang),
    };
  }

  async function render404(config: SiteConfig, lang?: string, currentPath?: string, site: SiteDefinition | null = null): Promise<string> {
    const siteLangs = getSiteLanguages(site);
    const effectiveLang = lang ?? siteLangs.default;
    const effectivePath = currentPath ?? '/404';
    const now = new Date();
    const virtualContent: Content = {
      id: '404',
      title: 'Page not found',
      type: '404',
      status: 'published',
      langcode: effectiveLang,
      slug: '404',
      body: '',
      bodyHtml: '',
      fields: {},
      seo: { title: 'Page not found' },
      sections: [],
      createdAt: now as any,
      updatedAt: now as any,
      publishedAt: now as any,
    };
    try {
      return await renderContent(virtualContent, config, themeResolver, settingsWithLang(effectiveLang, effectivePath, site));
    } catch (err) {
      console.error('[theme] 404 render error:', err);
      return render404Fallback(config);
    }
  }

  // --- Site resolution middleware ------------------------------------------

  app.use('*', async (c, next) => {
    const host = c.req.header('host');
    const site = resolveSite(host, sites);
    c.set('site', site);
    c.set('siteId', site?.id);
    await next();
  });

  // --- Static assets -------------------------------------------------------

  app.get('/static/components.css', (c) => {
    const cssFiles = themeResolver.collectComponentCss();
    const combined = cssFiles
      .map((f) => `/* --- ${path.basename(path.dirname(f))} --- */\n${fs.readFileSync(f, 'utf-8')}`)
      .join('\n\n');
    return c.text(combined, 200, {
      'Content-Type': 'text/css; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    });
  });

  app.use(
    '/static/*',
    serveStatic({
      root: themeStaticRoot,
      rewriteRequestPath: (p: string) => p.replace(/^\/static/, ''),
    }),
  );

  app.use(
    '/theme/*',
    serveStatic({
      root: themeStaticRoot,
      rewriteRequestPath: (p: string) => p.replace(/^\/theme/, ''),
    }),
  );

  app.use(
    '/*',
    serveStatic({ root: publicRoot }),
  );

  // --- Auth routes (only when DB is present) --------------------------------

  if (hasDatabase(dataDir)) {
    const db = getDb(dataDir);
    const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

    app.post('/api/auth/login', async (c) => {
      const body = await c.req.json<{ email?: string; password?: string }>();
      if (!body.email || !body.password) {
        return c.json({ error: 'Email and password are required' }, 400);
      }

      const user = db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, body.email))
        .get();

      if (!user || !bcrypt.compareSync(body.password, user.passwordHash)) {
        return c.json({ error: 'Invalid credentials' }, 401);
      }

      const sessionId = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);
      db.insert(schema.sessions).values({
        id: sessionId,
        userId: user.id,
        expiresAt,
      }).run();

      setCookie(c, 'barka_session', sessionId, {
        httpOnly: true,
        sameSite: 'Lax',
        path: '/',
        maxAge: SESSION_MAX_AGE,
      });

      return c.json({ id: user.id, email: user.email, name: user.name, role: user.role });
    });

    app.post('/api/auth/logout', async (c) => {
      const sessionId = getCookie(c, 'barka_session');
      if (sessionId) {
        db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId)).run();
        deleteCookie(c, 'barka_session', { path: '/' });
      }
      return c.json({ ok: true });
    });

    app.get('/api/auth/me', async (c) => {
      const sessionId = getCookie(c, 'barka_session');
      if (!sessionId) {
        return c.json({ user: null }, 401);
      }

      const session = db
        .select()
        .from(schema.sessions)
        .where(eq(schema.sessions.id, sessionId))
        .get();

      if (!session || session.expiresAt < new Date()) {
        if (session) {
          db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId)).run();
        }
        deleteCookie(c, 'barka_session', { path: '/' });
        return c.json({ user: null }, 401);
      }

      const user = db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, session.userId))
        .get();

      if (!user) {
        return c.json({ user: null }, 401);
      }

      return c.json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
    });
  }

  // --- Admin routes (only when DB is present) ------------------------------

  if (hasDatabase(dataDir)) {
    const adminRoutes = createAdminRoutes(dataDir, {
      configDir: path.resolve(options.configDir),
      themesDir: path.resolve(options.themesDir),
      publicDir: path.resolve(options.publicDir),
      contentDir: path.resolve(options.contentDir),
    });
    app.route('/admin', adminRoutes);
  }

  // --- SEO files -----------------------------------------------------------

  app.get('/sitemap.xml', async (c) => {
    const siteId = c.get('siteId');
    const config = await engine.getSiteConfig();
    const contents = filterContentBySite(await engine.listContent(), siteId);
    const types = await engine.getContentTypes();
    return c.text(generateSitemap(contents, config, types), 200, {
      'Content-Type': 'application/xml; charset=utf-8',
    });
  });

  app.get('/robots.txt', async (c) => {
    const config = await engine.getSiteConfig();
    return c.text(generateRobotsTxt(config));
  });

  app.get('/feed.xml', async (c) => {
    const siteId = c.get('siteId');
    const config = await engine.getSiteConfig();
    const contents = filterContentBySite(await engine.listContent(), siteId);
    const types = await engine.getContentTypes();
    const feedCfg = config.seo?.feeds?.[0] ?? {
      content_types: ['article'],
      limit: 20,
    };
    return c.text(generateRssFeed(contents, config, feedCfg, types), 200, {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    });
  });

  // --- Collection listing routes --------------------------------------------

  const listingRoutes: Record<string, { type: string; title: string; subtitle?: string }> = {
    '/articles': { type: 'article', title: 'Insights', subtitle: 'Engineering perspectives, technical deep-dives, and industry analysis' },
    '/services': { type: 'service', title: 'Our Services' },
    '/industries': { type: 'industry', title: 'Industries', subtitle: 'Deep domain expertise across regulated and high-growth sectors' },
    '/case-studies': { type: 'case_study', title: 'Case Studies', subtitle: 'Real results for real enterprises' },
  };

  for (const [routePath, listing] of Object.entries(listingRoutes)) {
    app.get(routePath, async (c) => {
      const site = c.get('site');
      const siteId = c.get('siteId');
      const siteLangs = getSiteLanguages(site);
      const config = await engine.getSiteConfig();
      const allContent = filterContentBySite(await engine.listContent(), siteId);
      const contentTypes = await engine.getContentTypes();
      const items = allContent
        .filter(
          (item) =>
            item.type === listing.type &&
            item.status === 'published' &&
            (!item.langcode || item.langcode === siteLangs.default),
        )
        .map((item) => ({
          ...item,
          url: resolveContentPath(item, contentTypes),
        }));

      const now = new Date();
      const virtualContent: Content = {
        id: `virtual-${routePath.replace(/^\//, '')}`,
        slug: routePath.replace(/^\//, ''),
        title: listing.title,
        type: 'index',
        status: 'published',
        langcode: siteLangs.default,
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

      try {
        const html = await renderContent(virtualContent, config, themeResolver, settingsWithLang(siteLangs.default, routePath, site));
        return c.html(html);
      } catch (err) {
        console.error(`[theme] Listing render error for ${routePath}:`, err);
        return c.html(await render404(config, siteLangs.default, routePath, site), 404);
      }
    });
  }

  // --- Helper: render with language context --------------------------------

  function settingsWithLang(lang: string, currentPath: string, site: SiteDefinition | null = null) {
    const siteLangs = getSiteLanguages(site);
    const basePath = lang === siteLangs.default ? '' : `/${lang}`;
    return {
      ...themeSettings,
      ...(site?.settings ?? {}),
      _lang: lang,
      _defaultLang: siteLangs.default,
      _languages: siteLangs.languages,
      _currentPath: currentPath,
      _basePath: basePath,
      _url: (path: string) => `${basePath}${path}`,
      _t: createT(lang, siteLangs.default),
      _siteId: site?.id,
      _tokenCss: tokenCss,
    };
  }

  // --- Language-prefixed routes (e.g. /pl/services/cloud) ------------------

  for (const lang of nonDefaultLangs) {
    const prefix = `/${lang}`;

    app.get(`${prefix}`, async (c) => {
      const site = c.get('site');
      const siteId = c.get('siteId');
      const config = await engine.getSiteConfig();
      const homepage = await engine.getContent('homepage', lang);
      if (homepage) {
        try {
          const html = await renderContent(homepage, config, themeResolver, settingsWithLang(lang, prefix, site));
          return c.html(html);
        } catch (err) {
          console.error(`[theme] ${lang} homepage render error:`, err);
        }
      }
      return c.html(await render404(config, lang, prefix, site), 404);
    });

    for (const [routePath, listing] of Object.entries(listingRoutes)) {
      app.get(`${prefix}${routePath}`, async (c) => {
        const site = c.get('site');
        const siteId = c.get('siteId');
        const config = await engine.getSiteConfig();
        const allContent = filterContentBySite(await engine.listContent(), siteId);
        const contentTypes = await engine.getContentTypes();
        const items = allContent
          .filter(
            (item) =>
              item.type === listing.type &&
              item.status === 'published' &&
              item.langcode === lang,
          )
          .map((item) => ({
            ...item,
            url: `${prefix}${resolveContentPath(item, contentTypes)}`,
          }));

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
          fields: { subtitle: listing.subtitle, items },
          sections: [],
          createdAt: now,
          updatedAt: now,
          publishedAt: now,
        };

        try {
          const html = await renderContent(virtualContent, config, themeResolver, settingsWithLang(lang, `${prefix}${routePath}`, site));
          return c.html(html);
        } catch (err) {
          console.error(`[theme] ${lang} listing render error for ${routePath}:`, err);
          return c.html(await render404(config, lang, `${prefix}${routePath}`, site), 404);
        }
      });
    }

    app.get(`${prefix}/*`, async (c) => {
      const site = c.get('site');
      const siteId = c.get('siteId');
      const urlPath = new URL(c.req.url).pathname;
      const pathWithoutPrefix = urlPath.slice(prefix.length);
      const config = await engine.getSiteConfig();

      const allContent = filterContentBySite(await engine.listContent(), siteId);
      const contentTypes = await engine.getContentTypes();
      const normalized =
        pathWithoutPrefix !== '/' && pathWithoutPrefix.endsWith('/')
          ? pathWithoutPrefix.slice(0, -1)
          : pathWithoutPrefix;

      let content: Content | null = null;
      for (const item of allContent) {
        if (item.langcode !== lang) continue;
        const resolved = resolveContentPath(item, contentTypes);
        if (resolved === normalized) { content = item; break; }
      }
      if (!content) {
        content = allContent.find(
          (item) => item.langcode === lang && `/${item.slug}` === normalized,
        ) ?? null;
      }

      if (!content) {
        return c.html(await render404(config, lang, urlPath, site), 404);
      }

      try {
        const html = await renderContent(content, config, themeResolver, settingsWithLang(lang, urlPath, site));
        return c.html(html);
      } catch (err) {
        console.error(`[theme] ${lang} render error for ${urlPath}:`, err);
        return c.html(await render404(config, lang, urlPath, site), 404);
      }
    });
  }

  // --- Catch-all content route (default language) -------------------------

  app.get('*', async (c) => {
    const site = c.get('site');
    const siteId = c.get('siteId');
    const siteLangs = getSiteLanguages(site);
    const urlPath = new URL(c.req.url).pathname;
    const config = await engine.getSiteConfig();
    const lang = siteLangs.default;

    if (urlPath === '/') {
      const homepage =
        (await engine.getContent('homepage', lang)) ??
        (await engine.getContent('homepage')) ??
        (await engine.getContent('index'));
      if (homepage) {
        try {
          const html = await renderContent(homepage, config, themeResolver, settingsWithLang(lang, '/', site));
          return c.html(html);
        } catch (err) {
          console.error('[theme] Homepage render error:', err);
        }
      }
      return c.html(await render404(config, lang, '/', site), 404);
    }

    const allContent = filterContentBySite(await engine.listContent(), siteId);
    const contentTypes = await engine.getContentTypes();
    const normalized =
      urlPath !== '/' && urlPath.endsWith('/')
        ? urlPath.slice(0, -1)
        : urlPath;

    let content: Content | null = null;
    for (const item of allContent) {
      if (item.langcode && item.langcode !== lang) continue;
      const resolved = resolveContentPath(item, contentTypes);
      if (resolved === normalized) { content = item; break; }
    }
    if (!content) {
      content = allContent.find(
        (item) => (!item.langcode || item.langcode === lang) && `/${item.slug}` === normalized,
      ) ?? null;
    }

    if (!content) {
      return c.html(await render404(config, lang, urlPath, site), 404);
    }

    try {
      const html = await renderContent(content, config, themeResolver, settingsWithLang(lang, urlPath, site));
      return c.html(html);
    } catch (err) {
      console.error(`[theme] Render error for ${urlPath}:`, err);
      return c.html(await render404(config, lang, urlPath, site), 404);
    }
  });

  return { app, engine };
}
