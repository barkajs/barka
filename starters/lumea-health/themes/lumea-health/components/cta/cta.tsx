/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';
import { token, alpha } from '../../lib/tokens.js';

const spacingMap: Record<string, string> = {
  none: 'py-0', small: 'py-12', medium: 'py-16', large: 'py-20', xlarge: 'py-28',
};

const CTA: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const urlFn = themeSettings._url ?? ((p: string) => p);
  const isDark = settings.background === 'dark';
  const bg = isDark ? { backgroundColor: token.navy } : { backgroundColor: token.primary };

  return (
    <section class={`${spacing} relative overflow-hidden ${settings.css_class ?? ''}`} id={settings.anchor_id} style={bg}>
      <div class="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full" style={{ background: alpha(token.textLight, 6) }} />
      <div class="mx-auto max-w-3xl px-6 text-center relative">
        {data.eyebrow && (
          <p class="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: token.accent }}>{data.eyebrow}</p>
        )}
        <h2 class="text-3xl sm:text-4xl text-white mb-4" style={{ fontFamily: token.fontHeading }}>{data.heading}</h2>
        {(data.description || data.body) && (
          <p class="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.75)' }}>{data.description ?? data.body}</p>
        )}
        <div class="flex flex-wrap items-center justify-center gap-4">
          {data.button_text && (
            <a href={urlFn(data.button_url ?? '#')} class="mv-btn-accent text-base px-8 py-4">
              {data.button_text}
            </a>
          )}
          {data.secondary_text && (
            <a href={urlFn(data.secondary_url ?? '#')} class="inline-block rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white hover:border-white/60 hover:no-underline">
              {data.secondary_text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTA;
