import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { glob } from 'glob';
import { marked } from 'marked';
import type { Content, Section, SectionSettings } from './types.js';
import { langFromFilename, baseSlugFromFilename } from './i18n.js';

const DEFAULT_SECTION_SETTINGS: SectionSettings = {
  background: 'light',
  spacing: 'medium',
  width: 'contained',
};

function singularize(word: string): string {
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('ses') || word.endsWith('xes') || word.endsWith('zes')) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

function slugFromFilename(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

function typeFromDirectory(filePath: string): string {
  const dir = path.basename(path.dirname(filePath));
  return singularize(dir);
}

function parseSections(raw: any[] | undefined): Section[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((entry, index) => {
    const { type, settings: rawSettings, children: rawChildren, data: dataWrapper, ...rest } = entry;
    const data = dataWrapper ?? rest;
    const settings: SectionSettings = {
      ...DEFAULT_SECTION_SETTINGS,
      ...rawSettings,
    };
    const section: Section = {
      type: type ?? 'text',
      weight: index,
      data,
      settings,
    };
    if (rawChildren) {
      section.children = parseSections(rawChildren);
    }
    return section;
  });
}

export function parseContentFile(filePath: string): Content {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.yaml' || ext === '.yml') {
    return parseYamlContent(filePath, raw);
  }

  return parseMarkdownContent(filePath, raw);
}

function parseMarkdownContent(filePath: string, raw: string): Content {
  const { data: fm, content: body } = matter(raw);
  const now = new Date();

  const detectedLang = langFromFilename(filePath);
  const langcode = fm.langcode ?? detectedLang ?? 'en';
  const slug = fm.slug ?? baseSlugFromFilename(path.basename(filePath));

  return {
    id: fm.uuid ?? crypto.randomUUID(),
    type: fm.type ?? typeFromDirectory(filePath),
    title: fm.title ?? slugFromFilename(filePath),
    slug,
    status: fm.status ?? 'draft',
    langcode,
    body,
    bodyHtml: marked.parse(body) as string,
    fields: fm.fields ?? {},
    sections: parseSections(fm.sections),
    seo: fm.seo,
    siteId: fm.site_id,
    createdAt: fm.date ? new Date(fm.date) : now,
    updatedAt: fm.updated ? new Date(fm.updated) : now,
    publishedAt: fm.status === 'published' ? (fm.date ? new Date(fm.date) : now) : undefined,
    filePath,
  };
}

function parseYamlContent(filePath: string, raw: string): Content {
  const data = yaml.load(raw) as Record<string, any>;
  const now = new Date();
  const body = data.body ?? '';

  const detectedLang = langFromFilename(filePath);
  const langcode = data.langcode ?? detectedLang ?? 'en';
  const slug = data.slug ?? baseSlugFromFilename(path.basename(filePath));

  return {
    id: data.uuid ?? crypto.randomUUID(),
    type: data.type ?? typeFromDirectory(filePath),
    title: data.title ?? slugFromFilename(filePath),
    slug,
    status: data.status ?? 'draft',
    langcode,
    body,
    bodyHtml: body ? (marked.parse(body) as string) : '',
    fields: data.fields ?? {},
    sections: parseSections(data.sections),
    seo: data.seo,
    siteId: data.site_id,
    createdAt: data.date ? new Date(data.date) : now,
    updatedAt: data.updated ? new Date(data.updated) : now,
    publishedAt: data.status === 'published' ? (data.date ? new Date(data.date) : now) : undefined,
    filePath,
  };
}

export function parseContentDirectory(dir: string): Content[] {
  const pattern = path.join(dir, '**/*.{md,yaml,yml}');
  const files = glob.sync(pattern);
  return files.map((f) => parseContentFile(f));
}

export function serializeContent(content: Content): string {
  const fm: Record<string, any> = {
    uuid: content.id,
    title: content.title,
    status: content.status,
    langcode: content.langcode,
    date: content.createdAt.toISOString().split('T')[0],
  };

  if (content.slug !== slugFromFilename(content.filePath ?? '')) {
    fm.slug = content.slug;
  }

  if (Object.keys(content.fields).length > 0) {
    fm.fields = content.fields;
  }

  if (content.seo) {
    fm.seo = content.seo;
  }

  if (content.sections && content.sections.length > 0) {
    fm.sections = content.sections.map(serializeSection);
  }

  return matter.stringify(content.body, fm);
}

function serializeSection(section: Section): Record<string, any> {
  const out: Record<string, any> = {
    type: section.type,
    ...section.data,
  };

  const nonDefaults: Record<string, any> = {};
  for (const [key, val] of Object.entries(section.settings)) {
    if ((DEFAULT_SECTION_SETTINGS as any)[key] !== val) {
      nonDefaults[key] = val;
    }
  }
  if (Object.keys(nonDefaults).length > 0) {
    out.settings = nonDefaults;
  }

  if (section.children && section.children.length > 0) {
    out.children = section.children.map(serializeSection);
  }

  return out;
}
