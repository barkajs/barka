/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const perks = [
  { icon: '🌍', title: 'Remote-First', desc: 'Work from anywhere in Europe. Our 6 offices are optional, not mandatory.' },
  { icon: '📚', title: 'Learning Budget', desc: '€2,000/year for courses, conferences, and certifications of your choice.' },
  { icon: '🏥', title: 'Health & Wellness', desc: 'Private healthcare, mental health support, gym memberships, and ergonomic home office setup.' },
  { icon: '🏖️', title: '26 Days PTO', desc: 'Plus national holidays. We believe rested engineers write better code.' },
  { icon: '💻', title: 'Top Hardware', desc: 'MacBook Pro M4, 4K monitor, standing desk — everything you need to do your best work.' },
  { icon: '📈', title: 'Growth Path', desc: 'Clear career tracks for IC and management. Quarterly feedback and annual reviews.' },
];

const openings = [
  { title: 'Senior Backend Engineer', team: 'Cloud Platform', location: 'Warsaw / Remote', type: 'Full-time' },
  { title: 'Staff Frontend Engineer', team: 'Admin UI', location: 'Kraków / Remote', type: 'Full-time' },
  { title: 'ML Engineer', team: 'Data & AI', location: 'Berlin / Remote', type: 'Full-time' },
  { title: 'DevOps Engineer', team: 'Infrastructure', location: 'Wrocław / Remote', type: 'Full-time' },
  { title: 'Product Designer', team: 'Design', location: 'London / Remote', type: 'Full-time' },
  { title: 'Engineering Manager', team: 'Custom Software', location: 'Warsaw / Remote', type: 'Full-time' },
];

const PageCareers: FC<LayoutProps> = (props) => {
  const { content, themeSettings } = props;
  const primaryColor = themeSettings.primary_color ?? '#10B981';
  const navColor = themeSettings.nav_color ?? '#0B1222';

  return (
    <Base {...props}>
      {/* Hero */}
      <section class="relative overflow-hidden py-28 text-white" style={{ backgroundColor: navColor }}>
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 70%, ${primaryColor}10 0%, transparent 50%)` }} />
        <div class="relative mx-auto max-w-4xl px-6 text-center">
          <p class="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Careers</p>
          <h1 class="text-4xl font-extrabold tracking-[-0.03em] leading-[1.1] sm:text-5xl lg:text-6xl">
            Build technology that matters
          </h1>
          <p class="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-gray-300/90">
            Join 800+ engineers solving complex problems for the world's most ambitious enterprises.
          </p>
          <a href="#openings" class="mt-10 inline-block rounded-lg px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:no-underline" style={{ backgroundColor: primaryColor }}>
            View Open Positions
          </a>
        </div>
      </section>

      {/* Why join us */}
      <section class="py-24">
        <div class="mx-auto max-w-4xl px-6">
          <h2 class="mb-6 text-3xl font-bold tracking-[-0.02em] text-slate-900">Why LokaTech?</h2>
          <div class="space-y-6 text-lg leading-relaxed text-slate-600">
            <p>
              We're not a body shop. Every engineer here works on meaningful projects with direct business impact — from modernizing core banking systems to building real-time healthcare data pipelines. You'll work alongside some of the best engineers in Europe, with the autonomy to make technical decisions and the support to grow your career.
            </p>
            <p>
              Our culture is built on engineering excellence, not corporate theatre. No mandatory fun, no ping-pong tables as compensation for long hours. Just great work, fair pay, and a genuine commitment to your professional development.
            </p>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section class="border-t border-gray-100 bg-slate-50 py-24">
        <div class="mx-auto max-w-6xl px-6">
          <div class="mx-auto mb-16 max-w-2xl text-center">
            <h2 class="text-3xl font-bold tracking-[-0.02em] text-slate-900">Benefits & Perks</h2>
            <p class="mt-4 text-lg text-slate-500">Everything you need to do your best work</p>
          </div>
          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((p) => (
              <div class="rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50">
                <div class="mb-4 text-3xl">{p.icon}</div>
                <h3 class="mb-2 text-base font-semibold text-slate-900">{p.title}</h3>
                <p class="text-sm leading-relaxed text-slate-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section class="py-24" id="openings">
        <div class="mx-auto max-w-4xl px-6">
          <h2 class="mb-4 text-3xl font-bold tracking-[-0.02em] text-slate-900">Open Positions</h2>
          <p class="mb-12 text-lg text-slate-500">Can't find a perfect fit? Send your CV to <a href="mailto:careers@barka.dev" class="hover:no-underline" style={{ color: primaryColor }}>careers@barka.dev</a></p>

          <div class="divide-y divide-gray-100">
            {openings.map((job) => (
              <a href="/contact" class="group flex items-center justify-between py-6 hover:no-underline">
                <div>
                  <h3 class="text-base font-semibold text-slate-900 group-hover:text-emerald-600">{job.title}</h3>
                  <div class="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span>{job.team}</span>
                    <span class="text-slate-200">·</span>
                    <span>{job.location}</span>
                    <span class="text-slate-200">·</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <span class="hidden text-sm font-medium transition-transform duration-200 group-hover:translate-x-1 sm:block" style={{ color: primaryColor }}>
                  Apply &rarr;
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section class="relative overflow-hidden py-24 text-white" style={{ backgroundColor: navColor }}>
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${primaryColor}12 0%, transparent 60%)` }} />
        <div class="relative mx-auto max-w-3xl px-6 text-center">
          <h2 class="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Don't see your role?</h2>
          <p class="mt-6 text-lg text-gray-300/90">We're always looking for exceptional engineers. Send us your CV and we'll reach out when a position opens.</p>
          <a href="mailto:careers@barka.dev" class="mt-10 inline-block rounded-lg px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:no-underline" style={{ backgroundColor: primaryColor }}>
            Send Your CV
          </a>
        </div>
      </section>
    </Base>
  );
};

export default PageCareers;
