import type { ThemeConfig } from './theme-types.js';

/**
 * Resolve `{{setting_name}}` placeholders against themeSettings values.
 */
function resolveRefs(value: string, settings: Record<string, any>): string {
  return value.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
    const resolved = settings[key];
    return typeof resolved === 'string' ? resolved : `{{${key}}}`;
  });
}

/**
 * Generate a CSS string from theme design_tokens.
 *
 * Produces `@import` rules for font_imports and a `:root` block
 * mapping tokens to CSS custom properties:
 *   - design_tokens.colors.*       → --color-*
 *   - design_tokens.fonts.*        → --font-*
 *   - design_tokens.transitions.*  → --transition-*
 *
 * If design_tokens is absent, returns an empty string (backward-compatible).
 */
export function generateTokenCss(
  themeConfig: ThemeConfig,
  themeSettings: Record<string, any>,
): string {
  const tokens = themeConfig.design_tokens;
  if (!tokens) return '';

  const lines: string[] = [];

  // @import rules for web fonts
  if (tokens.font_imports) {
    for (const url of tokens.font_imports) {
      lines.push(`@import url('${url}');`);
    }
  }

  // Map-driven: adding a new token category only requires a new entry here
  const categoryPrefix: Record<string, string> = {
    colors: 'color',
    fonts: 'font',
    transitions: 'transition',
  };

  const vars: string[] = [];

  for (const [category, prefix] of Object.entries(categoryPrefix)) {
    const group = tokens[category as keyof typeof tokens];
    if (group && typeof group === 'object' && !Array.isArray(group)) {
      for (const [key, value] of Object.entries(group as Record<string, string>)) {
        const cssKey = `--${prefix}-${key.replace(/_/g, '-')}`;
        vars.push(`  ${cssKey}: ${resolveRefs(value, themeSettings)};`);
      }
    }
  }

  if (vars.length > 0) {
    lines.push(`:root {\n${vars.join('\n')}\n}`);
  }

  return lines.join('\n');
}
