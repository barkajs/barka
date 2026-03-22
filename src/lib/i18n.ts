import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export interface Language {
  code: string;
  label: string;
  direction: 'ltr' | 'rtl';
}

export interface LanguagesConfig {
  default: string;
  languages: Record<string, Language>;
}

/**
 * ISO 639-1 two-letter codes used for filename-based detection.
 * Not exhaustive — covers the most common languages.
 */
const KNOWN_LANG_CODES = new Set([
  'aa', 'ab', 'af', 'ak', 'am', 'an', 'ar', 'as', 'av', 'ay', 'az',
  'ba', 'be', 'bg', 'bh', 'bi', 'bm', 'bn', 'bo', 'br', 'bs',
  'ca', 'ce', 'ch', 'co', 'cr', 'cs', 'cu', 'cv', 'cy',
  'da', 'de', 'dv', 'dz',
  'ee', 'el', 'en', 'eo', 'es', 'et', 'eu',
  'fa', 'ff', 'fi', 'fj', 'fo', 'fr', 'fy',
  'ga', 'gd', 'gl', 'gn', 'gu', 'gv',
  'ha', 'he', 'hi', 'ho', 'hr', 'ht', 'hu', 'hy', 'hz',
  'ia', 'id', 'ie', 'ig', 'ii', 'ik', 'io', 'is', 'it', 'iu',
  'ja', 'jv',
  'ka', 'kg', 'ki', 'kj', 'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku', 'kv', 'kw', 'ky',
  'la', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'lu', 'lv',
  'mg', 'mh', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my',
  'na', 'nb', 'nd', 'ne', 'ng', 'nl', 'nn', 'no', 'nr', 'nv', 'ny',
  'oc', 'oj', 'om', 'or', 'os',
  'pa', 'pi', 'pl', 'ps', 'pt',
  'qu',
  'rm', 'rn', 'ro', 'ru', 'rw',
  'sa', 'sc', 'sd', 'se', 'sg', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st', 'su', 'sv', 'sw',
  'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ty',
  'ug', 'uk', 'ur', 'uz',
  've', 'vi', 'vo',
  'wa', 'wo',
  'xh',
  'yi', 'yo',
  'za', 'zh', 'zu',
]);

export function isKnownLangCode(code: string): boolean {
  return KNOWN_LANG_CODES.has(code.toLowerCase());
}

export type TranslationFn = (key: string, replacements?: Record<string, string>) => string;

type TranslationStore = Record<string, Record<string, string>>;

let translationStore: TranslationStore = {};

export function loadTranslations(configDir: string): TranslationStore {
  const dir = path.join(configDir, 'translations');
  if (!fs.existsSync(dir)) return {};

  const store: TranslationStore = {};

  let files: string[];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return {};
  }

  for (const file of files) {
    if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;
    const lang = path.basename(file, path.extname(file));
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const data = yaml.load(raw) as Record<string, string> | null;
    if (data && typeof data === 'object') {
      store[lang] = data;
    }
  }

  translationStore = store;
  return store;
}

export function createT(lang: string, defaultLang: string = 'en'): TranslationFn {
  return (key: string, replacements?: Record<string, string>): string => {
    let value =
      translationStore[lang]?.[key] ??
      translationStore[defaultLang]?.[key] ??
      key;

    if (replacements) {
      for (const [k, v] of Object.entries(replacements)) {
        value = value.replace(new RegExp(`@${k}`, 'g'), v);
      }
    }

    return value;
  };
}

