/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { SectionProps } from '../../_types.js';

const spacingMap: Record<string, string> = {
  none: 'py-0', small: 'py-8', medium: 'py-16', large: 'py-24', xlarge: 'py-32',
};
const widthMap: Record<string, string> = {
  contained: 'max-w-3xl mx-auto px-6', wide: 'max-w-5xl mx-auto px-6', full: 'w-full px-6',
};

const Text: FC<SectionProps> = ({ data, settings }) => {
  if (settings.hidden) return null;
  const spacing = spacingMap[settings.spacing] ?? spacingMap.medium;
  const width = widthMap[settings.width] ?? widthMap.contained;

  // Convert markdown-like bold **text** to <strong>
  const processBody = (body: string) => {
    return body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  return (
    <section class={`${spacing} ${settings.css_class ?? ''}`} id={settings.anchor_id}>
      <div class={width}>
        {data.heading && (
          <h2 class="mb-6 text-2xl font-bold sm:text-3xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            {data.heading}
          </h2>
        )}
        {data.body && (
          <div
            class="prose prose-lg leading-relaxed"
            style={{ color: 'var(--color-text)' }}
            dangerouslySetInnerHTML={{
              __html: processBody(data.body)
                .split('\n\n')
                .map(p => `<p style="margin-bottom: 1rem; line-height: 1.75;">${p.trim()}</p>`)
                .join(''),
            }}
          />
        )}
      </div>
    </section>
  );
};

export default Text;
