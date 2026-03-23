/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';
import { token } from '../../lib/tokens.js';

const spacingMap: Record<string, string> = {
  none: 'py-0', small: 'py-12', medium: 'py-16', large: 'py-20', xlarge: 'py-28',
};

const starSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

const Testimonials: FC<SectionProps> = ({ data, settings }) => {
  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const items: any[] = data.items ?? [];

  return (
    <section class={`${spacing} ${settings.css_class ?? ''}`} id={settings.anchor_id} style={{ backgroundColor: token.cream }}>
      <div class="mx-auto max-w-6xl px-6">
        {data.heading && (
          <h2 class="text-center text-3xl sm:text-4xl mb-12" style={{ fontFamily: token.fontHeading }}>{data.heading}</h2>
        )}
        <div class="grid gap-8 md:grid-cols-3">
          {items.map((item: any) => {
            const rating = item.rating ?? 5;
            return (
              <div class="mv-testimonial-card">
                <div class="mv-stars mb-4" dangerouslySetInnerHTML={{ __html: starSvg.repeat(rating) }} />
                <blockquote class="text-base leading-relaxed mb-6" style={{ color: token.text }}>
                  "{item.quote}"
                </blockquote>
                <div class="flex items-center gap-3">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.author} class="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: token.primary }}>
                      {item.author?.charAt(0) ?? 'P'}
                    </div>
                  )}
                  <div>
                    <p class="text-sm font-semibold">{item.author}</p>
                    {item.role && <p class="text-xs" style={{ color: token.muted }}>{item.role}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
