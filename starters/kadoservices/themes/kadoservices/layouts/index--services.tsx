/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps, Content } from '../_types.js';
import Base from './base.js';

const iconSvgs: Record<string, string> = {
  code: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m17.25 6.75 4.5 5.25-4.5 5.25m-10.5 0L2.25 12l4.5-5.25m7.5-3-4.5 16.5"/></svg>`,
  cloud: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 .75-7.425 4.5 4.5 0 0 0-8.78-2.34A4.5 4.5 0 0 0 2.25 15Z"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/></svg>`,
  brain: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/></svg>`,
  rocket: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/></svg>`,
};

const Services: FC<LayoutProps> = (props) => {
  const { content, themeSettings } = props;
  const primaryColor = themeSettings.primary_color ?? '#F59E0B';
  const navColor = themeSettings.nav_color ?? '#14101E';
  const items: Content[] = content.fields.items ?? [];
  const t = themeSettings._t ?? ((key: string) => key);

  const featured = items[0];
  const rest = items.slice(1);

  return (
    <Base {...props}>
      {/* Hero — strong first impression (halo effect) */}
      <section class="relative overflow-hidden py-28 text-white" style={{ backgroundColor: navColor }}>
        <div class="grid-pattern pointer-events-none absolute inset-0" />
        <div class="blob blob-lg" style={{ top: '-20%', right: '-5%', background: `${primaryColor}12` }} />
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 70%, ${primaryColor}12 0%, transparent 50%)` }} />
        <div class="relative mx-auto max-w-7xl px-6">
          <p class="reveal-sub mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">{t('services.hero_label')}</p>
          <h1 class="reveal-heading max-w-4xl text-4xl font-extrabold tracking-[-0.04em] leading-[1.05] sm:text-5xl lg:text-6xl">
            End-to-end{' '}
            <em class="not-italic" style={{ background: `linear-gradient(135deg, ${primaryColor}, #EF4444)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>staffing</em>{' '}
            solutions
          </h1>
          <p class="reveal-sub mt-6 max-w-2xl text-lg leading-relaxed text-gray-300/80" style={{ animationDelay: '0.3s' }}>
            From job brief to placement — one partner for all your hiring needs. 200+ recruiters, 15,000+ placements per year, 15+ years of staffing expertise.
          </p>
          <div class="reveal-sub mt-14 flex flex-wrap gap-12" style={{ animationDelay: '0.45s' }}>
            <div>
              <div class="text-3xl font-extrabold">{items.length}</div>
              <div class="mt-1 text-xs uppercase tracking-widest text-gray-400">{t('services.stats_areas')}</div>
            </div>
            <div>
              <div class="text-3xl font-extrabold">200+</div>
              <div class="mt-1 text-xs uppercase tracking-widest text-gray-400">{t('services.stats_engineers')}</div>
            </div>
            <div>
              <div class="text-3xl font-extrabold">15,000+</div>
              <div class="mt-1 text-xs uppercase tracking-widest text-gray-400">{t('services.stats_delivered')}</div>
            </div>
            <div>
              <div class="text-3xl font-extrabold">12</div>
              <div class="mt-1 text-xs uppercase tracking-widest text-gray-400">{t('services.stats_offices')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured service — full-width asymmetric card */}
      {featured && (
        <section class="py-24">
          <div class="mx-auto max-w-7xl px-6">
            <p class="reveal-sub mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t('services.core_capability')}</p>
            <a
              href={(featured as any).url ?? `/services/${featured.slug}`}
              class="group relative grid overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/60 hover:no-underline lg:grid-cols-2"
            >
              <div class="relative flex flex-col justify-center p-10 lg:p-14">
                <div
                  class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${primaryColor}12`, color: primaryColor }}
                  dangerouslySetInnerHTML={{ __html: iconSvgs[featured.fields?.icon] ?? iconSvgs.code }}
                />
                <h2 class="text-2xl font-bold tracking-[-0.03em] text-slate-900 lg:text-3xl">
                  {featured.title}
                </h2>
                <p class="mt-4 text-base leading-relaxed text-slate-500">
                  {featured.fields.short_description ?? featured.fields.description}
                </p>
                {featured.fields.hero_stats && (
                  <div class="mt-8 grid grid-cols-3 gap-6 border-t border-gray-100 pt-8">
                    {(featured.fields.hero_stats as Array<{ value: string; label: string }>).map((stat) => (
                      <div>
                        <div class="text-xl font-extrabold" style={{ color: primaryColor }}>{stat.value}</div>
                        <div class="mt-0.5 text-xs text-slate-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div class="mt-8 flex items-center gap-2 text-sm font-semibold" style={{ color: primaryColor }}>
                  Explore service
                  <span class="transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
                </div>
              </div>
              <div class="relative hidden overflow-hidden lg:block" style={{ backgroundColor: `${navColor}08` }}>
                <div class="absolute inset-0 grid-pattern opacity-40" />
                <div class="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 50%, ${primaryColor}15 0%, transparent 70%)` }} />
                <div class="flex h-full items-center justify-center">
                  <div class="text-slate-200/20" style={{ transform: 'scale(6)' }} dangerouslySetInnerHTML={{ __html: iconSvgs[featured.fields?.icon] ?? iconSvgs.code }} />
                </div>
              </div>
              <div class="absolute bottom-0 left-0 h-1 w-0 transition-all duration-700 group-hover:w-full" style={{ backgroundColor: primaryColor }} />
            </a>
          </div>
        </section>
      )}

      {/* Services grid — clean hierarchy (cognitive fluency) */}
      {rest.length > 0 && (
        <section class="border-t border-gray-100 bg-slate-50/50 py-24">
          <div class="mx-auto max-w-7xl px-6">
            <div class="mb-14 max-w-2xl">
              <div class="mb-4 flex items-center gap-3">
                <div class="h-1 w-8 rounded" style={{ backgroundColor: primaryColor }} />
                <span class="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">{t('services.all_services')}</span>
              </div>
              <h2 class="text-3xl font-bold tracking-[-0.03em] text-slate-900">
                Every staffing solution you need, <em class="not-italic" style={{ color: primaryColor }}>under one roof</em>
              </h2>
            </div>

            <div class="stagger-grid grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((item) => (
                <a
                  href={(item as any).url ?? `/services/${item.slug}`}
                  class="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-400 hover:shadow-xl hover:shadow-slate-200/50 hover:no-underline"
                >
                  <div
                    class="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}
                    dangerouslySetInnerHTML={{ __html: iconSvgs[item.fields?.icon] ?? iconSvgs.code }}
                  />
                  <h3 class="text-lg font-bold tracking-[-0.02em] text-slate-900">
                    {item.title}
                  </h3>
                  <p class="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                    {item.fields.short_description ?? item.fields.description}
                  </p>
                  {item.fields.hero_stats && (
                    <div class="mt-6 flex gap-6 border-t border-gray-50 pt-5">
                      {(item.fields.hero_stats as Array<{ value: string; label: string }>).slice(0, 2).map((stat) => (
                        <div>
                          <div class="text-sm font-extrabold" style={{ color: primaryColor }}>{stat.value}</div>
                          <div class="text-[10px] text-slate-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div class="mt-5 flex items-center gap-1 text-xs font-semibold opacity-0 transition-all duration-300 group-hover:opacity-100" style={{ color: primaryColor }}>
                    Learn more <span class="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                  </div>
                  <div class="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: primaryColor }} />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process section — cognitive fluency through numbered steps */}
      <section class="py-24">
        <div class="mx-auto max-w-7xl px-6">
          <div class="mb-16 text-center">
            <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t('services.how_we_work')}</p>
            <h2 class="text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
              From first call to <em class="not-italic" style={{ color: primaryColor }}>placement</em>
            </h2>
            <p class="mx-auto mt-4 max-w-xl text-base text-slate-500">
              Every engagement follows a proven methodology refined across 15,000+ successful placements.
            </p>
          </div>
          <div class="grid gap-px overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 md:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '01', title: 'Brief', desc: 'Deep-dive consultation to understand your hiring needs, culture fit requirements, and timeline.' },
              { step: '02', title: 'Source', desc: 'Targeted candidate search through our 500,000+ talent database and active sourcing channels.' },
              { step: '03', title: 'Screen', desc: 'Rigorous screening, skills assessment, and reference checks. Only qualified candidates reach you.' },
              { step: '04', title: 'Place', desc: 'Seamless onboarding support and follow-up. We stay engaged to ensure long-term retention.' },
            ].map((phase) => (
              <div class="group relative bg-white p-8 transition-all duration-300 hover:bg-slate-50">
                <div class="mb-4 text-3xl font-extrabold tracking-tighter" style={{ color: `${primaryColor}30` }}>
                  {phase.step}
                </div>
                <h3 class="text-base font-bold text-slate-900">{phase.title}</h3>
                <p class="mt-2 text-sm leading-relaxed text-slate-500">{phase.desc}</p>
                <div class="absolute top-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: primaryColor }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — strong ending (peak-end rule) */}
      <section class="relative overflow-hidden py-28 text-white" style={{ backgroundColor: navColor }}>
        <div class="grid-pattern pointer-events-none absolute inset-0" />
        <div class="blob blob-sm" style={{ bottom: '-10%', right: '10%', background: `${primaryColor}10`, animationDelay: '-4s' }} />
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${primaryColor}10 0%, transparent 60%)` }} />
        <div class="relative mx-auto max-w-7xl px-6">
          <div class="grid items-center gap-12 lg:grid-cols-5">
            <div class="lg:col-span-3">
              <p class="reveal-sub mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">{t('services.lets_talk')}</p>
              <h2 class="reveal-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                Ready to{' '}
                <em class="not-italic" style={{ background: `linear-gradient(135deg, ${primaryColor}, #EF4444)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>build</em>{' '}
                your team?
              </h2>
              <p class="reveal-sub mt-5 max-w-lg text-lg text-gray-300/90" style={{ animationDelay: '0.2s' }}>
                Our staffing consultants will review your hiring needs and propose a tailored approach within 48 hours.
              </p>
            </div>
            <div class="reveal-sub flex flex-col gap-4 lg:col-span-2" style={{ animationDelay: '0.35s' }}>
              <a
                href="/contact"
                class="inline-block rounded-xl px-8 py-4 text-center text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110 hover:no-underline"
                style={{ backgroundColor: primaryColor }}
              >
                Start a Conversation
              </a>
              <a
                href="/case-studies"
                class="inline-block rounded-xl border border-white/20 px-8 py-4 text-center text-sm font-semibold text-white/90 transition-all duration-300 hover:border-white/40 hover:text-white hover:no-underline"
              >
                See Success Stories
              </a>
            </div>
          </div>
        </div>
        <div class="glow-line absolute top-0 left-0 right-0" />
      </section>
    </Base>
  );
};

export default Services;
