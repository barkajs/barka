import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../../db/schema.js';
import { initializeSchema } from '../../db/connection.js';
import {
  importContent,
  exportContent,
  syncContent,
} from '../sync.js';
import { parseContentFile } from '../content-files.js';

let tmpDir: string;
let contentDir: string;
let db: BetterSQLite3Database<typeof schema>;
let rawDb: Database.Database;

function fixture(relativePath: string, content: string): string {
  const full = path.join(contentDir, relativePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf-8');
  return full;
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'barka-sync-'));
  contentDir = path.join(tmpDir, 'content');
  fs.mkdirSync(contentDir, { recursive: true });

  rawDb = new Database(':memory:');
  rawDb.pragma('foreign_keys = ON');
  db = drizzle(rawDb, { schema });
  initializeSchema(db);
});

afterEach(() => {
  rawDb.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// importContent
// ---------------------------------------------------------------------------

describe('importContent', () => {
  it('creates content records in DB from files', async () => {
    const uuid1 = crypto.randomUUID();
    const uuid2 = crypto.randomUUID();

    fixture(
      'pages/about.md',
      [
        '---',
        `uuid: "${uuid1}"`,
        'title: "About Us"',
        'status: published',
        'date: 2025-01-01',
        'updated: 2025-01-15T00:00:00.000Z',
        '---',
        '',
        'About page content.',
      ].join('\n'),
    );

    fixture(
      'posts/hello.md',
      [
        '---',
        `uuid: "${uuid2}"`,
        'title: "Hello World"',
        'status: draft',
        'date: 2025-02-01',
        'updated: 2025-02-15T00:00:00.000Z',
        '---',
        '',
        'Hello world content.',
      ].join('\n'),
    );

    const result = await importContent(db, contentDir);

    expect(result.created).toBe(2);
    expect(result.updated).toBe(0);
    expect(result.skipped).toBe(0);

    const row1 = db
      .select()
      .from(schema.content)
      .where(eq(schema.content.id, uuid1))
      .get();
    expect(row1).toBeDefined();
    expect(row1!.title).toBe('About Us');
    expect(row1!.slug).toBe('about');
    expect(row1!.type).toBe('page');

    const row2 = db
      .select()
      .from(schema.content)
      .where(eq(schema.content.id, uuid2))
      .get();
    expect(row2).toBeDefined();
    expect(row2!.title).toBe('Hello World');
    expect(row2!.type).toBe('post');
  });

  it('updates DB when file is newer', async () => {
    const id = crypto.randomUUID();

    db.insert(schema.content)
      .values({
        id,
        type: 'page',
        title: 'Old Title',
        slug: 'about',
        status: 'draft',
        langcode: 'en',
        body: 'Old body.',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      })
      .run();

    fixture(
      'pages/about.md',
      [
        '---',
        `uuid: "${id}"`,
        'title: "New Title"',
        'status: published',
        'date: 2025-01-01',
        'updated: 2025-06-01T00:00:00.000Z',
        '---',
        '',
        'New body.',
      ].join('\n'),
    );

    const result = await importContent(db, contentDir);

    expect(result.updated).toBe(1);
    expect(result.created).toBe(0);
    expect(result.skipped).toBe(0);

    const row = db
      .select()
      .from(schema.content)
      .where(eq(schema.content.id, id))
      .get();
    expect(row!.title).toBe('New Title');
    expect(row!.status).toBe('published');
  });

  it('skips when DB is newer', async () => {
    const id = crypto.randomUUID();

    db.insert(schema.content)
      .values({
        id,
        type: 'page',
        title: 'DB Title',
        slug: 'about',
        status: 'published',
        langcode: 'en',
        body: 'DB body.',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-12-01'),
      })
      .run();

    fixture(
      'pages/about.md',
      [
        '---',
        `uuid: "${id}"`,
        'title: "File Title"',
        'status: draft',
        'date: 2025-01-01',
        'updated: 2025-06-01T00:00:00.000Z',
        '---',
        '',
        'File body.',
      ].join('\n'),
    );

    const result = await importContent(db, contentDir);

    expect(result.skipped).toBe(1);
    expect(result.created).toBe(0);
    expect(result.updated).toBe(0);

    const row = db
      .select()
      .from(schema.content)
      .where(eq(schema.content.id, id))
      .get();
    expect(row!.title).toBe('DB Title');
  });

  it('handles sections', async () => {
    const uuid = crypto.randomUUID();

    fixture(
      'pages/landing.md',
      [
        '---',
        `uuid: "${uuid}"`,
        'title: "Landing Page"',
        'status: published',
        'date: 2025-01-01',
        'updated: 2025-01-15T00:00:00.000Z',
        'sections:',
        '  - type: hero',
        '    heading: "Welcome"',
        '    settings:',
        '      background: dark',
        '  - type: cta',
        '    heading: "Sign Up"',
        '---',
        '',
        'Landing body.',
      ].join('\n'),
    );

    await importContent(db, contentDir);

    const sections = db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.contentId, uuid))
      .all();

    expect(sections).toHaveLength(2);

    const hero = sections.find((s) => s.type === 'hero');
    expect(hero).toBeDefined();
    expect(hero!.weight).toBe(0);
    expect((hero!.data as Record<string, any>).heading).toBe('Welcome');
    expect((hero!.settings as Record<string, any>).background).toBe('dark');

    const cta = sections.find((s) => s.type === 'cta');
    expect(cta).toBeDefined();
    expect(cta!.weight).toBe(1);
    expect((cta!.data as Record<string, any>).heading).toBe('Sign Up');
  });
});

