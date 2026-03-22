import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../../db/schema.js';
import { initializeSchema } from '../../db/connection.js';
import {
  loadTaxonomies,
  loadTermsFromConfig,
  buildTermTree,
  importTaxonomy,
  getTerms,
  createTerm,
  updateTerm,
  deleteTerm,
} from '../taxonomy.js';

let tmpDir: string;
let configDir: string;
let db: BetterSQLite3Database<typeof schema>;
let rawDb: Database.Database;

const TAXONOMIES_YAML = `vocabularies:
  categories:
    label: "Categories"
    description: "Content categories"
    hierarchical: true
    terms:
      - name: "Technology"
        slug: technology
        children:
          - name: "Web Development"
            slug: web-development
          - name: "AI & ML"
            slug: ai-ml
      - name: "Business"
        slug: business

  tags:
    label: "Tags"
    description: "Free-form content tags"
    hierarchical: false
    terms:
      - name: "tutorial"
        slug: tutorial
      - name: "guide"
        slug: guide
`;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'barka-tax-'));
  configDir = path.join(tmpDir, 'config');
  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(path.join(configDir, 'taxonomies.yaml'), TAXONOMIES_YAML, 'utf-8');

  rawDb = new Database(':memory:');
  rawDb.pragma('foreign_keys = ON');
  db = drizzle(rawDb, { schema });
  initializeSchema(db);
});

