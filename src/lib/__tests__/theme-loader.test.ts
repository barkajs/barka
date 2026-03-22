import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { loadThemeConfig, getAvailableThemes, createThemeResolver } from '../theme-loader.js';

let tmpDir: string;

beforeAll(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'barka-theme-test-'));

  // Create starter theme
  const starter = path.join(tmpDir, 'starter');
  fs.mkdirSync(path.join(starter, 'layouts'), { recursive: true });
  fs.mkdirSync(path.join(starter, 'components', 'hero'), { recursive: true });
  fs.mkdirSync(path.join(starter, 'components', 'cta'), { recursive: true });
  fs.mkdirSync(path.join(starter, 'partials'), { recursive: true });
  fs.mkdirSync(path.join(starter, 'static'), { recursive: true });

  fs.writeFileSync(
    path.join(starter, 'theme.yaml'),
    `name: starter\nlabel: "Starter Theme"\ndescription: "Default theme"\nversion: "1.0.0"\nsettings:\n  primary_color:\n    type: color\n    label: "Primary Color"\n    default: "#2563eb"\n`,
  );
  fs.writeFileSync(path.join(starter, 'layouts', 'page.tsx'), 'export default () => null;');
  fs.writeFileSync(path.join(starter, 'layouts', 'article.tsx'), 'export default () => null;');
  fs.writeFileSync(path.join(starter, 'components', 'hero', 'hero.tsx'), 'export default () => null;');
  fs.writeFileSync(path.join(starter, 'components', 'cta', 'cta.tsx'), 'export default () => null;');
  fs.writeFileSync(path.join(starter, 'partials', 'header.tsx'), 'export default () => null;');
  fs.writeFileSync(path.join(starter, 'static', 'style.css'), 'body {}');

  // Create a child theme that inherits from starter
  const child = path.join(tmpDir, 'corporate');
  fs.mkdirSync(path.join(child, 'layouts'), { recursive: true });
  fs.mkdirSync(path.join(child, 'components', 'hero'), { recursive: true });
  fs.mkdirSync(path.join(child, 'partials'), { recursive: true });
  fs.mkdirSync(path.join(child, 'static'), { recursive: true });

  fs.writeFileSync(
    path.join(child, 'theme.yaml'),
    `name: corporate\nlabel: "Corporate Theme"\ndescription: "For business sites"\nbase: starter\nversion: "1.0.0"\nauthor: "Barka Team"\n`,
  );
  // corporate overrides page layout but NOT article
  fs.writeFileSync(path.join(child, 'layouts', 'page.tsx'), 'export default () => null;');
  // corporate has its own hero section
  fs.writeFileSync(path.join(child, 'components', 'hero', 'hero.tsx'), 'export default () => null;');
  // corporate has a custom static file
  fs.writeFileSync(path.join(child, 'static', 'logo.svg'), '<svg></svg>');
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('loadThemeConfig', () => {
  it('reads theme.yaml correctly', () => {
    const config = loadThemeConfig(path.join(tmpDir, 'starter'));
    expect(config.name).toBe('starter');
    expect(config.label).toBe('Starter Theme');
    expect(config.description).toBe('Default theme');
    expect(config.version).toBe('1.0.0');
    expect(config.settings).toBeDefined();
    expect(config.settings!.primary_color).toEqual({
      type: 'color',
      label: 'Primary Color',
      default: '#2563eb',
    });
  });

  it('reads child theme with base field', () => {
    const config = loadThemeConfig(path.join(tmpDir, 'corporate'));
    expect(config.name).toBe('corporate');
    expect(config.base).toBe('starter');
    expect(config.author).toBe('Barka Team');
  });

  it('throws if theme.yaml is missing', () => {
    expect(() => loadThemeConfig(path.join(tmpDir, 'nonexistent'))).toThrow(
      'theme.yaml not found',
    );
  });
});

describe('getAvailableThemes', () => {
  it('finds all themes in directory', () => {
    const themes = getAvailableThemes(tmpDir);
    const names = themes.map((t) => t.name).sort();
    expect(names).toEqual(['corporate', 'starter']);
  });

  it('returns empty array for nonexistent directory', () => {
    expect(getAvailableThemes('/nonexistent/path')).toEqual([]);
  });
});

