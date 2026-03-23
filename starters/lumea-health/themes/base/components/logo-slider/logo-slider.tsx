/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';
import { token } from '../../lib/tokens.js';

const spacingMap: Record<string, string> = {
  none: 'py-0',
  small: 'py-8',
  medium: 'py-16',
  large: 'py-24',
  xlarge: 'py-32',
};

const widthMap: Record<string, string> = {
  contained: 'max-w-6xl mx-auto px-6',
  wide: 'max-w-7xl mx-auto px-6',
  full: 'w-full px-6',
};

const bgMap: Record<string, string> = {
  light: 'bg-white text-gray-900',
  dark: 'bg-gray-900 text-white',
  primary: 'text-white',
  custom: '',
};

const LogoSlider: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  if (settings.hidden) return null;

  const spacing = spacingMap[settings.spacing] ?? spacingMap.medium;
  const width = widthMap[settings.width] ?? widthMap.contained;
  const bg = bgMap[settings.background] ?? bgMap.light;
  const items: Array<{ src: string; alt?: string; url?: string }> =
    data.items ?? [];

  const bgStyle: Record<string, string> = {};
  if (settings.background === 'primary') {
    bgStyle.backgroundColor = token.primary;
  } else if (settings.background === 'custom' && settings.background_color) {
    bgStyle.backgroundColor = settings.background_color;
  }

  return (
    <section
      class={`${spacing} ${bg} ${settings.css_class ?? ''}`}
      id={settings.anchor_id}
      style={Object.keys(bgStyle).length > 0 ? bgStyle : undefined}
    >
      <div class={width}>
        {data.heading && (
          <h2 class="mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {data.heading}
          </h2>
        )}

        <div class="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {items.map((item) => {
            const img = (
              <img
                src={item.src}
                alt={item.alt ?? ''}
                class="h-10 max-w-[140px] object-contain grayscale transition-all duration-200 hover:grayscale-0"
                loading="lazy"
              />
            );

            return item.url ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {img}
              </a>
            ) : (
              <div>{img}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LogoSlider;
