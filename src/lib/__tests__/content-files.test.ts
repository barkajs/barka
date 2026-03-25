import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { parseContentFile, parseContentDirectory, serializeContent } from '../content-files.js';
import type { Content } from '../types.js';

const FIXTURES_DIR = path.join(os.tmpdir(), 'barka-test-content-' + Date.now());

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

describe('parseContentFile', () => {
  it('parses a markdown file with frontmatter', () => {
    const filePath = fixture('articles/hello.md', [
      '---',
      'uuid: "aaaa-bbbb-cccc-dddd"',
      'title: "Hello World"',
      'status: published',
      'langcode: en',
      'date: 2026-03-21',
      'fields:',
      '  summary: "A test article"',
      '---',
      '',
      '# Hello',
      '',
      'Body text here.',
    ].join('\n'));

    const content = parseContentFile(filePath);

    expect(content.id).toBe('aaaa-bbbb-cccc-dddd');
    expect(content.title).toBe('Hello World');
    expect(content.status).toBe('published');
    expect(content.langcode).toBe('en');
    expect(content.type).toBe('article');
    expect(content.slug).toBe('hello');
    expect(content.fields.summary).toBe('A test article');
    expect(content.body).toContain('# Hello');
    expect(content.bodyHtml).toContain('<h1>');
    expect(content.bodyHtml).toContain('Hello');
    expect(content.publishedAt).toBeInstanceOf(Date);
    expect(content.filePath).toBe(filePath);
  });

  it('generates a UUID when none is provided', () => {
    const filePath = fixture('pages/no-uuid.md', [
      '---',
      'title: "No UUID"',
      '---',
      '',
      'Content.',
    ].join('\n'));

    const content = parseContentFile(filePath);

    expect(content.id).toBeTruthy();
    expect(content.id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('auto-detects type from parent directory', () => {
    const filePath = fixture('pages/test-page.md', [
      '---',
      'title: "Test Page"',
      '---',
      '',
      'Page content.',
    ].join('\n'));

    const content = parseContentFile(filePath);
    expect(content.type).toBe('page');
  });

  it('auto-detects slug from filename', () => {
    const filePath = fixture('articles/my-great-post.md', [
      '---',
      'title: "My Great Post"',
      '---',
      '',
      'Post body.',
    ].join('\n'));

    const content = parseContentFile(filePath);
    expect(content.slug).toBe('my-great-post');
  });

  it('defaults status to draft when not specified', () => {
    const filePath = fixture('articles/draft-post.md', [
      '---',
      'title: "Draft"',
      '---',
      '',
      'Draft content.',
    ].join('\n'));

    const content = parseContentFile(filePath);
    expect(content.status).toBe('draft');
    expect(content.publishedAt).toBeUndefined();
  });

  it('parses sections and applies default settings', () => {
    const filePath = fixture('landing-pages/test.md', [
      '---',
      'title: "Landing"',
      'sections:',
      '  - type: hero',
      '    heading: "Welcome"',
      '    settings:',
      '      background: dark',
      '      spacing: large',
      '  - type: cta',
      '    heading: "Act Now"',
      '---',
      '',
      'Body.',
    ].join('\n'));

    const content = parseContentFile(filePath);

    expect(content.sections).toHaveLength(2);

    const hero = content.sections![0];
    expect(hero.type).toBe('hero');
    expect(hero.weight).toBe(0);
    expect(hero.data.heading).toBe('Welcome');
    expect(hero.settings.background).toBe('dark');
    expect(hero.settings.spacing).toBe('large');
    expect(hero.settings.width).toBe('contained');

    const cta = content.sections![1];
    expect(cta.type).toBe('cta');
    expect(cta.weight).toBe(1);
    expect(cta.settings.background).toBe('light');
    expect(cta.settings.spacing).toBe('medium');
  });

  it('parses sections with data: wrapper format', () => {
    const filePath = fixture('landing-pages/data-wrapper.md', [
      '---',
      'title: "Data Wrapper Test"',
      'sections:',
      '  - type: hero',
      '    data:',
      '      heading: "Wrapped"',
      '      subheading: "In data"',
      '    settings:',
      '      background: dark',
      '---',
      '',
      'Body.',
    ].join('\n'));

    const content = parseContentFile(filePath);

    expect(content.sections).toHaveLength(1);

    const hero = content.sections![0];
    expect(hero.type).toBe('hero');
    expect(hero.data.heading).toBe('Wrapped');
    expect(hero.data.subheading).toBe('In data');
    expect(hero.settings.background).toBe('dark');
  });

  it('parses a YAML landing page file', () => {
    const filePath = fixture('landing-pages/home.yaml', [
      'uuid: "1111-2222-3333-4444"',
      'title: "Home"',
      'type: landing_page',
      'status: published',
      'date: 2026-03-21',
      'sections:',
      '  - type: hero',
      '    heading: "Hello"',
      '    settings:',
      '      background: dark',
    ].join('\n'));

    const content = parseContentFile(filePath);

    expect(content.id).toBe('1111-2222-3333-4444');
    expect(content.title).toBe('Home');
    expect(content.type).toBe('landing_page');
    expect(content.status).toBe('published');
    expect(content.sections).toHaveLength(1);
    expect(content.sections![0].type).toBe('hero');
    expect(content.sections![0].settings.background).toBe('dark');
  });
});

describe('parseContentDirectory', () => {
  it('finds all .md and .yaml files recursively', () => {
    fixture('articles/one.md', '---\ntitle: "One"\n---\nBody one.');
    fixture('articles/two.md', '---\ntitle: "Two"\n---\nBody two.');
    fixture('pages/about.md', '---\ntitle: "About"\n---\nAbout body.');
    fixture('landing-pages/home.yaml', 'title: "Home"\ntype: landing_page');

    const contents = parseContentDirectory(FIXTURES_DIR);

    expect(contents).toHaveLength(4);
    const titles = contents.map((c) => c.title).sort();
    expect(titles).toEqual(['About', 'Home', 'One', 'Two']);
  });

  it('returns empty array for non-existent directory', () => {
    const contents = parseContentDirectory(path.join(FIXTURES_DIR, 'nope'));
    expect(contents).toEqual([]);
  });
});

describe('serializeContent', () => {
  it('round-trips a content object through serialize and parse', () => {
    const filePath = fixture('articles/round-trip.md', [
      '---',
      'uuid: "rt-uuid-1234"',
      'title: "Round Trip"',
      'status: published',
      'langcode: en',
      'date: 2026-03-21',
      'fields:',
      '  summary: "Testing round trip"',
      'seo:',
      '  description: "SEO desc"',
      'sections:',
      '  - type: hero',
      '    heading: "Hi"',
      '    settings:',
      '      background: dark',
      '---',
      '',
      'The body content.',
    ].join('\n'));

    const original = parseContentFile(filePath);
    const serialized = serializeContent(original);

    const tmpPath = fixture('articles/round-trip-out.md', serialized);
    const reparsed = parseContentFile(tmpPath);

    expect(reparsed.id).toBe(original.id);
    expect(reparsed.title).toBe(original.title);
    expect(reparsed.status).toBe(original.status);
    expect(reparsed.fields.summary).toBe(original.fields.summary);
    expect(reparsed.seo?.description).toBe(original.seo?.description);
    expect(reparsed.sections).toHaveLength(1);
    expect(reparsed.sections![0].type).toBe('hero');
    expect(reparsed.sections![0].settings.background).toBe('dark');
    expect(reparsed.body).toContain('The body content.');
  });
});
