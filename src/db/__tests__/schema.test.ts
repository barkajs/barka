import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { eq, sql } from 'drizzle-orm';
import { createDatabase, closeDb, initializeSchema } from '../connection.js';
import * as schema from '../schema.js';
import { hashPassword, verifyPassword, createUser, createSession, validateSession, destroySession } from '../../lib/auth.js';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

let tmpDir: string;
let db: BetterSQLite3Database<typeof schema>;

beforeAll(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'barka-test-'));
  db = createDatabase(tmpDir);
  initializeSchema(db);
});

afterAll(() => {
  closeDb();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('database creation', () => {
  it('creates the database file', () => {
    const dbPath = path.join(tmpDir, 'barka.db');
    expect(fs.existsSync(dbPath)).toBe(true);
  });
});

describe('schema initialization', () => {
  it('creates all 8 tables', () => {
    const tables = db.all<{ name: string }>(
      sql`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`,
    );

    const tableNames = tables.map((t) => t.name).sort();
    expect(tableNames).toEqual([
      'content',
      'content_revisions',
      'media',
      'sections',
      'sessions',
      'sites',
      'taxonomy_terms',
      'users',
    ]);
  });
});

describe('user operations', () => {
  it('inserts and queries a user', () => {
    const id = 'user-1';
    db.insert(schema.users).values({
      id,
      email: 'test@example.com',
      passwordHash: 'hashed',
      name: 'Test User',
      role: 'admin',
      createdAt: new Date(),
    }).run();

    const user = db.select().from(schema.users).where(eq(schema.users.id, id)).get();
    expect(user).toBeDefined();
    expect(user!.email).toBe('test@example.com');
    expect(user!.name).toBe('Test User');
    expect(user!.role).toBe('admin');
  });
});

describe('content operations', () => {
  it('inserts content with JSON fields', () => {
    const id = 'content-1';
    const fields = { hero: true, color: 'blue', tags: ['a', 'b'] };
    db.insert(schema.content).values({
      id,
      type: 'page',
      title: 'Test Page',
      slug: 'test-page',
      status: 'published',
      body: '<p>Hello</p>',
      fields,
      authorId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).run();

    const row = db.select().from(schema.content).where(eq(schema.content.id, id)).get();
    expect(row).toBeDefined();
    expect(row!.title).toBe('Test Page');
    expect(row!.fields).toEqual(fields);
    expect(row!.status).toBe('published');
  });
});

describe('session operations', () => {
  it('creates and validates a session', () => {
    const sessionId = createSession(db, 'user-1');
    expect(typeof sessionId).toBe('string');

    const result = validateSession(db, sessionId);
    expect(result).not.toBeNull();
    expect(result!.userId).toBe('user-1');
    expect(result!.email).toBe('test@example.com');
    expect(result!.role).toBe('admin');
  });

  it('returns null for a non-existent session', () => {
    const result = validateSession(db, 'does-not-exist');
    expect(result).toBeNull();
  });

  it('destroys a session', () => {
    const sessionId = createSession(db, 'user-1');
    destroySession(db, sessionId);
    const result = validateSession(db, sessionId);
    expect(result).toBeNull();
  });
});

describe('password hashing', () => {
  it('hashes and verifies a password', async () => {
    const hash = await hashPassword('MySecret123');
    expect(hash).not.toBe('MySecret123');
    expect(await verifyPassword('MySecret123', hash)).toBe(true);
    expect(await verifyPassword('wrong', hash)).toBe(false);
  });
});

describe('createUser helper', () => {
  it('creates a user with hashed password', async () => {
    const id = await createUser(db, 'new@example.com', 'Pass123!', 'New User', 'author');
    const user = db.select().from(schema.users).where(eq(schema.users.id, id)).get();
    expect(user).toBeDefined();
    expect(user!.email).toBe('new@example.com');
    expect(user!.role).toBe('author');
    expect(user!.passwordHash).not.toBe('Pass123!');
    expect(await verifyPassword('Pass123!', user!.passwordHash)).toBe(true);
  });
});
