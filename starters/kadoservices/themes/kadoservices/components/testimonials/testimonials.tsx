/** @jsxImportSource hono/jsx */
import { raw } from 'hono/html';
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';

function renderGradient(text: string, color: string): any {
  const parts = text.split(/(\*[^*]+\*)/g);
  const html = parts
    .map((p) =>
      p.startsWith('*') && p.endsWith('*')
        ? `<em class="not-italic" style="background:linear-gradient(135deg,${color},${color}99,#EF4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${p.slice(1, -1)}</em>`
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
  light: 'bg-slate-50 text-slate-900',
  dark: 'text-white',
  primary: 'text-white',
  custom: '',
};

const Testimonials: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  if (settings.hidden) return null;

  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const width = widthMap[settings.width] ?? widthMap.contained;
  const bg = bgMap[settings.background] ?? bgMap.light;
  const primaryColor = themeSettings.primary_color ?? '#F59E0B';
  const navColor = themeSettings.nav_color ?? '#14101E';
  const items: Array<{
    quote: string;
    author: string;
    role?: string;
    avatar?: string;
  }> = data.items ?? [];

  const bgStyle: Record<string, string> = {};
  if (settings.background === 'dark') {
    bgStyle.backgroundColor = navColor;
  } else if (settings.background === 'primary') {
    bgStyle.backgroundColor = primaryColor;
  } else if (settings.background === 'custom' && settings.background_color) {
    bgStyle.backgroundColor = settings.background_color;
  }

  const isDark = settings.background === 'dark' || settings.background === 'primary';

  const featured = items[0];
  const rest = items.slice(1);

  return (
    <section
      class={`${spacing} ${bg} relative overflow-hidden ${settings.css_class ?? ''}`}
      id={settings.anchor_id}
      style={Object.keys(bgStyle).length > 0 ? bgStyle : undefined}
    >
      <div class={width}>
        {data.heading && (
          <h2 class="reveal-heading mb-16 max-w-2xl text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
            {data.heading.includes('*') ? renderGradient(data.heading, primaryColor) : data.heading}
          </h2>
        )}

        {/* Asymmetric layout: 1 large left, 2 stacked right */}
        <div class="grid gap-6 lg:grid-cols-5">
          {/* Featured testimonial — spans 3 cols */}
          {featured && (
            <div
              class={`testimonial-featured lg:col-span-3 group relative rounded-2xl border p-10 transition-all duration-400 ${
                isDark
                  ? 'border-gray-700/50 bg-white/[0.04] hover:border-gray-600'
                  : 'border-gray-100 bg-white shadow-sm hover:shadow-xl hover:shadow-slate-200/50'
              }`}
            >
              <div class="mb-6 text-7xl font-serif leading-none" style={{ color: `${primaryColor}30` }}>"</div>
              <blockquote class={`mb-8 text-xl leading-relaxed ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>
                {featured.quote}
              </blockquote>
              <div class="flex items-center gap-4">
                {featured.avatar ? (
                  <img src={featured.avatar} alt={featured.author} class="h-14 w-14 rounded-full object-cover ring-2 ring-gray-100" loading="lazy" />
                ) : (
                  <div class="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white" style={{ backgroundColor: primaryColor }}>
                    {featured.author.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div class={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{featured.author}</div>
                  {featured.role && <div class={`text-sm ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{featured.role}</div>}
                </div>
              </div>
              {/* Accent corner */}
              <div class="absolute bottom-0 right-0 h-1 w-24 rounded-tl-full" style={{ backgroundColor: primaryColor }} />
            </div>
          )}

          {/* Side testimonials — offset with top margin */}
          <div class="testimonial-side flex flex-col gap-6 lg:col-span-2 lg:mt-8">
            {rest.map((item) => (
              <div
                class={`group relative rounded-2xl border p-7 transition-all duration-400 ${
                  isDark
                    ? 'border-gray-700/50 bg-white/[0.03] hover:border-gray-600'
                    : 'border-gray-100 bg-white shadow-sm hover:shadow-lg hover:shadow-slate-200/50'
                }`}
              >
                <div class="mb-4 text-4xl font-serif leading-none" style={{ color: `${primaryColor}25` }}>"</div>
                <blockquote class={`mb-6 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                  {item.quote}
                </blockquote>
                <div class="flex items-center gap-3">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.author} class="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100" loading="lazy" />
                  ) : (
                    <div class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: primaryColor }}>
                      {item.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div class={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.author}</div>
                    {item.role && <div class={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{item.role}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