describe('createThemeResolver', () => {
  describe('with starter theme active', () => {
    it('resolves layout by content type', () => {
      const resolver = createThemeResolver(tmpDir, 'starter');
      const result = resolver.resolveLayout('page');
      expect(result).toBe(path.join(tmpDir, 'starter', 'layouts', 'page.tsx'));
    });

    it('resolves article layout', () => {
      const resolver = createThemeResolver(tmpDir, 'starter');
      const result = resolver.resolveLayout('article');
      expect(result).toBe(path.join(tmpDir, 'starter', 'layouts', 'article.tsx'));
    });

    it('falls back to page.tsx for unknown content type', () => {
      const resolver = createThemeResolver(tmpDir, 'starter');
      const result = resolver.resolveLayout('unknown-type');
      expect(result).toBe(path.join(tmpDir, 'starter', 'layouts', 'page.tsx'));
    });

    it('resolves sections', () => {
      const resolver = createThemeResolver(tmpDir, 'starter');
      expect(resolver.resolveSection('hero')).toBe(
        path.join(tmpDir, 'starter', 'components', 'hero', 'hero.tsx'),
      );
      expect(resolver.resolveSection('cta')).toBe(
        path.join(tmpDir, 'starter', 'components', 'cta', 'cta.tsx'),
      );
    });

    it('returns null for unknown section', () => {
      const resolver = createThemeResolver(tmpDir, 'starter');
      expect(resolver.resolveSection('nonexistent')).toBeNull();
    });

    it('resolves partials', () => {
      const resolver = createThemeResolver(tmpDir, 'starter');
      expect(resolver.resolvePartial('header')).toBe(
        path.join(tmpDir, 'starter', 'partials', 'header.tsx'),
      );
    });

    it('resolves static files', () => {
      const resolver = createThemeResolver(tmpDir, 'starter');
      expect(resolver.resolveStatic('style.css')).toBe(
        path.join(tmpDir, 'starter', 'static', 'style.css'),
      );
    });

    it('returns config and available themes', () => {
      const resolver = createThemeResolver(tmpDir, 'starter');
      expect(resolver.getConfig().name).toBe('starter');
      expect(resolver.getAvailableThemes().length).toBe(2);
    });
  });

  describe('with child theme (corporate) active', () => {
    it('resolves overridden layout from child theme', () => {
      const resolver = createThemeResolver(tmpDir, 'corporate');
      const result = resolver.resolveLayout('page');
      expect(result).toBe(path.join(tmpDir, 'corporate', 'layouts', 'page.tsx'));
    });

    it('falls back to base theme for non-overridden layout', () => {
      const resolver = createThemeResolver(tmpDir, 'corporate');
      const result = resolver.resolveLayout('article');
      expect(result).toBe(path.join(tmpDir, 'starter', 'layouts', 'article.tsx'));
    });

    it('resolves overridden section from child theme', () => {
      const resolver = createThemeResolver(tmpDir, 'corporate');
      expect(resolver.resolveSection('hero')).toBe(
        path.join(tmpDir, 'corporate', 'components', 'hero', 'hero.tsx'),
      );
    });

    it('falls back to starter for non-overridden section', () => {
      const resolver = createThemeResolver(tmpDir, 'corporate');
      expect(resolver.resolveSection('cta')).toBe(
        path.join(tmpDir, 'starter', 'components', 'cta', 'cta.tsx'),
      );
    });

    it('falls back to starter for non-overridden partial', () => {
      const resolver = createThemeResolver(tmpDir, 'corporate');
      expect(resolver.resolvePartial('header')).toBe(
        path.join(tmpDir, 'starter', 'partials', 'header.tsx'),
      );
    });

    it('resolves child-specific static file', () => {
      const resolver = createThemeResolver(tmpDir, 'corporate');
      expect(resolver.resolveStatic('logo.svg')).toBe(
        path.join(tmpDir, 'corporate', 'static', 'logo.svg'),
      );
    });

    it('falls back to starter for non-overridden static file', () => {
      const resolver = createThemeResolver(tmpDir, 'corporate');
      expect(resolver.resolveStatic('style.css')).toBe(
        path.join(tmpDir, 'starter', 'static', 'style.css'),
      );
    });
  });

  describe('layout resolution with slug', () => {
    it('resolves slug-specific layout when file exists', () => {
      const specificFile = path.join(tmpDir, 'starter', 'layouts', 'page--about.tsx');
      fs.writeFileSync(specificFile, 'export default () => null;');

      const resolver = createThemeResolver(tmpDir, 'starter');
      const result = resolver.resolveLayout('page', 'about');
      expect(result).toBe(specificFile);

      fs.unlinkSync(specificFile);
    });

    it('falls back to content type when slug-specific file missing', () => {
      const resolver = createThemeResolver(tmpDir, 'starter');
      const result = resolver.resolveLayout('page', 'nonexistent-slug');
      expect(result).toBe(path.join(tmpDir, 'starter', 'layouts', 'page.tsx'));
    });
  });
});
