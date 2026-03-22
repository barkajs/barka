/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const CaseStudy: FC<LayoutProps> = (props) => {
  const { content, themeSettings } = props;
  const primaryColor = themeSettings.primary_color ?? '#F59E0B';
  const navColor = themeSettings.nav_color ?? '#14101E';
  const url = (p: string) => themeSettings._url?.(p) ?? p;
  const fields = content.fields;
  const tags: string[] = fields.tags ?? [];
  const gallery: { image: string; caption?: string }[] = fields.gallery ?? [];

  const metrics = fields.metrics && Array.isArray(fields.metrics) ? fields.metrics : [];

  return (
    <Base {...props}>
      {/* Hero — LIGHT warm background, not dark */}
      <section class="py-20" style={{ background: 'linear-gradient(180deg, #FFFBEB 0%, #FAFAF9 100%)' }}>
        <div class="mx-auto max-w-5xl px-6">
          {/* Breadcrumb */}
          <nav class="mb-8 flex items-center gap-2 text-sm text-slate-400">
            <a href={url('/')} class="hover:text-slate-600 hover:no-underline">Home</a>
            <span>›</span>
            <a href={url('/case-studies')} class="hover:text-slate-600 hover:no-underline">Success Stories</a>
            <span>›</span>
            <span class="text-slate-600">{content.title}</span>
          </nav>

          {/* Tags as pills */}
          <div class="mb-4 flex flex-wrap gap-2">
            {fields.industry && (
              <span class="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: primaryColor }}>
                {String(fields.industry).replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
              </span>
            )}
            {fields.service && (
              <span class="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                {String(fields.service).replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
              </span>
            )}
          </div>

          <h1 class="text-4xl font-extrabold tracking-[-0.03em] leading-[1.1] text-slate-900 sm:text-5xl">
            {content.title}
          </h1>

          {fields.client_name && (
            <p class="mt-4 text-lg text-slate-500">Client: <span class="font-semibold text-slate-700">{fields.client_name}</span></p>
          )}
        </div>
      </section>

      {/* Metrics — card row (NOT a dark bar like lokatech) */}
      {metrics.length > 0 && (
        <section class="border-y border-gray-100 bg-white py-0">
          <div class="mx-auto max-w-5xl px-6">
            <div class="grid grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric: { value: string; label: string }, idx: number) => (
                <div class={`py-8 text-center ${idx > 0 ? 'border-l border-gray-100' : ''}`}>
                  <div class="text-3xl font-extrabold tracking-tight" style={{ color: primaryColor }}>{metric.value}</div>
                  <div class="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured image — full width, rounded, NOT inside dark hero */}
      {fields.featured_image && (
        <section class="bg-white py-10">
          <div class="mx-auto max-w-5xl px-6">
            <img
              src={fields.featured_image}
              alt={content.title}
              class="w-full rounded-2xl object-cover shadow-lg"
              style="aspect-ratio: 21/9;"
              loading="eager"
            />
          </div>
        </section>
      )}

      {/* Content — full width, NO sidebar */}
      <section class="bg-white py-16">
        <div class="mx-auto max-w-3xl px-6">

          {/* Challenge */}
          {fields.challenge && (
            <div class="mb-14">
              <div class="mb-4 flex items-center gap-3">
                <span class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: primaryColor }}>1</span>
                <h2 class="text-2xl font-bold tracking-[-0.02em] text-slate-900">The Challenge</h2>
              </div>
              <div class="ml-11 text-base leading-relaxed text-slate-600" dangerouslySetInnerHTML={{ __html: typeof fields.challenge === 'string' ? fields.challenge : '' }} />
            </div>
          )}

          {/* Solution */}
          {fields.solution && (
            <div class="mb-14">
              <div class="mb-4 flex items-center gap-3">
                <span class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: primaryColor }}>2</span>
                <h2 class="text-2xl font-bold tracking-[-0.02em] text-slate-900">Our Approach</h2>
              </div>
              <div class="ml-11 text-base leading-relaxed text-slate-600" dangerouslySetInnerHTML={{ __html: typeof fields.solution === 'string' ? fields.solution : '' }} />
            </div>
          )}

          {/* Results */}
          {fields.results && (
            <div class="mb-14">
              <div class="mb-4 flex items-center gap-3">
                <span class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: primaryColor }}>3</span>
                <h2 class="text-2xl font-bold tracking-[-0.02em] text-slate-900">The Results</h2>
              </div>
              <div class="ml-11 text-base leading-relaxed text-slate-600" dangerouslySetInnerHTML={{ __html: typeof fields.results === 'string' ? fields.results : '' }} />
            </div>
          )}

          {/* Body content */}
          {content.bodyHtml && (
            <div class="prose prose-lg prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: content.bodyHtml }} />
          )}
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section class="bg-slate-50 py-16">
          <div class="mx-auto max-w-5xl px-6">
            <div class={`grid gap-4 ${gallery.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {gallery.map((item, idx) => (
                <figure class="group overflow-hidden rounded-xl border border-gray-100 bg-white">
                  <div class="overflow-hidden">
                    <img src={item.image} alt={item.caption ?? `Photo ${idx + 1}`} class="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" style="aspect-ratio: 16/9;" loading="lazy" />
                  </div>
                  {item.caption && <figcaption class="px-4 py-3 text-xs font-medium text-slate-400">{item.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Client quote — full-width band, NOT in sidebar */}
      {(fields.client_quote || fields.quote) && (
        <section class="border-y border-gray-100" style={{ backgroundColor: '#FFFBEB' }}>
          <div class="mx-auto max-w-4xl px-6 py-16">
            <div class="flex flex-col items-center text-center">
              <div class="mb-6 text-5xl font-serif" style={{ color: `${primaryColor}40` }}>"</div>
              <p class="max-w-2xl text-xl italic leading-relaxed text-slate-700">
                {fields.client_quote ?? fields.quote}
              </p>
              {(fields.client_quote_author || fields.quote_author) && (
                <div class="mt-8 flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: primaryColor }}>
                    {(fields.client_quote_author ?? fields.quote_author ?? '').charAt(0).toUpperCase()}
                  </div>
                  <div class="text-left">
                    <div class="text-sm font-semibold text-slate-900">{fields.client_quote_author ?? fields.quote_author}</div>
                    {(fields.client_quote_role || fields.quote_role) && (
                      <div class="text-xs text-slate-400">{fields.client_quote_role ?? fields.quote_role}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Engagement details — horizontal card at bottom, NOT a sidebar */}
      <section class="bg-white py-16">
        <div class="mx-auto max-w-5xl px-6">
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fields.industry && (
              <div class="rounded-xl border border-gray-100 p-5">
                <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Industry</div>
                <div class="mt-1 text-sm font-semibold text-slate-900 capitalize">{String(fields.industry).replace(/-/g, ' ')}</div>
              </div>
            )}
            {fields.service && (
              <div class="rounded-xl border border-gray-100 p-5">
                <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Service</div>
                <div class="mt-1 text-sm font-semibold text-slate-900">{String(fields.service).replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</div>
              </div>
            )}
            {fields.hires_delivered && (
              <div class="rounded-xl border border-gray-100 p-5">
                <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Hires Delivered</div>
                <div class="mt-1 text-sm font-semibold text-slate-900">{fields.hires_delivered}</div>
              </div>
            )}
            {fields.time_to_fill && (
              <div class="rounded-xl border border-gray-100 p-5">
                <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Time to Fill</div>
                <div class="mt-1 text-sm font-semibold text-slate-900">{fields.time_to_fill}</div>
              </div>
            )}
            {fields.retention_rate && (
              <div class="rounded-xl border border-gray-100 p-5">
                <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Retention Rate</div>
                <div class="mt-1 text-sm font-semibold text-slate-900">{fields.retention_rate}</div>
              </div>
            )}
            {fields.duration && (
              <div class="rounded-xl border border-gray-100 p-5">
                <div class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Duration</div>
                <div class="mt-1 text-sm font-semibold text-slate-900">{fields.duration}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section class="py-20" style={{ backgroundColor: '#FFFBEB' }}>
        <div class="mx-auto max-w-3xl px-6 text-center">
          <h2 class="text-3xl font-bold tracking-[-0.02em] text-slate-900">Ready to achieve similar results?</h2>
          <p class="mt-4 text-lg text-slate-500">Our staffing consultants are ready to help you build your team.</p>
          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <a href={url('/contact')} class="inline-block rounded-lg px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:no-underline" style={{ backgroundColor: primaryColor }}>
              Start a Conversation
            </a>
            <a href={url('/case-studies')} class="inline-block rounded-lg border-2 px-8 py-3.5 text-sm font-semibold transition-all duration-200 hover:no-underline" style={{ borderColor: primaryColor, color: primaryColor }}>
              More Success Stories
            </a>
          </div>
        </div>
      </section>

      {props.children}
    </Base>
  );
};

export default CaseStudy;
