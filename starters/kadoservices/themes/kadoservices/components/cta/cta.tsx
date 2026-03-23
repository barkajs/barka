/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';
import { token, alpha } from '../../lib/tokens.js';

const spacingMap: Record<string, string> = {
  none: 'py-0',
  small: 'py-10',
  medium: 'py-20',
  large: 'py-28',
  xlarge: 'py-36',
};

const widthMap: Record<string, string> = {
  contained: 'max-w-5xl mx-auto px-6',
  wide: 'max-w-6xl mx-auto px-6',
  full: 'w-full px-6',
};

const Cta: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  const urlFn = (p: string) => themeSettings._url?.(p) ?? p;
  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const width = widthMap[settings.width] ?? widthMap.contained;
  const bgColor = settings.background === 'primary' ? token.primary : token.navy;
  const isDarkBg = settings.background !== 'primary';

  return (
    <section
      class={`${spacing} text-white relative overflow-hidden ${settings.css_class ?? ''}`}
      id={settings.anchor_id}
      style={{ backgroundColor: bgColor }}
    >
      {/* Grid pattern */}
      <div class="grid-pattern pointer-events-none absolute inset-0" />

      {/* Floating blobs */}
      <div class="blob" style={{ top: '-20%', left: '-10%', width: '400px', height: '400px', background: `${alpha(token.primary, 7)}` }} />
      <div class="blob blob-sm" style={{ bottom: '-10%', right: '5%', background: `#F9731608`, animationDelay: '-6s' }} />

      {/* Glow effect */}
      <div
        class="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${alpha(token.primary, 7)} 0%, transparent 60%)`,
        }}
      />

      <div class={`${width} relative`}>
        {/* Asymmetric: text left-aligned on larger screens */}
        <div class="grid items-center gap-12 lg:grid-cols-5">
          <div class="lg:col-span-3">
            {data.eyebrow && (
              <p class="reveal-sub mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">{data.eyebrow}</p>
            )}
            {data.heading && (
              <h2 class="reveal-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                {data.heading}
              </h2>
            )}
            {(data.description || data.body) && (
              <p class="reveal-sub mt-6 max-w-xl text-lg leading-relaxed text-gray-300/90" style={{ animationDelay: '0.25s' }}>
                {data.description ?? data.body}
              </p>
            )}
          </div>

          {/* Buttons on the right, vertically stacked */}
          <div class="reveal-sub flex flex-col gap-4 lg:col-span-2" style={{ animationDelay: '0.35s' }}>
            {data.button_text && (
              <a
                href={urlFn(data.button_url ?? '#')}
                class={`inline-block rounded-lg px-8 py-4 text-center text-sm font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110 hover:no-underline ${
                  isDarkBg ? 'text-white' : 'text-slate-900'
                }`}
                style={{ backgroundColor: isDarkBg ? token.primary : '#fff' }}
              >
                {data.button_text}
              </a>
            )}
            {data.secondary_text && (
              <a
                href={urlFn(data.secondary_url ?? '#')}
                class="inline-block rounded-lg border border-white/20 px-8 py-4 text-center text-sm font-semibold text-white/90 transition-all duration-300 hover:border-white/40 hover:text-white hover:no-underline"
              >
                {data.secondary_text}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Glow line top */}
      <div class="glow-line absolute top-0 left-0 right-0" />
    </section>
  );
};

export default Cta;
