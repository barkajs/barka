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
  light: 'bg-white text-gray-900',
  dark: 'bg-gray-900 text-white',
  primary: 'text-white',
  custom: '',
};

const BlogListing: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  if (settings.hidden) return null;

  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const width = widthMap[settings.width] ?? widthMap.contained;
  const bg = bgMap[settings.background] ?? bgMap.light;
  const primaryColor = themeSettings.primary_color ?? '#2563eb';

  const bgStyle: Record<string, string> = {};
  if (settings.background === 'primary') {
    bgStyle.backgroundColor = primaryColor;
  } else if (settings.background === 'custom' && settings.background_color) {
    bgStyle.backgroundColor = settings.background_color;
  }

  const items: Array<{
    title: string;
    url?: string;
    excerpt?: string;
    image?: string;
    date?: string;
  }> = data.items ?? [];

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

        {items.length > 0 ? (
          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    class="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                )}
                <div class="p-5">
                  {item.date && (
                    <time class="text-xs text-gray-400">{item.date}</time>
                  )}
                  <h3 class="mt-1 text-lg font-semibold text-gray-900">
                    {item.url ? (
                      <a href={item.url} class="hover:underline">{item.title}</a>
                    ) : (
                      item.title
                    )}
                  </h3>
                  {item.excerpt && (
                    <p class="mt-2 text-sm leading-relaxed text-gray-600">{item.excerpt}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p class="text-center text-sm opacity-60">
            Blog listing renders dynamically — content will appear here at runtime.
          </p>
        )}
      </div>
    </section>
  );
};

export default BlogListing;
