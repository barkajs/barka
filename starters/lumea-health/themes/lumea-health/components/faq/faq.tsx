/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';
import { token } from '../../lib/tokens.js';

const spacingMap: Record<string, string> = {
  none: 'py-0', small: 'py-12', medium: 'py-16', large: 'py-20', xlarge: 'py-28',
};

const FAQ: FC<SectionProps> = ({ data, settings }) => {
  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const items: any[] = data.items ?? [];

  return (
    <section class={`${spacing} ${settings.css_class ?? ''}`} id={settings.anchor_id} style={{ backgroundColor: token.cream }}>
      <div class="mx-auto max-w-3xl px-6">
        {data.heading && (
          <h2 class="text-center text-3xl sm:text-4xl mb-12" style={{ fontFamily: token.fontHeading }}>{data.heading}</h2>
        )}
        <div class="mv-faq">
          {items.map((item: any) => (
            <details>
              <summary>
                {item.question}
                <svg class="h-5 w-5 shrink-0 transition-transform" style={{ color: token.muted }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" /></svg>
              </summary>
              <div class="mv-faq-answer">{item.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
