/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const CaseStudy: FC<LayoutProps> = (props) => {
  const { content, themeSettings } = props;
  const primaryColor = themeSettings.primary_color ?? '#10B981';
  const navColor = themeSettings.nav_color ?? '#0B1222';
  const fields = content.fields;
  const tags: string[] = fields.tags ?? [];
  const gallery: { image: string; caption?: string }[] = fields.gallery ?? [];

  return (
    <Base {...props}>
      {/* Hero — Halo Effect: bold first impression with floating product shot */}
      <section class="relative overflow-hidden pb-0 pt-28 text-white" style={{ backgroundColor: navColor }}>
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 20%, ${primaryColor}14 0%, transparent 55%)` }} />
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 80%, ${primaryColor}08 0%, transparent 40%)` }} />

        <div class="relative mx-auto max-w-5xl px-6">
          <div class="max-w-3xl">
            {fields.client_name && (
              <p class="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                {fields.client_name}
              </p>
            )}
            <h1 class="text-4xl font-extrabold tracking-[-0.03em] leading-[1.1] sm:text-5xl lg:text-[3.25rem]">
              {content.title}
            </h1>

            {tags.length > 0 && (
              <div class="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span class="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {content.seo?.description && (
              <p class="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300/90">
                {content.seo.description.replace(/^Case Study: .+? — /, '').replace(/ — LokaTech Solutions$/, '')}
              </p>
            )}
          </div>

          {/* Floating hero image — extends beyond the dark hero into white */}
          {fields.featured_image && (
            <div class="relative z-10 mt-12">
              <div class="overflow-hidden rounded-t-2xl shadow-2xl shadow-black/30">
                <img
                  src={fields.featured_image}
                  alt={content.title}
                  class="w-full object-cover"
                  style="aspect-ratio: 16/9;"
                  loading="eager"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Metrics — full-width impact bar */}
      {fields.metrics && Array.isArray(fields.metrics) && fields.metrics.length > 0 ? (
        <section class={`border-b border-gray-100 bg-white ${fields.featured_image ? 'pt-6' : ''} py-12`}>
          <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-12 px-6 lg:gap-20">
            {fields.metrics.map((metric: { value: string; label: string }) => (
              <div class="text-center">
                <div class="text-4xl font-extrabold tracking-[-0.03em]" style={{ color: primaryColor }}>
                  {metric.value}
                </div>
                <div class="mt-1 text-sm font-medium text-slate-400">{metric.label}</div>
              </div>
            ))}
          </div>
        </section>
      ) : fields.featured_image ? (
        <div class="h-6 bg-white" />
      ) : null}

      <div class="mx-auto max-w-5xl px-6 py-20">
        <div class="grid gap-16 lg:grid-cols-3">
          {/* Main content */}
          <div class="lg:col-span-2">
            {fields.challenge && (
              <div class="mb-16">
                <h2 class="mb-6 text-2xl font-bold tracking-[-0.02em] text-slate-900">Challenge</h2>
                <div class="text-base leading-relaxed text-slate-600" dangerouslySetInnerHTML={{ __html: typeof fields.challenge === 'string' ? fields.challenge : '' }} />
              </div>
            )}

            {fields.solution && (
              <div class="mb-16">
                <h2 class="mb-6 text-2xl font-bold tracking-[-0.02em] text-slate-900">Solution</h2>
                <div class="text-base leading-relaxed text-slate-600" dangerouslySetInnerHTML={{ __html: typeof fields.solution === 'string' ? fields.solution : '' }} />
              </div>
            )}

            {/* Inline gallery between Solution and Results — visual "peak" moment */}
            {gallery.length > 0 && (
              <div class="mb-16">
                <div class={`grid gap-4 ${gallery.length === 1 ? 'grid-cols-1' : gallery.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  {gallery.map((item, idx) => (
                    <figure class={`group overflow-hidden rounded-xl border border-gray-100 bg-slate-50 ${gallery.length === 3 && idx === 0 ? 'sm:col-span-2' : ''}`}>
                      <div class="overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.caption ?? `Project screenshot ${idx + 1}`}
                          class="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          style="aspect-ratio: 16/9;"
                          loading="lazy"
                        />
                      </div>
                      {item.caption && (
                        <figcaption class="px-4 py-3 text-xs font-medium text-slate-400">{item.caption}</figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {fields.results && (
              <div class="mb-16">
                <h2 class="mb-6 text-2xl font-bold tracking-[-0.02em] text-slate-900">Results</h2>
                <div class="text-base leading-relaxed text-slate-600" dangerouslySetInnerHTML={{ __html: typeof fields.results === 'string' ? fields.results : '' }} />
              </div>
            )}

            {content.bodyHtml && (
              <div class="prose prose-lg prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: content.bodyHtml }} />
            )}

            {/* Client quote — peak-end rule "delight" moment */}
            {(fields.client_quote || fields.quote) && (
              <blockquote class="relative mt-16 overflow-hidden rounded-2xl border border-gray-100 bg-slate-50 p-8 sm:p-10">
                <div class="pointer-events-none absolute -right-4 -top-4 text-[8rem] font-serif leading-none" style={{ color: `${primaryColor}08` }}>"</div>
                <div class="relative">
                  <div class="mb-6 text-3xl font-serif leading-none" style={{ color: `${primaryColor}50` }}>"</div>
                  <p class="text-lg italic leading-relaxed text-slate-700">{fields.client_quote ?? fields.quote}</p>
                  {(fields.client_quote_author || fields.quote_author) && (
                    <footer class="mt-8 flex items-center gap-4">
                      <div class="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: primaryColor }}>
                        {(fields.client_quote_author ?? fields.quote_author ?? '').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div class="text-sm font-semibold text-slate-900">{fields.client_quote_author ?? fields.quote_author}</div>
                        {(fields.client_quote_role || fields.quote_role) && (
                          <div class="text-sm text-slate-400">{fields.client_quote_role ?? fields.quote_role}</div>
                        )}
                      </div>
                    </footer>
                  )}
                </div>
              </blockquote>
            )}
          </div>

          {/* Sidebar */}
          <div class="lg:col-span-1">
            <div class="sticky top-28 space-y-8">
              <div class="rounded-2xl border border-gray-100 bg-slate-50 p-8">
                <h3 class="mb-8 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Project Overview</h3>
                <dl class="space-y-6 text-sm">
                  {fields.industry && (
                    <div>
                      <dt class="font-medium text-slate-400">Industry</dt>
                      <dd class="mt-1 font-semibold text-slate-900 capitalize">{fields.industry}</dd>
                    </div>
                  )}
                  {fields.service && (
                    <div>
                      <dt class="font-medium text-slate-400">Service</dt>
                      <dd class="mt-1 font-semibold text-slate-900">{String(fields.service).replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</dd>
                    </div>
                  )}
                  {fields.duration && (
                    <div>
                      <dt class="font-medium text-slate-400">Duration</dt>
                      <dd class="mt-1 font-semibold text-slate-900">{fields.duration}</dd>
                    </div>
                  )}
                  {fields.team_size && (
                    <div>
                      <dt class="font-medium text-slate-400">Team Size</dt>
                      <dd class="mt-1 font-semibold text-slate-900">{fields.team_size}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {tags.length > 0 && (
                <div class="rounded-2xl border border-gray-100 bg-slate-50 p-8">
                  <h3 class="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Technologies</h3>
                  <div class="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span class="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <a href="/contact" class="block rounded-xl py-3.5 text-center text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:no-underline" style={{ backgroundColor: primaryColor }}>
                Start Your Project
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section class="relative overflow-hidden py-24 text-white" style={{ backgroundColor: navColor }}>
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${primaryColor}12 0%, transparent 60%)` }} />
        <div class="relative mx-auto max-w-3xl px-6 text-center">
          <h2 class="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Ready to achieve similar results?</h2>
          <p class="mt-6 text-lg text-gray-300/90">Our team is ready to help you tackle your biggest technology challenges.</p>
          <a href="/contact" class="mt-10 inline-block rounded-lg px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:no-underline" style={{ backgroundColor: primaryColor }}>
            Schedule a Consultation
          </a>
        </div>
      </section>

      {props.children}
    </Base>
  );
};

export default CaseStudy;
