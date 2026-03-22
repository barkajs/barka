import Database from 'better-sqlite3';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { sql } from 'drizzle-orm';
import * as schema from './schema.js';
import path from 'node:path';
import fs from 'node:fs';

let db: BetterSQLite3Database<typeof schema> | null = null;
let rawDb: Database.Database | null = null;

export function getDbPath(dataDir: string): string {
  return path.join(dataDir, 'barka.db');
}

export function hasDatabase(dataDir: string): boolean {
  return fs.existsSync(getDbPath(dataDir));
}

export function getDb(dataDir: string): BetterSQLite3Database<typeof schema> {
  if (db) return db;
  const dbPath = getDbPath(dataDir);
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Database not found at ${dbPath}. Run "barka db:init" first.`);
  }
  rawDb = new Database(dbPath);
  rawDb.pragma('journal_mode = WAL');
  rawDb.pragma('foreign_keys = ON');
  db = drizzle(rawDb, { schema });
  return db;
}

export function createDatabase(dataDir: string): BetterSQLite3Database<typeof schema> {
  fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = getDbPath(dataDir);
  rawDb = new Database(dbPath);
  rawDb.pragma('journal_mode = WAL');
  rawDb.pragma('foreign_keys = ON');
  db = drizzle(rawDb, { schema });
  return db;
}

export function closeDb(): void {
  if (rawDb) {
    rawDb.close();
    rawDb = null;
    db = null;
  }
}

export function initializeSchema(database: BetterSQLite3Database<typeof schema>): void {
  database.run(sql`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor',
    lang TEXT DEFAULT 'en',
    created_at INTEGER NOT NULL
  )`);

  database.run(sql`CREATE TABLE IF NOT EXISTS content (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    langcode TEXT NOT NULL DEFAULT 'en',
    body TEXT,
    fields TEXT,
    author_id TEXT REFERENCES users(id),
    site_id TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    published_at INTEGER
  )`);

  database.run(sql`CREATE TABLE IF NOT EXISTS content_revisions (
    id TEXT PRIMARY KEY,
    content_id TEXT NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    data TEXT,
    message TEXT,
    user_id TEXT REFERENCES users(id),
    created_at INTEGER NOT NULL
  )`);

  database.run(sql`CREATE TABLE IF NOT EXISTS sections (
    id TEXT PRIMARY KEY,
    content_id TEXT NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    weight INTEGER NOT NULL DEFAULT 0,
    data TEXT,
    settings TEXT,
    parent_id TEXT,
    langcode TEXT NOT NULL DEFAULT 'en'
  )`);

  database.run(sql`CREATE TABLE IF NOT EXISTS taxonomy_terms (
    id TEXT PRIMARY KEY,
    vocabulary TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    parent_id TEXT,
    weight INTEGER DEFAULT 0,
    langcode TEXT DEFAULT 'en'
  )`);

  database.run(sql`CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    alt TEXT,
    width INTEGER,
    height INTEGER,
    created_at INTEGER NOT NULL
  )`);

  database.run(sql`CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  )`);

  database.run(sql`CREATE TABLE IF NOT EXISTS sites (
    id TEXT PRIMARY KEY,
    domain TEXT,
    label TEXT NOT NULL,
    default_lang TEXT NOT NULL DEFAULT 'en',
    settings TEXT
  )`);
}
