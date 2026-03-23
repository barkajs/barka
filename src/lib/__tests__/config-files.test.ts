import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { loadSiteConfig, loadContentTypes, loadSectionTypes } from '../config-files.js';

const FIXTURES_DIR = path.join(os.tmpdir(), 'barka-test-config-' + Date.now());

function fixture(relativePath: string, content: string) {
  const full = path.join(FIXTURES_DIR, relativePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf-8');
  return full;
}

beforeEach(() => {
  fs.rmSync(FIXTURES_DIR, { recursive: true, force: true });
  fs.mkdirSync(FIXTURES_DIR, { recursive: true });
});

describe('loadSiteConfig', () => {
  it('returns defaults when no file exists', () => {
    const config = loadSiteConfig(path.join(FIXTURES_DIR, 'nonexistent'));

    expect(config.site_name).toBe('Barka Site');
    expect(config.base_url).toBe('http://localhost:3000');
    expect(config.theme).toBe('base');
  });

  it('loads and merges with defaults', () => {
    fixture('settings.yaml', [
      'site_name: "Test Site"',
      'base_url: "https://example.com"',
      'theme: custom-theme',
      'seo:',
      '  title_separator: " — "',
    ].join('\n'));

    const config = loadSiteConfig(FIXTURES_DIR);

    expect(config.site_name).toBe('Test Site');
    expect(config.base_url).toBe('https://example.com');
    expect(config.theme).toBe('custom-theme');
    expect(config.seo?.title_separator).toBe(' — ');
  });
});

describe('loadContentTypes', () => {
  it('returns empty array when no file exists', () => {
    const types = loadContentTypes(path.join(FIXTURES_DIR, 'nonexistent'));
    expect(types).toEqual([]);
  });

  it('parses YAML content types correctly', () => {
    fixture('content-types.yaml', [
      'article:',
      '  label: Article',
      '  path_pattern: "/articles/{slug}"',
      '  fields:',
      '    summary:',
      '      type: textarea',
      '      label: Summary',
      '      required: true',
      '    category:',
      '      type: select',
      '      label: Category',
      '      options:',
      '        - tech',
      '        - design',
      'page:',
      '  label: Page',
      '  fields:',
      '    subtitle:',
      '      type: text',
      '      label: Subtitle',
    ].join('\n'));

    const types = loadContentTypes(FIXTURES_DIR);

    expect(types).toHaveLength(2);

    const article = types.find((t) => t.name === 'article');
    expect(article).toBeDefined();
    expect(article!.label).toBe('Article');
    expect(article!.path_pattern).toBe('/articles/{slug}');
    expect(article!.fields.summary.type).toBe('textarea');
    expect(article!.fields.summary.required).toBe(true);
    expect(article!.fields.category.options).toEqual(['tech', 'design']);

    const page = types.find((t) => t.name === 'page');
    expect(page).toBeDefined();
    expect(page!.label).toBe('Page');
    expect(page!.fields.subtitle.type).toBe('text');
  });
});

describe('loadSectionTypes', () => {
  it('returns defaults when no file exists', () => {
    const { defaults, types } = loadSectionTypes(path.join(FIXTURES_DIR, 'nonexistent'));

    expect(types).toEqual([]);
    expect(defaults.settings.background).toBeDefined();
    expect(defaults.settings.spacing).toBeDefined();
    expect(defaults.settings.width).toBeDefined();
  });

  it('separates _defaults from section type definitions', () => {
    fixture('section-types.yaml', [
      '_defaults:',
      '  settings:',
      '    background:',
      '      type: select',
      '      label: Background',
      '      default: light',
      '    custom_setting:',
      '      type: text',
      '      label: Custom',
      'hero:',
      '  label: Hero Section',
      '  icon: star',
      '  fields:',
      '    heading:',
      '      type: text',
      '      label: Heading',
      '      required: true',
      'cta:',
      '  label: Call to Action',
      '  fields:',
      '    button_text:',
      '      type: text',
      '      label: Button Text',
    ].join('\n'));

    const { defaults, types } = loadSectionTypes(FIXTURES_DIR);

    expect(defaults.settings.custom_setting).toBeDefined();
    expect(defaults.settings.custom_setting.label).toBe('Custom');
    expect(defaults.settings.background).toBeDefined();
    expect(defaults.settings.spacing).toBeDefined();

    expect(types).toHaveLength(2);

    const hero = types.find((t) => t.name === 'hero');
    expect(hero).toBeDefined();
    expect(hero!.label).toBe('Hero Section');
    expect(hero!.icon).toBe('star');
    expect(hero!.fields.heading.required).toBe(true);

    const cta = types.find((t) => t.name === 'cta');
    expect(cta).toBeDefined();
    expect(cta!.label).toBe('Call to Action');
  });
});
