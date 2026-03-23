/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';
import { token, alpha } from '../lib/tokens.js';

const perks = [
  { icon: '💰', title: 'Uncapped Commission', desc: 'No ceiling on your earnings. Transparent, competitive commission tiers.' },
  { icon: '📚', title: 'Recruitment Training', desc: 'Structured onboarding, sourcing workshops, certifications.' },
  { icon: '🏥', title: 'Health & Wellness', desc: 'Private healthcare, mental health support, gym memberships.' },
  { icon: '🏖️', title: '26 Days PTO', desc: 'Plus national holidays. Rested recruiters build stronger relationships.' },
  { icon: '🌍', title: 'Hybrid & Remote', desc: 'Work from 12 offices or from home. Flexibility that fits your lifestyle.' },
  { icon: '📈', title: 'Career Growth', desc: 'Clear paths from recruiter to team lead to branch manager.' },
];

const openings = [
  { title: 'Senior Recruiter — IT', team: 'Tech Staffing', location: 'Warsaw', remote: 'Remote OK', type: 'Full-time', seniority: 'Senior', department: 'Recruitment' },
  { title: 'Recruitment Consultant — Finance', team: 'Banking & Finance', location: 'Kraków', remote: 'Remote OK', type: 'Full-time', seniority: 'Mid', department: 'Recruitment' },
  { title: 'Sourcing Specialist', team: 'Talent Acquisition', location: 'Wrocław', remote: 'Remote OK', type: 'Full-time', seniority: 'Junior', department: 'Recruitment' },
  { title: 'Account Manager — Manufacturing', team: 'Client Relations', location: 'Gdańsk', remote: 'Hybrid', type: 'Full-time', seniority: 'Senior', department: 'Sales' },
  { title: 'Branch Manager', team: 'Operations', location: 'Łódź', remote: 'On-site', type: 'Full-time', seniority: 'Lead', department: 'Operations' },
  { title: 'HR Business Partner', team: 'Internal HR', location: 'Warsaw', remote: 'Remote OK', type: 'Full-time', seniority: 'Mid', department: 'HR' },
  { title: 'Recruiter — Logistics', team: 'Logistics Staffing', location: 'Katowice', remote: 'Hybrid', type: 'Full-time', seniority: 'Junior', department: 'Recruitment' },
  { title: 'Team Lead — Temporary Staffing', team: 'Temp Division', location: 'Warsaw', remote: 'Hybrid', type: 'Full-time', seniority: 'Lead', department: 'Recruitment' },
  { title: 'Marketing Specialist', team: 'Marketing', location: 'Warsaw', remote: 'Remote OK', type: 'Full-time', seniority: 'Mid', department: 'Marketing' },
  { title: 'Payroll Administrator', team: 'Payroll & Admin', location: 'Kraków', remote: 'On-site', type: 'Full-time', seniority: 'Junior', department: 'Operations' },
];

const locations = ['All Locations', 'Warsaw', 'Kraków', 'Wrocław', 'Gdańsk', 'Łódź', 'Katowice'];
const departments = ['All Departments', 'Recruitment', 'Sales', 'Operations', 'HR', 'Marketing'];
const seniorities = ['All Levels', 'Junior', 'Mid', 'Senior', 'Lead'];

const stats = [
  { number: '200+', label: 'Team members' },
  { number: '12', label: 'Offices in Poland' },
  { number: '94%', label: 'Employee satisfaction' },
  { number: '3.2', label: 'Avg. years tenure' },
];

