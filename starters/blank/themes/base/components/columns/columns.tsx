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

const layoutMap: Record<string, string> = {
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  '1-2': 'grid-cols-1 md:grid-cols-3',
  '2-1': 'grid-cols-1 md:grid-cols-3',
};

function colSpan(layout: string, index: number): string {
  if (layout === '1-2') return index === 0 ? 'md:col-span-1' : 'md:col-span-2';
  if (layout === '2-1') return index === 0 ? 'md:col-span-2' : 'md:col-span-1';
  return '';
}

const Columns: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  if (settings.hidden) return null;

  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const width = widthMap[settings.width] ?? widthMap.contained;
  const bg = bgMap[settings.background] ?? bgMap.light;
  const layout = data.layout ?? '2';
  const columns: Array<{ heading?: string; body?: string; image?: string; image_alt?: string }> =
    data.columns ?? [];

  const bgStyle: Record<string, string> = {};
  if (settings.background === 'primary') {
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
      <div class={width}>
        {data.heading && (
          <h2 class="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {data.heading}
          </h2>
        )}

        <div class={`grid gap-8 ${layoutMap[layout] ?? layoutMap['2']}`}>
          {columns.map((col, i) => (
            <div class={colSpan(layout, i)}>
              {col.image && (
                <img
                  src={col.image}
                  alt={col.image_alt ?? ''}
                  class="mb-4 rounded-lg"
                  loading="lazy"
                />
              )}
              {col.heading && (
                <h3 class="mb-3 text-xl font-semibold">{col.heading}</h3>
              )}
              {col.body && (
                <div
                  class={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}
                  dangerouslySetInnerHTML={{ __html: col.body }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Columns;
