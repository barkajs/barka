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
  contained: 'max-w-6xl mx-auto px-6',
  wide: 'max-w-7xl mx-auto px-6',
  full: 'w-full px-6',
};

const bgMap: Record<string, string> = {
  light: 'bg-gray-50 text-gray-900',
  dark: 'bg-gray-900 text-white',
  primary: 'text-white',
  custom: '',
};

const Testimonials: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  if (settings.hidden) return null;

  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const width = widthMap[settings.width] ?? widthMap.contained;
  const bg = bgMap[settings.background] ?? bgMap.light;
  const primaryColor = themeSettings.primary_color ?? '#2563eb';
  const items: Array<{
    quote: string;
    author: string;
    role?: string;
    avatar?: string;
  }> = data.items ?? [];

  const bgStyle: Record<string, string> = {};
  if (settings.background === 'primary') {
    bgStyle.backgroundColor = primaryColor;
  } else if (settings.background === 'custom' && settings.background_color) {
    bgStyle.backgroundColor = settings.background_color;
  }

  const cols = items.length <= 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';

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

        <div class={`grid gap-8 ${cols}`}>
          {items.map((item) => (
            <div class="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div class="mb-4 text-4xl leading-none opacity-20" style={{ color: primaryColor }}>"</div>
              <blockquote class="mb-6 text-base italic leading-relaxed text-gray-600">
                {item.quote}
              </blockquote>
              <div class="flex items-center gap-3">
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt={item.author}
                    class="h-10 w-10 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {item.author.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div class="text-sm font-semibold text-gray-900">{item.author}</div>
                  {item.role && (
                    <div class="text-xs text-gray-500">{item.role}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
