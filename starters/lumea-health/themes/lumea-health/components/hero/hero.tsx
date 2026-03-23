/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';
import { token, alpha } from '../../lib/tokens.js';

const spacingMap: Record<string, string> = {
  none: 'py-0', small: 'py-12', medium: 'py-20', large: 'py-28', xlarge: 'py-36',
};

const Hero: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  const spacing = spacingMap[settings.spacing] ?? spacingMap.xlarge;
  const showSearch = data.show_search !== false;
  const urlFn = themeSettings._url ?? ((p: string) => p);

  return (
    <section
      class={`${spacing} relative overflow-hidden ${settings.css_class ?? ''}`}
      id={settings.anchor_id}
      style={{ backgroundColor: token.primary }}
    >
      {/* Decorative circles */}
      <div class="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full" style={{ background: alpha(token.textLight, 5) }} />
      <div class="pointer-events-none absolute -bottom-16 -left-16 w-60 h-60 rounded-full" style={{ background: alpha(token.textLight, 4) }} />

      <div class="relative mx-auto max-w-4xl px-6 text-center">
        {data.heading && (
          <h1 class="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight" style={{ fontFamily: token.fontHeading }}>
            {data.heading}
          </h1>
        )}
        {data.subheading && (
          <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: alpha(token.textLight, 80) }}>
            {data.subheading}
          </p>
        )}

        {/* Decorative search bar */}
        {showSearch && (
          <div class="mx-auto mt-10" style={{ background: 'white', borderRadius: '16px', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxWidth: '600px' }}>
            <svg class="h-5 w-5 shrink-0" style={{ color: token.muted }} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search doctors, specialties, or symptoms..." disabled style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', background: 'transparent', color: token.text }} />
            <button class="rounded-xl px-5 py-2.5 text-sm font-semibold" style={{ backgroundColor: token.accent, color: 'white' }}>
              Find a Doctor
            </button>
          </div>
        )}

        {data.cta_text && (
          <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href={urlFn(data.cta_url ?? '#')} class="mv-btn-accent text-base px-8 py-4">
              {data.cta_text}
            </a>
            {data.cta_secondary_text && (
              <a
                href={urlFn(data.cta_secondary_url ?? '#')}
                class="inline-block rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/60 hover:no-underline"
              >
                {data.cta_secondary_text}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
