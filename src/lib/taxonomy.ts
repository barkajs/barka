import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { eq, and } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema.js';

export interface Vocabulary {
  name: string;
  label: string;
  description?: string;
  hierarchical: boolean;
}

export interface TaxonomyTerm {
  id: string;
  vocabulary: string;
  name: string;
  slug: string;
  parentId?: string;
  weight: number;
  langcode: string;
  children?: TaxonomyTerm[];
}

interface ConfigTermDef {
  name: string;
  slug: string;
  children?: ConfigTermDef[];
}

interface TaxonomiesConfig {
  vocabularies: Record<
    string,
    {
      label: string;
      description?: string;
      hierarchical: boolean;
      terms?: ConfigTermDef[];
    }
  >;
}

function readYaml<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(raw) as T;
}

export function loadTaxonomies(configDir: string): Vocabulary[] {
  const filePath = path.join(configDir, 'taxonomies.yaml');
  const data = readYaml<TaxonomiesConfig>(filePath);
  if (!data?.vocabularies) return [];

  return Object.entries(data.vocabularies).map(([name, def]) => ({
    name,
    label: def.label ?? name,
    description: def.description,
    hierarchical: def.hierarchical ?? false,
  }));
}

function flattenConfigTerms(
  vocabulary: string,
  terms: ConfigTermDef[],
  langcode: string,
  parentId?: string,
  startWeight = 0,
): TaxonomyTerm[] {
  const result: TaxonomyTerm[] = [];
  let weight = startWeight;

  for (const t of terms) {
    const id = crypto.randomUUID();
    result.push({
      id,
      vocabulary,
      name: t.name,
      slug: t.slug,
      parentId,
      weight,
      langcode,
    });
    weight++;

    if (t.children?.length) {
      result.push(...flattenConfigTerms(vocabulary, t.children, langcode, id));
    }
  }

  return result;
}

export function loadTermsFromConfig(
  configDir: string,
  vocabulary: string,
): TaxonomyTerm[] {
  const filePath = path.join(configDir, 'taxonomies.yaml');
  const data = readYaml<TaxonomiesConfig>(filePath);
  if (!data?.vocabularies?.[vocabulary]?.terms) return [];

  return flattenConfigTerms(
    vocabulary,
    data.vocabularies[vocabulary].terms!,
    'en',
  );
}

export function buildTermTree(terms: TaxonomyTerm[]): TaxonomyTerm[] {
  const map = new Map<string, TaxonomyTerm>();
  for (const t of terms) {
    map.set(t.id, { ...t, children: [] });
  }

  const roots: TaxonomyTerm[] = [];

  for (const t of terms) {
    const node = map.get(t.id)!;
    if (t.parentId && map.has(t.parentId)) {
      map.get(t.parentId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  }

  function stripEmptyChildren(node: TaxonomyTerm): TaxonomyTerm {
    if (node.children && node.children.length === 0) {
      const { children: _, ...rest } = node;
      return rest;
    }
    return {
      ...node,
      children: node.children!.map(stripEmptyChildren),
    };
  }

  return roots
    .sort((a, b) => a.weight - b.weight)
    .map(stripEmptyChildren);
}

export function importTaxonomy(
  db: BetterSQLite3Database<typeof schema>,
  configDir: string,
): { created: number } {
  const vocabularies = loadTaxonomies(configDir);
  let created = 0;

  for (const vocab of vocabularies) {
    const terms = loadTermsFromConfig(configDir, vocab.name);
    for (const term of terms) {
      const existing = db
        .select()
        .from(schema.taxonomyTerms)
        .where(
          and(
            eq(schema.taxonomyTerms.vocabulary, term.vocabulary),
            eq(schema.taxonomyTerms.slug, term.slug),
          ),
        )
        .get();

      if (!existing) {
        db.insert(schema.taxonomyTerms)
          .values({
            id: term.id,
            vocabulary: term.vocabulary,
            name: term.name,
            slug: term.slug,
            parentId: term.parentId ?? null,
            weight: term.weight,
            langcode: term.langcode,
          })
          .run();
        created++;
      }
    }
  }

  return { created };
}

export function getTerms(
  db: BetterSQLite3Database<typeof schema>,
  vocabulary: string,
  langcode?: string,
): TaxonomyTerm[] {
  const conditions = [eq(schema.taxonomyTerms.vocabulary, vocabulary)];
  if (langcode) {
    conditions.push(eq(schema.taxonomyTerms.langcode, langcode));
  }

  const rows = db
    .select()
    .from(schema.taxonomyTerms)
    .where(and(...conditions))
    .all();

  return rows.map((r) => ({
    id: r.id,
    vocabulary: r.vocabulary,
    name: r.name,
    slug: r.slug,
    parentId: r.parentId ?? undefined,
    weight: r.weight ?? 0,
    langcode: r.langcode ?? 'en',
  }));
}

export function createTerm(
  db: BetterSQLite3Database<typeof schema>,
  term: Omit<TaxonomyTerm, 'id' | 'children'>,
): TaxonomyTerm {
  const id = crypto.randomUUID();

  db.insert(schema.taxonomyTerms)
    .values({
      id,
      vocabulary: term.vocabulary,
      name: term.name,
      slug: term.slug,
      parentId: term.parentId ?? null,
      weight: term.weight,
      langcode: term.langcode,
    })
    .run();

  return { id, ...term };
}

export function updateTerm(
  db: BetterSQLite3Database<typeof schema>,
  id: string,
  data: Partial<TaxonomyTerm>,
): void {
  const updates: Record<string, unknown> = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.slug !== undefined) updates.slug = data.slug;
  if (data.parentId !== undefined) updates.parentId = data.parentId ?? null;
  if (data.weight !== undefined) updates.weight = data.weight;
  if (data.langcode !== undefined) updates.langcode = data.langcode;

  if (Object.keys(updates).length > 0) {
    db.update(schema.taxonomyTerms)
      .set(updates)
      .where(eq(schema.taxonomyTerms.id, id))
      .run();
  }
}

export function deleteTerm(
  db: BetterSQLite3Database<typeof schema>,
  id: string,
): void {
  db.delete(schema.taxonomyTerms)
    .where(eq(schema.taxonomyTerms.id, id))
    .run();
}
