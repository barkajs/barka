import { describe, it, expect } from 'vitest';
import { generateTokenCss } from '../design-tokens.js';
import type { ThemeConfig } from '../theme-types.js';

function makeConfig(overrides: Partial<ThemeConfig> = {}): ThemeConfig {
  return {
    name: 'test',
    label: 'Test Theme',
    ...overrides,
  };
}

describe('generateTokenCss', () => {
  it('returns empty string when design_tokens is absent', () => {
    const config = makeConfig();
    expect(generateTokenCss(config, {})).toBe('');
  });

  it('generates color CSS vars', () => {
    const config = makeConfig({
      design_tokens: {
        colors: {
          primary: '#10B981',
          navy: '#0B1222',
          primary_dark: '#059669',
        },
      },
    });
    const css = generateTokenCss(config, {});
    expect(css).toContain('--color-primary: #10B981;');
    expect(css).toContain('--color-navy: #0B1222;');
    expect(css).toContain('--color-primary-dark: #059669;');
    expect(css).toContain(':root {');
  });

  it('generates font CSS vars', () => {
    const config = makeConfig({
      design_tokens: {
        fonts: {
          sans: "'Inter', sans-serif",
          heading: "'DM Sans', sans-serif",
        },
      },
    });
    const css = generateTokenCss(config, {});
    expect(css).toContain("--font-sans: 'Inter', sans-serif;");
    expect(css).toContain("--font-heading: 'DM Sans', sans-serif;");
  });

  it('generates transition CSS vars', () => {
    const config = makeConfig({
      design_tokens: {
        transitions: {
          base: '0.3s ease',
          slow: '0.5s ease',
        },
      },
    });
    const css = generateTokenCss(config, {});
    expect(css).toContain('--transition-base: 0.3s ease;');
    expect(css).toContain('--transition-slow: 0.5s ease;');
  });

  it('generates @import rules from font_imports', () => {
    const config = makeConfig({
      design_tokens: {
        font_imports: [
          'https://fonts.googleapis.com/css2?family=Inter',
          'https://fonts.googleapis.com/css2?family=DM+Sans',
        ],
      },
    });
    const css = generateTokenCss(config, {});
    expect(css).toContain("@import url('https://fonts.googleapis.com/css2?family=Inter');");
    expect(css).toContain("@import url('https://fonts.googleapis.com/css2?family=DM+Sans');");
  });

  it('resolves {{setting_name}} references from themeSettings', () => {
    const config = makeConfig({
      design_tokens: {
        colors: {
          primary: '{{primary_color}}',
          navy: '{{nav_color}}',
        },
      },
    });
    const css = generateTokenCss(config, {
      primary_color: '#FF0000',
      nav_color: '#000000',
    });
    expect(css).toContain('--color-primary: #FF0000;');
    expect(css).toContain('--color-navy: #000000;');
  });

  it('keeps unresolved refs as-is when setting is missing', () => {
    const config = makeConfig({
      design_tokens: {
        colors: {
          primary: '{{missing_setting}}',
        },
      },
    });
    const css = generateTokenCss(config, {});
    expect(css).toContain('--color-primary: {{missing_setting}};');
  });

  it('converts underscores to hyphens in CSS var names', () => {
    const config = makeConfig({
      design_tokens: {
        colors: {
          primary_light: '#D1FAE5',
          text_light: '#F8FAFC',
        },
      },
    });
    const css = generateTokenCss(config, {});
    expect(css).toContain('--color-primary-light: #D1FAE5;');
    expect(css).toContain('--color-text-light: #F8FAFC;');
  });

  it('combines all token types in correct order', () => {
    const config = makeConfig({
      design_tokens: {
        colors: { primary: '#10B981' },
        fonts: { sans: "'Inter', sans-serif" },
        font_imports: ['https://fonts.example.com/inter'],
        transitions: { base: '0.3s ease' },
      },
    });
    const css = generateTokenCss(config, {});
    // @import should come before :root
    const importIdx = css.indexOf('@import');
    const rootIdx = css.indexOf(':root');
    expect(importIdx).toBeLessThan(rootIdx);
    // All three categories should be in :root
    expect(css).toContain('--color-primary');
    expect(css).toContain('--font-sans');
    expect(css).toContain('--transition-base');
  });
});
