import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { eq, and, gte } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { marked } from 'marked';
import matter from 'gray-matter';
import * as schema from '../db/schema.js';
import type { Content, Section, SectionSettings } from './types.js';
import { parseContentDirectory, serializeContent } from './content-files.js';

const DEFAULT_SECTION_SETTINGS: SectionSettings = {
  background: 'light',
  spacing: 'medium',
  width: 'contained',
};

function pluralize(word: string): string {
  if (word.endsWith('y') && word.length > 1 && !'aeiou'.includes(word[word.length - 2])) {
    return word.slice(0, -1) + 'ies';
  }
  if (
    word.endsWith('s') ||
    word.endsWith('x') ||
    word.endsWith('z') ||
    word.endsWith('sh') ||
    word.endsWith('ch')
  ) {
    return word + 'es';
  }
  return word + 's';
}

function injectUpdatedDate(serialized: string, updatedAt: Date): string {
  const { data, content } = matter(serialized);
  data.updated = updatedAt.toISOString();
  return matter.stringify(content, data);
}

// ---------------------------------------------------------------------------
// DB ↔ Content conversions
// ---------------------------------------------------------------------------

function buildSectionTree(
  rows: (typeof schema.sections.$inferSelect)[],
): Section[] {
  const roots = rows.filter((r) => !r.parentId);

  function toSection(row: (typeof schema.sections.$inferSelect)): Section {
    const childRows = rows
      .filter((r) => r.parentId === row.id)
      .sort((a, b) => a.weight - b.weight);

    const section: Section = {
      type: row.type,
      weight: row.weight,
      data: (row.data as Record<string, any>) ?? {},
      settings: (row.settings as SectionSettings) ?? {
        ...DEFAULT_SECTION_SETTINGS,
      },
    };
    if (childRows.length > 0) {
      section.children = childRows.map(toSection);
    }
    return section;
  }

  return roots.sort((a, b) => a.weight - b.weight).map(toSection);
}

export function dbRowToContent(
  row: typeof schema.content.$inferSelect,
  dbSections: (typeof schema.sections.$inferSelect)[],
): Content {
  const rawFields = (row.fields as Record<string, any>) ?? {};
  const { _seo, ...fields } = rawFields;

  return {
    id: row.id,
    type: row.type,
    title: row.title,
    slug: row.slug,
    status: row.status as Content['status'],
    langcode: row.langcode,
    body: row.body ?? '',
    bodyHtml: row.body ? (marked.parse(row.body) as string) : '',
    fields,
    sections: buildSectionTree(dbSections),
    seo: _seo,
    siteId: row.siteId ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    publishedAt: row.publishedAt ?? undefined,
  };
}

export function contentToDbRow(
  content: Content,
): typeof schema.content.$inferInsert {
  const fields: Record<string, any> = { ...content.fields };
  if (content.seo) {
    fields._seo = content.seo;
  }
  return {
    id: content.id,
    type: content.type,
    title: content.title,
    slug: content.slug,
    status: content.status,
    langcode: content.langcode,
    body: content.body,
    fields: Object.keys(fields).length > 0 ? fields : null,
    siteId: content.siteId ?? null,
    createdAt: content.createdAt,
    updatedAt: content.updatedAt,
    publishedAt: content.publishedAt ?? null,
  };
}

function flattenSections(
  sections: Section[],
  contentId: string,
  langcode: string,
  parentId: string | null = null,
): (typeof schema.sections.$inferInsert)[] {
  const result: (typeof schema.sections.$inferInsert)[] = [];
  for (const section of sections) {
    const id = crypto.randomUUID();
    result.push({
      id,
      contentId,
      type: section.type,
      weight: section.weight,
      data: section.data,
      settings: section.settings as Record<string, any>,
      parentId,
      langcode,
    });
    if (section.children?.length) {
      result.push(
        ...flattenSections(section.children, contentId, langcode, id),
      );
    }
  }
  return result;
}

export function sectionToDbRow(
  section: Section,
  contentId: string,
  langcode: string,
): typeof schema.sections.$inferInsert {
  return {
    id: crypto.randomUUID(),
    contentId,
    type: section.type,
    weight: section.weight,
    data: section.data,
    settings: section.settings as Record<string, any>,
    parentId: null,
    langcode,
  };
}

// ---------------------------------------------------------------------------
// Import (files → DB)
// ---------------------------------------------------------------------------

export async function importContent(
  db: BetterSQLite3Database<typeof schema>,
  contentDir: string,
): Promise<{ created: number; updated: number; skipped: number }> {
  const files = parseContentDirectory(contentDir);
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const content of files) {
    const existing = db
      .select()
      .from(schema.content)
      .where(eq(schema.content.id, content.id))
      .get();

    if (!existing) {
      db.insert(schema.content).values(contentToDbRow(content)).run();
      if (content.sections?.length) {
        for (const sr of flattenSections(
          content.sections,
          content.id,
          content.langcode,
        )) {
          db.insert(schema.sections).values(sr).run();
        }
      }
      created++;
    } else if (content.updatedAt.getTime() > existing.updatedAt.getTime()) {
      const { id: _id, ...updateData } = contentToDbRow(content);
      db.update(schema.content)
        .set(updateData)
        .where(eq(schema.content.id, content.id))
        .run();

      db.delete(schema.sections)
        .where(eq(schema.sections.contentId, content.id))
        .run();
      if (content.sections?.length) {
        for (const sr of flattenSections(
          content.sections,
          content.id,
          content.langcode,
        )) {
          db.insert(schema.sections).values(sr).run();
        }
      }
      updated++;
    } else {
      skipped++;
    }
  }

  return { created, updated, skipped };
}

