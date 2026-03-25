/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import { token } from '../lib/tokens.js';

// Nav/footer items use translation keys — resolved via t() at render time
type NavItem = { tKey: string; fallback: string; href: string; children?: { tKey: string; fallback: string; href: string }[] };

const navItems: NavItem[] = [
  {
    tKey: 'nav.specialties', fallback: 'Specialties', href: '/services', children: [
      { tKey: 'nav.cardiology', fallback: 'Cardiology', href: '/services/cardiology' },
      { tKey: 'nav.dermatology', fallback: 'Dermatology', href: '/services/dermatology' },
      { tKey: 'nav.orthopedics', fallback: 'Orthopedics', href: '/services/orthopedics' },
      { tKey: 'nav.gynecology', fallback: 'Gynecology', href: '/services/gynecology' },
      { tKey: 'nav.pediatrics', fallback: 'Pediatrics', href: '/services/pediatrics' },
      { tKey: 'nav.ophthalmology', fallback: 'Ophthalmology', href: '/services/ophthalmology' },
      { tKey: 'nav.neurology', fallback: 'Neurology', href: '/services/neurology' },
      { tKey: 'nav.endocrinology', fallback: 'Endocrinology', href: '/services/endocrinology' },
    ],
  },
  {
    tKey: 'nav.services', fallback: 'Services', href: '/services', children: [
      { tKey: 'nav.primary_care', fallback: 'Primary Care', href: '/services/primary-care' },
      { tKey: 'nav.diagnostics', fallback: 'Diagnostics', href: '/services/diagnostics' },
      { tKey: 'nav.rehabilitation', fallback: 'Rehabilitation', href: '/services/rehabilitation' },
      { tKey: 'nav.telemedicine', fallback: 'Telemedicine', href: '/services/telemedicine' },
      { tKey: 'nav.health_checkups', fallback: 'Health Checkups', href: '/services/health-checkups' },
      { tKey: 'nav.occupational_medicine', fallback: 'Occupational Medicine', href: '/services/occupational-medicine' },
      { tKey: 'nav.vaccinations', fallback: 'Vaccinations', href: '/services/vaccinations' },
    ],
  },
  { tKey: 'nav.clinics', fallback: 'Clinics', href: '/clinics' },
  { tKey: 'nav.doctors', fallback: 'Doctors', href: '/doctors' },
  { tKey: 'nav.blog', fallback: 'Blog', href: '/articles' },
  { tKey: 'nav.about', fallback: 'About', href: '/about' },
];

type FooterItem = { tKey: string; fallback: string; href: string };

const footerSpecialties: FooterItem[] = [
  { tKey: 'nav.cardiology', fallback: 'Cardiology', href: '/services/cardiology' },
  { tKey: 'nav.dermatology', fallback: 'Dermatology', href: '/services/dermatology' },
  { tKey: 'nav.orthopedics', fallback: 'Orthopedics', href: '/services/orthopedics' },
  { tKey: 'nav.gynecology', fallback: 'Gynecology', href: '/services/gynecology' },
  { tKey: 'nav.pediatrics', fallback: 'Pediatrics', href: '/services/pediatrics' },
];

const footerCompany: FooterItem[] = [
  { tKey: 'footer.about_us', fallback: 'About Us', href: '/about' },
  { tKey: 'footer.our_clinics', fallback: 'Our Clinics', href: '/clinics' },
  { tKey: 'nav.doctors', fallback: 'Doctors', href: '/doctors' },
  { tKey: 'footer.careers', fallback: 'Careers', href: '/careers' },
  { tKey: 'nav.contact', fallback: 'Contact', href: '/contact' },
];

const footerPatient: FooterItem[] = [
  { tKey: 'footer.for_patients', fallback: 'For Patients', href: '/for-patients' },
  { tKey: 'footer.faq', fallback: 'FAQ', href: '/faq' },
  { tKey: 'footer.pricing', fallback: 'Pricing', href: '/pricing' },
  { tKey: 'nav.blog', fallback: 'Blog', href: '/articles' },
];

/** Resolve translation key — returns translated string or fallback */
function tr(t: (k: string) => string, tKey: string, fallback: string): string {
  const val = t(tKey);
  return val === tKey ? fallback : val;
}

