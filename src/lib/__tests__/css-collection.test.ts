import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createThemeResolver } from '../theme-loader.js';

let tmpDir: string;

beforeAll(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'barka-css-collection-test-'));

  const starter = path.join(tmpDir, 'starter');
  fs.mkdirSync(path.join(starter, 'layouts'), { recursive: true });
  fs.writeFileSync(
    path.join(starter, 'theme.yaml'),
    'name: starter\nlabel: Starter\n',
  );
  fs.writeFileSync(path.join(starter, 'layouts', 'page.tsx'), 'export default () => null;');

  fs.mkdirSync(path.join(starter, 'components', 'hero'), { recursive: true });
  fs.writeFileSync(path.join(starter, 'components', 'hero', 'hero.tsx'), 'export default () => null;');
  fs.writeFileSync(path.join(starter, 'components', 'hero', 'hero.css'), '.hero {}');

  fs.mkdirSync(path.join(starter, 'components', 'cta'), { recursive: true });
  fs.writeFileSync(path.join(starter, 'components', 'cta', 'cta.tsx'), 'export default () => null;');

  fs.mkdirSync(path.join(starter, 'components', 'features'), { recursive: true });
  fs.writeFileSync(
    path.join(starter, 'components', 'features', 'features.tsx'),
    'export default () => null;',
  );

  fs.mkdirSync(path.join(starter, 'components', 'text'), { recursive: true });
  fs.writeFileSync(path.join(starter, 'components', 'text', 'text.tsx'), 'export default () => null;');
  fs.writeFileSync(path.join(starter, 'components', 'text', 'text.css'), '.text {}');

  const corporate = path.join(tmpDir, 'corporate');
  fs.mkdirSync(path.join(corporate, 'layouts'), { recursive: true });
  fs.writeFileSync(
    path.join(corporate, 'theme.yaml'),
    'name: corporate\nlabel: Corporate\nbase: starter\n',
  );
  fs.writeFileSync(path.join(corporate, 'layouts', 'page.tsx'), 'export default () => null;');
  fs.mkdirSync(path.join(corporate, 'components', 'hero'), { recursive: true });
  fs.writeFileSync(path.join(corporate, 'components', 'hero', 'hero.tsx'), 'export default () => null;');
  fs.writeFileSync(
    path.join(corporate, 'components', 'hero', 'hero.css'),
    '.hero { color: red; }',
  );
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('ThemeResolver.collectComponentCss', () => {
  it('returns CSS file paths for components that have a matching .css file', () => {
    const resolver = createThemeResolver(tmpDir, 'starter');
    const paths = resolver.collectComponentCss();
    const heroCss = path.join(tmpDir, 'starter', 'components', 'hero', 'hero.css');
    const textCss = path.join(tmpDir, 'starter', 'components', 'text', 'text.css');
    expect(paths).toContain(heroCss);
    expect(paths).toContain(textCss);
  });

  it('does not include components that have no .css file', () => {
    const resolver = createThemeResolver(tmpDir, 'starter');
    const paths = resolver.collectComponentCss();
    const ctaCss = path.join(tmpDir, 'starter', 'components', 'cta', 'cta.css');
    const featuresCss = path.join(tmpDir, 'starter', 'components', 'features', 'features.css');
    expect(paths).not.toContain(ctaCss);
    expect(paths).not.toContain(featuresCss);
  });

  it('does not duplicate paths when child theme overrides parent component CSS', () => {
    const resolver = createThemeResolver(tmpDir, 'corporate');
    const paths = resolver.collectComponentCss();
    const childHero = path.join(tmpDir, 'corporate', 'components', 'hero', 'hero.css');
    const parentHero = path.join(tmpDir, 'starter', 'components', 'hero', 'hero.css');
    expect(paths.filter((p) => p === childHero)).toEqual([childHero]);
    expect(paths).not.toContain(parentHero);
  });

  it('returns an empty array when no theme in the chain provides component .css files', () => {
    const onlyBareRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'barka-bare-only-'));
    try {
      const bare = path.join(onlyBareRoot, 'bare');
      fs.mkdirSync(path.join(bare, 'layouts'), { recursive: true });
      fs.writeFileSync(path.join(bare, 'theme.yaml'), 'name: bare\nlabel: Bare\n');
      fs.writeFileSync(path.join(bare, 'layouts', 'page.tsx'), 'export default () => null;');

      const resolver = createThemeResolver(onlyBareRoot, 'bare');
      expect(resolver.collectComponentCss()).toEqual([]);
    } finally {
      fs.rmSync(onlyBareRoot, { recursive: true, force: true });
    }
  });
});

describe('ThemeResolver.resolveComponentSchema', () => {
  it('returns schema path from the active theme when present', () => {
    const heroSchema = path.join(tmpDir, 'starter', 'components', 'hero', 'schema.yaml');
    fs.writeFileSync(heroSchema, 'label: Hero\nfields: {}\n');

    const resolver = createThemeResolver(tmpDir, 'starter');
    expect(resolver.resolveComponentSchema('hero')).toBe(heroSchema);

    fs.unlinkSync(heroSchema);
  });

  it('falls back to base theme when the active theme has no schema', () => {
    const baseSchema = path.join(tmpDir, 'starter', 'components', 'cta', 'schema.yaml');
    fs.writeFileSync(baseSchema, 'label: CTA\nfields: {}\n');

    const resolver = createThemeResolver(tmpDir, 'corporate');
    expect(resolver.resolveComponentSchema('cta')).toBe(baseSchema);

    fs.unlinkSync(baseSchema);
  });

  it('returns null for a nonexistent component type', () => {
    const resolver = createThemeResolver(tmpDir, 'starter');
    expect(resolver.resolveComponentSchema('nonexistent')).toBeNull();
  });
});
