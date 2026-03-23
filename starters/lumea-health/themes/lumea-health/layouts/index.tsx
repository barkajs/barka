/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps, Content } from '../_types.js';
import Base from './base.js';

/* ── Doctor Card ─────────────────────────────────────── */
const DoctorCard: FC<{ item: Content }> = ({ item }) => {
  const photo = item.fields.photo;
  const initials = item.title.replace(/^Dr\.\s*/, '').split(' ').map((w: string) => w[0]).join('').slice(0, 2);

  return (
    <a
      href={(item as any).url ?? `/doctors/${item.slug}`}
      class="group block hover:no-underline transition-all duration-300 hover:-translate-y-1"
      style={{
        borderRadius: '24px',
        backgroundColor: '#fff',
        border: '1px solid var(--color-border)',
        boxShadow: '0 4px 20px -5px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Photo */}
      <div class="relative overflow-hidden" style={{ backgroundColor: 'var(--color-primary-light)' }}>
        {photo ? (
          <img
            src={photo}
            alt={item.title}
            class="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div class="flex h-72 items-center justify-center">
            <span class="text-6xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', opacity: 0.3 }}>{initials}</span>
          </div>
        )}
        {/* Experience badge */}
        {item.fields.experience_years && (
          <div
            class="absolute top-4 right-4 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(74,124,89,0.85)' }}
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {item.fields.experience_years}+ years
          </div>
        )}
      </div>

      {/* Info */}
      <div class="p-6">
        <h2 class="text-xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>{item.title}</h2>
        {item.fields.role && (
          <p class="mt-1 text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>{item.fields.role}</p>
        )}
        {item.fields.specialization && (
          <div class="mt-3 flex flex-wrap gap-1.5">
            {item.fields.specialization.split(',').map((spec: string) => (
              <span
                class="inline-block rounded-full px-2.5 py-1 text-[11px] font-medium"
                style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
              >
                {spec.trim()}
              </span>
            ))}
          </div>
        )}
        {item.fields.clinics && (
          <div class="mt-3 flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-muted)' }}>
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {item.fields.clinics}
          </div>
        )}
        <div class="mt-4 flex items-center justify-between">
          <span class="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>
            View profile &rarr;
          </span>
          <div
            class="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200"
            style={{ backgroundColor: 'var(--color-primary-light)' }}
          >
            <svg class="h-4 w-4" style={{ color: 'var(--color-primary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
      </div>
    </a>
  );
};

/* ── Generic Card ─────────────────────────────────────── */
const GenericCard: FC<{ item: Content }> = ({ item }) => (
  <a
    href={(item as any).url ?? `/${item.slug}`}
    class="mv-card group block hover:no-underline"
  >
    {(item.fields.image || item.fields.featured_image || item.fields.photo) && (
      <div class="overflow-hidden rounded-t-[20px]">
        <img
          src={item.fields.image ?? item.fields.featured_image ?? item.fields.photo}
          alt={item.title}
          class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
    )}
    <div class="p-6">
      {item.type === 'article' && item.publishedAt && (
        <time class="text-xs" style={{ color: 'var(--color-muted)' }}>
          {item.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </time>
      )}
      <h2 class="mt-1 text-xl" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h2>
      {(item.fields.description || item.fields.short_description) && (
        <p class="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          {item.fields.description ?? item.fields.short_description}
        </p>
      )}
      {item.fields.role && (
        <p class="mt-1 text-sm" style={{ color: 'var(--color-primary)' }}>{item.fields.role}</p>
      )}
      {item.fields.city && (
        <p class="mt-1 text-sm" style={{ color: 'var(--color-primary)' }}>{item.fields.city}, {item.fields.country ?? 'Poland'}</p>
      )}
      <span class="mt-3 inline-block text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
        Learn more &rarr;
      </span>
    </div>
  </a>
);

/* ── Index Layout ─────────────────────────────────────── */
const Index: FC<LayoutProps> = (props) => {
  const { content } = props;
  const items: Content[] = content.fields.items ?? [];
  const isDoctorsPage = items.length > 0 && items[0]?.type === 'person';

  return (
    <Base {...props}>
      {/* Hero section for doctors */}
      {isDoctorsPage && (
        <section class="py-16 pb-0" style={{ backgroundColor: 'var(--color-cream)' }}>
          <div class="mx-auto max-w-6xl px-6 text-center">
            <div
              class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: 'var(--color-primary-light)' }}
            >
              <svg class="h-8 w-8" style={{ color: 'var(--color-primary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
                <circle cx="20" cy="10" r="2"/>
              </svg>
            </div>
            <h1 class="text-4xl sm:text-5xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{content.title}</h1>
            <p class="mx-auto max-w-2xl text-lg" style={{ color: 'var(--color-muted)' }}>
              Our team of experienced physicians and specialists is committed to providing the highest standard of care. Each doctor brings years of expertise and a patient-first approach.
            </p>
            {/* Stats bar */}
            <div class="mt-10 flex flex-wrap items-center justify-center gap-8 sm:gap-16">
              <div>
                <div class="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>{items.length}</div>
                <div class="text-xs uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>Specialists</div>
              </div>
              <div class="h-8 w-px" style={{ backgroundColor: 'var(--color-border)' }} />
              <div>
                <div class="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>12+</div>
                <div class="text-xs uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>Specializations</div>
              </div>
              <div class="h-8 w-px" style={{ backgroundColor: 'var(--color-border)' }} />
              <div>
                <div class="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>95%</div>
                <div class="text-xs uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>Patient satisfaction</div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section class="py-16" style={{ backgroundColor: 'var(--color-cream)' }}>
        <div class="mx-auto max-w-6xl px-6">
          {!isDoctorsPage && (
            <>
              <h1 class="text-4xl sm:text-5xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{content.title}</h1>
              {content.fields?.subtitle && (
                <p class="text-lg mb-10" style={{ color: 'var(--color-muted)' }}>{content.fields.subtitle}</p>
              )}
            </>
          )}

          {items.length > 0 ? (
            <div class={`grid gap-8 ${isDoctorsPage ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
              {items.map((item) =>
                isDoctorsPage
                  ? <DoctorCard item={item} />
                  : <GenericCard item={item} />
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--color-muted)' }}>No content available yet.</p>
          )}
        </div>
      </section>

      {/* CTA for doctors page */}
      {isDoctorsPage && (
        <section class="py-16" style={{ backgroundColor: 'var(--color-primary)' }}>
          <div class="mx-auto max-w-3xl px-6 text-center">
            <h2 class="text-3xl text-white sm:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>Looking for a specific specialist?</h2>
            <p class="mx-auto mt-4 max-w-xl text-base" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Call our patient advisors — they'll match you with the right doctor based on your needs, location, and availability.
            </p>
            <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a href="/contact" class="rounded-2xl bg-white px-8 py-3.5 text-sm font-semibold hover:no-underline" style={{ color: 'var(--color-primary)' }}>
                Book Appointment
              </a>
              <a href="tel:+48221002000" class="rounded-2xl border-2 border-white/30 px-8 py-3.5 text-sm font-semibold text-white hover:no-underline">
                Call: +48 22 100 2000
              </a>
            </div>
          </div>
        </section>
      )}

      {props.children}
    </Base>
  );
};

export default Index;
