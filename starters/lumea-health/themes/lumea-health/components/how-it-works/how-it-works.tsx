/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';
import { token } from '../../lib/tokens.js';

const spacingMap: Record<string, string> = {
  none: 'py-0', small: 'py-12', medium: 'py-16', large: 'py-20', xlarge: 'py-28',
};

const HowItWorks: FC<SectionProps> = ({ data, settings }) => {
  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const items: any[] = data.items ?? [];

  return (
    <section class={`${spacing} ${settings.css_class ?? ''}`} id={settings.anchor_id} style={{ backgroundColor: 'white' }}>
      <div class="mx-auto max-w-5xl px-6">
        {data.heading && (
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl" style={{ fontFamily: token.fontHeading }}>{data.heading}</h2>
            {data.subheading && <p class="mt-3 mx-auto max-w-xl" style={{ color: token.muted }}>{data.subheading}</p>}
          </div>
        )}
        <div class="grid gap-12 md:grid-cols-3">
          {items.map((item: any, i: number) => (
            <div class="text-center relative">
              <div class="mv-step-number">{i + 1}</div>
              <h3 class="text-xl mb-3" style={{ fontFamily: token.fontHeading }}>{item.title}</h3>
              <p class="text-sm leading-relaxed" style={{ color: token.muted }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
