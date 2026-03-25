import path from 'node:path';
import { eq, and } from 'drizzle-orm';
import { marked } from 'marked';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './db/schema.js';
import { getDb, hasDatabase } from './db/connection.js';
import type { Content, Section, SectionSettings, SiteConfig, ContentType } from './lib/types.js';
import { parseContentFile, parseContentDirectory } from './lib/content-files.js';
import { loadSiteConfig, loadContentTypes } from './lib/config-files.js';

export interface ContentEngine {
  getContent(slug: string, lang?: string, siteId?: string): Promise<Content | null>;
  getContentByPath(urlPath: string): Promise<Content | null>;
  listContent(type?: string, lang?: string, siteId?: string): Promise<Content[]>;
  getContentTypes(): Promise<ContentType[]>;
  getSiteConfig(): Promise<SiteConfig>;
  invalidateCache(): void;
}

export function resolveContentPath(
  content: Content,
  contentTypes: ContentType[],
): string {
  const ct = contentTypes.find((t) => t.name === content.type);
  if (ct?.path_pattern) {
    return ct.path_pattern.replace('{slug}', content.slug);
  }
  return `/${content.slug}`;
}

export function buildListingRoutes(
  contentTypes: ContentType[],
): Record<string, { type: string; title: string; subtitle?: string }> {
  const routes: Record<string, { type: string; title: string; subtitle?: string }> = {};

  for (const ct of contentTypes) {
    // Opt-in: only generate listing when explicitly configured
    if (!ct.listing_path && !ct.listing_title) continue;

    let listingPath = ct.listing_path;

    if (!listingPath && ct.path_pattern) {
      const derived = ct.path_pattern.replace(/\/?\{slug\}$/, '');
      if (derived && derived !== '/') {
        listingPath = derived;
      }
    }

    if (!listingPath) continue;

    routes[listingPath] = {
      type: ct.name,
      title: ct.listing_title ?? ct.label,
      subtitle: ct.listing_subtitle,
    };
  }

  return routes;
}

export class FileContentEngine implements ContentEngine {
  private contentCache: Content[] | null = null;
  private siteConfigCache: SiteConfig | null = null;
  private contentTypesCache: ContentType[] | null = null;

  constructor(
    private contentDir: string,
    private configDir: string,
  ) {}

  invalidateCache(): void {
    this.contentCache = null;
    this.siteConfigCache = null;
    this.contentTypesCache = null;
  }

  invalidateContent(filePath?: string): void {
    if (!filePath || !this.contentCache) {
      this.contentCache = null;
      return;
    }
    const resolved = path.resolve(filePath);
    this.contentCache = this.contentCache.filter(
      (c) => c.filePath && path.resolve(c.filePath) !== resolved,
    );
    try {
      const updated = parseContentFile(resolved);
      this.contentCache.push(updated);
    } catch {
      // File was deleted or unparseable — removal is enough
    }
  }

  private loadAllContent(): Content[] {
    if (this.contentCache) return this.contentCache;
    this.contentCache = parseContentDirectory(this.contentDir);
    return this.contentCache;
  }

  async getContent(slug: string, lang?: string, siteId?: string): Promise<Content | null> {
    const all = this.loadAllContent();
    return (
      all.find((c) => {
        if (c.slug !== slug) return false;
        if (lang && c.langcode !== lang) return false;
        if (siteId && c.siteId !== siteId) return false;
        return true;
      }) ?? null
    );
  }

  async getContentByPath(urlPath: string): Promise<Content | null> {
    const all = this.loadAllContent();
    const contentTypes = await this.getContentTypes();

    const normalized =
      urlPath !== '/' && urlPath.endsWith('/')
        ? urlPath.slice(0, -1)
        : urlPath;

    for (const content of all) {
      const resolved = resolveContentPath(content, contentTypes);
      if (resolved === normalized) return content;
    }

    return all.find((c) => `/${c.slug}` === normalized) ?? null;
  }

  async listContent(type?: string, lang?: string, siteId?: string): Promise<Content[]> {
    let results = this.loadAllContent();
    if (type) results = results.filter((c) => c.type === type);
    if (lang) results = results.filter((c) => c.langcode === lang);
    if (siteId) results = results.filter((c) => c.siteId === siteId);
    return results;
  }

  async getContentTypes(): Promise<ContentType[]> {
    if (this.contentTypesCache) return this.contentTypesCache;
    this.contentTypesCache = loadContentTypes(this.configDir);
    return this.contentTypesCache;
  }

  async getSiteConfig(): Promise<SiteConfig> {
    if (this.siteConfigCache) return this.siteConfigCache;
    this.siteConfigCache = loadSiteConfig(this.configDir);
    return this.siteConfigCache;
  }
}

// ---------------------------------------------------------------------------
// DbContentEngine — reads from SQLite via Drizzle, falls back to files
// ---------------------------------------------------------------------------

const DEFAULT_SECTION_SETTINGS: SectionSettings = {
  background: 'light',
  spacing: 'medium',
  width: 'contained',
};

