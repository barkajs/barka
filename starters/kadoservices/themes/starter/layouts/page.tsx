/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const Page: FC<LayoutProps> = (props) => {
  const { content } = props;

  return (
    <Base {...props}>
      <div class="mx-auto max-w-4xl px-6 py-16">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {content.title}
        </h1>

        {content.bodyHtml && (
          <div
            class="prose prose-lg prose-gray mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: content.bodyHtml }}
          />
        )}

        {props.children}
      </div>
    </Base>
  );
};

export default Page;
