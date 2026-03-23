/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const Article: FC<LayoutProps> = (props) => {
  const { content } = props;
  return (
    <Base {...props}>
      <article class="py-16" style={{ backgroundColor: 'var(--color-cream)' }}>
        <div class="mx-auto max-w-3xl px-6">
          {content.fields?.category && (
            <span class="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              {content.fields.category}
            </span>
          )}
          <h1 class="text-3xl sm:text-4xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{content.title}</h1>
          {content.publishedAt && (
            <time class="text-sm mb-8 block" style={{ color: 'var(--color-muted)' }}>
              {content.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          )}
          {content.fields?.featured_image && (
            <img src={content.fields.featured_image} alt={content.title} class="w-full rounded-2xl mb-8 aspect-video object-cover" loading="lazy" />
          )}
          {content.bodyHtml && (
            <div class="mv-prose" dangerouslySetInnerHTML={{ __html: content.bodyHtml }} />
          )}
          <div class="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <a href="/blog" class="mv-btn-outline text-sm">&larr; Back to Blog</a>
          </div>
        </div>
      </article>
      {props.children}
    </Base>
  );
};

export default Article;
