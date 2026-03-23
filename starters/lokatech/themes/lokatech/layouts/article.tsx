/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import { token, alpha } from '../lib/tokens.js';
import Base from './base.js';

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

const Article: FC<LayoutProps> = (props) => {
  const { content, themeSettings } = props;
  const publishedDate = content.publishedAt ?? content.createdAt;
  const readTime = estimateReadingTime(content.bodyHtml ?? '');
  const category = content.fields.category ?? content.fields.tags?.[0];
  const featuredImage = content.fields.featured_image ?? content.fields.image;

  return (
    <Base {...props}>
      {/* Hero with background image */}
      <section class="relative overflow-hidden" style={{ minHeight: '520px' }}>
        {featuredImage ? (
          <>
            <img
              src={featuredImage}
              alt=""
              class="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
            <div class="absolute inset-0" style={{
              background: `linear-gradient(to bottom, ${alpha(token.navy, 80)} 0%, ${alpha(token.navy, 90)} 50%, ${alpha(token.navy, 95)} 100%)`,
            }} />
          </>
        ) : (
          <div class="absolute inset-0" style={{ backgroundColor: token.navy }} />
        )}

        <div class="relative z-10 flex min-h-[520px] items-end pb-16 pt-24">
          <div class="mx-auto w-full max-w-4xl px-6">
            <div class="mb-5 flex items-center gap-3">
              {category && (
                <span class="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{
                  backgroundColor: `${alpha(token.primary, 80)}`,
                  backdropFilter: 'blur(4px)',
                }}>
                  {category}
                </span>
              )}
              <span class="text-sm text-gray-300">{readTime} min read</span>
            </div>

            <h1 class="max-w-3xl text-3xl font-extrabold leading-[1.12] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl" style={{
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}>
              {content.title}
            </h1>

            <div class="mt-6 flex items-center gap-4">
              {content.fields.author && (
                <div class="flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4" style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                }}>
                  {content.fields.author_image ? (
                    <img src={content.fields.author_image} alt={content.fields.author} class="h-9 w-9 rounded-full object-cover ring-2 ring-white/20" loading="lazy" />
                  ) : (
                    <div class="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: token.primary }}>
                      {content.fields.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span class="text-sm font-medium text-white">{content.fields.author}</span>
                    {content.fields.author_role && (
                      <span class="ml-2 text-xs text-gray-300">{content.fields.author_role}</span>
                    )}
                  </div>
                </div>
              )}
              {publishedDate && (
                <time datetime={publishedDate.toISOString()} class="rounded-full px-3 py-1.5 text-sm text-gray-200" style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                }}>
                  {publishedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article class="py-16">
        <div class="mx-auto max-w-3xl px-6">
          {content.bodyHtml && (
            <div class="prose prose-lg prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: content.bodyHtml }} />
          )}

          {content.fields.author && (
            <div class="mt-16 border-t border-gray-100 pt-8">
              <div class="flex items-center gap-4">
                {content.fields.author_image ? (
                  <img src={content.fields.author_image} alt={content.fields.author} class="h-14 w-14 rounded-full object-cover ring-2 ring-gray-100" />
                ) : (
                  <div class="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white" style={{ backgroundColor: token.primary }}>
                    {content.fields.author.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div class="font-semibold text-slate-900">{content.fields.author}</div>
                  {content.fields.author_role && (
                    <div class="text-sm text-slate-400">{content.fields.author_role}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* CTA */}
      <section class="border-t border-gray-100 bg-slate-50 py-16">
        <div class="mx-auto max-w-3xl px-6 text-center">
          <h2 class="text-2xl font-bold tracking-[-0.02em] text-slate-900">Want to discuss this topic?</h2>
          <p class="mt-3 text-slate-500">Our experts are ready to help with your specific challenges.</p>
          <a href="/contact" class="mt-6 inline-block rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:no-underline" style={{ backgroundColor: token.primary }}>
            Get in Touch
          </a>
        </div>
      </section>

      {props.children}
    </Base>
  );
};

export default Article;
