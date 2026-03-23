/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';
import { token } from '../../lib/tokens.js';

const spacingMap: Record<string, string> = {
  none: 'py-0', small: 'py-12', medium: 'py-16', large: 'py-20', xlarge: 'py-28',
};

/* ── Doctor Card ─────────────────────────────────── */
const DoctorCard: FC<{ item: any }> = ({ item }) => {
  const initials = (item.title ?? '').replace(/^Dr\.\s*/, '').split(' ').map((w: string) => w[0]).join('').slice(0, 2);
  const photo = item.image ?? item.photo;

  return (
    <a
      href={item.url ?? '#'}
      class="group block hover:no-underline transition-all duration-300 hover:-translate-y-1"
      style={{
        borderRadius: '24px',
        backgroundColor: '#fff',
        border: '1px solid var(--color-border)',
        boxShadow: '0 4px 24px -6px rgba(0,0,0,0.07)',
        overflow: 'hidden',
      }}
    >
      <div class="relative overflow-hidden" style={{ backgroundColor: 'var(--color-primary-light)' }}>
        {photo ? (
          <img src={photo} alt={item.title} class="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div class="flex h-72 items-center justify-center">
            <span class="text-6xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', opacity: 0.25 }}>{initials}</span>
          </div>
        )}
        {item.experience_years && (
          <div class="absolute top-4 right-4 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm" style={{ backgroundColor: 'rgba(74,124,89,0.85)' }}>
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {item.experience_years}+ years
          </div>
        )}
      </div>

      <div class="p-6">
        <h3 class="text-xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>{item.title}</h3>
        {item.role && (
          <p class="mt-1 text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>{item.role}</p>
        )}
        {item.specialization && (
          <div class="mt-3 flex flex-wrap gap-1.5">
            {item.specialization.split(',').map((spec: string) => (
              <span class="inline-block rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                {spec.trim()}
              </span>
            ))}
          </div>
        )}
        {item.clinics && (
          <div class="mt-3 flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-muted)' }}>
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {item.clinics}
          </div>
        )}
        <div class="mt-4 flex items-center justify-between">
          <span class="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>View profile &rarr;</span>
          <div class="flex h-9 w-9 items-center justify-center rounded-full transition-colors" style={{ backgroundColor: 'var(--color-primary-light)' }}>
            <svg class="h-4 w-4" style={{ color: 'var(--color-primary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
      </div>
    </a>
  );
};

/* ── Article Card ────────────────────────────────── */
const ArticleCard: FC<{ item: any }> = ({ item }) => (
  <a href={item.url ?? '#'} class="mv-card group block hover:no-underline">
    {item.image && (
      <div class="overflow-hidden rounded-t-[20px]">
        <img src={item.image} alt={item.title} class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      </div>
    )}
    <div class="p-6">
      {item.date && <time class="text-xs" style={{ color: token.muted }}>{item.date}</time>}
      <h3 class="mt-1 text-lg" style={{ fontFamily: token.fontHeading }}>{item.title}</h3>
      {item.excerpt && <p class="mt-2 text-sm leading-relaxed" style={{ color: token.muted }}>{item.excerpt}</p>}
      <span class="mt-3 inline-block text-sm font-medium" style={{ color: token.accent }}>Read more &rarr;</span>
    </div>
  </a>
);

/* ── Blog Listing (auto-detects doctor vs article) ── */
const BlogListing: FC<SectionProps> = ({ data, settings }) => {
  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const items: any[] = data.items ?? [];
  const isDoctor = items.length > 0 && (items[0]?.role || items[0]?.specialization);

  return (
    <section class={`${spacing} ${settings.css_class ?? ''}`} id={settings.anchor_id} style={{ backgroundColor: token.cream }}>
      <div class="mx-auto max-w-6xl px-6">
        {data.heading && (
          <h2 class="text-center text-3xl sm:text-4xl mb-12" style={{ fontFamily: token.fontHeading }}>{data.heading}</h2>
        )}
        <div class={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3`}>
          {items.map((item: any) =>
            isDoctor ? <DoctorCard item={item} /> : <ArticleCard item={item} />
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogListing;