const Base: FC<LayoutProps> = ({ content, site, theme, themeSettings, children }) => {
  const seo = content.seo ?? {};
  const separator = site.seo?.title_separator ?? ' — ';
  const pageTitle = seo.title ?? content.title;
  const fullTitle = `${pageTitle}${separator}${site.site_name}`;
  const description = seo.description ?? site.seo?.default_description ?? '';
  const ogImage = seo.image ?? site.seo?.default_image ?? '';
  const canonical = seo.canonical ?? `${site.base_url}/${content.slug}`;
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
    '@type': content.type === 'article' ? 'Article' : 'MedicalBusiness',
    name: pageTitle,
    description,
    url: canonical,
    ...(content.publishedAt && { datePublished: content.publishedAt.toISOString() }),
    ...(content.updatedAt && { dateModified: content.updatedAt.toISOString() }),
  };

  const primaryColor = themeSettings.primary_color ?? '#4A7C59';

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

        {themeSettings._tokenCss
          ? <style dangerouslySetInnerHTML={{ __html: themeSettings._tokenCss }} />
          : null
        }
      </head>
      <body style={{ fontFamily: 'var(--font-sans)', backgroundColor: 'var(--color-cream)', color: 'var(--color-text)' }}>

        {/* ═══ Header — Simple horizontal nav with dropdowns ═══ */}
        <header class="mv-header sticky top-0 z-50">
          <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <a href={homeUrl} class="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill={primaryColor} />
                <path d="M16 8v16M10 14h12" stroke="white" stroke-width="2.5" stroke-linecap="round" />
              </svg>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-text)' }}>
                {site.site_name}
              </span>
            </a>

            {/* Desktop nav */}
            <ul class="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <li class={item.children ? 'mv-dropdown' : ''}>
                  <a href={url(item.href)} class="mv-nav-link flex items-center gap-1">
                    {tr(t, item.tKey, item.fallback)}
                    {item.children && (
                      <svg class="h-3.5 w-3.5 opacity-50" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                    )}
                  </a>
                  {item.children && (
                    <div class="mv-dropdown-menu">
                      <div class="mv-dropdown-panel">
                        {item.children.map((child) => (
                          <a href={url(child.href)} class="mv-dropdown-item">{tr(t, child.tKey, child.fallback)}</a>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div class="hidden items-center gap-3 md:flex">
              {hasMultipleLangs && (
                <div class="mv-lang-switcher">
                  <button class="flex items-center gap-1 rounded-lg border px-2.5 py-2 text-xs font-semibold uppercase tracking-wide" style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                    {currentLang.toUpperCase()}
                    <svg class="h-3 w-3 opacity-50" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                  </button>
                  <div class="mv-lang-dropdown">
                    <div class="rounded-xl border bg-white py-1 shadow-lg" style={{ borderColor: 'var(--color-border)', minWidth: '140px' }}>
                      {Object.entries(languages).map(([code, lang]) => (
                        <a
                          href={langSwitchUrl(code)}
                          class="block px-3 py-2 text-sm hover:no-underline"
                          style={{ color: code === currentLang ? 'var(--color-primary)' : 'var(--color-muted)' }}
                        >
                          {(lang as any).label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <a href={url('/contact')} class="mv-btn-primary text-sm">
                {tr(t, 'nav.book_appointment', 'Book Appointment')}
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              id="mv-mobile-toggle"
              class="flex h-10 w-10 items-center justify-center rounded-lg md:hidden"
              style={{ color: 'var(--color-text)' }}
              aria-label="Open menu"
            >
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </nav>
        </header>

        {/* Mobile menu overlay */}
        <div id="mv-mobile-menu" class="fixed inset-0 z-[60] flex-col md:hidden" style={{ backgroundColor: 'var(--color-cream)' }}>
          <div class="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'var(--color-border)' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>{site.site_name}</span>
            <button id="mv-mobile-close" class="h-10 w-10 flex items-center justify-center" aria-label="Close">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto px-6 py-6">
            {navItems.map((item) => (
              <div class="mb-4">
                <a href={url(item.href)} class="block py-2 text-lg font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>{tr(t, item.tKey, item.fallback)}</a>
                {item.children && (
                  <div class="ml-4 space-y-1">
                    {item.children.map((child) => (
                      <a href={url(child.href)} class="block py-1 text-sm" style={{ color: 'var(--color-muted)' }}>{tr(t, child.tKey, child.fallback)}</a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {hasMultipleLangs && (
              <div class="mt-6 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
                <span class="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>Language</span>
                <div class="space-y-1">
                  {Object.entries(languages).map(([code, lang]) => (
                    <a
                      href={langSwitchUrl(code)}
                      class={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm hover:no-underline ${code === currentLang ? 'font-semibold' : ''}`}
                      style={{
                        color: code === currentLang ? 'var(--color-primary)' : 'var(--color-muted)',
                        backgroundColor: code === currentLang ? 'var(--color-primary-light)' : 'transparent',
                      }}
                    >
                      <span class="w-7 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>{code}</span>
                      <span>{(lang as any).label}</span>
                      {code === currentLang && (
                        <svg class="ml-auto h-4 w-4" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'var(--color-primary)' }}><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
            <a href={url('/contact')} class="mv-btn-primary mt-4 block text-center">{tr(t, 'nav.book_appointment', 'Book Appointment')}</a>
          </div>
        </div>

        {/* Main content */}
        <main class="flex-1">
          {children}
        </main>

        {/* ═══ Footer — 4-column, cream background ═══ */}
        <footer style={{ backgroundColor: 'var(--color-cream)', borderTop: '1px solid var(--color-border)' }}>
          <div class="mx-auto max-w-7xl px-6 py-16">
            <div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div class="flex items-center gap-2 mb-4">
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" fill={primaryColor} />
                    <path d="M16 8v16M10 14h12" stroke="white" stroke-width="2.5" stroke-linecap="round" />
                  </svg>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>{site.site_name}</span>
                </div>
                <p class="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                  {themeSettings.footer_text ?? 'Your health, our mission. Premium healthcare across Poland.'}
                </p>
                <p class="mt-4 text-sm" style={{ color: 'var(--color-muted)' }}>
                  <strong style={{ color: 'var(--color-text)' }}>Call us:</strong> +48 22 100 2000
                </p>
                <p class="text-sm" style={{ color: 'var(--color-muted)' }}>
                  <strong style={{ color: 'var(--color-text)' }}>Email:</strong> info@lumeahealth.pl
                </p>
              </div>

              <div>
                <h4 class="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}>{tr(t, 'footer.specialties', 'Specialties')}</h4>
                <ul class="space-y-2.5">
                  {footerSpecialties.map((link) => (
                    <li><a href={url(link.href)} class="text-sm transition-colors hover:no-underline" style={{ color: 'var(--color-primary)' }}>{tr(t, link.tKey, link.fallback)}</a></li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 class="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}>{tr(t, 'footer.company', 'Company')}</h4>
                <ul class="space-y-2.5">
                  {footerCompany.map((link) => (
                    <li><a href={url(link.href)} class="text-sm transition-colors hover:no-underline" style={{ color: 'var(--color-primary)' }}>{tr(t, link.tKey, link.fallback)}</a></li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 class="mb-4 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}>{tr(t, 'footer.patient_info', 'Patient Info')}</h4>
                <ul class="space-y-2.5">
                  {footerPatient.map((link) => (
                    <li><a href={url(link.href)} class="text-sm transition-colors hover:no-underline" style={{ color: 'var(--color-primary)' }}>{tr(t, link.tKey, link.fallback)}</a></li>
                  ))}
                </ul>
              </div>
            </div>

            <div class="mt-12 border-t pt-8 flex flex-col items-center gap-4" style={{ borderColor: 'var(--color-border)' }}>
              <div class="flex items-center gap-4">
                {/* Facebook */}
                <a href="#" aria-label="Facebook" class="flex h-10 w-10 items-center justify-center rounded-full transition-colors" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                {/* Instagram */}
                <a href="#" aria-label="Instagram" class="flex h-10 w-10 items-center justify-center rounded-full transition-colors" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                {/* LinkedIn */}
                <a href="#" aria-label="LinkedIn" class="flex h-10 w-10 items-center justify-center rounded-full transition-colors" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                {/* YouTube */}
                <a href="#" aria-label="YouTube" class="flex h-10 w-10 items-center justify-center rounded-full transition-colors" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
              <p class="text-xs" style={{ color: 'var(--color-muted)' }}>&copy; {new Date().getFullYear()} {site.site_name}. {tr(t, 'footer.rights', 'All rights reserved.')} NIP: 525-XXX-XX-XX</p>
              <p class="mt-2 text-xs" style={{ color: 'var(--color-muted)', opacity: '0.5' }}>{tr(t, 'footer.crafted_with', 'Crafted with')} <a href="https://www.barka.dev" class="hover:no-underline" style={{ color: 'inherit' }}>Barka</a></p>
            </div>
          </div>
        </footer>

        {/* ═══ Mobile Bottom Nav — sticky icon bar ═══ */}
        <nav class="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden" style={{ borderColor: 'var(--color-border)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div class="mx-auto flex max-w-lg items-center justify-around px-1 py-1.5">
            {/* Home */}
            <a href={homeUrl} class="flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-colors hover:no-underline" style={{ color: 'var(--color-muted)' }}>
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span class="text-[10px] font-medium">{tr(t, 'mobile.home', 'Home')}</span>
            </a>
            {/* Specialties — stethoscope */}
            <a href={url('/services')} class="flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-colors hover:no-underline" style={{ color: 'var(--color-muted)' }}>
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
              <span class="text-[10px] font-medium">{tr(t, 'mobile.specialties', 'Specialties')}</span>
            </a>
            {/* Doctors — stethoscope */}
            <a href={url('/doctors')} class="flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-colors hover:no-underline" style={{ color: 'var(--color-muted)' }}>
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span class="text-[10px] font-medium">{tr(t, 'mobile.doctors', 'Doctors')}</span>
            </a>
            {/* Blog — newspaper */}
            <a href={url('/articles')} class="flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-colors hover:no-underline" style={{ color: 'var(--color-muted)' }}>
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/></svg>
              <span class="text-[10px] font-medium">{tr(t, 'mobile.blog', 'Blog')}</span>
            </a>
            {/* Contact — phone */}
            <a href={url('/contact')} class="flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-colors hover:no-underline" style={{ color: 'var(--color-primary)' }}>
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span class="text-[10px] font-bold">{tr(t, 'mobile.contact', 'Contact')}</span>
            </a>
          </div>
        </nav>

        {/* Mobile menu script */}
        <script dangerouslySetInnerHTML={{ __html: `
          document.getElementById('mv-mobile-toggle')?.addEventListener('click', function() {
            document.getElementById('mv-mobile-menu')?.classList.add('open');
          });
          document.getElementById('mv-mobile-close')?.addEventListener('click', function() {
            document.getElementById('mv-mobile-menu')?.classList.remove('open');
          });
        `}} />
      </body>
    </html>
  );
};

export default Base;
