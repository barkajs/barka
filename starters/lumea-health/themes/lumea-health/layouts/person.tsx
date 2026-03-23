/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const Person: FC<LayoutProps> = (props) => {
  const { content } = props;
  return (
    <Base {...props}>
      <section class="py-16" style={{ backgroundColor: 'var(--color-cream)' }}>
        <div class="mx-auto max-w-4xl px-6">
          <div class="flex flex-col md:flex-row gap-8 mb-8">
            <div class="shrink-0">
              <img
                src={content.fields?.photo || `https://placehold.co/300x300/4A7C59/FFFFFF?text=${encodeURIComponent(content.title.charAt(0))}`}
                alt={content.title}
                class="w-48 h-48 rounded-2xl object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <h1 class="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{content.title}</h1>
              {content.fields?.role && <p class="text-lg font-medium mb-1" style={{ color: 'var(--color-primary)' }}>{content.fields.role}</p>}
              {content.fields?.specialization && <p class="text-sm mb-2" style={{ color: 'var(--color-muted)' }}>Specialization: {content.fields.specialization}</p>}
              {content.fields?.experience_years && <p class="text-sm" style={{ color: 'var(--color-muted)' }}>{content.fields.experience_years} years of experience</p>}
            </div>
          </div>
          {content.bodyHtml && (
            <div class="mv-prose" dangerouslySetInnerHTML={{ __html: content.bodyHtml }} />
          )}
          <div class="mt-8">
            <a href="/contact" class="mv-btn-primary">Book with {content.title.split(' ')[0]}</a>
          </div>
        </div>
      </section>
      {props.children}
    </Base>
  );
};

export default Person;
