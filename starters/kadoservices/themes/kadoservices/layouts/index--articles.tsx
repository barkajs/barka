/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps, Content } from '../_types.js';
import Base from './base.js';
import { token, alpha } from '../lib/tokens.js';

const categories = [
  'All',
  'Hiring Trends',
  'HR Strategy',
  'Labor Law',
  'Employer Branding',
  'Workforce Planning',
];

const Insights: FC<LayoutProps> = (props) => {
  const { content, themeSettings } = props;
  const allItems: Content[] = content.fields.items ?? [];

  const sorted = [...allItems].sort((a, b) => {
    const da = a.publishedAt ?? a.createdAt;
    const db = b.publishedAt ?? b.createdAt;
    return (db?.getTime?.() ?? 0) - (da?.getTime?.() ?? 0);
  });

  const featured = sorted.find((a) => a.fields.featured === true || a.fields.featured === 'true') ?? sorted[0];
  const rest = sorted.filter((a) => a !== featured);

  return (
    <Base {...props}>
      {/* Hero — light warm background, left-aligned */}
      <section class="py-16" style={{ backgroundColor: '#FFFBEB' }}>
        <div class="mx-auto max-w-6xl px-6">
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: token.primary }}>
            Insights & Articles
          </p>
          <h1 class="text-3xl font-extrabold tracking-[-0.03em] leading-[1.1] text-slate-900 sm:text-4xl lg:text-5xl">
            Staffing insights,<br />shared openly
          </h1>
          <p class="mt-4 max-w-xl text-base text-slate-500">
            Hiring trends, workforce strategies, and lessons learned from 15,000+ placements per year.
          </p>
        </div>
      </section>

      {/* Featured article — full width horizontal layout */}
      {featured && (
        <section class="py-12 border-b border-gray-100">
          <div class="mx-auto max-w-6xl px-6">
            <div class="mb-6 flex items-center gap-3">
              <div class="h-1 w-6 rounded" style={{ backgroundColor: token.primary }} />
              <span class="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Featured</span>
            </div>
            <a href={(featured as any).url ?? `/articles/${featured.slug}`} class="group block hover:no-underline">
              <div class="grid gap-8 lg:grid-cols-5">
                {/* Image — 40% */}
                {featured.fields.featured_image && (
                  <div class="lg:col-span-2 overflow-hidden rounded-2xl">
                    <img
                      src={featured.fields.featured_image}
                      alt={featured.title}
                      class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                {/* Content — 60% */}
                <div class="lg:col-span-3 flex flex-col justify-center">
                  {featured.fields.category && (
                    <span class="mb-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: token.primary }}>
                      {featured.fields.category}
                    </span>
                  )}
                  <h2 class="text-2xl font-bold tracking-[-0.02em] text-slate-900 sm:text-3xl lg:text-4xl">
                    {featured.title}
                  </h2>
                  {featured.fields.excerpt && (
                    <p class="mt-4 text-base leading-relaxed text-slate-500 lg:text-lg">
                      {featured.fields.excerpt}
                    </p>
                  )}
                  <div class="mt-5 flex items-center gap-3">
                    {featured.fields.author_image && (
                      <img src={featured.fields.author_image} alt={featured.fields.author} class="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100" loading="lazy" />
                    )}
                    <div>
                      <span class="text-sm font-medium text-slate-700">{featured.fields.author}</span>
                      {featured.publishedAt && (
                        <span class="ml-2 text-sm text-slate-400">
                          · {featured.publishedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div class="mt-5">
                    <span class="inline-flex items-center gap-1 text-sm font-semibold transition-colors duration-200" style={{ color: token.primary }}>
                      Read article
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-200 group-hover:translate-x-1"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </section>
      )}

      {/* Sidebar categories + Article grid */}
      <section class="py-16">
        <div class="mx-auto max-w-6xl px-6">
          <div class="flex flex-col lg:flex-row gap-10">

            {/* Category sidebar — desktop: vertical list, mobile: horizontal scroll */}
            <aside class="lg:w-[250px] shrink-0">
              {/* Mobile: horizontal scroll */}
              <div class="flex gap-2 overflow-x-auto pb-4 lg:hidden" style={{ scrollbarWidth: 'none' }}>
                {categories.map((cat) => (
                  <button
                    class="shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-sm"
                    style={cat === 'All'
                      ? { backgroundColor: token.primary, color: '#fff', borderColor: token.primary }
                      : { borderColor: '#e5e7eb', color: '#64748b', backgroundColor: '#fff' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {/* Desktop: vertical sidebar */}
              <div class="hidden lg:block sticky top-24">
                <h3 class="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Categories</h3>
                <nav class="space-y-1">
                  {categories.map((cat) => (
                    <button
                      class="block w-full text-left rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200"
                      style={cat === 'All'
                        ? { backgroundColor: alpha(token.primary, 8), color: token.primary, borderLeft: `3px solid ${token.primary}` }
                        : { color: '#64748b', borderLeft: '3px solid transparent' }}
                    >
                      {cat}
                    </button>
                  ))}
                </nav>
                {/* Sidebar promo card */}
                <div class="mt-8 rounded-xl p-5 border" style={{ backgroundColor: '#FFFBEB', borderColor: alpha(token.primary, 19) }}>
                  <p class="text-sm font-semibold text-slate-700">Got hiring insights?</p>
                  <p class="mt-1 text-xs text-slate-500">We welcome guest contributions from HR professionals.</p>
                  <a href="/contact" class="mt-3 inline-block text-xs font-semibold hover:no-underline" style={{ color: token.primary }}>
                    Submit an article →
                  </a>
                </div>
              </div>
            </aside>

            {/* Article grid — 2 columns */}
            <div class="flex-1 min-w-0">
              <div class="grid gap-8 sm:grid-cols-2">
                {rest.map((item) => (
                  <a href={(item as any).url ?? `/articles/${item.slug}`} class="group block hover:no-underline">
                    {item.fields.featured_image && (
                      <div class="overflow-hidden rounded-2xl">
                        <img
                          src={item.fields.featured_image}
                          alt={item.title}
                          class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div class="mt-4">
                      <div class="flex items-center gap-2">
                        {item.fields.category && (
                          <span class="text-xs font-semibold" style={{ color: token.primary }}>
                            {item.fields.category}
                          </span>
                        )}
                        {item.publishedAt && (
                          <span class="text-xs text-slate-300">·</span>
                        )}
                        {item.publishedAt && (
                          <time class="text-xs text-slate-400">
                            {item.publishedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </time>
                        )}
                      </div>
                      <h3 class="mt-2 text-base font-semibold leading-snug tracking-[-0.01em] text-slate-900">
                        {item.title}
                      </h3>
                      {item.fields.excerpt && (
                        <p class="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-3">
                          {item.fields.excerpt}
                        </p>
                      )}
                      <div class="mt-3 flex items-center gap-2">
                        {item.fields.author_image && (
                          <img src={item.fields.author_image} alt={item.fields.author} class="h-6 w-6 rounded-full object-cover" loading="lazy" />
                        )}
                        <span class="text-xs font-medium text-slate-500">{item.fields.author}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Newsletter CTA — amber card instead of dark section */}
      <section class="py-16">
        <div class="mx-auto max-w-2xl px-6">
          <div class="rounded-2xl border p-10 text-center" style={{ backgroundColor: '#FFFBEB', borderColor: alpha(token.primary, 19) }}>
            <h2 class="text-2xl font-bold tracking-[-0.02em] text-slate-900">Subscribe to our newsletter</h2>
            <p class="mt-3 text-slate-500">Hiring insights, workforce trends, and HR best practices — delivered biweekly.</p>
            <form class="mt-8 flex gap-3 sm:mx-auto sm:max-w-md" action="#" method="post">
              <input
                type="email"
                placeholder="your@email.com"
                class="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
              <button
                type="submit"
                class="shrink-0 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: token.primary }}
              >
                Subscribe
              </button>
            </form>
            <p class="mt-3 text-xs text-slate-400">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section class="relative overflow-hidden py-20 text-white" style={{ backgroundColor: token.navy }}>
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${alpha(token.primary, 6)} 0%, transparent 60%)` }} />
        <div class="relative mx-auto max-w-3xl px-6 text-center">
          <h2 class="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Have a hiring need?</h2>
          <p class="mt-4 text-lg text-gray-300/90">Let's discuss how our 200+ recruiters can help you find the right talent.</p>
          <a href="/contact" class="mt-8 inline-block rounded-lg px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:no-underline" style={{ backgroundColor: token.primary }}>
            Start a Conversation
          </a>
        </div>
      </section>
    </Base>
  );
};

export default Insights;
