/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const NotFound: FC<LayoutProps> = (props) => {
  const { themeSettings } = props;
  const primaryColor = themeSettings.primary_color ?? '#F59E0B';
  const navColor = themeSettings.nav_color ?? '#14101E';

  return (
    <Base {...props}>
      <section class="relative flex min-h-[75vh] items-center justify-center overflow-hidden" style={{ backgroundColor: navColor }}>
        {/* Ambient glow */}
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 30%, ${primaryColor}12 0%, transparent 50%)` }} />
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 20% 70%, ${primaryColor}06 0%, transparent 40%)` }} />
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 80% 80%, ${primaryColor}06 0%, transparent 40%)` }} />

        {/* Grid pattern overlay */}
        <div class="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div class="relative z-10 px-6 text-center">
          {/* Giant 404 — faded background element */}
          <div
            class="select-none text-[12rem] font-extrabold leading-none tracking-[-0.06em] sm:text-[16rem] lg:text-[20rem]"
            style={{ color: `${primaryColor}08` }}
          >
            404
          </div>

          {/* Content overlay */}
          <div class="-mt-20 sm:-mt-28 lg:-mt-36">
            <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: `${primaryColor}15` }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={primaryColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>

            <h1 class="text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl">
              Page not found
            </h1>
            <p class="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-400 sm:text-lg">
              The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
            </p>

            <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/"
                class="group inline-flex items-center gap-2 rounded-lg px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:no-underline"
                style={{ backgroundColor: primaryColor }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-200 group-hover:-translate-x-0.5">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Home
              </a>
              <a href="/contact" class="inline-flex items-center gap-2 rounded-lg border border-white/20 px-7 py-3 text-sm font-semibold text-white/80 transition-all duration-200 hover:border-white/40 hover:text-white hover:no-underline">
                Contact Us
              </a>
            </div>

            {/* Helpful links */}
            <div class="mx-auto mt-16 max-w-xl">
              <p class="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                Popular pages
              </p>
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Services', href: '/services', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
                  { label: 'Case Studies', href: '/case-studies', icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11' },
                  { label: 'About', href: '/about', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
                  { label: 'Contact', href: '/contact', icon: 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z' },
                ].map((link) => (
                  <a
                    href={link.href}
                    class="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm font-medium text-gray-400 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-white hover:no-underline"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-60 transition-opacity group-hover:opacity-100">
                      <path d={link.icon} />
                    </svg>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Base>
  );
};

export default NotFound;