const PageCareers: FC<LayoutProps> = (props) => {
  const { content, themeSettings } = props;
  const t = (k: string) => themeSettings._t?.(k) ?? k;
  const url = (p: string) => themeSettings._url?.(p) ?? p;

  return (
    <Base {...props}>
      {/* Hero — warm amber tint, not dark */}
      <section class="py-24" style={{ background: 'linear-gradient(180deg, #FFFBEB 0%, #FAFAF9 100%)' }}>
        <div class="mx-auto max-w-6xl px-6">
          <div class="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p class="mb-4 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: token.primary }}>Careers at KadoServices</p>
              <h1 class="text-4xl font-extrabold tracking-[-0.03em] leading-[1.1] text-slate-900 sm:text-5xl">
                Build careers that matter
              </h1>
              <p class="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
                Join 200+ recruiters connecting top talent with Poland's most ambitious companies. No cold-call quotas — just meaningful work and uncapped earning potential.
              </p>
              <div class="mt-8 flex flex-wrap gap-4">
                <a href="#openings" class="inline-block rounded-lg px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:no-underline" style={{ backgroundColor: token.primary }}>
                  View {openings.length} Open Positions
                </a>
                <a href="mailto:careers@kadoservices.com" class="inline-block rounded-lg border-2 px-7 py-3.5 text-sm font-semibold transition-all duration-200 hover:no-underline" style={{ borderColor: token.primary, color: token.primary }}>
                  Send Your CV
                </a>
              </div>
            </div>
            <div class="hidden lg:block">
              <img src="/static/images/team-meeting.jpg" alt="KadoServices team" class="rounded-2xl shadow-xl" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section class="border-y border-gray-100 bg-white py-10">
        <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-around gap-8 px-6">
          {stats.map((s) => (
            <div class="text-center">
              <div class="text-3xl font-extrabold" style={{ color: token.primary }}>{s.number}</div>
              <div class="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Open positions — table with filter tags */}
      <section class="py-20" id="openings">
        <div class="mx-auto max-w-6xl px-6">
          <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 class="text-3xl font-bold tracking-[-0.02em] text-slate-900">Open Positions</h2>
              <p class="mt-2 text-slate-500">{openings.length} open roles across Poland</p>
            </div>
          </div>

          {/* Filter bar */}
          <div class="mb-8 flex flex-wrap gap-3 rounded-xl border border-gray-100 bg-slate-50 p-4">
            <div>
              <label class="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Location</label>
              <div class="flex flex-wrap gap-1.5">
                {locations.map((loc, i) => (
                  <span class={`cursor-default rounded-full px-3 py-1 text-xs font-medium transition-colors ${i === 0 ? 'text-white' : 'bg-white text-slate-600 border border-gray-200'}`} style={i === 0 ? { backgroundColor: token.primary } : {}}>
                    {loc}
                  </span>
                ))}
              </div>
            </div>
            <div class="border-l border-gray-200 pl-3">
              <label class="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Department</label>
              <div class="flex flex-wrap gap-1.5">
                {departments.map((dep, i) => (
                  <span class={`cursor-default rounded-full px-3 py-1 text-xs font-medium transition-colors ${i === 0 ? 'text-white' : 'bg-white text-slate-600 border border-gray-200'}`} style={i === 0 ? { backgroundColor: token.primary } : {}}>
                    {dep}
                  </span>
                ))}
              </div>
            </div>
            <div class="border-l border-gray-200 pl-3">
              <label class="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Level</label>
              <div class="flex flex-wrap gap-1.5">
                {seniorities.map((s, i) => (
                  <span class={`cursor-default rounded-full px-3 py-1 text-xs font-medium transition-colors ${i === 0 ? 'text-white' : 'bg-white text-slate-600 border border-gray-200'}`} style={i === 0 ? { backgroundColor: token.primary } : {}}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Job listings table */}
          <div class="overflow-hidden rounded-xl border border-gray-100">
            {/* Table header */}
            <div class="hidden border-b border-gray-100 bg-slate-50 px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:grid sm:grid-cols-12 sm:gap-4">
              <div class="col-span-4">Position</div>
              <div class="col-span-2">Department</div>
              <div class="col-span-2">Location</div>
              <div class="col-span-2">Remote</div>
              <div class="col-span-1">Level</div>
              <div class="col-span-1"></div>
            </div>
            {/* Rows */}
            {openings.map((job, idx) => (
              <a
                href={url('/contact')}
                class={`group block border-b border-gray-50 px-6 py-5 transition-colors duration-150 hover:bg-amber-50/40 hover:no-underline sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
              >
                <div class="col-span-4">
                  <h3 class="text-sm font-semibold text-slate-900 group-hover:text-amber-700">{job.title}</h3>
                  <p class="mt-0.5 text-xs text-slate-400 sm:hidden">{job.team} · {job.location} · {job.remote}</p>
                </div>
                <div class="col-span-2 hidden text-sm text-slate-600 sm:block">{job.team}</div>
                <div class="col-span-2 hidden text-sm text-slate-600 sm:block">{job.location}</div>
                <div class="col-span-2 hidden sm:block">
                  <span class={`rounded-full px-2.5 py-0.5 text-xs font-medium ${job.remote === 'Remote OK' ? 'bg-green-50 text-green-700' : job.remote === 'Hybrid' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {job.remote}
                  </span>
                </div>
                <div class="col-span-1 hidden text-xs text-slate-400 sm:block">{job.seniority}</div>
                <div class="col-span-1 hidden text-right sm:block">
                  <span class="text-xs font-semibold opacity-0 transition-all duration-200 group-hover:opacity-100" style={{ color: token.primary }}>Apply &rarr;</span>
                </div>
              </a>
            ))}
          </div>

          <p class="mt-6 text-sm text-slate-400">
            Can't find a perfect fit? Send your CV to <a href="mailto:careers@kadoservices.com" class="font-medium hover:no-underline" style={{ color: token.primary }}>careers@kadoservices.com</a>
          </p>
        </div>
      </section>

      {/* Why join us + Perks */}
      <section class="border-t border-gray-100 bg-slate-50 py-24">
        <div class="mx-auto max-w-6xl px-6">
          <div class="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 class="mb-6 text-3xl font-bold tracking-[-0.02em] text-slate-900">Why KadoServices?</h2>
              <div class="space-y-5 text-base leading-relaxed text-slate-600">
                <p>We're not a resume factory. Every recruiter here builds real relationships — from placing warehouse operators to sourcing C-level executives.</p>
                <p>Our culture is built on people-first values. No impossible KPIs, no cold-call quotas. Just meaningful work, uncapped commission, and genuine commitment to your growth.</p>
                <p>You'll work alongside some of the best recruiters in Poland, with the autonomy to manage your own desk and the support to build your career.</p>
              </div>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              {perks.map((p) => (
                <div class="rounded-xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:shadow-md">
                  <div class="mb-3 text-2xl">{p.icon}</div>
                  <h3 class="mb-1 text-sm font-semibold text-slate-900">{p.title}</h3>
                  <p class="text-xs leading-relaxed text-slate-500">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section class="relative overflow-hidden py-24 text-white" style={{ backgroundColor: token.navy }}>
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${alpha(token.primary, 7)} 0%, transparent 60%)` }} />
        <div class="relative mx-auto max-w-3xl px-6 text-center">
          <h2 class="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Don't see your role?</h2>
          <p class="mt-6 text-lg text-gray-300/90">We're always looking for exceptional recruiters and HR professionals. Send us your CV and we'll reach out when a position opens.</p>
          <a href="mailto:careers@kadoservices.com" class="mt-10 inline-block rounded-lg px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:no-underline" style={{ backgroundColor: token.primary }}>
            Send Your CV
          </a>
        </div>
      </section>
    </Base>
  );
};

export default PageCareers;