export function loadLanguages(configDir: string): LanguagesConfig {
  const filePath = path.join(configDir, 'languages.yaml');
  if (!fs.existsSync(filePath)) {
    return {
      default: 'en',
      languages: {
        en: { code: 'en', label: 'English', direction: 'ltr' },
      },
    };
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = yaml.load(raw) as Record<string, any>;

  const defaultLang = data.default ?? 'en';
  const languages: Record<string, Language> = {};

  if (data.languages && typeof data.languages === 'object') {
    for (const [code, def] of Object.entries<any>(data.languages)) {
      languages[code] = {
        code,
        label: def.label ?? code,
        direction: def.direction ?? 'ltr',
      };
    }
  }

  if (Object.keys(languages).length === 0) {
    languages[defaultLang] = {
      code: defaultLang,
      label: defaultLang,
      direction: 'ltr',
    };
  }

  return { default: defaultLang, languages };
}

export function langFromFilename(filename: string): string | undefined {
  const base = path.basename(filename);
  const parts = base.split('.');

  // Need at least 3 parts: name.lang.ext (e.g. welcome.pl.md)
  if (parts.length < 3) return undefined;

  const candidate = parts[parts.length - 2].toLowerCase();
  if (isKnownLangCode(candidate)) return candidate;
  return undefined;
}

export function baseSlugFromFilename(filename: string): string {
  const base = path.basename(filename);
  const parts = base.split('.');

  // Remove the file extension
  if (parts.length < 2) return base;

  const ext = parts.pop()!;
  const candidate = parts[parts.length - 1]?.toLowerCase();

  if (parts.length >= 2 && candidate && isKnownLangCode(candidate)) {
    parts.pop();
  }

  return parts.join('.');
}

export function negotiateLanguage(
  acceptLanguage: string | undefined,
  urlPrefix: string | undefined,
  cookie: string | undefined,
  available: string[],
  defaultLang: string,
): string {
  const avail = new Set(available);

  // 1. URL prefix takes priority
  if (urlPrefix && avail.has(urlPrefix)) {
    return urlPrefix;
  }

  // 2. Cookie
  if (cookie && avail.has(cookie)) {
    return cookie;
  }

  // 3. Accept-Language header
  if (acceptLanguage) {
    const parsed = parseAcceptLanguage(acceptLanguage);
    for (const lang of parsed) {
      if (avail.has(lang)) return lang;
      const prefix = lang.split('-')[0];
      if (avail.has(prefix)) return prefix;
    }
  }

  // 4. Default
  return defaultLang;
}

function parseAcceptLanguage(header: string): string[] {
  return header
    .split(',')
    .map((entry) => {
      const [lang, qPart] = entry.trim().split(';');
      const q = qPart ? parseFloat(qPart.replace(/q\s*=\s*/, '')) : 1.0;
      return { lang: lang.trim().toLowerCase(), q: isNaN(q) ? 0 : q };
    })
    .sort((a, b) => b.q - a.q)
    .map((e) => e.lang);
}

export function findTranslations(
  contentDir: string,
  content: { slug: string; type: string; langcode: string },
): Array<{ langcode: string; slug: string; filePath: string }> {
  const typeDir = guessContentTypeDir(contentDir, content.type);
  if (!typeDir || !fs.existsSync(typeDir)) return [];

  const results: Array<{ langcode: string; slug: string; filePath: string }> = [];

  let files: string[];
  try {
    files = fs.readdirSync(typeDir);
  } catch {
    return [];
  }

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext !== '.md' && ext !== '.yaml' && ext !== '.yml') continue;

    const slug = baseSlugFromFilename(file);
    if (slug !== content.slug) continue;

    const lang = langFromFilename(file);
    const langcode = lang ?? 'en';

    if (langcode === content.langcode) continue;

    results.push({
      langcode,
      slug: content.slug,
      filePath: path.join(typeDir, file),
    });
  }

  return results;
}

function guessContentTypeDir(contentDir: string, type: string): string | null {
  // Try plural forms: article → articles, page → pages
  const plural = type.endsWith('y')
    ? type.slice(0, -1) + 'ies'
    : type.endsWith('s')
      ? type
      : type + 's';

  const pluralPath = path.join(contentDir, plural);
  if (fs.existsSync(pluralPath)) return pluralPath;

  const singularPath = path.join(contentDir, type);
  if (fs.existsSync(singularPath)) return singularPath;

  return null;
}

export function generateHreflangTags(
  translations: Array<{ langcode: string; path: string }>,
  currentLang: string,
  baseUrl: string,
  defaultLang: string,
): string {
  const base = baseUrl.replace(/\/$/, '');
  const tags: string[] = [];

  const allLangs = [
    { langcode: currentLang, path: translations.find((t) => t.langcode === currentLang)?.path },
    ...translations.filter((t) => t.langcode !== currentLang),
  ];

  for (const entry of allLangs) {
    if (!entry.path && entry.langcode === currentLang) continue;
    const href = entry.path
      ? `${base}${entry.path.startsWith('/') ? '' : '/'}${entry.path}`
      : base;
    tags.push(`<link rel="alternate" hreflang="${entry.langcode}" href="${href}">`);
  }

  // Add all translations including current language with proper hrefs
  const allEntries = translations.map((t) => ({
    langcode: t.langcode,
    href: `${base}${t.path.startsWith('/') ? '' : '/'}${t.path}`,
  }));

  // Rebuild tags properly: one per translation
  tags.length = 0;
  for (const entry of allEntries) {
    tags.push(`<link rel="alternate" hreflang="${entry.langcode}" href="${entry.href}">`);
  }

  // x-default points to the default language version
  const defaultEntry = allEntries.find((e) => e.langcode === defaultLang);
  if (defaultEntry) {
    tags.push(`<link rel="alternate" hreflang="x-default" href="${defaultEntry.href}">`);
  }

  return tags.join('\n');
}
