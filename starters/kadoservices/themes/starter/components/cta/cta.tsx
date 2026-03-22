/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';

const spacingMap: Record<string, string> = {
  none: 'py-0',
  small: 'py-8',
  medium: 'py-16',
  large: 'py-24',
  xlarge: 'py-32',
};

const widthMap: Record<string, string> = {
  contained: 'max-w-4xl mx-auto px-6',
  wide: 'max-w-6xl mx-auto px-6',
  full: 'w-full px-6',
};

const Cta: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const width = widthMap[settings.width] ?? widthMap.contained;
  const primaryColor = themeSettings.primary_color ?? '#2563eb';

  return (
    <section
      class={`${spacing} text-white ${settings.css_class ?? ''}`}
      id={settings.anchor_id}
      style={{ backgroundColor: primaryColor }}
    >
      <div class={`${width} text-center`}>
        {data.heading && (
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
            {data.heading}
          </h2>
        )}
        {data.description && (
          <p class="mt-4 text-lg opacity-90">
            {data.description}
          </p>
        )}
        {data.button_text && (
          <div class="mt-8">
            <a
              href={data.button_url ?? '#'}
              class="inline-block rounded-lg bg-white px-8 py-3 text-sm font-semibold shadow-lg transition-transform hover:scale-105"
              style={{ color: primaryColor }}
            >
              {data.button_text}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cta;
