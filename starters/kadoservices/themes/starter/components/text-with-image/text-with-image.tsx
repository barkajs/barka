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

const TextWithImage: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const width = widthMap[settings.width] ?? widthMap.contained;
  const bg = bgMap[settings.background] ?? bgMap.light;
  const reversed = data.image_position === 'left';

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
      <div class={`${width} grid items-center gap-12 md:grid-cols-2`}>
        <div class={reversed ? 'order-2' : ''}>
          {data.heading && (
            <h2 class="mb-4 text-3xl font-bold tracking-tight">
              {data.heading}
            </h2>
          )}
          {data.body && (
            <div
              class="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: data.body }}
            />
          )}
          {data.cta_text && (
            <div class="mt-6">
              <a
                href={data.cta_url ?? '#'}
                class="inline-block rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
                style={{ backgroundColor: token.primary }}
              >
                {data.cta_text}
              </a>
            </div>
          )}
        </div>
        <div class={reversed ? 'order-1' : ''}>
          {data.image && (
            <img
              src={data.image}
              alt={data.image_alt ?? ''}
              class="rounded-xl shadow-lg"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default TextWithImage;
