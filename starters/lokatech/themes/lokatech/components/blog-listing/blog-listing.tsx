/** @jsxImportSource hono/jsx */
import { raw } from 'hono/html';
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';
import { token, alpha } from '../../lib/tokens.js';

function renderGradient(text: string): any {
  const parts = text.split(/(\*[^*]+\*)/g);
  const html = parts
    .map((p) =>
      p.startsWith('*') && p.endsWith('*')
        ? `<em class="not-italic" style="background:linear-gradient(135deg,${token.primary},${alpha(token.primary, 60)},#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${p.slice(1, -1)}</em>`
        : p,
    )
    .join('');
  return raw(html);
}

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

const BlogListing: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  if (settings.hidden) return null;

  const urlFn = (p: string) => themeSettings._url?.(p) ?? p;
  const t = (key: string) => themeSettings._t?.(key) ?? key;
  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const width = widthMap[settings.width] ?? widthMap.contained;
  const bg = bgMap[settings.background] ?? bgMap.light;
  const bgStyle: Record<string, string> = {};
  if (settings.background === 'dark') {
    bgStyle.backgroundColor = token.navy;
  } else if (settings.background === 'primary') {
    bgStyle.backgroundColor = token.primary;
  } else if (settings.background === 'custom' && settings.background_color) {
    bgStyle.backgroundColor = settings.background_color;
  }

  const isDark = settings.background === 'dark' || settings.background === 'primary';

  const items: Array<{
    title: string;
    url?: string;
    excerpt?: string;
    image?: string;
    date?: string;
  }> = data.items ?? [];

  const featured = items[0];
  const rest = items.slice(1);

  return (
    <section
      class={`${spacing} ${bg} relative overflow-hidden ${settings.css_class ?? ''}`}
      id={settings.anchor_id}
      style={Object.keys(bgStyle).length > 0 ? bgStyle : undefined}
    >
      <div class={width}>
        {/* Left-aligned heading + "View all" link */}
        <div class="mb-16 flex items-end justify-between gap-4">
          <div class="max-w-2xl">
            {data.heading && (
              <h2 class="reveal-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                {data.heading.includes('*') ? renderGradient(data.heading) : data.heading}
              </h2>
            )}
          </div>
          <a
            href={urlFn('/articles')}
            class="reveal-sub hidden shrink-0 items-center gap-1 text-sm font-semibold transition-colors duration-200 hover:no-underline sm:flex"
            style={{ color: token.primary }}
          >
            {t('blog.view_all')}
            <span class="transition-transform duration-200 hover:translate-x-1">&rarr;</span>
          </a>
        </div>

        {items.length > 0 ? (
          <div class="grid gap-6 lg:grid-cols-5">
            {/* Featured article — large, left */}
            {featured && (
              <article class="testimonial-featured lg:col-span-3">
                <a
                  href={featured.url ?? '#'}
                  class={`group block overflow-hidden rounded-2xl border transition-all duration-400 hover:no-underline ${
                    isDark
                      ? 'border-gray-700/50 bg-white/[0.03] hover:border-gray-600'
                      : 'border-gray-100 bg-white hover:shadow-xl hover:shadow-slate-200/50'
                  }`}
                >
                  {featured.image && (
                    <div class="overflow-hidden">
                      <img
                        src={featured.image}
                        alt={featured.title}
                        class="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div class="p-8">
                    {featured.date && (
                      <time class={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{featured.date}</time>
                    )}
                    <h3 class={`mt-3 text-xl font-bold tracking-[-0.02em] leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {featured.title}
                    </h3>
                    {featured.excerpt && (
                      <p class={`mt-3 line-clamp-3 text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        {featured.excerpt}
                      </p>
                    )}
                    <div class="mt-5 flex items-center gap-1 text-sm font-semibold" style={{ color: token.primary }}>
                      Read more
                      <span class="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                    </div>
                  </div>
                </a>
              </article>
            )}

            {/* Side articles — stacked, offset */}
            <div class="testimonial-side flex flex-col gap-6 lg:col-span-2 lg:mt-6">
              {rest.map((item) => (
                <article>
                  <a
                    href={item.url ?? '#'}
                    class={`group flex gap-5 rounded-2xl border p-5 transition-all duration-400 hover:no-underline ${
                      isDark
                        ? 'border-gray-700/50 bg-white/[0.03] hover:border-gray-600'
                        : 'border-gray-100 bg-white hover:shadow-lg hover:shadow-slate-200/50'
                    }`}
                  >
                    {item.image && (
                      <div class="hidden shrink-0 overflow-hidden rounded-xl sm:block" style={{ width: '100px', height: '100px' }}>
                        <img
                          src={item.image}
                          alt={item.title}
                          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div class="flex-1">
                      {item.date && (
                        <time class={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{item.date}</time>
                      )}
                      <h3 class={`mt-1 text-sm font-semibold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {item.title}
                      </h3>
                      <div class="mt-2 flex items-center gap-1 text-xs font-semibold opacity-0 transition-all duration-200 group-hover:opacity-100" style={{ color: token.primary }}>
                        Read <span class="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                      </div>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <p class={`text-center text-sm ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
            Blog listing renders dynamically — content will appear here at runtime.
          </p>
        )}

        {/* Mobile "View all" */}
        <div class="mt-10 text-center sm:hidden">
          <a href={urlFn('/articles')} class="text-sm font-semibold hover:no-underline" style={{ color: token.primary }}>
            {t('blog.view_all')} &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogListing;
