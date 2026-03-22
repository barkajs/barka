/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const values = [
  { title: 'Trust', icon: '◆', desc: 'We build lasting relationships through transparency, honest communication, and always putting people first.' },
  { title: 'Speed', icon: '◈', desc: 'Time-to-fill matters. Our streamlined processes deliver qualified candidates faster than the competition.' },
  { title: 'People-First', icon: '◇', desc: 'Every placement is a person. We invest in understanding candidates and clients to create perfect matches.' },
  { title: 'Local Expertise', icon: '○', desc: 'Deep knowledge of regional labor markets, salary benchmarks, and workforce regulations across Poland.' },
];

const milestones = [
  { year: '2009', text: 'Founded in Warsaw with a team of five recruiters' },
  { year: '2012', text: 'Opened Kraków office — first 1,000 placements' },
  { year: '2014', text: 'Expanded to Wrocław and Gdańsk offices' },
  { year: '2016', text: 'Łódź office. 5,000 cumulative placements' },
  { year: '2018', text: 'Launched executive search division' },
  { year: '2020', text: 'Remote hiring solutions during pandemic — record year' },
  { year: '2022', text: '10 offices across Poland. 10,000+ placements' },
  { year: '2024', text: '200+ recruiters. 15,000+ placements per year. 12 offices' },
];

const PageAbout: FC<LayoutProps> = (props) => {
  const { content, themeSettings } = props;
  const primaryColor = themeSettings.primary_color ?? '#F59E0B';
  const navColor = themeSettings.nav_color ?? '#14101E';

  return (
    <Base {...props}>
      {/* Hero with team photo */}
      <section class="relative overflow-hidden text-white" style={{ minHeight: '520px' }}>
        <img
          src="/static/images/article-platform-engineering.jpg"
          alt="KadoServices team collaborating"
          class="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div class="absolute inset-0" style={{
          background: `linear-gradient(to bottom, ${navColor}c0 0%, ${navColor}dd 50%, ${navColor}f0 100%)`,
        }} />
        <div class="relative z-10 flex min-h-[520px] items-center py-28">
          <div class="mx-auto max-w-4xl px-6 text-center">
            <p class="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">About Us</p>
            <h1 class="text-4xl font-extrabold tracking-[-0.03em] leading-[1.1] sm:text-5xl lg:text-6xl" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
              We connect great people with great companies
            </h1>
            <p class="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-gray-200/90">
              Founded in 2009. 200+ recruiters across 12 offices in Poland. Staffing, recruitment, and workforce solutions for companies of all sizes.
            </p>
          </div>
        </div>
      </section>

      {/* Story — clean prose, lots of white space */}
      <section class="py-24">
        <div class="mx-auto max-w-3xl px-6">
          <h2 class="mb-8 text-3xl font-bold tracking-[-0.02em] text-slate-900">Our Story</h2>
          <div class="space-y-6 text-lg leading-relaxed text-slate-600">
            <p>
              KadoServices was founded in 2009 in Warsaw by a team of five recruiters who believed that staffing could be done differently — with genuine care for candidates, transparent partnerships with employers, and a relentless focus on long-term placements over quick fills.
            </p>
            <p>
              What started as a small recruitment agency has grown into one of Poland's leading staffing and workforce solutions companies. Our growth has been organic and deliberate — every new office, service line, and hire was driven by client demand and a commitment to maintaining the people-first culture that defines us.
            </p>
          </div>
        </div>
      </section>

      {/* Values — 4-column cards */}
      <section class="border-t border-gray-100 bg-slate-50 py-24">
        <div class="mx-auto max-w-6xl px-6">
          <div class="mx-auto mb-16 max-w-2xl text-center">
            <h2 class="text-3xl font-bold tracking-[-0.02em] text-slate-900">Our Values</h2>
            <p class="mt-4 text-lg text-slate-500">The principles behind every decision we make</p>
          </div>
          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div class="group rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50">
                <div class="mb-5 text-2xl" style={{ color: primaryColor }}>{v.icon}</div>
                <h3 class="mb-3 text-lg font-semibold text-slate-900">{v.title}</h3>
                <p class="text-sm leading-relaxed text-slate-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission statement — big centered text */}
      <section class="py-24">
        <div class="mx-auto max-w-4xl px-6 text-center">
          <blockquote class="text-3xl font-bold leading-snug tracking-[-0.02em] text-slate-900 sm:text-4xl">
            "We <span style={{ color: primaryColor }}>connect</span> because every hire starts with a relationship.
            <span style={{ color: primaryColor }}> People</span> because they are at the heart of every business.
            <span style={{ color: primaryColor }}> Great companies</span> because our work has no value unless it creates lasting impact."
          </blockquote>
        </div>
      </section>

      {/* Milestones — clean timeline */}
      <section class="border-t border-gray-100 bg-slate-50 py-24">
        <div class="mx-auto max-w-4xl px-6">
          <h2 class="mb-16 text-center text-3xl font-bold tracking-[-0.02em] text-slate-900">Key Milestones</h2>
          <div class="space-y-0">
            {milestones.map((m, i) => (
              <div class="group flex items-start gap-8 py-6" style={{ borderBottom: i < milestones.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div class="w-20 shrink-0 text-right text-2xl font-extrabold tracking-[-0.02em]" style={{ color: primaryColor }}>
                  {m.year}
                </div>
                <div class="pt-1 text-base text-slate-600">
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section class="py-24">
        <div class="mx-auto max-w-6xl px-6">
          <div class="grid gap-12 text-center sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: '15+', label: 'Years in Staffing' },
              { value: '15,000+', label: 'Placements Per Year' },
              { value: '12', label: 'Offices in Poland' },
              { value: '94%', label: 'Client Retention' },
            ].map((stat) => (
              <div>
                <div class="text-5xl font-extrabold tracking-[-0.03em]" style={{ color: primaryColor }}>{stat.value}</div>
                <div class="mt-2 text-sm font-medium uppercase tracking-[0.1em] text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section class="relative overflow-hidden py-24 text-white" style={{ backgroundColor: navColor }}>
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${primaryColor}12 0%, transparent 60%)` }} />
        <div class="relative mx-auto max-w-3xl px-6 text-center">
          <h2 class="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Let's build your team together</h2>
          <p class="mt-6 text-lg text-gray-300/90">Whether you need one key hire or an entire workforce — we're ready.</p>
          <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="/contact" class="inline-block rounded-lg px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:no-underline" style={{ backgroundColor: primaryColor }}>
              Get in Touch
            </a>
            <a href="/case-studies" class="inline-block rounded-lg border border-white/20 px-8 py-3.5 text-sm font-semibold text-white/90 transition-all duration-200 hover:border-white/50 hover:text-white hover:no-underline">
              See Success Stories
            </a>
          </div>
        </div>
      </section>
    </Base>
  );
};

export default PageAbout;
