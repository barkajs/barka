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

const Counters: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  if (settings.hidden) return null;

  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const width = widthMap[settings.width] ?? widthMap.contained;
  const primaryColor = themeSettings.primary_color ?? '#F59E0B';
  const navColor = themeSettings.nav_color ?? '#14101E';
  const rawItems: Array<Record<string, any>> = data.items ?? [];
  const items = rawItems.map((item) => ({
    value: item.number ?? item.value ?? '',
    suffix: item.suffix ?? '',
    label: item.label ?? '',
  }));

  const bgStyle: Record<string, string> = {};
  if (settings.background === 'dark') {
    bgStyle.backgroundColor = navColor;
  } else if (settings.background === 'primary') {
    bgStyle.backgroundColor = primaryColor;
  } else if (settings.background === 'custom' && settings.background_color) {
    bgStyle.backgroundColor = settings.background_color;
  }

  const isDark = settings.background === 'dark' || settings.background === 'primary';

  return (
    <section
      class={`${spacing} ${isDark ? 'text-white' : 'bg-white text-slate-900'} relative overflow-hidden ${settings.css_class ?? ''}`}
      id={settings.anchor_id}
      style={Object.keys(bgStyle).length > 0 ? bgStyle : undefined}
    >
      {/* Grid pattern for dark bg */}
      {isDark && <div class="grid-pattern pointer-events-none absolute inset-0" />}

      {/* Floating blob */}
      <div class="blob blob-sm" style={{ bottom: '10%', right: '5%', background: `${primaryColor}10`, animationDelay: '-4s' }} />

      <div class={width}>
        {data.heading && (
          <h2 class="reveal-heading mb-16 text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
            {data.heading.includes('*') ? renderGradient(data.heading, primaryColor) : data.heading}
          </h2>
        )}

        {/* Counter items with dividers, staggered */}
        <div class="flex flex-wrap items-start justify-between gap-y-12">
          {items.map((item, idx) => (
            <div class="counter-item flex items-start gap-8" style={{ animationDelay: `${0.15 + idx * 0.2}s` }}>
              {idx > 0 && (
                <div class={`hidden h-20 w-px lg:block ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
              )}
              <div class="min-w-[140px]">
                <div
                  class="text-5xl font-extrabold tracking-[-0.04em] sm:text-6xl lg:text-7xl"
                  style={{ color: isDark ? '#fff' : primaryColor }}
                >
                  {item.value}
                  {item.suffix && <span class="text-3xl sm:text-4xl lg:text-5xl">{item.suffix}</span>}
                </div>
                <div class={`mt-3 text-sm font-medium uppercase tracking-[0.12em] ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Counters;
