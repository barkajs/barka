/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';
import { token } from '../../lib/tokens.js';

const spacingMap: Record<string, string> = {
  none: 'py-0', small: 'py-12', medium: 'py-16', large: 'py-20', xlarge: 'py-28',
};

const Counters: FC<SectionProps> = ({ data, settings }) => {
  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const items: any[] = data.items ?? [];
  const bg = settings.background === 'primary'
    ? { backgroundColor: token.primary, color: 'white' }
    : { backgroundColor: token.cream };

  return (
    <section class={`${spacing} ${settings.css_class ?? ''}`} id={settings.anchor_id} style={bg}>
      <div class="mx-auto max-w-6xl px-6">
        {data.heading && (
          <h2 class="text-center text-3xl sm:text-4xl mb-12" style={{ fontFamily: token.fontHeading }}>{data.heading}</h2>
        )}
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item: any) => (
            <div class="text-center">
              <div class="mv-counter-value" style={settings.background === 'primary' ? { color: 'white' } : {}}>
                {item.number}{item.suffix ?? ''}
              </div>
              <p class="mt-2 text-sm font-medium" style={{ color: settings.background === 'primary' ? 'rgba(255,255,255,0.8)' : token.muted }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Counters;
