/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const Page: FC<LayoutProps> = (props) => {
  const { content, themeSettings } = props;
  const primaryColor = themeSettings.primary_color ?? '#10B981';
  const navColor = themeSettings.nav_color ?? '#0B1222';

  return (
    <Base {...props}>
      {/* Hero */}
      <section class="relative overflow-hidden py-20 text-white" style={{ backgroundColor: navColor }}>
        <div class="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${primaryColor}08 0%, transparent 50%)` }} />
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

      {/* Body */}
      {content.bodyHtml && (
        <section class="py-20">
          <div class="mx-auto max-w-3xl px-6">
            <div
              class="prose prose-lg prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: content.bodyHtml }}
            />
          </div>
        </section>
      )}

      {props.children}
    </Base>
  );
};

export default Page;
