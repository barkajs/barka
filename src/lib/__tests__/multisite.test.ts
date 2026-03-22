import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { loadSites, resolveSite, filterContentBySite } from '../multisite.js';
import type { Content } from '../types.js';

function makeTmpDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'barka-multisite-'));
}

function makeContent(overrides: Partial<Content> = {}): Content {
  const now = new Date();
  return {
    id: 'test-id',
    type: 'article',
    title: 'Test',
    slug: 'test',
    status: 'published',
    langcode: 'en',
    body: '',
    bodyHtml: '',
    fields: {},
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('loadSites', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = makeTmpDir();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('reads sites from config YAML', () => {
    const yaml = `sites:
  default:
    label: "Main Site"
    domain: "example.com"
    default_lang: en
  blog:
    label: "Blog"
    domain: "blog.example.com"
    default_lang: en
`;
    fs.writeFileSync(path.join(tmpDir, 'sites.yaml'), yaml);

    const sites = loadSites(tmpDir);
    expect(sites).toHaveLength(2);
    expect(sites[0]).toEqual({
      id: 'default',
      label: 'Main Site',
      domain: 'example.com',
      localhost: undefined,
      default_lang: 'en',
      languages: undefined,
      settings: undefined,
    });
    expect(sites[1].id).toBe('blog');
  });

  it('parses localhost and languages fields', () => {
    const yaml = `sites:
  main:
    label: "Barka"
    domain: "barka.dev"
    localhost: "barka.localhost"
    default_lang: en
    languages: [en, pl, de]
    settings:
      logo: "/static/logo.svg"
`;
    fs.writeFileSync(path.join(tmpDir, 'sites.yaml'), yaml);

    const sites = loadSites(tmpDir);
    expect(sites).toHaveLength(1);
    expect(sites[0].localhost).toBe('barka.localhost');
    expect(sites[0].languages).toEqual(['en', 'pl', 'de']);
    expect(sites[0].settings).toEqual({ logo: '/static/logo.svg' });
  });

  it('returns empty array when file does not exist', () => {
    const sites = loadSites(tmpDir);
    expect(sites).toEqual([]);
  });
});

describe('resolveSite', () => {
  const sites = [
    { id: 'default', label: 'Main', domain: 'example.com', localhost: 'barka.localhost', default_lang: 'en' },
    { id: 'blog', label: 'Blog', domain: 'blog.example.com', localhost: 'blog.localhost', default_lang: 'en' },
    { id: 'pl', label: 'Polish', domain: 'firma.example.pl', default_lang: 'pl' },
  ];

  it('matches by domain', () => {
    const result = resolveSite('blog.example.com', sites);
    expect(result).not.toBeNull();
    expect(result!.id).toBe('blog');
  });

  it('matches ignoring port', () => {
    const result = resolveSite('example.com:3000', sites);
    expect(result).not.toBeNull();
    expect(result!.id).toBe('default');
  });

  it('matches by localhost alias', () => {
    const result = resolveSite('barka.localhost:3101', sites);
    expect(result).not.toBeNull();
    expect(result!.id).toBe('default');
  });

  it('matches localhost alias without port', () => {
    const result = resolveSite('blog.localhost', sites);
    expect(result).not.toBeNull();
    expect(result!.id).toBe('blog');
  });

  it('prefers domain over localhost when both could match', () => {
    const result = resolveSite('example.com', sites);
    expect(result!.id).toBe('default');
  });

  it('returns null for unknown domain', () => {
    const result = resolveSite('unknown.com', sites);
    expect(result).toBeNull();
  });

  it('returns null when host is undefined', () => {
    const result = resolveSite(undefined, sites);
    expect(result).toBeNull();
  });

  it('returns null when sites list is empty', () => {
    const result = resolveSite('example.com', []);
    expect(result).toBeNull();
  });

  it('returns null for site without localhost field', () => {
    const result = resolveSite('firma.localhost', sites);
    expect(result).toBeNull();
  });
});

describe('filterContentBySite', () => {
  const contents = [
    makeContent({ id: '1', siteId: 'default' }),
    makeContent({ id: '2', siteId: 'blog' }),
    makeContent({ id: '3', siteId: 'default' }),
    makeContent({ id: '4', siteId: undefined }),
  ];

  it('includes site-specific and shared content', () => {
    const result = filterContentBySite(contents, 'default');
    expect(result).toHaveLength(3);
    expect(result.map((c) => c.id)).toEqual(['1', '3', '4']);
  });

  it('shared content appears for every site', () => {
    const blogResult = filterContentBySite(contents, 'blog');
    expect(blogResult).toHaveLength(2);
    expect(blogResult.map((c) => c.id)).toEqual(['2', '4']);
  });

  it('returns all when siteId is undefined (no site filter)', () => {
    const result = filterContentBySite(contents, undefined);
    expect(result).toHaveLength(4);
  });

  it('returns only shared content when no site-specific matches', () => {
    const result = filterContentBySite(contents, 'nonexistent');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('4');
  });

  it('returns empty when no content at all', () => {
    const result = filterContentBySite([], 'default');
    expect(result).toEqual([]);
  });
});
