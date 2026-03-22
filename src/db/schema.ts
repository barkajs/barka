import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('editor'),
  lang: text('lang').default('en'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const content = sqliteTable('content', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  status: text('status').notNull().default('draft'),
  langcode: text('langcode').notNull().default('en'),
  body: text('body'),
  fields: text('fields', { mode: 'json' }),
  authorId: text('author_id').references(() => users.id),
  siteId: text('site_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
});

export const contentRevisions = sqliteTable('content_revisions', {
  id: text('id').primaryKey(),
  contentId: text('content_id').notNull().references(() => content.id, { onDelete: 'cascade' }),
  version: integer('version').notNull(),
  data: text('data', { mode: 'json' }),
  message: text('message'),
  userId: text('user_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const sections = sqliteTable('sections', {
  id: text('id').primaryKey(),
  contentId: text('content_id').notNull().references(() => content.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  weight: integer('weight').notNull().default(0),
  data: text('data', { mode: 'json' }),
  settings: text('settings', { mode: 'json' }),
  parentId: text('parent_id'),
  langcode: text('langcode').notNull().default('en'),
});

export const taxonomyTerms = sqliteTable('taxonomy_terms', {
  id: text('id').primaryKey(),
  vocabulary: text('vocabulary').notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  parentId: text('parent_id'),
  weight: integer('weight').default(0),
  langcode: text('langcode').default('en'),
});

export const media = sqliteTable('media', {
  id: text('id').primaryKey(),
  filename: text('filename').notNull(),
  path: text('path').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  alt: text('alt'),
  width: integer('width'),
  height: integer('height'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

export const sites = sqliteTable('sites', {
  id: text('id').primaryKey(),
  domain: text('domain'),
  localhost: text('localhost'),
  label: text('label').notNull(),
  defaultLang: text('default_lang').notNull().default('en'),
  languages: text('languages', { mode: 'json' }),
  settings: text('settings', { mode: 'json' }),
});
