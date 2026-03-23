/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const Location: FC<LayoutProps> = (props) => {
  const { content } = props;
  return (
    <Base {...props}>
      <section class="py-16" style={{ backgroundColor: 'var(--color-cream)' }}>
        <div class="mx-auto max-w-4xl px-6">
          <span class="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-3" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
            Clinic
          </span>
          <h1 class="text-4xl sm:text-5xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Lumea Health {content.fields?.city ?? content.title}</h1>
          <div class="mv-card p-8 mb-8">
            <div class="grid gap-4 sm:grid-cols-2">
              {content.fields?.address && (
                <div>
                  <p class="text-sm font-semibold mb-1">Address</p>
                  <p class="text-sm" style={{ color: 'var(--color-muted)' }}>{content.fields.address}</p>
                </div>
              )}
              {content.fields?.phone && (
                <div>
                  <p class="text-sm font-semibold mb-1">Phone</p>
                  <p class="text-sm" style={{ color: 'var(--color-muted)' }}>{content.fields.phone}</p>
                </div>
              )}
              {content.fields?.hours && (
                <div>
                  <p class="text-sm font-semibold mb-1">Hours</p>
                  <p class="text-sm" style={{ color: 'var(--color-muted)' }}>{content.fields.hours}</p>
                </div>
              )}
              {content.fields?.specializations && (
                <div>
                  <p class="text-sm font-semibold mb-1">Specializations</p>
                  <p class="text-sm" style={{ color: 'var(--color-muted)' }}>{content.fields.specializations}</p>
                </div>
              )}
            </div>
          </div>
          {content.bodyHtml && (
            <div class="mv-prose" dangerouslySetInnerHTML={{ __html: content.bodyHtml }} />
          )}
          <div class="mt-8">
            <a href="/contact" class="mv-btn-primary">Book at this Clinic</a>
          </div>
        </div>
      </section>
      {props.children}
    </Base>
  );
};

export default Location;
