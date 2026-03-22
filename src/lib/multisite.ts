import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { eq } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema.js';
import type { Content } from './types.js';

export interface SiteDefinition {
  id: string;
  label: string;
  domain?: string;
  localhost?: string;
  default_lang: string;
  languages?: string[];
  settings?: Record<string, any>;
}

interface SitesYaml {
  sites: Record<
    string,
    {
      label: string;
      domain?: string;
      localhost?: string;
      default_lang: string;
      languages?: string[];
      settings?: Record<string, any>;
    }
  >;
}

export function loadSites(configDir: string): SiteDefinition[] {
  const filePath = path.join(configDir, 'sites.yaml');
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = yaml.load(raw) as SitesYaml | null;
  if (!data?.sites) return [];

  return Object.entries(data.sites).map(([id, def]) => ({
    id,
    label: def.label,
    domain: def.domain,
    localhost: def.localhost,
    default_lang: def.default_lang ?? 'en',
    languages: def.languages,
    settings: def.settings,
  }));
}

export function resolveSite(
  host: string | undefined,
  sites: SiteDefinition[],
): SiteDefinition | null {
  if (!host || sites.length === 0) return null;

  const hostname = host.split(':')[0].toLowerCase();

  for (const site of sites) {
    if (site.domain && site.domain.toLowerCase() === hostname) {
      return site;
    }
    if (site.localhost && site.localhost.toLowerCase() === hostname) {
      return site;
    }
  }

  return null;
}

/**
 * Filter content by site. Content without a siteId is considered "shared"
 * and appears on every site. Content with a siteId only appears on that site.
 */
export function filterContentBySite(
  contents: Content[],
  siteId: string | undefined,
): Content[] {
  if (!siteId) return contents;
  return contents.filter((c) => !c.siteId || c.siteId === siteId);
}

export function importSites(
  db: BetterSQLite3Database<typeof schema>,
  configDir: string,
): { created: number } {
  const sites = loadSites(configDir);
  let created = 0;

  for (const site of sites) {
    const existing = db
      .select()
      .from(schema.sites)
      .where(eq(schema.sites.id, site.id))
      .get();

    if (!existing) {
      db.insert(schema.sites)
        .values({
          id: site.id,
          domain: site.domain ?? null,
          localhost: site.localhost ?? null,
          label: site.label,
          defaultLang: site.default_lang,
          languages: site.languages ?? null,
          settings: site.settings ?? null,
        })
        .run();
      created++;
    }
  }

  return { created };
}