afterEach(() => {
  rawDb.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('loadTaxonomies', () => {
  it('reads vocabularies from config', () => {
    const vocabs = loadTaxonomies(configDir);
    expect(vocabs).toHaveLength(2);

    const categories = vocabs.find((v) => v.name === 'categories');
    expect(categories).toBeDefined();
    expect(categories!.label).toBe('Categories');
    expect(categories!.description).toBe('Content categories');
    expect(categories!.hierarchical).toBe(true);

    const tags = vocabs.find((v) => v.name === 'tags');
    expect(tags).toBeDefined();
    expect(tags!.label).toBe('Tags');
    expect(tags!.hierarchical).toBe(false);
  });

  it('returns empty array when config file is missing', () => {
    const vocabs = loadTaxonomies(path.join(tmpDir, 'nonexistent'));
    expect(vocabs).toEqual([]);
  });
});

describe('loadTermsFromConfig', () => {
  it('flattens nested terms for hierarchical vocabulary', () => {
    const terms = loadTermsFromConfig(configDir, 'categories');
    expect(terms).toHaveLength(4);

    const slugs = terms.map((t) => t.slug);
    expect(slugs).toContain('technology');
    expect(slugs).toContain('web-development');
    expect(slugs).toContain('ai-ml');
    expect(slugs).toContain('business');

    const webDev = terms.find((t) => t.slug === 'web-development');
    expect(webDev).toBeDefined();
    expect(webDev!.parentId).toBeDefined();

    const tech = terms.find((t) => t.slug === 'technology');
    expect(webDev!.parentId).toBe(tech!.id);
  });

  it('loads flat terms for non-hierarchical vocabulary', () => {
    const terms = loadTermsFromConfig(configDir, 'tags');
    expect(terms).toHaveLength(2);
    expect(terms.every((t) => !t.parentId)).toBe(true);
  });

  it('returns empty for unknown vocabulary', () => {
    const terms = loadTermsFromConfig(configDir, 'nonexistent');
    expect(terms).toEqual([]);
  });
});

describe('buildTermTree', () => {
  it('builds correct hierarchy from flat list', () => {
    const terms = loadTermsFromConfig(configDir, 'categories');
    const tree = buildTermTree(terms);

    expect(tree).toHaveLength(2);

    const tech = tree.find((t) => t.slug === 'technology');
    expect(tech).toBeDefined();
    expect(tech!.children).toHaveLength(2);
    expect(tech!.children!.map((c) => c.slug)).toContain('web-development');
    expect(tech!.children!.map((c) => c.slug)).toContain('ai-ml');

    const biz = tree.find((t) => t.slug === 'business');
    expect(biz).toBeDefined();
    expect(biz!.children).toBeUndefined();
  });

  it('handles flat list with no parents', () => {
    const terms = loadTermsFromConfig(configDir, 'tags');
    const tree = buildTermTree(terms);
    expect(tree).toHaveLength(2);
    expect(tree.every((t) => !t.children)).toBe(true);
  });

  it('returns empty array for empty input', () => {
    const tree = buildTermTree([]);
    expect(tree).toEqual([]);
  });
});

describe('CRUD operations', () => {
  it('createTerm inserts and returns term with id', () => {
    const term = createTerm(db, {
      vocabulary: 'tags',
      name: 'TypeScript',
      slug: 'typescript',
      weight: 0,
      langcode: 'en',
    });

    expect(term.id).toBeDefined();
    expect(term.name).toBe('TypeScript');

    const rows = getTerms(db, 'tags');
    expect(rows).toHaveLength(1);
    expect(rows[0].slug).toBe('typescript');
  });

  it('getTerms filters by vocabulary', () => {
    createTerm(db, { vocabulary: 'tags', name: 'A', slug: 'a', weight: 0, langcode: 'en' });
    createTerm(db, { vocabulary: 'categories', name: 'B', slug: 'b', weight: 0, langcode: 'en' });

    expect(getTerms(db, 'tags')).toHaveLength(1);
    expect(getTerms(db, 'categories')).toHaveLength(1);
  });

  it('getTerms filters by langcode', () => {
    createTerm(db, { vocabulary: 'tags', name: 'EN', slug: 'en-term', weight: 0, langcode: 'en' });
    createTerm(db, { vocabulary: 'tags', name: 'PL', slug: 'pl-term', weight: 0, langcode: 'pl' });

    expect(getTerms(db, 'tags', 'en')).toHaveLength(1);
    expect(getTerms(db, 'tags', 'pl')).toHaveLength(1);
    expect(getTerms(db, 'tags')).toHaveLength(2);
  });

  it('updateTerm modifies fields', () => {
    const term = createTerm(db, {
      vocabulary: 'tags',
      name: 'Old Name',
      slug: 'old-name',
      weight: 0,
      langcode: 'en',
    });

    updateTerm(db, term.id, { name: 'New Name', slug: 'new-name', weight: 5 });

    const rows = getTerms(db, 'tags');
    expect(rows[0].name).toBe('New Name');
    expect(rows[0].slug).toBe('new-name');
    expect(rows[0].weight).toBe(5);
  });

  it('deleteTerm removes the term', () => {
    const term = createTerm(db, {
      vocabulary: 'tags',
      name: 'To Delete',
      slug: 'to-delete',
      weight: 0,
      langcode: 'en',
    });

    expect(getTerms(db, 'tags')).toHaveLength(1);
    deleteTerm(db, term.id);
    expect(getTerms(db, 'tags')).toHaveLength(0);
  });
});

describe('importTaxonomy', () => {
  it('imports all terms from config into DB', () => {
    const result = importTaxonomy(db, configDir);
    expect(result.created).toBe(6);

    const catTerms = getTerms(db, 'categories');
    expect(catTerms).toHaveLength(4);

    const tagTerms = getTerms(db, 'tags');
    expect(tagTerms).toHaveLength(2);
  });

  it('skips existing terms on re-import', () => {
    const first = importTaxonomy(db, configDir);
    expect(first.created).toBe(6);

    const second = importTaxonomy(db, configDir);
    expect(second.created).toBe(0);

    expect(getTerms(db, 'categories')).toHaveLength(4);
    expect(getTerms(db, 'tags')).toHaveLength(2);
  });

  it('preserves parent-child relationships', () => {
    importTaxonomy(db, configDir);
    const terms = getTerms(db, 'categories');
    const tree = buildTermTree(terms);

    const tech = tree.find((t) => t.slug === 'technology');
    expect(tech).toBeDefined();
    expect(tech!.children).toHaveLength(2);
  });
});
