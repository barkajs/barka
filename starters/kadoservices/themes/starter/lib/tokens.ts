/**
 * CSS custom property references for the Starter (base) theme.
 *
 * Components use these instead of extracting raw hex values from themeSettings.
 * The actual values are injected via `_tokenCss` in the <head> from theme.yaml
 * design_tokens, so changing a value in theme.yaml propagates everywhere.
 */
export const token = {
  primary: 'var(--color-primary)',
  text: 'var(--color-text)',
  muted: 'var(--color-muted)',
  border: 'var(--color-border)',
  surface: 'var(--color-surface)',
  fontSans: 'var(--font-sans)',
} as const;

/**
 * Create a semi-transparent version of a CSS var token using color-mix.
 *
 * @param cssVar  A CSS var reference, e.g. token.primary
 * @param percent Opacity percentage (0–100)
 */
export function alpha(cssVar: string, percent: number): string {
  return `color-mix(in srgb, ${cssVar} ${percent}%, transparent)`;
}
