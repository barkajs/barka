/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';
import { token } from '../../lib/tokens.js';

const spacingMap: Record<string, string> = {
  none: 'py-0', small: 'py-12', medium: 'py-16', large: 'py-20', xlarge: 'py-28',
};

const TextWithImage: FC<SectionProps> = ({ data, settings, themeSettings }) => {
  const spacing = spacingMap[settings.spacing] ?? spacingMap.large;
  const urlFn = themeSettings._url ?? ((p: string) => p);
  const imgLeft = data.image_position === 'left';
  const bg = settings.background === 'light' ? { backgroundColor: 'white' } : { backgroundColor: token.cream };

  return (
    <section class={`${spacing} ${settings.css_class ?? ''}`} id={settings.anchor_id} style={bg}>
      <div class="mx-auto max-w-6xl px-6">
        <div class={`grid gap-12 items-center lg:grid-cols-2 ${imgLeft ? '' : ''}`}>
          <div class={imgLeft ? 'order-2' : 'order-1'}>
            {data.heading && <h2 class="text-3xl sm:text-4xl mb-4" style={{ fontFamily: token.fontHeading }}>{data.heading}</h2>}
            <p class="text-base leading-relaxed" style={{ color: token.muted }}>{data.body}</p>
            {data.cta_text && (
              <a href={urlFn(data.cta_url ?? '#')} class="mv-btn-primary mt-6 inline-block">
                {data.cta_text}
              </a>
            )}
          </div>
          <div class={imgLeft ? 'order-1' : 'order-2'}>
            <img
              src={data.image}
              alt={data.image_alt ?? ''}
              class="w-full rounded-2xl shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextWithImage;
