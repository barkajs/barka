/** @jsxImportSource hono/jsx */
import { raw } from 'hono/html';
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';

const spacingMap: Record<string, string> = {
  none: 'py-0',
  small: 'py-12',
  medium: 'py-20',
  large: 'py-28',
  xlarge: 'py-36',
};

const widthMap: Record<string, string> = {
  contained: 'max-w-6xl mx-auto px-6',
  wide: 'max-w-7xl mx-auto px-6',
  full: 'w-full px-6',
};

function renderHeading(heading: string, primaryColor: string): any {
  const parts = heading.split(/(\*[^*]+\*)/g);
  const html = parts
    .map((part) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        const inner = part.slice(1, -1);
        return `<em class="hero-gradient-text not-italic" style="background:linear-gradient(135deg,${primaryColor},${primaryColor}99,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${inner}</em>`;
      }
      return part;
    })
    .join('');
  return raw(html);
}

const Hero: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  const urlFn = (p: string) => themeSettings._url?.(p) ?? p;
  const spacing = spacingMap[settings.spacing] ?? spacingMap.xlarge;
  const width = widthMap[settings.width] ?? widthMap.contained;
  const primaryColor = themeSettings.primary_color ?? '#10B981';
  const navColor = themeSettings.nav_color ?? '#0B1222';
  const centered = data.alignment === 'center';

  const bgStyle: Record<string, string> = {
    backgroundColor: navColor,
  };
  if (settings.background_image) {
    bgStyle.backgroundImage = `linear-gradient(to right, ${navColor}ee, ${navColor}aa), url(${settings.background_image})`;
    bgStyle.backgroundSize = 'cover';
    bgStyle.backgroundPosition = 'center';
  }

  const hasGradient = data.heading?.includes('*');

  return (
    <section
      class={`${spacing} text-white relative overflow-hidden ${settings.css_class ?? ''}`}
      id={settings.anchor_id}
      style={bgStyle}
    >
      {/* Grid pattern overlay */}
      <div class="grid-pattern pointer-events-none absolute inset-0" />

      {/* Animated floating blobs */}
      <div class="blob blob-lg" style={{ top: '-10%', left: '-5%', background: `${primaryColor}15` }} />
      <div class="blob blob-sm" style={{ top: '20%', right: '10%', background: `${primaryColor}10`, animationDelay: '-3s' }} />
      <div class="blob" style={{ bottom: '-5%', left: '40%', width: '300px', height: '300px', background: `#3b82f610`, animationDelay: '-5s' }} />

      {/* Radial glow */}
      <div
        class="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 20% 50%, ${primaryColor}15 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, ${primaryColor}08 0%, transparent 40%)`,
        }}
      />

      <div class={`${width} relative`}>
        {centered ? (
          <div class="mx-auto max-w-4xl text-center">
            {data.eyebrow && (
              <p class="reveal-sub mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">{data.eyebrow}</p>
            )}
            {data.heading && (
              <h1 class="reveal-heading text-4xl font-extrabold tracking-[-0.04em] leading-[1.05] sm:text-5xl lg:text-6xl xl:text-7xl">
                {hasGradient ? renderHeading(data.heading, primaryColor) : data.heading}
              </h1>
            )}
            {data.subheading && (
              <p class="reveal-sub mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-gray-300/80 sm:text-xl" style={{ animationDelay: '0.3s' }}>
                {data.subheading}
              </p>
            )}
            {data.cta_text && (
              <div class="reveal-sub mt-12 flex flex-wrap items-center justify-center gap-5" style={{ animationDelay: '0.45s' }}>
                <a
                  href={urlFn(data.cta_url ?? '#')}
                  class="inline-block rounded-lg px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110 hover:no-underline"
                  style={{ backgroundColor: primaryColor }}
                >
                  {data.cta_text}
                </a>
                {data.cta_secondary_text && (
                  <a
                    href={urlFn(data.cta_secondary_url ?? '#')}
                    class="inline-block rounded-lg border border-white/20 px-8 py-4 text-sm font-semibold text-white/90 transition-all duration-300 hover:border-white/40 hover:text-white hover:no-underline"
                  >
                    {data.cta_secondary_text}
                  </a>
                )}
              </div>
            )}
          </div>
        ) : (
          <div class="grid items-center gap-16 lg:grid-cols-2">
            <div>
              {data.eyebrow && (
                <p class="reveal-sub mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">{data.eyebrow}</p>
              )}
              {data.heading && (
                <h1 class="reveal-heading text-4xl font-extrabold tracking-[-0.04em] leading-[1.05] sm:text-5xl lg:text-6xl">
                  {hasGradient ? renderHeading(data.heading, primaryColor) : data.heading}
                </h1>
              )}
              {data.subheading && (
                <p class="reveal-sub mt-8 max-w-xl text-lg leading-relaxed text-gray-300/80" style={{ animationDelay: '0.3s' }}>
                  {data.subheading}
                </p>
              )}
              {data.cta_text && (
                <div class="reveal-sub mt-12 flex flex-wrap gap-5" style={{ animationDelay: '0.45s' }}>
                  <a
                    href={urlFn(data.cta_url ?? '#')}
                    class="inline-block rounded-lg px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110 hover:no-underline"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {data.cta_text}
                  </a>
                  {data.cta_secondary_text && (
                    <a
                      href={urlFn(data.cta_secondary_url ?? '#')}
                      class="inline-block rounded-lg border border-white/20 px-8 py-4 text-sm font-semibold text-white/90 transition-all duration-300 hover:border-white/40 hover:text-white hover:no-underline"
                    >
                      {data.cta_secondary_text}
                    </a>
                  )}
                </div>
              )}
            </div>
            {data.image && (
              <div class="reveal-sub" style={{ animationDelay: '0.4s' }}>
                <img
                  src={data.image}
                  alt={data.image_alt ?? ''}
                  class="rounded-2xl shadow-2xl ring-1 ring-white/10"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decorative line at bottom */}
      <div class="glow-line absolute bottom-0 left-0 right-0" />
    </section>
  );
};

export default Hero;