// ---------------------------------------------------------------------------
// exportContent
// ---------------------------------------------------------------------------

describe('exportContent', () => {
  it('writes .md files from DB records', async () => {
    const id = crypto.randomUUID();

    db.insert(schema.content)
      .values({
        id,
        type: 'page',
        title: 'Exported Page',
        slug: 'exported',
        status: 'published',
        langcode: 'en',
        body: '# Exported\n\nContent here.',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-15'),
      })
      .run();

    const exportDir = path.join(tmpDir, 'export');
    const result = await exportContent(db, exportDir);

    expect(result.exported).toBe(1);

    const filePath = path.join(exportDir, 'pages', 'exported.md');
    expect(fs.existsSync(filePath)).toBe(true);

    const content = parseContentFile(filePath);
    expect(content.title).toBe('Exported Page');
    expect(content.id).toBe(id);
    expect(content.body).toContain('# Exported');
  });

  it('filters by type', async () => {
    db.insert(schema.content)
      .values({
        id: crypto.randomUUID(),
        type: 'page',
        title: 'A Page',
        slug: 'a-page',
        status: 'published',
        langcode: 'en',
        body: 'Page.',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      })
      .run();

    db.insert(schema.content)
      .values({
        id: crypto.randomUUID(),
        type: 'post',
        title: 'A Post',
        slug: 'a-post',
        status: 'published',
        langcode: 'en',
        body: 'Post.',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      })
      .run();

    const exportDir = path.join(tmpDir, 'export');
    const result = await exportContent(db, exportDir, { type: 'page' });

    expect(result.exported).toBe(1);
    expect(fs.existsSync(path.join(exportDir, 'pages', 'a-page.md'))).toBe(
      true,
    );
    expect(fs.existsSync(path.join(exportDir, 'posts', 'a-post.md'))).toBe(
      false,
    );
  });
});

// ---------------------------------------------------------------------------
// syncContent
// ---------------------------------------------------------------------------

