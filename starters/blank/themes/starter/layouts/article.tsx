/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const Article: FC<LayoutProps> = (props) => {
  const { content } = props;
  const publishedDate = content.publishedAt ?? content.createdAt;

  return (
    <Base {...props}>
      <article class="mx-auto max-w-3xl px-6 py-16">
        <header class="mb-10">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {content.title}
          </h1>
          <time
            datetime={publishedDate.toISOString()}
            class="mt-4 block text-sm text-gray-500"
          >
            {publishedDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </header>

        {content.bodyHtml && (
          <div
            class="prose prose-lg prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: content.bodyHtml }}
          />
        )}

        {props.children}
      </article>
    </Base>
  );
};

export default Article;
