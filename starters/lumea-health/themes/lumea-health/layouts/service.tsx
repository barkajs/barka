/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const iconMap: Record<string, string> = {
  heart: '<svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  bone: '<svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10c.5-.5 1.5-1 2-1s1.5.5 2 1 .5 2 0 2.5L13 20l-2-2"/><path d="M7 14c-.5.5-1.5 1-2 1s-1.5-.5-2-1-.5-2 0-2.5L11 4l2 2"/></svg>',
  sun: '<svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  brain: '<svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2a4 4 0 0 1 4-4z"/><path d="M8 8v2c0 2.2 1.8 4 4 4s4-1.8 4-4V8"/><path d="M6 14c-1.7 1-3 3-3 5v1h18v-1c0-2-1.3-4-3-5"/></svg>',
  baby: '<svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',
  eye: '<svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  thermometer: '<svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>',
  stethoscope: '<svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>',
};

const Service: FC<LayoutProps> = (props) => {
  const { content, themeSettings } = props;
  const t = themeSettings._t ?? ((k: string) => k);
  const url = themeSettings._url ?? ((p: string) => p);
  const icon = content.fields?.icon ?? 'heart';
  const iconSvg = iconMap[icon] ?? iconMap.heart;

  // Parse bullet lists from body HTML
  const bodyHtml = content.bodyHtml ?? '';

  // Extract services list (items between <li> tags)
  const serviceItems: string[] = [];
  const liRegex = /<li>(.*?)<\/li>/gs;
  let match;
  while ((match = liRegex.exec(bodyHtml)) !== null) {
    serviceItems.push(match[1].replace(/<\/?strong>/g, '').replace(/<\/?em>/g, ''));
  }

  // Extract headings and their content
  const sections: { heading: string; content: string }[] = [];
  const headingRegex = /<h2>(.*?)<\/h2>([\s\S]*?)(?=<h2>|$)/g;
  let hMatch;
  while ((hMatch = headingRegex.exec(bodyHtml)) !== null) {
    sections.push({ heading: hMatch[1], content: hMatch[2].trim() });
  }

  return (
    <Base {...props}>
      {/* Hero */}
      <section class="py-16 pb-8" style={{ backgroundColor: 'var(--color-cream)' }}>
        <div class="mx-auto max-w-6xl px-6">
          <div class="grid gap-10 lg:grid-cols-5 lg:items-start">
            <div class="lg:col-span-3">
              <div class="mb-4 flex items-center gap-3">
                <div
                  class="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                  dangerouslySetInnerHTML={{ __html: iconSvg }}
                />
                <span class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
                  Specialty
                </span>
              </div>
              <h1 class="text-4xl sm:text-5xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{content.title}</h1>
              {content.fields?.short_description && (
                <p class="text-lg leading-relaxed mb-6" style={{ color: 'var(--color-muted)' }}>{content.fields.short_description}</p>
              )}
              <div class="flex flex-wrap gap-3">
                <a href={url('/contact')} class="rounded-2xl px-6 py-3 text-sm font-semibold text-white hover:no-underline" style={{ backgroundColor: 'var(--color-primary)' }}>
                  Book Consultation
                </a>
                <a href={url('/doctors')} class="rounded-2xl border-2 px-6 py-3 text-sm font-semibold hover:no-underline" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                  Find a Specialist
                </a>
              </div>
            </div>

            {/* Quick info card */}
            <div class="lg:col-span-2">
              <div class="rounded-3xl p-6" style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', boxShadow: '0 8px 30px -10px rgba(0,0,0,0.08)' }}>
                <h3 class="text-lg mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Quick Info</h3>
                <div class="space-y-4">
                  <div class="flex items-start gap-3">
                    <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--color-primary-light)' }}>
                      <svg class="h-4 w-4" style={{ color: 'var(--color-primary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div>
                      <div class="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>Consultation</div>
                      <div class="text-sm font-medium">30-60 min · from 350 PLN</div>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--color-primary-light)' }}>
                      <svg class="h-4 w-4" style={{ color: 'var(--color-primary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div>
                      <div class="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>Available at</div>
                      <div class="text-sm font-medium">All 6 clinics</div>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--color-primary-light)' }}>
                      <svg class="h-4 w-4" style={{ color: 'var(--color-primary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                    </div>
                    <div>
                      <div class="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>Referral</div>
                      <div class="text-sm font-medium">Not required (private)</div>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--color-primary-light)' }}>
                      <svg class="h-4 w-4" style={{ color: 'var(--color-primary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                    <div>
                      <div class="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>Insurance</div>
                      <div class="text-sm font-medium">Medicover, Luxmed, PZU, NFZ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services list as cards */}
      {serviceItems.length > 0 && (
        <section class="py-12" style={{ backgroundColor: 'var(--color-cream)' }}>
          <div class="mx-auto max-w-6xl px-6">
            <h2 class="text-2xl sm:text-3xl mb-8" style={{ fontFamily: 'var(--font-heading)' }}>What We Offer</h2>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {serviceItems.map((item) => {
                const parts = item.split(' — ');
                const title = parts[0]?.trim() ?? item;
                const desc = parts[1]?.trim() ?? '';
                return (
                  <div class="rounded-2xl p-5" style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)' }}>
                    <div class="flex items-start gap-3">
                      <svg class="mt-0.5 h-5 w-5 shrink-0" style={{ color: 'var(--color-primary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                      <div>
                        <div class="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{title}</div>
                        {desc && <div class="mt-1 text-xs" style={{ color: 'var(--color-muted)' }}>{desc}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Body content — remaining sections */}
      {sections.filter(s => !s.content.includes('<li>')).length > 0 && (
        <section class="py-12" style={{ backgroundColor: 'var(--color-cream)' }}>
          <div class="mx-auto max-w-6xl px-6">
            <div class="grid gap-8 lg:grid-cols-2">
              {sections.filter(s => !s.content.includes('<li>')).map((s) => (
                <div class="rounded-3xl p-8" style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)' }}>
                  <h2 class="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{s.heading}</h2>
                  <div class="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }} dangerouslySetInnerHTML={{ __html: s.content }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section class="py-16" style={{ backgroundColor: 'var(--color-primary)' }}>
        <div class="mx-auto max-w-3xl px-6 text-center">
          <h2 class="text-3xl text-white sm:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>Ready to take care of your health?</h2>
          <p class="mx-auto mt-4 max-w-xl text-base" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Book a {content.title.toLowerCase()} consultation at any of our clinics. Same-day availability for urgent cases.
          </p>
          <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href={url('/contact')} class="rounded-2xl bg-white px-8 py-3.5 text-sm font-semibold hover:no-underline" style={{ color: 'var(--color-primary)' }}>
              Book Appointment
            </a>
            <a href="tel:+48221002000" class="rounded-2xl border-2 border-white/30 px-8 py-3.5 text-sm font-semibold text-white hover:no-underline">
              Call: +48 22 100 2000
            </a>
          </div>
        </div>
      </section>

      {props.children}
    </Base>
  );
};

export default Service;
