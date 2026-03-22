/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const contactChannels = [
  {
    label: 'Employers',
    description: 'Hiring managers & HR teams',
    email: 'employers@kadoservices.com',
    phone: '+48 22 123 4567',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  },
  {
    label: 'Candidates',
    description: 'Job seekers & career support',
    email: 'careers@kadoservices.com',
    phone: '+48 22 123 4568',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  },
  {
    label: 'General',
    description: 'Partnerships & media inquiries',
    email: 'hello@kadoservices.com',
    phone: '+48 22 123 4569',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  },
];

const offices = [
  { city: 'Warsaw', label: 'Headquarters', address: 'ul. Marszalkowska 100, 00-026 Warsaw', hours: 'Mon-Fri 9:00-18:00' },
  { city: 'Krakow', label: 'Southern Hub', address: 'ul. Pawia 5, 31-154 Krakow', hours: 'Mon-Fri 9:00-18:00' },
  { city: 'Wroclaw', label: 'Western Office', address: 'ul. Swidnicka 40, 50-024 Wroclaw', hours: 'Mon-Fri 9:00-17:00' },
  { city: 'Gdansk', label: 'Northern Office', address: 'ul. Dluga 45, 80-827 Gdansk', hours: 'Mon-Fri 9:00-17:00' },
];

const PageContact: FC<LayoutProps> = (props) => {
  const { content, themeSettings } = props;
  const primaryColor = themeSettings.primary_color ?? '#F59E0B';
  const navColor = themeSettings.nav_color ?? '#14101E';

  return (
    <Base {...props}>
      {/* Hero — clean amber-50 background */}
      <section class="py-20" style={{ backgroundColor: '#FFFBEB' }}>
        <div class="mx-auto max-w-7xl px-6 text-center">
          <h1 class="text-4xl font-extrabold tracking-[-0.03em] text-slate-900 sm:text-5xl">
            Let's Talk
          </h1>
          <p class="mx-auto mt-4 max-w-xl text-lg text-slate-500">
            {content.fields?.subtitle ?? 'Whether you need talent or are looking for your next role, we are here to help.'}
          </p>
        </div>
      </section>

      {/* Contact channel cards — row of 3 */}
      <section class="py-16">
        <div class="mx-auto max-w-5xl px-6">
          <div class="grid gap-6 sm:grid-cols-3">
            {contactChannels.map((ch) => (
              <div class="rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50" style={{ borderTop: `3px solid ${primaryColor}` }}>
                <div
                  class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: primaryColor }}
                  dangerouslySetInnerHTML={{ __html: ch.icon }}
                />
                <h3 class="text-lg font-bold text-slate-900">{ch.label}</h3>
                <p class="mt-1 text-xs text-slate-400">{ch.description}</p>
                <div class="mt-4 space-y-2">
                  <a href={`mailto:${ch.email}`} class="flex items-center gap-2 text-sm hover:no-underline" style={{ color: primaryColor }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {ch.email}
                  </a>
                  <a href={`tel:${ch.phone.replace(/\s/g, '')}`} class="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 hover:no-underline">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    {ch.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form — full width bordered card */}
      <section class="pb-16">
        <div class="mx-auto max-w-3xl px-6">
          <div class="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
            <h2 class="text-2xl font-bold tracking-[-0.02em] text-slate-900">Send us a message</h2>
            <p class="mt-2 text-sm text-slate-500">Fill out the form and our team will get back to you within 24 hours.</p>

            <form class="mt-8 space-y-6" action="#" method="post">
              <div class="grid gap-6 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700" for="first_name">First name</label>
                  <input
                    type="text" id="first_name" name="first_name" autocomplete="given-name"
                    class="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700" for="last_name">Last name</label>
                  <input
                    type="text" id="last_name" name="last_name" autocomplete="family-name"
                    class="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700" for="email">Work email</label>
                <input
                  type="email" id="email" name="email" autocomplete="email"
                  class="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="jane@company.com"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700" for="company">Company</label>
                <input
                  type="text" id="company" name="company" autocomplete="organization"
                  class="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="Company Ltd."
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700" for="interest">I'm interested in</label>
                <select
                  id="interest" name="interest"
                  class="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="">Select a topic</option>
                  <option value="temporary-staffing">Temporary Staffing</option>
                  <option value="permanent-recruitment">Permanent Recruitment</option>
                  <option value="executive-search">Executive Search</option>
                  <option value="outsourcing">HR Outsourcing & Payroll</option>
                  <option value="workforce-planning">Workforce Planning</option>
                  <option value="candidate">I'm a Candidate Looking for Work</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700" for="message">Message</label>
                <textarea
                  id="message" name="message" rows={5}
                  class="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                  placeholder="Tell us about your hiring needs, timeline, and goals..."
                />
              </div>

              <button
                type="submit"
                class="w-full rounded-lg px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Office locations — 2x2 compact grid */}
      <section class="py-16 border-t border-gray-100" style={{ backgroundColor: '#FAFAFA' }}>
        <div class="mx-auto max-w-4xl px-6">
          <h2 class="mb-2 text-center text-2xl font-bold tracking-[-0.02em] text-slate-900">Our Offices</h2>
          <p class="mx-auto mb-10 max-w-md text-center text-sm text-slate-500">
            Visit us at any of our locations across Poland.
          </p>

          <div class="grid gap-4 sm:grid-cols-2">
            {offices.map((office) => (
              <div class="flex gap-4 rounded-xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:shadow-md">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: navColor }}>
                  {office.city.slice(0, 2).toUpperCase()}
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-semibold text-slate-900">{office.city}</h3>
                  <div class="text-xs font-medium" style={{ color: primaryColor }}>{office.label}</div>
                  <p class="mt-1 text-xs text-slate-400 leading-relaxed">{office.address}</p>
                  <p class="mt-0.5 text-xs text-slate-400">{office.hours}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section class="relative overflow-hidden py-20 text-white" style={{ backgroundColor: navColor }}>
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${primaryColor}12 0%, transparent 60%)` }} />
        <div class="relative mx-auto max-w-3xl px-6 text-center">
          <h2 class="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            Prefer a scheduled call?
          </h2>
          <p class="mt-4 text-lg text-gray-300/90">
            Book a 30-minute discovery call with one of our staffing consultants.
          </p>
          <a
            href="#"
            class="mt-8 inline-block rounded-lg px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:no-underline"
            style={{ backgroundColor: primaryColor }}
          >
            Book a Discovery Call
          </a>
        </div>
      </section>
    </Base>
  );
};

export default PageContact;
