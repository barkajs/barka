export const token = {
  primary: 'var(--color-primary)',
  primaryDark: 'var(--color-primary-dark)',
  primaryLight: 'var(--color-primary-light)',
  accent: 'var(--color-accent)',
  accentLight: 'var(--color-accent-light)',
  cream: 'var(--color-cream)',
  text: 'var(--color-text)',
  textLight: 'var(--color-text-light)',
  muted: 'var(--color-muted)',
  border: 'var(--color-border)',
  surface: 'var(--color-surface)',
  navy: 'var(--color-navy)',
  navyLight: 'var(--color-navy-light)',
  fontHeading: 'var(--font-heading)',
  fontSans: 'var(--font-sans)',
} as const;

export function alpha(cssVar: string, percent: number): string {
  return `color-mix(in srgb, ${cssVar} ${percent}%, transparent)`;
}