export class DbContentEngine implements ContentEngine {
  private fileEngine: FileContentEngine;

  constructor(
    private db: BetterSQLite3Database<typeof schema>,
    private contentDir: string,
    private configDir: string,
  ) {
    this.fileEngine = new FileContentEngine(contentDir, configDir);
  }

  invalidateCache(): void {
    this.fileEngine.invalidateCache();
  }

  async getContent(slug: string, lang?: string, siteId?: string): Promise<Content | null> {
    const conditions = [eq(schema.content.slug, slug)];
    if (siteId) conditions.push(eq(schema.content.siteId, siteId));

    const rows = this.db
      .select()
      .from(schema.content)
      .where(conditions.length === 1 ? conditions[0] : and(...conditions))
      .all();

    const match = lang
      ? rows.find((r) => r.langcode === lang)
      : rows[0];

    if (match) return this.rowToContent(match);
    return this.fileEngine.getContent(slug, lang, siteId);
  }

  async getContentByPath(urlPath: string): Promise<Content | null> {
    const all = await this.listContent();
    const contentTypes = await this.getContentTypes();

    const normalized =
      urlPath !== '/' && urlPath.endsWith('/')
        ? urlPath.slice(0, -1)
        : urlPath;

    for (const content of all) {
      const resolved = resolveContentPath(content, contentTypes);
      if (resolved === normalized) return content;
    }

    return all.find((c) => `/${c.slug}` === normalized) ?? null;
  }

  async listContent(type?: string, lang?: string, siteId?: string): Promise<Content[]> {
    const conditions = [];
    if (type) conditions.push(eq(schema.content.type, type));
    if (siteId) conditions.push(eq(schema.content.siteId, siteId));

    let rows: (typeof schema.content.$inferSelect)[];
    if (conditions.length > 0) {
      rows = this.db
        .select()
        .from(schema.content)
        .where(conditions.length === 1 ? conditions[0] : and(...conditions))
        .all();
    } else {
      rows = this.db.select().from(schema.content).all();
    }

    let dbContent = rows.map((r) => this.rowToContent(r));
    if (lang) dbContent = dbContent.filter((c) => c.langcode === lang);

    const fileContent = await this.fileEngine.listContent(type, lang, siteId);
    const dbSlugs = new Set(dbContent.map((c) => `${c.slug}:${c.langcode}`));
    const uniqueFileContent = fileContent.filter(
      (c) => !dbSlugs.has(`${c.slug}:${c.langcode}`),
    );

    return [...dbContent, ...uniqueFileContent];
  }

  async getContentTypes(): Promise<ContentType[]> {
    return this.fileEngine.getContentTypes();
  }

  async getSiteConfig(): Promise<SiteConfig> {
    return this.fileEngine.getSiteConfig();
  }

  private rowToContent(row: typeof schema.content.$inferSelect): Content {
    const sectionRows = this.db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.contentId, row.id))
      .all();

    const sections: Section[] = sectionRows
      .sort((a, b) => a.weight - b.weight)
      .filter((s) => !s.parentId)
      .map((s) => this.rowToSection(s, sectionRows));

    const fields = (row.fields as Record<string, any>) ?? {};
    const seo = fields.seo as Content['seo'] | undefined;
    const bodyRaw = row.body ?? '';
    const bodyHtml = marked.parse(bodyRaw, { async: false }) as string;

    return {
      id: row.id,
      type: row.type,
      title: row.title,
      slug: row.slug,
      status: row.status as Content['status'],
      langcode: row.langcode,
      body: bodyRaw,
      bodyHtml,
      fields,
      sections: sections.length > 0 ? sections : undefined,
      seo,
      siteId: row.siteId ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      publishedAt: row.publishedAt ?? undefined,
    };
  }

  private rowToSection(
    row: typeof schema.sections.$inferSelect,
    allRows: (typeof schema.sections.$inferSelect)[],
  ): Section {
    const children = allRows
      .filter((s) => s.parentId === row.id)
      .sort((a, b) => a.weight - b.weight)
      .map((s) => this.rowToSection(s, allRows));

    return {
      type: row.type,
      weight: row.weight,
      data: (row.data as Record<string, any>) ?? {},
      settings: {
        ...DEFAULT_SECTION_SETTINGS,
        ...((row.settings as Partial<SectionSettings>) ?? {}),
      },
      children: children.length > 0 ? children : undefined,
    };
  }
}

// ---------------------------------------------------------------------------
// Factory — auto-detect DB presence
// ---------------------------------------------------------------------------

export function createContentEngine(options: {
  contentDir: string;
  configDir: string;
  dataDir: string;
  siteId?: string;
}): ContentEngine {
  if (hasDatabase(options.dataDir)) {
    const db = getDb(options.dataDir);
    return new DbContentEngine(db, options.contentDir, options.configDir);
  }
  return new FileContentEngine(options.contentDir, options.configDir);
}
