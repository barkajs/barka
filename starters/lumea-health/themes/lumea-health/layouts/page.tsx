/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const Page: FC<LayoutProps> = (props) => {
  const { content } = props;
  return (
    <Base {...props}>
      <section class="py-16" style={{ backgroundColor: 'var(--color-cream)' }}>
        <div class="mx-auto max-w-4xl px-6">
          <h1 class="text-4xl sm:text-5xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{content.title}</h1>
          {content.fields?.subtitle && (
            <p class="text-lg mb-8" style={{ color: 'var(--color-muted)' }}>{content.fields.subtitle}</p>
          )}
          {content.bodyHtml && (
            <div class="mv-prose" dangerouslySetInnerHTML={{ __html: content.bodyHtml }} />
          )}
        </div>
      </section>
      {props.children}
    </Base>
  );
};

export default Page;