describe('syncContent', () => {
  it('imports file-only content to DB and exports DB-only to files', async () => {
    const fileId = crypto.randomUUID();
    const dbId = crypto.randomUUID();

    fixture(
      'pages/file-only.md',
      [
        '---',
        `uuid: "${fileId}"`,
        'title: "File Only"',
        'status: published',
        'date: 2025-01-01',
        'updated: 2025-01-15T00:00:00.000Z',
        '---',
        '',
        'File only content.',
      ].join('\n'),
    );

    db.insert(schema.content)
      .values({
        id: dbId,
        type: 'post',
        title: 'DB Only',
        slug: 'db-only',
        status: 'published',
        langcode: 'en',
        body: 'DB only content.',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-15'),
      })
      .run();

    const result = await syncContent(db, contentDir);

    expect(result.fileToDb.created).toBe(1);
    const dbRow = db
      .select()
      .from(schema.content)
      .where(eq(schema.content.id, fileId))
      .get();
    expect(dbRow).toBeDefined();
    expect(dbRow!.title).toBe('File Only');

    expect(result.dbToFile.created).toBe(1);
    const exportedFile = path.join(contentDir, 'posts', 'db-only.md');
    expect(fs.existsSync(exportedFile)).toBe(true);
    const exported = parseContentFile(exportedFile);
    expect(exported.title).toBe('DB Only');
  });

  it('updates DB when file is newer', async () => {
    const id = crypto.randomUUID();

    db.insert(schema.content)
      .values({
        id,
        type: 'page',
        title: 'Old Title',
        slug: 'shared',
        status: 'draft',
        langcode: 'en',
        body: 'Old.',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      })
      .run();

    fixture(
      'pages/shared.md',
      [
        '---',
        `uuid: "${id}"`,
        'title: "New Title"',
        'status: published',
        'date: 2025-01-01',
        'updated: 2025-06-01T00:00:00.000Z',
        '---',
        '',
        'New content.',
      ].join('\n'),
    );

    const result = await syncContent(db, contentDir);

    expect(result.fileToDb.updated).toBe(1);
    const row = db
      .select()
      .from(schema.content)
      .where(eq(schema.content.id, id))
      .get();
    expect(row!.title).toBe('New Title');
    expect(row!.status).toBe('published');
  });

  it('updates file when DB is newer', async () => {
    const id = crypto.randomUUID();

    db.insert(schema.content)
      .values({
        id,
        type: 'page',
        title: 'DB Title',
        slug: 'shared',
        status: 'published',
        langcode: 'en',
        body: 'DB content.',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-12-01'),
      })
      .run();

    fixture(
      'pages/shared.md',
      [
        '---',
        `uuid: "${id}"`,
        'title: "File Title"',
        'status: draft',
        'date: 2025-01-01',
        'updated: 2025-06-01T00:00:00.000Z',
        '---',
        '',
        'File content.',
      ].join('\n'),
    );

    const result = await syncContent(db, contentDir);

    expect(result.dbToFile.updated).toBe(1);

    const updated = parseContentFile(
      path.join(contentDir, 'pages', 'shared.md'),
    );
    expect(updated.title).toBe('DB Title');
    expect(updated.body).toContain('DB content.');
  });
});

// ---------------------------------------------------------------------------
// Round-trip
// ---------------------------------------------------------------------------

describe('round-trip', () => {
  it('import -> export produces equivalent content', async () => {
    const uuid = crypto.randomUUID();

    fixture(
      'pages/round-trip.md',
      [
        '---',
        `uuid: "${uuid}"`,
        'title: "Round Trip Test"',
        'status: published',
        'langcode: en',
        'date: 2025-03-01',
        'updated: 2025-03-15T00:00:00.000Z',
        'fields:',
        '  summary: "A test page"',
        '---',
        '',
        '# Round Trip',
        '',
        'This is the body.',
      ].join('\n'),
    );

    await importContent(db, contentDir);

    const exportDir = path.join(tmpDir, 'export');
    await exportContent(db, exportDir);

    const original = parseContentFile(
      path.join(contentDir, 'pages', 'round-trip.md'),
    );
    const exported = parseContentFile(
      path.join(exportDir, 'pages', 'round-trip.md'),
    );

    expect(exported.id).toBe(original.id);
    expect(exported.title).toBe(original.title);
    expect(exported.slug).toBe(original.slug);
    expect(exported.status).toBe(original.status);
    expect(exported.langcode).toBe(original.langcode);
    expect(exported.body).toContain('# Round Trip');
    expect(exported.body).toContain('This is the body.');
    expect(exported.fields.summary).toBe('A test page');
  });
});
