/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';

const megaServices = [
  { labelKey: 'mega.services.recruitment', descKey: 'mega.services.recruitment_desc', href: '/services/permanent-recruitment', icon: 'users' },
  { labelKey: 'mega.services.temporary', descKey: 'mega.services.temporary_desc', href: '/services/temporary-staffing', icon: 'clock' },
  { labelKey: 'mega.services.outsourcing', descKey: 'mega.services.outsourcing_desc', href: '/services/outsourcing-rpo', icon: 'rocket' },
  { labelKey: 'mega.services.consulting', descKey: 'mega.services.consulting_desc', href: '/services/hr-consulting', icon: 'brain' },
  { labelKey: 'mega.services.branding', descKey: 'mega.services.branding_desc', href: '/services/employer-branding', icon: 'shield' },
  { labelKey: 'mega.services.payroll', descKey: 'mega.services.payroll_desc', href: '/services/payroll-hr-admin', icon: 'zap' },
];

const megaIndustries = [
  { labelKey: 'mega.industries.manufacturing', descKey: 'mega.industries.manufacturing_desc', href: '/industries/manufacturing', icon: 'factory' },
  { labelKey: 'mega.industries.logistics', descKey: 'mega.industries.logistics_desc', href: '/industries/logistics', icon: 'signal' },
  { labelKey: 'mega.industries.retail', descKey: 'mega.industries.retail_desc', href: '/industries/retail', icon: 'store' },
  { labelKey: 'mega.industries.it', descKey: 'mega.industries.it_desc', href: '/industries/it-technology', icon: 'code' },
  { labelKey: 'mega.industries.finance', descKey: 'mega.industries.finance_desc', href: '/industries/finance-shared-services', icon: 'landmark' },
  { labelKey: 'mega.industries.healthcare', descKey: 'mega.industries.healthcare_desc', href: '/industries/healthcare', icon: 'heart' },
];

const iconSvg: Record<string, string> = {
  users: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  clock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  code: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  cloud: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
  brain: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2a4 4 0 0 1 4-4z"/><path d="M8 8v2c0 2.2 1.8 4 4 4s4-1.8 4-4V8"/><path d="M6 14c-1.7 1-3 3-3 5v1h18v-1c0-2-1.3-4-3-5"/></svg>',
  shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  rocket: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>',
  zap: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  landmark: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>',
  heart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  factory: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>',
  store: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M2 7h20"/></svg>',
  signal: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg>',
  edit: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  book: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  video: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
  check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  play: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>',
  mic: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
  github: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
};

const megaInsights = [
  { labelKey: 'mega.insights.blog', href: '/articles', icon: 'edit' },
  { labelKey: 'mega.insights.ebooks', href: '/resources/ebooks', icon: 'book' },
  { labelKey: 'mega.insights.webinars', href: '/resources/webinars', icon: 'video' },
  { labelKey: 'mega.insights.tools', href: '/resources/tools', icon: 'check' },
  { labelKey: 'mega.insights.demo', href: '/resources/demo', icon: 'play' },
  { labelKey: 'mega.insights.talks', href: '/resources/talks', icon: 'mic' },
  { labelKey: 'mega.insights.opensource', href: '/open-source', icon: 'github' },
];

const footerServices = [
  { labelKey: 'footer.recruitment', href: '/services/permanent-recruitment' },
  { labelKey: 'footer.temporary_staffing', href: '/services/temporary-staffing' },
  { labelKey: 'footer.outsourcing', href: '/services/outsourcing-rpo' },
  { labelKey: 'footer.hr_consulting', href: '/services/hr-consulting' },
  { labelKey: 'footer.payroll', href: '/services/payroll-hr-admin' },
];

const footerCompany = [
  { labelKey: 'footer.about_us', href: '/about' },
  { labelKey: 'footer.leadership', href: '/about/leadership' },
  { labelKey: 'footer.careers', href: '/careers' },
  { labelKey: 'footer.locations', href: '/locations' },
  { labelKey: 'footer.contact', href: '/contact' },
];

const footerResources = [
  { labelKey: 'footer.blog', href: '/articles' },
  { labelKey: 'footer.case_studies', href: '/case-studies' },
  { labelKey: 'footer.salary_guides', href: '/resources/salary-guides' },
  { labelKey: 'footer.webinars', href: '/resources/webinars' },
  { labelKey: 'footer.resources', href: '/resources' },
];

