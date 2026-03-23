import { raw } from 'hono/html';
import { token } from './tokens.js';

/**
 * Render heading text with gradient-highlighted words.
 * Words wrapped in *asterisks* get a gradient text effect.
 *
 * Shared across all components that use gradient headings.
 */
export function renderGradient(text: string): any {
  const parts = text.split(/(\*[^*]+\*)/g);
  const html = parts
    .map((p) =>
      p.startsWith('*') && p.endsWith('*')
        ? `<em class="not-italic" style="background:linear-gradient(135deg,${token.primary},color-mix(in srgb,${token.primary} 60%,transparent),${token.accent});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${p.slice(1, -1)}</em>`
        : p,
    )
    .join('');
  return raw(html);
}
