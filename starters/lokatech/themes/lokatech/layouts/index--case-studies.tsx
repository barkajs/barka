/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps, Content } from '../_types.js';
import Base from './base.js';

const CaseStudies: FC<LayoutProps> = (props) => {
  const { content, themeSettings } = props;
  const primaryColor = themeSettings.primary_color ?? '#10B981';
  const navColor = themeSettings.nav_color ?? '#0B1222';
  const items: Content[] = (content.fields.items ?? []).sort(
    (a: Content, b: Content) => (b.publishedAt?.getTime?.() ?? 0) - (a.publishedAt?.getTime?.() ?? 0),
  );

  const featured = items[0];
  const rest = items.slice(1);

  const industryColors: Record<string, string> = {
    banking: '#3b82f6',
    'financial-services': '#8b5cf6',
    healthcare: '#ef4444',
    manufacturing: '#f59e0b',
    retail: '#ec4899',
    telecom: '#06b6d4',
    'public-sector': '#10b981',
  };

  return (
    <Base {...props}>
      {/* Hero */}
      <section class="relative overflow-hidden py-24 text-white" style={{ backgroundColor: navColor }}>
        <div class="grid-pattern pointer-events-none absolute inset-0" />
        <div class="blob blob-lg" style={{ top: '-15%', right: '-5%', background: `${primaryColor}10` }} />
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 60%, ${primaryColor}10 0%, transparent 50%)` }} />
        <div class="relative mx-auto max-w-7xl px-6">
          <p class="reveal-sub mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Our Work</p>
          <h1 class="reveal-heading max-w-3xl text-4xl font-extrabold tracking-[-0.04em] leading-[1.05] sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>
          {content.fields?.subtitle && (
            <p class="reveal-sub mt-6 max-w-xl text-lg text-gray-300/80" style={{ animationDelay: '0.3s' }}>
              {content.fields.subtitle}
            </p>
          )}
          {/* Quick stats bar */}
          <div class="reveal-sub mt-12 flex flex-wrap gap-12" style={{ animationDelay: '0.4s' }}>
            <div>
              <div class="text-3xl font-extrabold">{items.length}</div>
              <div class="mt-1 text-xs uppercase tracking-widest text-gray-400">Case Studies</div>
            </div>
            <div>
              <div class="text-3xl font-extrabold">6</div>
              <div class="mt-1 text-xs uppercase tracking-widest text-gray-400">Industries</div>
            </div>
            <div>
              <div class="text-3xl font-extrabold">200+</div>
              <div class="mt-1 text-xs uppercase tracking-widest text-gray-400">Projects Delivered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured case study — full-width asymmetric */}
      {featured && (
        <section class="py-20">
          <div class="mx-auto max-w-7xl px-6">
            <p class="reveal-sub mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Featured Project</p>
            <a
              href={(featured as any).url ?? `/case-studies/${featured.slug}`}
              class="testimonial-featured group grid overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-400 hover:shadow-2xl hover:shadow-slate-200/60 hover:no-underline lg:grid-cols-5"
            >
              {/* Image — takes 3 cols */}
              <div class="overflow-hidden lg:col-span-3">
                {(featured.fields.featured_image || featured.fields.image) && (
                  <img
                    src={featured.fields.featured_image ?? featured.fields.image}
                    alt={featured.title}
                    class="h-full min-h-[300px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
              </div>
              {/* Content — takes 2 cols */}
              <div class="flex flex-col justify-center p-10 lg:col-span-2">
                {featured.fields.industry && (
                  <span
                    class="mb-4 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: industryColors[featured.fields.industry] ?? primaryColor }}
                  >
                    {String(featured.fields.industry).replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  </span>
                )}
                <h2 class="text-2xl font-bold tracking-[-0.02em] text-slate-900 lg:text-3xl">
                  {featured.title}
                </h2>
                {featured.fields.short_description && (
                  <p class="mt-4 text-sm leading-relaxed text-slate-500">{featured.fields.short_description}</p>
                )}
                {/* Metrics row */}
                {featured.fields.metrics && (
                  <div class="mt-6 flex flex-wrap gap-6">
                    {(featured.fields.metrics as Array<{ value: string; label: string }>).slice(0, 3).map((m) => (
                      <div>
                        <div class="text-xl font-extrabold" style={{ color: primaryColor }}>{m.value}</div>
                        <div class="text-xs text-slate-400">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div class="mt-6 flex items-center gap-1 text-sm font-semibold" style={{ color: primaryColor }}>
                  View case study
                  <span class="transition-transform duration-200 group-hover:translate-x-2">&rarr;</span>
                </div>
              </div>
            </a>
          </div>
        </section>
      )}

      {/* Grid — asymmetric bento */}
      {rest.length > 0 && (
        <section class="border-t border-gray-100 bg-slate-50 py-20">
          <div class="mx-auto max-w-7xl px-6">
            <div class="stagger-grid grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((item, idx) => {
                const isLarge = idx === 0 || idx === 3;
                return (
                  <a
                    href={(item as any).url ?? `/case-studies/${item.slug}`}
                    class={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-400 hover:shadow-xl hover:shadow-slate-200/50 hover:no-underline ${
                      isLarge ? 'md:col-span-2 xl:col-span-2' : ''
                    }`}
                  >
                    <div class={`${isLarge ? 'grid md:grid-cols-2' : ''}`}>
                      {(item.fields.featured_image || item.fields.image) && (
                        <div class="overflow-hidden">
                          <img
                            src={item.fields.featured_image ?? item.fields.image}
                            alt={item.title}
                            class={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${isLarge ? 'h-full min-h-[240px]' : 'aspect-video'}`}
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div class="p-7">
                        <div class="mb-3 flex flex-wrap items-center gap-2">
                          {item.fields.industry && (
                            <span
                              class="rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white"
                              style={{ backgroundColor: industryColors[item.fields.industry] ?? primaryColor }}
                            >
                              {String(item.fields.industry).replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                            </span>
                          )}
                          {item.fields.duration && (
                            <span class="text-[10px] font-medium text-slate-400">{item.fields.duration}</span>
                          )}
                        </div>
                        <h3 class={`font-bold tracking-[-0.02em] text-slate-900 ${isLarge ? 'text-xl lg:text-2xl' : 'text-lg'}`}>
                          {item.title}
                        </h3>
                        {item.fields.short_description && (
                          <p class="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-3">
                            {item.fields.short_description}
                          </p>
                        )}
                        {/* Metrics for large cards */}
                        {isLarge && item.fields.metrics && (
                          <div class="mt-5 flex flex-wrap gap-5">
                            {(item.fields.metrics as Array<{ value: string; label: string }>).slice(0, 3).map((m) => (
                              <div>
                                <div class="text-lg font-extrabold" style={{ color: primaryColor }}>{m.value}</div>
                                <div class="text-[10px] uppercase tracking-wider text-slate-400">{m.label}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div class="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 transition-all duration-300 group-hover:opacity-100" style={{ color: primaryColor }}>
                          Read case study <span class="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                        </div>
                      </div>
                    </div>
                    {/* Accent line */}
                    <div class="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: primaryColor }} />
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section class="relative overflow-hidden py-24 text-white" style={{ backgroundColor: navColor }}>
        <div class="grid-pattern pointer-events-none absolute inset-0" />
        <div class="blob blob-sm" style={{ bottom: '-10%', right: '10%', background: `${primaryColor}10`, animationDelay: '-4s' }} />
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${primaryColor}10 0%, transparent 60%)` }} />
        <div class="relative mx-auto max-w-7xl px-6">
          <div class="grid items-center gap-10 lg:grid-cols-5">
            <div class="lg:col-span-3">
              <h2 class="reveal-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                Have a similar challenge?
              </h2>
              <p class="reveal-sub mt-4 max-w-lg text-lg text-gray-300/90" style={{ animationDelay: '0.2s' }}>
                Our solution architects will review your requirements and propose a tailored approach within 48 hours.
              </p>
            </div>
            <div class="reveal-sub flex flex-col gap-4 lg:col-span-2" style={{ animationDelay: '0.35s' }}>
              <a
                href="/contact"
                class="inline-block rounded-lg px-8 py-4 text-center text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110 hover:no-underline"
                style={{ backgroundColor: primaryColor }}
              >
                Discuss Your Project
              </a>
              <a
                href="/services"
                class="inline-block rounded-lg border border-white/20 px-8 py-4 text-center text-sm font-semibold text-white/90 transition-all duration-300 hover:border-white/40 hover:text-white hover:no-underline"
              >
                Explore Services
              </a>
            </div>
          </div>
        </div>
        <div class="glow-line absolute top-0 left-0 right-0" />
      </section>
    </Base>
  );
};

export default CaseStudies;
