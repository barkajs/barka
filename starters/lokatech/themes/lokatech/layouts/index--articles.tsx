/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps, Content } from '../_types.js';
import { token, alpha } from '../lib/tokens.js';
import Base from './base.js';

const categories = [
  'All',
  'Cloud & DevOps',
  'AI & Machine Learning',
  'Software Architecture',
  'Security & Compliance',
  'Engineering Culture',
  'Digital Transformation',
  'CMS & Content',
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

  const topArticles = rest.slice(0, 5);
  const gridArticles = rest.slice(5);

  return (
    <Base {...props}>
      {/* Hero */}
      <section class="relative overflow-hidden py-16 text-white" style={{ backgroundColor: token.navy }}>
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${alpha(token.primary, 3)} 0%, transparent 50%)` }} />
        <div class="relative mx-auto max-w-6xl px-6">
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Insights & Articles</p>
          <h1 class="text-3xl font-extrabold tracking-[-0.03em] leading-[1.1] sm:text-4xl lg:text-5xl">
            Engineering knowledge,<br />shared openly
          </h1>
          <p class="mt-4 max-w-xl text-base text-gray-400">
            Technical deep-dives, architecture decisions, and lessons learned from 200+ enterprise projects.
          </p>
        </div>
      </section>

      {/* Featured + Top Articles */}
      <section class="py-16">
        <div class="mx-auto max-w-6xl px-6">
          <div class="mb-6 flex items-center gap-3">
            <div class="h-1 w-6 rounded" style={{ backgroundColor: token.primary }} />
            <span class="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Top Articles</span>
          </div>

          <div class="grid gap-10 lg:grid-cols-5">
            {/* Featured article — large */}
            {featured && (
              <div class="lg:col-span-3">
                <a href={(featured as any).url ?? `/articles/${featured.slug}`} class="group block hover:no-underline">
                  {featured.fields.featured_image && (
                    <div class="overflow-hidden rounded-2xl">
                      <img
                        src={featured.fields.featured_image}
                        alt={featured.title}
                        class="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div class="mt-5">
                    {featured.fields.category && (
                      <span class="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: token.primary }}>
                        {featured.fields.category}
                      </span>
                    )}
                    <h2 class="mt-3 text-2xl font-bold tracking-[-0.02em] text-slate-900 sm:text-3xl">
                      {featured.title}
                    </h2>
                    {featured.fields.excerpt && (
                      <p class="mt-3 text-base leading-relaxed text-slate-500">
                        {featured.fields.excerpt}
                      </p>
                    )}
                    <div class="mt-4 flex items-center gap-3">
                      {featured.fields.author_image && (
                        <img src={featured.fields.author_image} alt={featured.fields.author} class="h-8 w-8 rounded-full object-cover ring-2 ring-gray-100" loading="lazy" />
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
                  </div>
                </a>
              </div>
            )}

            {/* Top 5 — sidebar list */}
            <div class="lg:col-span-2">
              <div class="space-y-0 divide-y divide-gray-100">
                {topArticles.map((item) => (
                  <a href={(item as any).url ?? `/articles/${item.slug}`} class="group flex gap-4 py-5 first:pt-0 hover:no-underline">
                    {item.fields.featured_image && (
                      <div class="w-24 shrink-0 overflow-hidden rounded-lg">
                        <img src={item.fields.featured_image} alt={item.title} class="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                      </div>
                    )}
                    <div class="min-w-0">
                      {item.fields.category && (
                        <span class="text-xs font-semibold" style={{ color: token.primary }}>
                          {item.fields.category}
                        </span>
                      )}
                      <h3 class="mt-0.5 text-sm font-semibold leading-snug text-slate-900 line-clamp-2">
                        {item.title}
                      </h3>
                      {item.publishedAt && (
                        <time class="mt-1 block text-xs text-slate-400">
                          {item.publishedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </time>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category filters */}
      <section class="border-y border-gray-100 bg-slate-50">
        <div class="mx-auto max-w-6xl px-6">
          <div class="flex gap-1 overflow-x-auto py-4" style={{ scrollbarWidth: 'none' }}>
            {categories.map((cat) => (
              <button
                class="shrink-0 rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-white hover:text-slate-900 hover:shadow-sm"
                style={cat === 'All' ? { backgroundColor: token.navy, color: '#fff' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Article grid */}
      <section class="py-16">
        <div class="mx-auto max-w-6xl px-6">
          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {gridArticles.map((item) => (
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
      </section>

      {/* Newsletter CTA */}
      <section class="border-t border-gray-100 bg-slate-50 py-20">
        <div class="mx-auto max-w-2xl px-6 text-center">
          <h2 class="text-2xl font-bold tracking-[-0.02em] text-slate-900">Subscribe to our newsletter</h2>
          <p class="mt-3 text-slate-500">Engineering insights, architecture deep-dives, and technology trends — delivered biweekly.</p>
          <form class="mt-8 flex gap-3 sm:mx-auto sm:max-w-md" action="#" method="post">
            <input
              type="email"
              placeholder="your@email.com"
              class="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
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
      </section>

      {/* Bottom CTA */}
      <section class="relative overflow-hidden py-20 text-white" style={{ backgroundColor: token.navy }}>
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${alpha(token.primary, 6)} 0%, transparent 60%)` }} />
        <div class="relative mx-auto max-w-3xl px-6 text-center">
          <h2 class="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Have a project in mind?</h2>
          <p class="mt-4 text-lg text-gray-300/90">Let's discuss how our 800+ engineers can help you build it.</p>
          <a href="/contact" class="mt-8 inline-block rounded-lg px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:no-underline" style={{ backgroundColor: token.primary }}>
            Start a Conversation
          </a>
        </div>
      </section>
    </Base>
  );
};

export default Insights;