const MegaPanel: FC<{ items: typeof megaServices; primaryColor: string; viewAllLabel: string; viewAllHref: string; urlFn?: (p: string) => string; t?: (k: string) => string }> = ({ items, primaryColor, viewAllLabel, viewAllHref, urlFn = (p) => p, t: tFn = (k) => k }) => (
  <div class="mega-dropdown pointer-events-none invisible absolute left-1/2 top-full z-50 w-[260px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200">
    <div class="pointer-events-auto rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
      {items.map((item) => (
        <a
          href={urlFn(item.href)}
          class="block px-5 py-2.5 text-sm text-slate-700 transition-colors duration-150 hover:bg-amber-50 hover:text-amber-700 hover:no-underline"
        >
          {tFn(item.labelKey)}
        </a>
      ))}
      <div class="mx-5 mt-1 border-t border-gray-100 pt-2 pb-1">
        <a
          href={urlFn(viewAllHref)}
          class="flex items-center gap-1 text-xs font-semibold hover:no-underline"
          style={{ color: primaryColor }}
        >
          {viewAllLabel} <span>&rarr;</span>
        </a>
      </div>
    </div>
  </div>
);

const Base: FC<LayoutProps> = ({ content, site, theme, themeSettings, children }) => {
  const seo = content.seo ?? {};
  const separator = site.seo?.title_separator ?? ' | ';
  const pageTitle = seo.title ?? content.title;
  const fullTitle = `${pageTitle}${separator}${site.site_name}`;
  const description = seo.description ?? site.seo?.default_description ?? '';
  const ogImage = seo.image ?? site.seo?.default_image ?? '';
  const canonical = seo.canonical ?? `${site.base_url}/${content.slug}`;
  const primaryColor = themeSettings.primary_color ?? '#F59E0B';
  const navColor = themeSettings.nav_color ?? '#14101E';
  const langcode = content.langcode ?? themeSettings._lang ?? 'en';

  const currentLang = themeSettings._lang ?? langcode;
  const defaultLang = themeSettings._defaultLang ?? 'en';
  const languages: Record<string, { code: string; label: string }> = themeSettings._languages ?? {};
  const currentPath = themeSettings._currentPath ?? '/';
  const hasMultipleLangs = Object.keys(languages).length > 1;
  const basePath: string = themeSettings._basePath ?? (currentLang === defaultLang ? '' : `/${currentLang}`);
  const url = themeSettings._url ?? ((path: string) => `${basePath}${path}`);
  const homeUrl = basePath || '/';
  const t = themeSettings._t ?? ((key: string) => key);

  function langSwitchUrl(targetLang: string): string {
    if (targetLang === defaultLang) {
      if (currentLang === defaultLang) return currentPath;
      return currentPath.replace(new RegExp(`^/${currentLang}`), '') || '/';
    }
    if (currentLang === defaultLang) {
      return `/${targetLang}${currentPath === '/' ? '' : currentPath}`;
    }
    return currentPath.replace(new RegExp(`^/${currentLang}`), `/${targetLang}`);
  }

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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>{fullTitle}</title>
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
        <link rel="stylesheet" href="/static/components.css" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <style>{`
          :root {
            --color-primary: ${primaryColor};
            --color-navy: ${navColor};
          }
        `}</style>
      </head>
      <body class="min-h-screen flex flex-col bg-white text-slate-800 antialiased">

        {/* ═══ Desktop Header with Mega Menu ═══ */}
        <header class="sticky top-0 z-50 hidden border-b border-gray-100 md:block" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255,255,255,0.95)' }}>
          <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <a href={homeUrl} class="flex items-center gap-2 hover:no-underline">
              {themeSettings.logo
                ? <img src={themeSettings.logo} alt={site.site_name} class="h-14" />
                : <span class="text-xl font-bold tracking-tight text-slate-900">{site.site_name}</span>}
            </a>

            <ul class="flex items-center gap-1 text-sm font-medium text-slate-500">
              {/* Services — mega dropdown */}
              <li class="mega-trigger relative">
                <a
                  href={url('/services')}
                  class="flex items-center gap-1 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900 hover:no-underline"
                >
                  {t('nav.services')}
                  <svg class="h-3.5 w-3.5 opacity-50" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                </a>
                <MegaPanel items={megaServices} primaryColor={primaryColor} viewAllLabel={t('nav.view_all_services')} viewAllHref="/services" urlFn={url} t={t} />
              </li>

              {/* Industries — mega dropdown */}
              <li class="mega-trigger relative">
                <a
                  href={url('/industries')}
                  class="flex items-center gap-1 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900 hover:no-underline"
                >
                  {t('nav.industries')}
                  <svg class="h-3.5 w-3.5 opacity-50" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                </a>
                <MegaPanel items={megaIndustries} primaryColor={primaryColor} viewAllLabel={t('nav.view_all_industries')} viewAllHref="/industries" urlFn={url} t={t} />
              </li>

              <li>
                <a href={url('/case-studies')} class="rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900 hover:no-underline">
                  {t('nav.case_studies')}
                </a>
              </li>
              {/* Insights — slim dropdown (same style as Services/Industries) */}
              <li class="mega-trigger relative">
                <a
                  href={url('/articles')}
                  class="flex items-center gap-1 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900 hover:no-underline"
                >
                  {t('nav.insights')}
                  <svg class="h-3.5 w-3.5 opacity-50" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                </a>
                <div class="mega-dropdown pointer-events-none invisible absolute left-1/2 top-full z-50 w-[260px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200">
                  <div class="pointer-events-auto rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
                    {megaInsights.map((item) => (
                      <a
                        href={url(item.href)}
                        class="block px-5 py-2.5 text-sm text-slate-700 transition-colors duration-150 hover:bg-amber-50 hover:text-amber-700 hover:no-underline"
                      >
                        {t(item.labelKey)}
                      </a>
                    ))}
                  </div>
                </div>
              </li>
              <li>
                <a href={url('/about')} class="rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900 hover:no-underline">
                  {t('nav.about')}
                </a>
              </li>
              <li>
                <a href={url('/careers')} class="rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900 hover:no-underline">
                  {t('nav.careers')}
                </a>
              </li>
            </ul>

            <div class="flex items-center gap-3">
              {hasMultipleLangs && (
                <div class="lang-switcher relative">
                  <button class="lang-switcher-trigger flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition-colors hover:border-gray-300 hover:text-slate-900">
                    <svg class="h-4 w-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    {currentLang.toUpperCase()}
                    <svg class="h-3 w-3 opacity-40" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                  </button>
                  <div class="lang-switcher-dropdown pointer-events-none invisible absolute right-0 top-full z-50 min-w-[160px] pt-2 opacity-0 transition-all duration-200">
                    <div class="pointer-events-auto max-h-64 overflow-y-auto rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl shadow-slate-200/50">
                      {Object.entries(languages).map(([code, lang]) => (
                        <a
                          href={langSwitchUrl(code)}
                          class={`flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors hover:bg-slate-50 hover:no-underline ${
                            code === currentLang
                              ? 'font-semibold text-slate-900'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <span class="w-7 text-[11px] font-bold uppercase tracking-wider text-slate-400">{code}</span>
                          <span>{(lang as any).label}</span>
                          {code === currentLang && (
                            <svg class="ml-auto h-4 w-4" viewBox="0 0 20 20" fill="currentColor" style={{ color: primaryColor }}><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <a
                href={url('/contact')}
                class="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:no-underline"
                style={{ backgroundColor: primaryColor }}
              >
                {t('nav.for_employers')}
              </a>
              <a
                href={url('/careers')}
                class="rounded-lg border-2 px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:no-underline"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                {t('nav.find_a_job')}
              </a>
            </div>
          </nav>
        </header>

        {/* ═══ Mobile Top Bar ═══ */}
        <header class="sticky top-0 z-50 border-b border-gray-100 md:hidden" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255,255,255,0.95)' }}>
          <div class="flex items-center justify-between px-5 py-3">
            <a href={homeUrl} class="flex items-center gap-2 hover:no-underline">
              {themeSettings.logo
                ? <img src={themeSettings.logo} alt={site.site_name} class="h-10" />
                : <span class="text-lg font-bold tracking-tight text-slate-900">{site.site_name}</span>}
            </a>
            <button
              id="mobile-menu-toggle"
              class="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100"
              aria-label="Open menu"
            >
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        {/* ═══ Mobile Full-screen Menu ═══ */}
        <div id="mobile-menu" class="fixed inset-0 z-[60] hidden md:hidden" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div class="mobile-menu-panel ml-auto flex h-full w-[85vw] max-w-sm flex-col bg-white shadow-2xl" style={{ transform: 'translateX(100%)', transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)' }}>
            {/* Menu header */}
            <div class="flex items-center justify-between border-b border-gray-100 px-5 py-3">
              <a href={homeUrl} class="flex items-center gap-2 hover:no-underline">
                {themeSettings.logo
                  ? <img src={themeSettings.logo} alt={site.site_name} class="h-10" />
                  : <span class="text-lg font-bold tracking-tight text-slate-900">{site.site_name}</span>}
              </a>
              <button
                id="mobile-menu-close"
                class="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close menu"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable nav */}
            <nav class="flex-1 overflow-y-auto px-4 py-4">
              {/* Services — accordion */}
              <div class="mobile-accordion border-b border-gray-100">
                <button class="mobile-accordion-trigger flex w-full items-center justify-between py-3.5 text-left text-[15px] font-semibold text-slate-800">
                  {t('nav.services')}
                  <svg class="mobile-accordion-arrow h-4 w-4 text-slate-400 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                </button>
                <div class="mobile-accordion-body hidden pb-3">
                  {megaServices.map((item) => (
                    <a href={url(item.href)} class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 hover:no-underline">
                      <div
                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: primaryColor }}
                        dangerouslySetInnerHTML={{ __html: iconSvg[item.icon] ?? '' }}
                      />
                      <div>
                        <div class="font-medium">{t(item.labelKey)}</div>
                        <div class="text-xs text-slate-400">{t(item.descKey)}</div>
                      </div>
                    </a>
                  ))}
                  <a href={url('/services')} class="mt-1 flex items-center gap-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:no-underline" style={{ color: primaryColor }}>
                    {t('nav.view_all_services')} <span>&rarr;</span>
                  </a>
                </div>
              </div>

              {/* Industries — accordion */}
              <div class="mobile-accordion border-b border-gray-100">
                <button class="mobile-accordion-trigger flex w-full items-center justify-between py-3.5 text-left text-[15px] font-semibold text-slate-800">
                  {t('nav.industries')}
                  <svg class="mobile-accordion-arrow h-4 w-4 text-slate-400 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                </button>
                <div class="mobile-accordion-body hidden pb-3">
                  {megaIndustries.map((item) => (
                    <a href={url(item.href)} class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 hover:no-underline">
                      <div
                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: primaryColor }}
                        dangerouslySetInnerHTML={{ __html: iconSvg[item.icon] ?? '' }}
                      />
                      <div>
                        <div class="font-medium">{t(item.labelKey)}</div>
                        <div class="text-xs text-slate-400">{t(item.descKey)}</div>
                      </div>
                    </a>
                  ))}
                  <a href={url('/industries')} class="mt-1 flex items-center gap-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:no-underline" style={{ color: primaryColor }}>
                    {t('nav.view_all_industries')} <span>&rarr;</span>
                  </a>
                </div>
              </div>

              {/* Case Studies — direct link */}
              <a href={url('/case-studies')} class="flex items-center border-b border-gray-100 py-3.5 text-[15px] font-semibold text-slate-800 hover:text-slate-900 hover:no-underline">
                {t('nav.case_studies')}
              </a>

              {/* Insights — accordion */}
              <div class="mobile-accordion border-b border-gray-100">
                <button class="mobile-accordion-trigger flex w-full items-center justify-between py-3.5 text-left text-[15px] font-semibold text-slate-800">
                  {t('nav.insights')}
                  <svg class="mobile-accordion-arrow h-4 w-4 text-slate-400 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                </button>
                <div class="mobile-accordion-body hidden pb-3">
                  {megaInsights.map((item) => (
                    <a href={url(item.href)} class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 hover:no-underline">
                      <div
                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: primaryColor }}
                        dangerouslySetInnerHTML={{ __html: iconSvg[item.icon] ?? '' }}
                      />
                      <span class="font-medium">{t(item.labelKey)}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* About — direct link */}
              <a href={url('/about')} class="flex items-center border-b border-gray-100 py-3.5 text-[15px] font-semibold text-slate-800 hover:text-slate-900 hover:no-underline">
                {t('nav.about')}
              </a>

              {/* Careers — direct link */}
              <a href={url('/careers')} class="flex items-center py-3.5 text-[15px] font-semibold text-slate-800 hover:text-slate-900 hover:no-underline">
                {t('nav.careers')}
              </a>

              {/* Language switcher */}
              {hasMultipleLangs && (
                <div class="border-t border-gray-100 pt-4 mt-2">
                  <span class="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {t('lang.label')}
                  </span>
                  <div class="space-y-0.5">
                    {Object.entries(languages).map(([code, lang]) => (
                      <a
                        href={langSwitchUrl(code)}
                        class={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors hover:no-underline ${
                          code === currentLang
                            ? 'bg-slate-100 font-semibold text-slate-900'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                      >
                        <span class="w-7 text-[11px] font-bold uppercase tracking-wider text-slate-400">{code}</span>
                        <span>{(lang as any).label}</span>
                        {code === currentLang && (
                          <svg class="ml-auto h-4 w-4" viewBox="0 0 20 20" fill="currentColor" style={{ color: primaryColor }}><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </nav>

            {/* CTA at bottom */}
            <div class="border-t border-gray-100 px-5 py-5">
              <a
                href={url('/contact')}
                class="flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold text-white hover:no-underline"
                style={{ backgroundColor: primaryColor }}
              >
                {t('nav.contact')}
              </a>
            </div>
          </div>
        </div>

        {/* Mobile menu script */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var menu = document.getElementById('mobile-menu');
            var panel = menu && menu.querySelector('.mobile-menu-panel');
            var openBtn = document.getElementById('mobile-menu-toggle');
            var closeBtn = document.getElementById('mobile-menu-close');

            function openMenu() {
              menu.classList.remove('hidden');
              requestAnimationFrame(function(){
                requestAnimationFrame(function(){
                  panel.style.transform = 'translateX(0)';
                  menu.style.backgroundColor = 'rgba(0,0,0,0.4)';
                });
              });
              document.body.style.overflow = 'hidden';
            }

            function closeMenu() {
              panel.style.transform = 'translateX(100%)';
              menu.style.backgroundColor = 'rgba(0,0,0,0)';
              setTimeout(function(){ menu.classList.add('hidden'); }, 300);
              document.body.style.overflow = '';
            }

            if (openBtn) openBtn.addEventListener('click', openMenu);
            if (closeBtn) closeBtn.addEventListener('click', closeMenu);
            if (menu) menu.addEventListener('click', function(e) {
              if (e.target === menu) closeMenu();
            });

            // Desktop lang switcher dropdown
            var langSwitcher = document.querySelector('.lang-switcher');
            var langTrigger = langSwitcher && langSwitcher.querySelector('.lang-switcher-trigger');
            var langDropdown = langSwitcher && langSwitcher.querySelector('.lang-switcher-dropdown');
            if (langTrigger && langDropdown) {
              langTrigger.addEventListener('click', function(e) {
                e.stopPropagation();
                var isOpen = !langDropdown.classList.contains('invisible');
                if (isOpen) {
                  langDropdown.classList.add('invisible','opacity-0','pointer-events-none');
                } else {
                  langDropdown.classList.remove('invisible','opacity-0','pointer-events-none');
                }
              });
              document.addEventListener('click', function() {
                langDropdown.classList.add('invisible','opacity-0','pointer-events-none');
              });
              langSwitcher.addEventListener('click', function(e) { e.stopPropagation(); });
            }

            document.querySelectorAll('.mobile-accordion-trigger').forEach(function(btn) {
              btn.addEventListener('click', function() {
                var body = btn.nextElementSibling;
                var arrow = btn.querySelector('.mobile-accordion-arrow');
                var isOpen = !body.classList.contains('hidden');
                document.querySelectorAll('.mobile-accordion-body').forEach(function(b) { b.classList.add('hidden'); });
                document.querySelectorAll('.mobile-accordion-arrow').forEach(function(a) { a.style.transform = ''; });
                if (!isOpen) {
                  body.classList.remove('hidden');
                  arrow.style.transform = 'rotate(180deg)';
                }
              });
            });
          })();
        ` }} />

        <main class="flex-1 pb-20 md:pb-0">
          {children}
        </main>

        {/* ═══ Mobile Bottom Navigation (app-style) ═══ */}
        <nav class="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div class="mx-auto flex max-w-lg items-center justify-around px-1 py-1.5">
            <a href={homeUrl} class="mobile-nav-item flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-slate-400 transition-colors duration-200 hover:no-underline" data-active="home">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span class="text-[10px] font-medium">{t('mobile.home')}</span>
            </a>
            <a href={url('/services')} class="mobile-nav-item flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-slate-400 transition-colors duration-200 hover:no-underline">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span class="text-[10px] font-medium">{t('mobile.services')}</span>
            </a>
            <a href={url('/case-studies')} class="mobile-nav-item flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-slate-400 transition-colors duration-200 hover:no-underline">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              <span class="text-[10px] font-medium">{t('mobile.case_studies')}</span>
            </a>
            <a href={url('/articles')} class="mobile-nav-item flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-slate-400 transition-colors duration-200 hover:no-underline">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span class="text-[10px] font-medium">{t('mobile.articles')}</span>
            </a>
            <a href={url('/about')} class="mobile-nav-item flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-slate-400 transition-colors duration-200 hover:no-underline">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <span class="text-[10px] font-medium">{t('mobile.about')}</span>
            </a>
            <a
              href={url('/contact')}
              class="mobile-nav-item flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-colors duration-200 hover:no-underline"
              style={{ color: primaryColor }}
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span class="text-[10px] font-bold">{t('mobile.contact')}</span>
            </a>
          </div>
        </nav>

        {/* ═══ Pre-footer dual CTA strip ═══ */}
        <div class="grid md:grid-cols-2">
          <div class="px-8 py-14 text-center" style={{ backgroundColor: primaryColor }}>
            <h3 class="text-xl font-bold text-white mb-2">{t('prefooter.need_to_hire')}</h3>
            <p class="text-sm text-white/80 mb-5">{t('prefooter.hire_desc')}</p>
            <a href={url('/contact')} class="inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-semibold hover:bg-gray-100 hover:no-underline" style={{ color: primaryColor }}>{t('prefooter.hire_cta')} &rarr;</a>
          </div>
          <div class="px-8 py-14 text-center bg-white">
            <h3 class="text-xl font-bold text-slate-900 mb-2">{t('prefooter.looking_for_work')}</h3>
            <p class="text-sm text-slate-500 mb-5">{t('prefooter.jobs_desc')}</p>
            <a href={url('/careers')} class="inline-block rounded-lg px-6 py-2.5 text-sm font-semibold text-white hover:brightness-110 hover:no-underline" style={{ backgroundColor: primaryColor }}>{t('prefooter.jobs_cta')} &rarr;</a>
          </div>
        </div>

        {/* ═══ Footer ═══ */}
        <footer class="md:block" style={{ backgroundColor: navColor }}>
          <div class="h-px" style={{ background: `linear-gradient(to right, transparent, ${primaryColor}, transparent)` }} />
          <div class="mx-auto max-w-7xl px-6 py-20">
            <div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div class="mb-5 text-lg font-bold text-white">{site.site_name}</div>
                <p class="mb-6 text-sm leading-relaxed text-gray-400">
                  {themeSettings.footer_text ?? 'Connecting great people with great companies.'}
                </p>
                <div class="flex gap-5 text-sm text-gray-500">
                  <a href="#" class="transition-colors duration-200 hover:text-white hover:no-underline">LinkedIn</a>
                  <a href="#" class="transition-colors duration-200 hover:text-white hover:no-underline">X</a>
                  <a href="#" class="transition-colors duration-200 hover:text-white hover:no-underline">GitHub</a>
                </div>
              </div>

              <div>
                <h4 class="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">{t('footer.services')}</h4>
                <ul class="space-y-3">
                  {footerServices.map((link) => (
                    <li>
                      <a href={url(link.href)} class="text-sm text-gray-500 transition-colors duration-200 hover:text-white hover:no-underline">
                        {t(link.labelKey)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 class="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">{t('footer.company')}</h4>
                <ul class="space-y-3">
                  {footerCompany.map((link) => (
                    <li>
                      <a href={url(link.href)} class="text-sm text-gray-500 transition-colors duration-200 hover:text-white hover:no-underline">
                        {t(link.labelKey)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 class="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">{t('footer.resources')}</h4>
                <ul class="space-y-3">
                  {footerResources.map((link) => (
                    <li>
                      <a href={url(link.href)} class="text-sm text-gray-500 transition-colors duration-200 hover:text-white hover:no-underline">
                        {t(link.labelKey)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div class="mt-16 border-t border-gray-800/50 pt-8 text-center text-xs text-gray-600">
              <p>&copy; {new Date().getFullYear()} {site.site_name}. {t('footer.rights')}</p>
              <p class="mt-3 text-gray-700/40">{t('footer.crafted_with')} <a href="https://barkajs.dev" class="hover:text-gray-500 hover:no-underline" style="color: inherit">Barka</a></p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default Base;
