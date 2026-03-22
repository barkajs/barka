/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const contactChannels = [
  {
    label: 'General Inquiries',
    email: 'hello@barka.dev',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  },
  {
    label: 'Sales & Partnerships',
    email: 'sales@barka.dev',
    phone: '+48 22 123 4567',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  },
  {
    label: 'Careers',
    email: 'careers@barka.dev',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  },
];

const offices = [
  { city: 'Warsaw', flag: '🇵🇱', label: 'Headquarters', address: 'ul. Marszałkowska 100, 00-026 Warsaw, Poland' },
  { city: 'Kraków', flag: '🇵🇱', label: 'Engineering Hub', address: 'ul. Pawia 5, 31-154 Kraków, Poland' },
  { city: 'Wrocław', flag: '🇵🇱', label: 'Development Center', address: 'ul. Świdnicka 40, 50-024 Wrocław, Poland' },
  { city: 'Berlin', flag: '🇩🇪', label: 'DACH Office', address: 'Friedrichstraße 123, 10117 Berlin, Germany' },
  { city: 'London', flag: '🇬🇧', label: 'UK Office', address: '1 Canada Square, Canary Wharf, London E14 5AB' },
];

const PageContact: FC<LayoutProps> = (props) => {
  const { content, themeSettings } = props;
  const primaryColor = themeSettings.primary_color ?? '#10B981';
  const navColor = themeSettings.nav_color ?? '#0B1222';

  return (
    <Base {...props}>
      {/* Hero */}
      <section class="relative overflow-hidden py-20 text-white" style={{ backgroundColor: navColor }}>
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 60% 50%, ${primaryColor}12 0%, transparent 50%)` }} />
        <div class="relative mx-auto max-w-7xl px-6 text-center">
          <h1 class="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
            {content.title ?? 'Get in Touch'}
          </h1>
          <p class="mx-auto mt-4 max-w-xl text-lg text-gray-300/90">
            {content.fields?.subtitle ?? "Let's discuss how we can accelerate your digital transformation"}
          </p>
        </div>
      </section>

      {/* Contact form + info — two-column layout */}
      <section class="py-20">
        <div class="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-5">

          {/* Left — Contact form */}
          <div class="lg:col-span-3">
            <h2 class="text-2xl font-bold tracking-[-0.02em] text-slate-900">Send us a message</h2>
            <p class="mt-2 text-sm text-slate-500">Fill out the form and our team will get back to you within 24 hours.</p>

            <form class="mt-8 space-y-6" action="#" method="post">
              <div class="grid gap-6 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700" for="first_name">First name</label>
                  <input
                    type="text" id="first_name" name="first_name" autocomplete="given-name"
                    class="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700" for="last_name">Last name</label>
                  <input
                    type="text" id="last_name" name="last_name" autocomplete="family-name"
                    class="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700" for="email">Work email</label>
                <input
                  type="email" id="email" name="email" autocomplete="email"
                  class="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="jane@company.com"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700" for="company">Company</label>
                <input
                  type="text" id="company" name="company" autocomplete="organization"
                  class="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Company Ltd."
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700" for="interest">I'm interested in</label>
                <select
                  id="interest" name="interest"
                  class="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Select a topic</option>
                  <option value="custom-software">Custom Software Development</option>
                  <option value="cloud">Cloud & Infrastructure</option>
                  <option value="data-ai">Data & AI</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="devops">DevOps & SRE</option>
                  <option value="staff">IT Outsourcing & Staff Augmentation</option>
                  <option value="consulting">Digital Transformation Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700" for="message">Message</label>
                <textarea
                  id="message" name="message" rows={5}
                  class="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  placeholder="Tell us about your project, timeline, and goals..."
                />
              </div>

              <button
                type="submit"
                class="w-full rounded-lg px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg sm:w-auto"
                style={{ backgroundColor: primaryColor }}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right — Contact channels */}
          <div class="lg:col-span-2">
            <h2 class="text-2xl font-bold tracking-[-0.02em] text-slate-900">Contact directly</h2>
            <p class="mt-2 text-sm text-slate-500">Prefer email or phone? Reach out to the right team.</p>

            <div class="mt-8 space-y-4">
              {contactChannels.map((ch) => (
                <div class="rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50">
                  <div class="flex items-start gap-4">
                    <div
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                      style={{ backgroundColor: primaryColor }}
                      dangerouslySetInnerHTML={{ __html: ch.icon }}
                    />
                    <div>
                      <div class="text-sm font-semibold text-slate-900">{ch.label}</div>
                      <a href={`mailto:${ch.email}`} class="mt-1 block text-sm hover:no-underline" style={{ color: primaryColor }}>
                        {ch.email}
                      </a>
                      {ch.phone && (
                        <a href={`tel:${ch.phone.replace(/\s/g, '')}`} class="mt-0.5 block text-sm text-slate-500 hover:text-slate-900 hover:no-underline">
                          {ch.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Business hours */}
            <div class="mt-8 rounded-2xl border border-gray-100 bg-slate-50 p-6">
              <h3 class="text-sm font-semibold text-slate-900">Business Hours</h3>
              <div class="mt-3 space-y-2 text-sm text-slate-500">
                <div class="flex justify-between">
                  <span>Monday – Friday</span>
                  <span class="font-medium text-slate-700">9:00 – 18:00 CET</span>
                </div>
                <div class="flex justify-between">
                  <span>Saturday – Sunday</span>
                  <span class="font-medium text-slate-400">Closed</span>
                </div>
              </div>
              <div class="mt-4 border-t border-gray-200 pt-4 text-xs text-slate-400">
                24/7 operations support: <a href="mailto:ops@barka.dev" class="hover:no-underline" style={{ color: primaryColor }}>ops@barka.dev</a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Offices */}
      <section class="border-t border-gray-100 bg-slate-50 py-20">
        <div class="mx-auto max-w-7xl px-6">
          <h2 class="mb-4 text-center text-3xl font-bold tracking-[-0.02em] text-slate-900">Our Offices</h2>
          <p class="mx-auto mb-16 max-w-xl text-center text-slate-500">
            5 offices across Europe, 800+ engineers ready to work with you.
          </p>

          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {offices.map((office) => (
              <div class="group rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50">
                <div class="mb-3 text-2xl">{office.flag}</div>
                <h3 class="text-base font-semibold text-slate-900">{office.city}</h3>
                <div class="mt-0.5 text-xs font-medium uppercase tracking-widest" style={{ color: primaryColor }}>{office.label}</div>
                <p class="mt-3 text-sm leading-relaxed text-slate-400">
                  {office.address}
                </p>
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
            Book a 30-minute discovery call with one of our solution architects.
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
