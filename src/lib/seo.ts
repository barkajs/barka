import type { Content, SiteConfig, ContentType } from './types.js';
import { resolveContentPath } from '../content-engine.js';
import { generateHreflangTags } from './i18n.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escXml(s: string): string {
  return esc(s).replace(/'/g, '&apos;');
}

function contentUrl(
  content: Content,
  baseUrl: string,
  contentTypes?: ContentType[],
): string {
  const base = baseUrl.replace(/\/$/, '');
  if (contentTypes) {
    return base + resolveContentPath(content, contentTypes);
  }
  if (content.type === 'page' || content.type === 'landing_page') {
    return `${base}/${content.slug}`;
  }
  return `${base}/${content.type}s/${content.slug}`;
}

// ---------------------------------------------------------------------------
// Meta Tags
// ---------------------------------------------------------------------------

export function generateMetaTags(
  content: Content,
  siteConfig: SiteConfig,
  options?: {
    translations?: Array<{ langcode: string; path: string }>;
    defaultLang?: string;
  },
): string {
  const sep = siteConfig.seo?.title_separator ?? ' | ';
  const pageTitle = content.seo?.title ?? content.title;
  const fullTitle = `${pageTitle}${sep}${siteConfig.site_name}`;
  const description =
    content.seo?.description ?? siteConfig.seo?.default_description ?? '';
  const image = content.seo?.image ?? siteConfig.seo?.default_image;
  const canonical = content.seo?.canonical;

  const tags: string[] = [
    `<title>${esc(fullTitle)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    `<meta property="og:title" content="${esc(pageTitle)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:type" content="${content.type === 'article' ? 'article' : 'website'}">`,
  ];

  if (image) {
    tags.push(`<meta property="og:image" content="${esc(image)}">`);
  }

  tags.push(
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">`,
    `<meta name="twitter:title" content="${esc(pageTitle)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
  );

  if (image) {
    tags.push(`<meta name="twitter:image" content="${esc(image)}">`);
  }
  if (canonical) {
    tags.push(`<link rel="canonical" href="${esc(canonical)}">`);
  }
  if (content.seo?.noindex) {
    tags.push(`<meta name="robots" content="noindex, nofollow">`);
  }
  if (siteConfig.seo?.google_site_verification) {
    tags.push(
      `<meta name="google-site-verification" content="${esc(siteConfig.seo.google_site_verification)}">`,
    );
  }

  if (options?.translations && options.translations.length > 0) {
    const baseUrl = siteConfig.base_url.replace(/\/$/, '');
    const defaultLang = options.defaultLang ?? 'en';
    const hreflang = generateHreflangTags(
      options.translations,
      content.langcode,
      baseUrl,
      defaultLang,
    );
    if (hreflang) {
      tags.push(hreflang);
    }
  }

  return tags.join('\n    ');
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

export function generateJsonLd(
  content: Content,
  siteConfig: SiteConfig,
): string {
  const schemas: object[] = [];
  const org = siteConfig.seo?.json_ld?.organization;

  if (content.type === 'article') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: content.title,
      description:
        content.seo?.description ?? content.fields.summary ?? '',
      datePublished: content.publishedAt?.toISOString(),
      dateModified: content.updatedAt.toISOString(),
      ...(content.seo?.image && { image: content.seo.image }),
      ...(org && {
        author: { '@type': 'Organization', name: org.name },
        publisher: {
          '@type': 'Organization',
          name: org.name,
          ...(org.logo && {
            logo: { '@type': 'ImageObject', url: org.logo },
          }),
        },
      }),
    });
  } else {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: content.title,
      description: content.seo?.description ?? '',
      dateModified: content.updatedAt.toISOString(),
    });
  }

  if (content.type === 'landing_page' && content.sections) {
    const faq = content.sections.find((s) => s.type === 'faq');
    if (faq && Array.isArray(faq.data.items)) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.data.items.map((item: any) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      });
    }

    const pricing = content.sections.find((s) => s.type === 'pricing');
    if (pricing && Array.isArray(pricing.data.plans)) {
      for (const plan of pricing.data.plans) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: plan.name,
          description: plan.description,
          offers: {
            '@type': 'Offer',
            price: plan.price,
            priceCurrency: plan.currency ?? 'USD',
          },
        });
      }
    }
  }

  return schemas
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n    ');
}

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------

export function generateSitemap(
  contents: Content[],
  siteConfig: SiteConfig,
  contentTypes?: ContentType[],
): string {
  const baseUrl = siteConfig.base_url.replace(/\/$/, '');

  const urls = contents
    .filter((c) => c.status === 'published' && !c.seo?.noindex)
    .map((c) => {
      const loc =
        c.seo?.canonical ?? contentUrl(c, baseUrl, contentTypes);
      const lastmod = c.updatedAt.toISOString().split('T')[0];
      return [
        '  <url>',
        `    <loc>${escXml(loc)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '  </url>',
      ].join('\n');
    });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// robots.txt
// ---------------------------------------------------------------------------

export function generateRobotsTxt(siteConfig: SiteConfig): string {
  const baseUrl = siteConfig.base_url.replace(/\/$/, '');
  return `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
}

// ---------------------------------------------------------------------------
// RSS Feed
// ---------------------------------------------------------------------------

export function generateRssFeed(
  contents: Content[],
  siteConfig: SiteConfig,
  feedConfig: {
    type?: string;
    path?: string;
    content_types?: string[];
    limit?: number;
  },
  contentTypes?: ContentType[],
): string {
  const baseUrl = siteConfig.base_url.replace(/\/$/, '');
  const limit = feedConfig.limit ?? 20;
  const allowed = new Set(feedConfig.content_types ?? []);

  const items = contents
    .filter((c) => c.status === 'published')
    .filter((c) => allowed.size === 0 || allowed.has(c.type))
    .sort(
      (a, b) =>
        (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0),
    )
    .slice(0, limit);

  const rssItems = items.map((c) => {
    const link = contentUrl(c, baseUrl, contentTypes);
    const pubDate = (c.publishedAt ?? c.createdAt).toUTCString();
    const description = c.seo?.description ?? c.fields.summary ?? '';
    return [
      '    <item>',
      `      <title>${escXml(c.title)}</title>`,
      `      <link>${escXml(link)}</link>`,
      `      <guid>${escXml(link)}</guid>`,
      `      <pubDate>${pubDate}</pubDate>`,
      `      <description>${escXml(description)}</description>`,
      '    </item>',
    ].join('\n');
  });

  const selfHref = baseUrl + (feedConfig.path ?? '/feed.xml');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escXml(siteConfig.site_name)}</title>`,
    `    <link>${escXml(baseUrl)}</link>`,
    `    <description>${escXml(siteConfig.seo?.default_description ?? '')}</description>`,
    `    <atom:link href="${escXml(selfHref)}" rel="self" type="application/rss+xml"/>`,
    ...rssItems,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
