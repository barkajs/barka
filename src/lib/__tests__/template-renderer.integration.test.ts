import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createThemeResolver } from '../theme-loader.js';
import { renderSection } from '../template-renderer.js';
import type { Section } from '../types.js';

const ROOT = path.resolve(import.meta.dirname, '..', '..', '..');
const themesDir = path.join(ROOT, 'starters', 'lokatech', 'themes');

describe('template-renderer integration (SDC, lokatech theme)', () => {
  const resolver = createThemeResolver(themesDir, 'lokatech');
  const themeConfig = resolver.getConfig();
  const themeSettings: Record<string, any> = {
    primary_color: '#10B981',
    nav_color: '#0B1222',
  };

  it('renderSection() loads hero from components/hero/hero.tsx and returns HTML containing the heading', async () => {
    const section: Section = {
      type: 'hero',
      weight: 0,
      data: {
        heading: 'Integration Test Hero Title',
        alignment: 'center',
      },
      settings: {
        background: 'dark',
        spacing: 'large',
        width: 'contained',
      },
    };

    const html = await renderSection(
      section,
      resolver,
      themeConfig,
      themeSettings,
    );

    expect(html).toContain('Integration Test Hero Title');
    expect(html).toMatch(/<h1[^>]*>/);
  });

  it('renderSection() for unknown type returns HTML comment <!-- unknown section type: ... -->', async () => {
    const section: Section = {
      type: 'definitely-not-a-real-section-type-xyz',
      weight: 0,
      data: {},
      settings: {
        background: 'light',
        spacing: 'medium',
        width: 'contained',
      },
    };

    const html = await renderSection(
      section,
      resolver,
      themeConfig,
      themeSettings,
    );

    expect(html).toBe(
      '<!-- unknown section type: definitely-not-a-real-section-type-xyz -->',
    );
  });

  it('Section with hidden: true renders empty string', async () => {
    const section: Section = {
      type: 'hero',
      weight: 0,
      data: {
        heading: 'Should Not Appear',
      },
      settings: {
        background: 'dark',
        spacing: 'large',
        width: 'contained',
        hidden: true,
      },
    };

    const html = await renderSection(
      section,
      resolver,
      themeConfig,
      themeSettings,
    );

    expect(html).toBe('');
  });
});
