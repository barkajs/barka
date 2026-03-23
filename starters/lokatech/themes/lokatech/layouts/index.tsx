/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps, Content } from '../_types.js';
import { token, alpha } from '../lib/tokens.js';
import Base from './base.js';

const Index: FC<LayoutProps> = (props) => {
  const { content, themeSettings } = props;
  const items: Content[] = content.fields.items ?? [];

  return (
    <Base {...props}>
      {/* Hero */}
      <section class="relative overflow-hidden py-20 text-white" style={{ backgroundColor: token.navy }}>
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${alpha(token.primary, 3)} 0%, transparent 50%)` }} />
        <div class="relative mx-auto max-w-4xl px-6 text-center">
          <h1 class="text-4xl font-extrabold tracking-[-0.03em] leading-[1.1] sm:text-5xl">
            {content.title}
          </h1>
          {content.fields?.subtitle && (
            <p class="mx-auto mt-6 max-w-xl text-lg text-gray-300/90">
              {content.fields.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Content grid */}
      <section class="py-20">
        <div class="mx-auto max-w-6xl px-6">
          {items.length > 0 ? (
            <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <a
                  href={(item as any).url ?? `/${item.slug}`}
                  class="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:no-underline"
                >
                  {item.fields.image && (
                    <div class="overflow-hidden">
                      <img
                        src={item.fields.image}
                        alt={item.title}
                        class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  {item.fields.featured_image && !item.fields.image && (
                    <div class="overflow-hidden">
                      <img
                        src={item.fields.featured_image}
                        alt={item.title}
                        class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div class="p-6">
                    {item.type === 'article' && item.publishedAt && (
                      <time class="text-xs font-medium text-slate-400">
                        {item.publishedAt.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    )}
                    <h2 class="mt-2 text-lg font-semibold tracking-[-0.01em] text-slate-900">
                      {item.title}
                    </h2>
                    {(item.fields.description || item.fields.short_description) && (
                      <p class="mt-3 text-sm leading-relaxed text-slate-500">
                        {item.fields.description ?? item.fields.short_description}
                      </p>
                    )}
                    <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200" style={{ color: token.primary }}>
                      Read more
                      <span class="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p class="text-center text-slate-400">No content available yet.</p>
          )}
        </div>
      </section>

      {props.children}
    </Base>
  );
};

export default Index;
