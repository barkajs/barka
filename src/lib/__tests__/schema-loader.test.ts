import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createThemeResolver } from '../theme-loader.js';
import {
  loadSectionSchema,
  getDefaultSettings,
  clearSchemaCache,
} from '../schema-loader.js';

let tmpDir: string;
let configDir: string;
let themesDir: string;

beforeEach(() => {
  clearSchemaCache();
});

beforeAll(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'barka-schema-test-'));
  configDir = path.join(tmpDir, 'config');
  themesDir = path.join(tmpDir, 'themes');
  fs.mkdirSync(configDir, { recursive: true });

  fs.writeFileSync(
    path.join(configDir, 'section-types.yaml'),
    `hero:
  label: "Global Hero"
  fields:
    title:
      type: text
      label: "Title"
cta:
  label: "Global CTA"
  fields:
    text:
      type: text
      label: "Text"
gallery:
  label: "Global Gallery"
  fields:
    title:
      type: text
      label: "Gallery Title"
_defaults:
  settings:
    spacing:
      type: select
      label: "Spacing"
      options:
        - compact
        - relaxed
`,
  );

  const starter = path.join(themesDir, 'starter');
  fs.mkdirSync(path.join(starter, 'layouts'), { recursive: true });
  fs.writeFileSync(
    path.join(starter, 'theme.yaml'),
    'name: starter\nlabel: Starter\n',
  );
  fs.writeFileSync(path.join(starter, 'layouts', 'page.tsx'), 'export default () => null;');
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('loadSectionSchema', () => {
  it('loads from component schema.yaml when present (via ThemeResolver)', () => {
    const heroDir = path.join(themesDir, 'starter', 'components', 'hero');
    fs.mkdirSync(heroDir, { recursive: true });
    fs.writeFileSync(
      path.join(heroDir, 'schema.yaml'),
      `label: "Component Hero Schema"
fields:
  headline:
    type: text
    label: "Headline"
`,
    );

    const resolver = createThemeResolver(themesDir, 'starter');
    expect(resolver.resolveComponentSchema('hero')).toBe(path.join(heroDir, 'schema.yaml'));

    const schema = loadSectionSchema('hero', resolver, configDir);
    expect(schema).not.toBeNull();
    expect(schema!.label).toBe('Component Hero Schema');
    expect(schema!.fields.headline).toEqual({ type: 'text', label: 'Headline' });
  });

  it('falls back to config/section-types.yaml when no component schema', () => {
    const resolver = createThemeResolver(themesDir, 'starter');
    expect(resolver.resolveComponentSchema('gallery')).toBeNull();

    const schema = loadSectionSchema('gallery', resolver, configDir);
    expect(schema).not.toBeNull();
    expect(schema!.label).toBe('Global Gallery');
    expect(schema!.fields.title).toEqual({ type: 'text', label: 'Gallery Title' });
  });

  it('returns schema fields with label and field type/label structure', () => {
    const resolver = createThemeResolver(themesDir, 'starter');
    const schema = loadSectionSchema('gallery', resolver, configDir);
    expect(schema).not.toBeNull();
    expect(schema!.label).toBe('Global Gallery');
    expect(schema!.fields.title).toMatchObject({
      type: 'text',
      label: 'Gallery Title',
    });
  });

  it('returns null for unknown section type', () => {
    const resolver = createThemeResolver(themesDir, 'starter');
    expect(loadSectionSchema('not_a_real_section_xyz', resolver, configDir)).toBeNull();
  });
});

describe('getDefaultSettings', () => {
  it('returns _defaults.settings from global config', () => {
    const settings = getDefaultSettings(configDir);
    expect(settings.spacing).toEqual({
      type: 'select',
      label: 'Spacing',
      options: ['compact', 'relaxed'],
    });
  });
});

describe('clearSchemaCache', () => {
  let cacheTmp: string;
  let cacheConfigDir: string;
  let cacheThemesDir: string;

  beforeAll(() => {
    cacheTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'barka-schema-cache-test-'));
    cacheConfigDir = path.join(cacheTmp, 'config');
    cacheThemesDir = path.join(cacheTmp, 'themes');
    fs.mkdirSync(cacheConfigDir, { recursive: true });

    const starter = path.join(cacheThemesDir, 'starter');
    fs.mkdirSync(path.join(starter, 'layouts'), { recursive: true });
    fs.writeFileSync(path.join(starter, 'theme.yaml'), 'name: starter\nlabel: Starter\n');
    fs.writeFileSync(path.join(starter, 'layouts', 'page.tsx'), 'export default () => null;');
  });

  afterAll(() => {
    fs.rmSync(cacheTmp, { recursive: true, force: true });
  });

  it('forces re-read of section-types.yaml from disk', () => {
    clearSchemaCache();
    const yamlPath = path.join(cacheConfigDir, 'section-types.yaml');
    fs.writeFileSync(
      yamlPath,
      `widget:
  label: "Version A"
  fields: {}
`,
    );

    const resolver = createThemeResolver(cacheThemesDir, 'starter');
    expect(loadSectionSchema('widget', resolver, cacheConfigDir)?.label).toBe('Version A');

    fs.writeFileSync(
      yamlPath,
      `widget:
  label: "Version B"
  fields: {}
`,
    );
    expect(loadSectionSchema('widget', resolver, cacheConfigDir)?.label).toBe('Version A');

    clearSchemaCache();
    expect(loadSectionSchema('widget', resolver, cacheConfigDir)?.label).toBe('Version B');
  });
});
