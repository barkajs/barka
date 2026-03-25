/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';

const Base: FC<LayoutProps> = ({ content, site, theme, themeSettings, children }) => {
  const seo = content.seo ?? {};
  const separator = site.seo?.title_separator ?? ' | ';
  const pageTitle = seo.title ?? content.title;
  const fullTitle = pageTitle.endsWith(site.site_name)
    ? pageTitle
    : `${pageTitle}${separator}${site.site_name}`;
  const description = seo.description ?? site.seo?.default_description ?? '';
  const ogImage = seo.image ?? site.seo?.default_image ?? '';
  const canonical = seo.canonical ?? `${site.base_url}/${content.slug}`;
  const primaryColor = themeSettings.primary_color ?? '#2563eb';
  const langcode = content.langcode ?? 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': content.type === 'article' ? 'Article' : 'WebPage',
    name: pageTitle,
    description,
    url: canonical,
    ...(content.publishedAt && { datePublished: content.publishedAt.toISOString() }),
    ...(content.updatedAt && { dateModified: content.updatedAt.toISOString() }),
  };

  return (
    <html lang={langcode}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{fullTitle}</title>
        <meta name="generator" content="BarkaCMS (https://www.barka.dev)" />
        <meta name="description" content={description} />
        {seo.noindex && <meta name="robots" content="noindex, nofollow" />}
        <link rel="canonical" href={canonical} />

        <meta property="og:type" content={content.type === 'article' ? 'article' : 'website'} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        {ogImage && <meta property="og:image" content={ogImage} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}

        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="/static/style.css" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {themeSettings._tokenCss
          ? <style dangerouslySetInnerHTML={{ __html: themeSettings._tokenCss }} />
          : <style>{`:root { --color-primary: ${primaryColor}; }`}</style>
        }
      </head>
      <body class="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <header class="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
          <nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <a href="/" class="text-xl font-bold tracking-tight" style={{ color: primaryColor }}>
              {themeSettings.logo
                ? <img src={themeSettings.logo} alt={site.site_name} class="h-8" />
                : site.site_name}
            </a>
            <ul class="flex items-center gap-8 text-sm font-medium text-gray-600">
              <li><a href="/" class="hover:text-gray-900 transition-colors">Home</a></li>
              <li><a href="/articles" class="hover:text-gray-900 transition-colors">Articles</a></li>
              <li><a href="/pages" class="hover:text-gray-900 transition-colors">Pages</a></li>
            </ul>
          </nav>
        </header>

        <main class="flex-1">
          {children}
        </main>

        <footer class="border-t border-gray-100 bg-gray-50">
          <div class="mx-auto max-w-6xl px-6 py-10 text-center text-sm text-gray-500">
            <p>{themeSettings.footer_text ?? 'Powered by Barka CMS'}</p>
            <p class="mt-1">&copy; {new Date().getFullYear()} {site.site_name}</p>
            <p class="mt-2 text-xs text-gray-400">Crafted with <a href="https://www.barka.dev" class="hover:text-gray-500 hover:no-underline" style="color: inherit">Barka</a></p>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default Base;
