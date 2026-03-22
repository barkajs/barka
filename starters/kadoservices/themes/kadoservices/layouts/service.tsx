/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const Service: FC<LayoutProps> = (props) => {
  const { content, themeSettings } = props;
  const primaryColor = themeSettings.primary_color ?? '#F59E0B';
  const navColor = themeSettings.nav_color ?? '#14101E';
  const fields = content.fields;

  return (
    <Base {...props}>
      {/* ═══ Hero — with grid, blobs, stats bar ═══ */}
      <section class="relative overflow-hidden py-28 text-white" style={{ backgroundColor: navColor }}>
        <div class="grid-pattern pointer-events-none absolute inset-0" />
        <div class="blob blob-lg" style={{ top: '-15%', right: '-10%', background: `${primaryColor}12` }} />
        <div class="blob blob-sm" style={{ bottom: '10%', left: '5%', background: `#F9731608`, animationDelay: '-4s' }} />
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 30%, ${primaryColor}12 0%, transparent 50%)` }} />

        <div class="relative mx-auto max-w-7xl px-6">
          <div class="max-w-3xl">
            <p class="reveal-sub mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Our Staffing Solutions</p>
            <h1 class="reveal-heading text-4xl font-extrabold tracking-[-0.04em] leading-[1.05] sm:text-5xl lg:text-6xl">
              {content.title}
            </h1>
            {fields.short_description && (
              <p class="reveal-sub mt-8 max-w-2xl text-lg leading-relaxed text-gray-300/80" style={{ animationDelay: '0.25s' }}>
                {fields.short_description}
              </p>
            )}
            <div class="reveal-sub mt-10 flex flex-wrap gap-4" style={{ animationDelay: '0.4s' }}>
              <a href="/contact" class="inline-block rounded-lg px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110 hover:no-underline" style={{ backgroundColor: primaryColor }}>
                Request Staffing Consultation
              </a>
              <a href="/case-studies" class="inline-block rounded-lg border border-white/20 px-8 py-4 text-sm font-semibold text-white/90 transition-all duration-300 hover:border-white/40 hover:text-white hover:no-underline">
                See Success Stories
              </a>
            </div>
          </div>

          {/* Stats bar */}
          {fields.hero_stats && Array.isArray(fields.hero_stats) && (
            <div class="reveal-sub mt-16 flex flex-wrap gap-12 border-t border-white/10 pt-10" style={{ animationDelay: '0.5s' }}>
              {fields.hero_stats.map((stat: { value: string; label: string }) => (
                <div class="counter-item">
                  <div class="text-3xl font-extrabold tracking-[-0.03em] lg:text-4xl">{stat.value}</div>
                  <div class="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div class="glow-line absolute bottom-0 left-0 right-0" />
      </section>

      {/* ═══ Challenges — left heading + staggered grid ═══ */}
      {fields.challenges && Array.isArray(fields.challenges) && fields.challenges.length > 0 && (
        <section class="relative overflow-hidden py-24">
          <div class="blob blob-sm" style={{ top: '20%', right: '-3%', background: `${primaryColor}06` }} />
          <div class="mx-auto max-w-7xl px-6">
            <div class="mb-16 max-w-2xl">
              <h2 class="reveal-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                The challenges <em class="not-italic" style={{ background: `linear-gradient(135deg,${primaryColor},${primaryColor}99,#EF4444)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>we solve</em>
              </h2>
              <p class="reveal-sub mt-4 text-lg text-slate-500">Workforce challenges companies face every day — and the reason they call us.</p>
            </div>
            <div class="stagger-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fields.challenges.map((challenge: string, idx: number) => (
                <div class={`group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-400 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-500/5 ${idx % 3 === 1 ? 'lg:translate-y-3' : ''}`}>
                  <div class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${primaryColor}15` }}>
                    <div class="h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                  </div>
                  <p class="text-sm leading-relaxed text-slate-600">{challenge}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Process — asymmetric timeline ═══ */}
      {fields.process && Array.isArray(fields.process) && fields.process.length > 0 && (
        <section class="relative overflow-hidden border-t border-gray-100 bg-slate-50 py-24">
          <div class="mx-auto max-w-7xl px-6">
            <div class="grid gap-16 lg:grid-cols-5">
              {/* Left heading — sticky */}
              <div class="lg:col-span-2">
                <div class="lg:sticky lg:top-32">
                  <h2 class="reveal-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl">Our proven <em class="not-italic" style={{ background: `linear-gradient(135deg,${primaryColor},${primaryColor}99,#EF4444)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>approach</em></h2>
                  <p class="reveal-sub mt-4 text-base text-slate-500">A methodology refined across thousands of placements, from Fortune 500 to high-growth scaleups.</p>
                  <div class="reveal-sub mt-8 hidden h-1 w-16 rounded lg:block" style={{ backgroundColor: primaryColor, animationDelay: '0.35s' }} />
                </div>
              </div>

              {/* Right steps — staggered */}
              <div class="stagger-grid space-y-8 lg:col-span-3">
                {fields.process.map((step: { title: string; description: string }, i: number) => (
                  <div class="group flex gap-6 rounded-2xl border border-gray-100 bg-white p-7 transition-all duration-400 hover:shadow-lg hover:shadow-slate-200/50">
                    <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-base font-bold text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: primaryColor }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold tracking-[-0.01em] text-slate-900">{step.title}</h3>
                      <p class="mt-2 text-sm leading-relaxed text-slate-500">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ Capabilities — staggered bento ═══ */}
      {fields.capabilities && Array.isArray(fields.capabilities) && fields.capabilities.length > 0 && (
        <section class="relative overflow-hidden py-24">
          <div class="mx-auto max-w-7xl px-6">
            <div class="mb-16 max-w-2xl">
              <h2 class="reveal-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl">What we <em class="not-italic" style={{ background: `linear-gradient(135deg,${primaryColor},${primaryColor}99,#EF4444)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>deliver</em></h2>
            </div>
            <div class="stagger-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fields.capabilities.map((cap: string, idx: number) => {
                const [title, ...rest] = cap.split(' — ');
                const desc = rest.join(' — ');
                return (
                  <div class={`group rounded-2xl border border-gray-100 bg-white p-7 transition-all duration-400 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-500/5 ${idx === 0 || idx === 6 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                    <div class="mb-4 h-1 w-8 rounded transition-all duration-400 group-hover:w-16" style={{ backgroundColor: primaryColor }} />
                    <h3 class="text-base font-semibold text-slate-900">{title}</h3>
                    {desc && <p class="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Technologies — pills with hover ═══ */}
      {fields.technologies && Array.isArray(fields.technologies) && fields.technologies.length > 0 && (
        <section class="relative overflow-hidden border-t border-gray-100 bg-slate-50 py-24">
          <div class="mx-auto max-w-7xl px-6">
            <div class="grid items-start gap-12 lg:grid-cols-5">
              <div class="lg:col-span-2">
                <h2 class="reveal-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl">Recruitment <em class="not-italic" style={{ background: `linear-gradient(135deg,${primaryColor},${primaryColor}99,#EF4444)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>tools</em></h2>
                <p class="reveal-sub mt-4 text-base text-slate-500">Proven platforms and systems our recruiters use daily.</p>
              </div>
              <div class="flex flex-wrap gap-3 lg:col-span-3">
                {fields.technologies.map((tech: { name: string; logo?: string }, idx: number) => (
                  <div
                    class="stagger-grid flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-5 py-3.5 transition-all duration-300 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/5"
                    style={{ animationDelay: `${0.05 * idx}s` }}
                  >
                    {tech.logo && (
                      <img src={tech.logo} alt={tech.name} class="h-6 w-6 object-contain" loading="lazy" />
                    )}
                    <span class="text-sm font-semibold text-slate-700">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ Related Case Studies ═══ */}
      {fields.case_studies && Array.isArray(fields.case_studies) && fields.case_studies.length > 0 && (
        <section class="py-24">
          <div class="mx-auto max-w-7xl px-6">
            <div class="mb-16 flex items-end justify-between">
              <div class="max-w-2xl">
                <h2 class="reveal-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl">Proven <em class="not-italic" style={{ background: `linear-gradient(135deg,${primaryColor},${primaryColor}99,#EF4444)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>results</em></h2>
                <p class="reveal-sub mt-4 text-base text-slate-500">See how our staffing expertise translates to measurable hiring outcomes.</p>
              </div>
              <a href="/case-studies" class="reveal-sub hidden items-center gap-1 text-sm font-semibold transition-colors duration-200 hover:no-underline sm:flex" style={{ color: primaryColor }}>
                All success stories <span>&rarr;</span>
              </a>
            </div>
            <div class="stagger-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fields.case_studies.map((cs: { title: string; result: string; url: string }) => (
                <a href={cs.url} class="group rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-400 hover:shadow-xl hover:shadow-slate-200/50 hover:no-underline">
                  <div class="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Success Story</div>
                  <h3 class="text-lg font-bold text-slate-900">{cs.title}</h3>
                  <div class="mt-3 text-2xl font-extrabold" style={{ color: primaryColor }}>{cs.result}</div>
                  <div class="mt-5 flex items-center gap-1 text-xs font-semibold opacity-0 transition-all duration-300 group-hover:opacity-100" style={{ color: primaryColor }}>
                    Read success story <span class="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Body (markdown) ═══ */}
      {content.bodyHtml && (
        <section class="py-20">
          <div class="mx-auto max-w-3xl px-6">
            <div class="prose prose-lg prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: content.bodyHtml }} />
          </div>
        </section>
      )}

      {/* ═══ CTA — asymmetric ═══ */}
      <section class="relative overflow-hidden py-24 text-white" style={{ backgroundColor: navColor }}>
        <div class="grid-pattern pointer-events-none absolute inset-0" />
        <div class="blob blob-sm" style={{ bottom: '-10%', right: '10%', background: `${primaryColor}10`, animationDelay: '-5s' }} />
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${primaryColor}10 0%, transparent 60%)` }} />
        <div class="relative mx-auto max-w-7xl px-6">
          <div class="grid items-center gap-10 lg:grid-cols-5">
            <div class="lg:col-span-3">
              <h2 class="reveal-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl">Ready to build your team?</h2>
              <p class="reveal-sub mt-4 max-w-lg text-lg text-gray-300/90" style={{ animationDelay: '0.2s' }}>
                Get a free consultation. Our staffing specialists will map the optimal hiring strategy for your needs in a 30-minute call.
              </p>
            </div>
            <div class="reveal-sub flex flex-col gap-4 lg:col-span-2" style={{ animationDelay: '0.35s' }}>
              <a href="/contact" class="inline-block rounded-lg px-8 py-4 text-center text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110 hover:no-underline" style={{ backgroundColor: primaryColor }}>
                Request Staffing Consultation
              </a>
              <a href="/case-studies" class="inline-block rounded-lg border border-white/20 px-8 py-4 text-center text-sm font-semibold text-white/90 transition-all duration-300 hover:border-white/40 hover:text-white hover:no-underline">
                See Success Stories
              </a>
            </div>
          </div>
        </div>
        <div class="glow-line absolute top-0 left-0 right-0" />
      </section>

      {props.children}
    </Base>
  );
};

export default Service;
