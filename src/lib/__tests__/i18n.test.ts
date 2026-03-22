import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  loadLanguages,
  langFromFilename,
  baseSlugFromFilename,
  negotiateLanguage,
  findTranslations,
  generateHreflangTags,
} from '../i18n.js';

const TMP_DIR = path.join(os.tmpdir(), 'barka-i18n-test-' + Date.now());

function writeFile(relativePath: string, content: string): string {
  const full = path.join(TMP_DIR, relativePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf-8');
  return full;
}

beforeEach(() => {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
  fs.mkdirSync(TMP_DIR, { recursive: true });
});

afterEach(() => {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// loadLanguages
// ---------------------------------------------------------------------------

describe('loadLanguages', () => {
  it('returns correct config from a YAML file', () => {
    const configDir = path.join(TMP_DIR, 'config');
    writeFile('config/languages.yaml', [
      'default: en',
      '',
      'languages:',
      '  en:',
      '    label: "English"',
      '    direction: ltr',
      '  pl:',
      '    label: "Polski"',
      '    direction: ltr',
      '  ar:',
      '    label: "العربية"',
      '    direction: rtl',
    ].join('\n'));

    const config = loadLanguages(configDir);

    expect(config.default).toBe('en');
    expect(Object.keys(config.languages)).toHaveLength(3);
    expect(config.languages.en.label).toBe('English');
    expect(config.languages.en.direction).toBe('ltr');
    expect(config.languages.pl.label).toBe('Polski');
    expect(config.languages.ar.label).toBe('العربية');
    expect(config.languages.ar.direction).toBe('rtl');
  });

  it('returns default config when file does not exist', () => {
    const config = loadLanguages(path.join(TMP_DIR, 'nonexistent'));

    expect(config.default).toBe('en');
    expect(config.languages.en).toBeDefined();
    expect(config.languages.en.label).toBe('English');
  });
});

// ---------------------------------------------------------------------------
// langFromFilename
// ---------------------------------------------------------------------------

describe('langFromFilename', () => {
  it('detects language from filename suffix', () => {
    expect(langFromFilename('welcome.pl.md')).toBe('pl');
    expect(langFromFilename('welcome.de.md')).toBe('de');
    expect(langFromFilename('welcome.fr.md')).toBe('fr');
    expect(langFromFilename('about.ar.yaml')).toBe('ar');
  });

  it('returns undefined for default language files', () => {
    expect(langFromFilename('welcome.md')).toBeUndefined();
    expect(langFromFilename('about.yaml')).toBeUndefined();
  });

  it('returns undefined when middle part is not a lang code', () => {
    expect(langFromFilename('my-great-post.md')).toBeUndefined();
    expect(langFromFilename('file.config.md')).toBeUndefined();
  });

  it('handles full file paths', () => {
    expect(langFromFilename('/content/articles/welcome.pl.md')).toBe('pl');
    expect(langFromFilename('/content/articles/welcome.md')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// baseSlugFromFilename
// ---------------------------------------------------------------------------

describe('baseSlugFromFilename', () => {
  it('strips language suffix from filename', () => {
    expect(baseSlugFromFilename('welcome.pl.md')).toBe('welcome');
    expect(baseSlugFromFilename('welcome.de.md')).toBe('welcome');
    expect(baseSlugFromFilename('getting-started.fr.md')).toBe('getting-started');
  });

  it('returns full slug for default language files', () => {
    expect(baseSlugFromFilename('welcome.md')).toBe('welcome');
    expect(baseSlugFromFilename('getting-started.md')).toBe('getting-started');
  });

  it('handles filenames without recognized lang codes', () => {
    expect(baseSlugFromFilename('my-great-post.md')).toBe('my-great-post');
  });

  it('handles full paths by extracting basename', () => {
    expect(baseSlugFromFilename('/content/articles/welcome.pl.md')).toBe('welcome');
  });
});

// ---------------------------------------------------------------------------
// negotiateLanguage
// ---------------------------------------------------------------------------

describe('negotiateLanguage', () => {
  const available = ['en', 'pl', 'de'];

  it('URL prefix takes highest priority', () => {
    const result = negotiateLanguage(
      'de,en;q=0.9',
      'pl',
      'en',
      available,
      'en',
    );
    expect(result).toBe('pl');
  });

  it('cookie takes priority over Accept-Language', () => {
    const result = negotiateLanguage(
      'de,en;q=0.9',
      undefined,
      'pl',
      available,
      'en',
    );
    expect(result).toBe('pl');
  });

  it('parses Accept-Language header by quality', () => {
    const result = negotiateLanguage(
      'fr;q=0.9, de;q=0.8, en;q=0.7',
      undefined,
      undefined,
      available,
      'en',
    );
    expect(result).toBe('de');
  });

  it('matches Accept-Language prefix (e.g. pl-PL → pl)', () => {
    const result = negotiateLanguage(
      'pl-PL,pl;q=0.9',
      undefined,
      undefined,
      available,
      'en',
    );
    expect(result).toBe('pl');
  });

  it('falls back to default language', () => {
    const result = negotiateLanguage(
      'ja,zh;q=0.9',
      undefined,
      undefined,
      available,
      'en',
    );
    expect(result).toBe('en');
  });

  it('falls back when everything is undefined', () => {
    const result = negotiateLanguage(
      undefined,
      undefined,
      undefined,
      available,
      'en',
    );
    expect(result).toBe('en');
  });

  it('ignores URL prefix not in available list', () => {
    const result = negotiateLanguage(
      undefined,
      'ja',
      'pl',
      available,
      'en',
    );
    expect(result).toBe('pl');
  });
});

// ---------------------------------------------------------------------------
// findTranslations
// ---------------------------------------------------------------------------

describe('findTranslations', () => {
  it('finds translated files with same base slug', () => {
    const contentDir = path.join(TMP_DIR, 'content');
    writeFile('content/articles/welcome.md', '---\ntitle: Welcome\n---\nHello');
    writeFile('content/articles/welcome.pl.md', '---\ntitle: Witamy\n---\nCzesc');
    writeFile('content/articles/welcome.de.md', '---\ntitle: Willkommen\n---\nHallo');

    const translations = findTranslations(contentDir, {
      slug: 'welcome',
      type: 'article',
      langcode: 'en',
    });

    expect(translations).toHaveLength(2);
    const langs = translations.map((t) => t.langcode).sort();
    expect(langs).toEqual(['de', 'pl']);
    expect(translations.every((t) => t.slug === 'welcome')).toBe(true);
  });

  it('does not include the current language in results', () => {
    const contentDir = path.join(TMP_DIR, 'content');
    writeFile('content/articles/welcome.md', '---\ntitle: Welcome\n---\nHello');
    writeFile('content/articles/welcome.pl.md', '---\ntitle: Witamy\n---\nCzesc');

    const translations = findTranslations(contentDir, {
      slug: 'welcome',
      type: 'article',
      langcode: 'pl',
    });

    expect(translations).toHaveLength(1);
    expect(translations[0].langcode).toBe('en');
  });

  it('returns empty array when no translations exist', () => {
    const contentDir = path.join(TMP_DIR, 'content');
    writeFile('content/articles/solo.md', '---\ntitle: Solo\n---\nAlone');

    const translations = findTranslations(contentDir, {
      slug: 'solo',
      type: 'article',
      langcode: 'en',
    });

    expect(translations).toEqual([]);
  });

  it('returns empty array for nonexistent content directory', () => {
    const translations = findTranslations('/nonexistent', {
      slug: 'test',
      type: 'article',
      langcode: 'en',
    });

    expect(translations).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// generateHreflangTags
// ---------------------------------------------------------------------------

describe('generateHreflangTags', () => {
  it('produces correct hreflang link tags', () => {
    const translations = [
      { langcode: 'en', path: '/articles/welcome' },
      { langcode: 'pl', path: '/pl/articles/welcome' },
      { langcode: 'de', path: '/de/articles/welcome' },
    ];

    const html = generateHreflangTags(
      translations,
      'en',
      'https://example.com',
      'en',
    );

    expect(html).toContain('hreflang="en"');
    expect(html).toContain('hreflang="pl"');
    expect(html).toContain('hreflang="de"');
    expect(html).toContain('hreflang="x-default"');
    expect(html).toContain('href="https://example.com/articles/welcome"');
    expect(html).toContain('href="https://example.com/pl/articles/welcome"');
    expect(html).toContain('href="https://example.com/de/articles/welcome"');
  });

  it('x-default points to the default language URL', () => {
    const translations = [
      { langcode: 'en', path: '/articles/welcome' },
      { langcode: 'pl', path: '/pl/articles/welcome' },
    ];

    const html = generateHreflangTags(
      translations,
      'pl',
      'https://example.com',
      'en',
    );

    expect(html).toContain('hreflang="x-default" href="https://example.com/articles/welcome"');
  });

  it('handles base URL with trailing slash', () => {
    const translations = [
      { langcode: 'en', path: '/about' },
    ];

    const html = generateHreflangTags(
      translations,
      'en',
      'https://example.com/',
      'en',
    );

    expect(html).toContain('href="https://example.com/about"');
    expect(html).not.toContain('https://example.com//about');
  });
});
