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
  contained: 'max-w-5xl mx-auto px-6',
  wide: 'max-w-7xl mx-auto px-6',
  full: 'w-full px-6',
};

const bgMap: Record<string, string> = {
  light: 'bg-white text-gray-900',
  dark: 'bg-gray-900 text-white',
  primary: 'text-white',
  custom: '',
};

const Hero: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const width = widthMap[settings.width] ?? widthMap.contained;
  const bg = bgMap[settings.background] ?? bgMap.light;
  const bgStyle: Record<string, string> = {};
  if (settings.background === 'primary') {
    bgStyle.backgroundColor = token.primary;
  } else if (settings.background === 'custom' && settings.background_color) {
    bgStyle.backgroundColor = settings.background_color;
  }
  if (settings.background_image) {
    bgStyle.backgroundImage = `url(${settings.background_image})`;
    bgStyle.backgroundSize = 'cover';
    bgStyle.backgroundPosition = 'center';
  }

  return (
    <section
      class={`${spacing} ${bg} ${settings.css_class ?? ''}`}
      id={settings.anchor_id}
      style={Object.keys(bgStyle).length > 0 ? bgStyle : undefined}
    >
      <div class={`${width} text-center`}>
        {data.heading && (
          <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
            {data.heading}
          </h1>
        )}
        {data.subheading && (
          <p class="mt-6 text-lg leading-relaxed opacity-80 sm:text-xl">
            {data.subheading}
          </p>
        )}
        {data.cta_text && (
          <div class="mt-10">
            <a
              href={data.cta_url ?? '#'}
              class="inline-block rounded-lg px-8 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: token.primary }}
            >
              {data.cta_text}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