// ---------------------------------------------------------------------------
// Export (DB → files)
// ---------------------------------------------------------------------------

export async function exportContent(
  db: BetterSQLite3Database<typeof schema>,
  contentDir: string,
  options?: { type?: string; since?: Date },
): Promise<{ exported: number }> {
  let rows: (typeof schema.content.$inferSelect)[];

  if (options?.type && options?.since) {
    rows = db
      .select()
      .from(schema.content)
      .where(
        and(
          eq(schema.content.type, options.type),
          gte(schema.content.updatedAt, options.since),
        ),
      )
      .all();
  } else if (options?.type) {
    rows = db
      .select()
      .from(schema.content)
      .where(eq(schema.content.type, options.type))
      .all();
  } else if (options?.since) {
    rows = db
      .select()
      .from(schema.content)
      .where(gte(schema.content.updatedAt, options.since))
      .all();
  } else {
    rows = db.select().from(schema.content).all();
  }

  let exported = 0;

  for (const row of rows) {
    const dbSections = db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.contentId, row.id))
      .all();

    const content = dbRowToContent(row, dbSections);
    writeContentToFile(contentDir, content);
    exported++;
  }

  return { exported };
}

// ---------------------------------------------------------------------------
// Sync (bidirectional)
// ---------------------------------------------------------------------------

export async function syncContent(
  db: BetterSQLite3Database<typeof schema>,
  contentDir: string,
): Promise<{
  fileToDb: { created: number; updated: number };
  dbToFile: { created: number; updated: number };
  conflicts: Array<{ id: string; slug: string; reason: string }>;
}> {
  const fileContents = parseContentDirectory(contentDir);
  const dbRows = db.select().from(schema.content).all();

  const fileMap = new Map<string, Content>();
  for (const c of fileContents) {
    fileMap.set(c.id, c);
  }

  const dbMap = new Map<string, (typeof dbRows)[0]>();
  for (const r of dbRows) {
    dbMap.set(r.id, r);
  }

  const fileToDb = { created: 0, updated: 0 };
  const dbToFile = { created: 0, updated: 0 };
  const conflicts: Array<{ id: string; slug: string; reason: string }> = [];

  // In files only → import to DB
  for (const [id, content] of fileMap) {
    if (dbMap.has(id)) continue;

    db.insert(schema.content).values(contentToDbRow(content)).run();
    if (content.sections?.length) {
      for (const sr of flattenSections(
        content.sections,
        id,
        content.langcode,
      )) {
        db.insert(schema.sections).values(sr).run();
      }
    }
    fileToDb.created++;
  }

  // In DB only → export to file
  for (const [id, row] of dbMap) {
    if (fileMap.has(id)) continue;

    const dbSections = db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.contentId, id))
      .all();
    const content = dbRowToContent(row, dbSections);
    writeContentToFile(contentDir, content);
    dbToFile.created++;
  }

  // In both → compare timestamps
  for (const [id, fileContent] of fileMap) {
    const dbRow = dbMap.get(id);
    if (!dbRow) continue;

    const fileTime = fileContent.updatedAt.getTime();
    const dbTime = dbRow.updatedAt.getTime();

    if (Math.abs(fileTime - dbTime) < 1000) continue;

    if (fileTime > dbTime) {
      const { id: _id, ...updateData } = contentToDbRow(fileContent);
      db.update(schema.content)
        .set(updateData)
        .where(eq(schema.content.id, id))
        .run();

      db.delete(schema.sections)
        .where(eq(schema.sections.contentId, id))
        .run();
      if (fileContent.sections?.length) {
        for (const sr of flattenSections(
          fileContent.sections,
          id,
          fileContent.langcode,
        )) {
          db.insert(schema.sections).values(sr).run();
        }
      }
      fileToDb.updated++;
    } else {
      const dbSections = db
        .select()
        .from(schema.sections)
        .where(eq(schema.sections.contentId, id))
        .all();
      const dbContent = dbRowToContent(dbRow, dbSections);
      writeContentToFile(contentDir, dbContent);
      dbToFile.updated++;
    }
  }

  return { fileToDb, dbToFile, conflicts };
}

// ---------------------------------------------------------------------------
// File writer helper
// ---------------------------------------------------------------------------

function writeContentToFile(contentDir: string, content: Content): void {
  const typeDir = pluralize(content.type);
  const ext = content.type === 'landing_page' ? '.yaml' : '.md';
  const filePath = path.join(contentDir, typeDir, `${content.slug}${ext}`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  let output = serializeContent(content);
  output = injectUpdatedDate(output, content.updatedAt);
  fs.writeFileSync(filePath, output, 'utf-8');
}
