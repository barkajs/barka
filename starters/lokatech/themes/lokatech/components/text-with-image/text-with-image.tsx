/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';
import { token } from '../../lib/tokens.js';

const spacingMap: Record<string, string> = {
  none: 'py-0',
  small: 'py-10',
  medium: 'py-20',
  large: 'py-28',
  xlarge: 'py-36',
};

const widthMap: Record<string, string> = {
  contained: 'max-w-6xl mx-auto px-6',
  wide: 'max-w-7xl mx-auto px-6',
  full: 'w-full px-6',
};

const bgMap: Record<string, string> = {
  light: 'bg-white text-slate-900',
  dark: 'text-white',
  primary: 'text-white',
  custom: '',
};

const TextWithImage: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  const urlFn = (p: string) => themeSettings._url?.(p) ?? p;
  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const width = widthMap[settings.width] ?? widthMap.contained;
  const bg = bgMap[settings.background] ?? bgMap.light;
  const reversed = data.image_position === 'left';

  const bgStyle: Record<string, string> = {};
  if (settings.background === 'dark') {
    bgStyle.backgroundColor = token.navy;
  } else if (settings.background === 'primary') {
    bgStyle.backgroundColor = token.primary;
  } else if (settings.background === 'custom' && settings.background_color) {
    bgStyle.backgroundColor = settings.background_color;
  }

  const isDark = settings.background === 'dark' || settings.background === 'primary';

  return (
    <section
      class={`${spacing} ${bg} ${settings.css_class ?? ''}`}
      id={settings.anchor_id}
      style={Object.keys(bgStyle).length > 0 ? bgStyle : undefined}
    >
      <div class={`${width} grid items-center gap-16 md:grid-cols-2`}>
        <div class={reversed ? 'order-2' : ''}>
          {data.heading && (
            <h2 class="mb-5 text-3xl font-bold tracking-[-0.02em]">
              {data.heading}
            </h2>
          )}
          {data.body && (
            <div
              class={`prose prose-lg max-w-none ${isDark ? 'prose-invert' : 'prose-slate'}`}
              dangerouslySetInnerHTML={{ __html: data.body }}
            />
          )}
          {data.cta_text && (
            <div class="mt-8">
              <a
                href={urlFn(data.cta_url ?? '#')}
                class="inline-block rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:no-underline"
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
              class="rounded-2xl shadow-xl ring-1 ring-gray-100"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default TextWithImage;
