import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import yaml from 'js-yaml';

const ROOT = path.resolve(import.meta.dirname, '..', '..', '..');
const COMPONENTS_DIR = path.join(ROOT, 'starters', 'lokatech', 'themes', 'lokatech', 'components');

/** Expected SDC component machine names (must match directories under `components/`). */
const EXPECTED_COMPONENT_NAMES = [
  'blog-listing',
  'columns',
  'counters',
  'cta',
  'faq',
  'features',
  'form',
  'gallery',
  'hero',
  'logo-slider',
  'pricing',
  'testimonials',
  'text',
  'text-with-image',
  'video',
] as const;

const VALID_FIELD_TYPES = new Set([
  'text',
  'textarea',
  'media',
  'select',
  'boolean',
  'number',
  'repeater',
]);

interface SchemaYaml {
  label?: unknown;
  fields?: Record<string, FieldDefYaml>;
  [key: string]: unknown;
}

interface FieldDefYaml {
  type?: string;
  label?: string;
  fields?: Record<string, FieldDefYaml>;
  [key: string]: unknown;
}

function readComponentDirs(): string[] {
  const entries = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function loadSchema(dirName: string): SchemaYaml {
  const schemaPath = path.join(COMPONENTS_DIR, dirName, 'schema.yaml');
  const raw = fs.readFileSync(schemaPath, 'utf-8');
  return yaml.load(raw) as SchemaYaml;
}

function assertFieldTypesValid(
  fields: Record<string, FieldDefYaml> | undefined,
  ctx: string,
): void {
  expect(fields, `${ctx}: fields must be defined`).toBeDefined();
  if (!fields) return;

  for (const [name, def] of Object.entries(fields)) {
    expect(def, `${ctx}.${name}`).toBeDefined();
    expect(typeof def, `${ctx}.${name}`).toBe('object');
    const type = def.type;
    expect(
      typeof type,
      `${ctx}.${name} must have string "type"`,
    ).toBe('string');
    expect(
      VALID_FIELD_TYPES.has(type as string),
      `Invalid field type "${type}" at ${ctx}.${name}`,
    ).toBe(true);

    if (type === 'repeater') {
      expect(
        def.fields,
        `Repeater at ${ctx}.${name} must have nested "fields"`,
      ).toBeDefined();
      expect(
        typeof def.fields,
        `Repeater "fields" at ${ctx}.${name} must be an object`,
      ).toBe('object');
      assertFieldTypesValid(def.fields, `${ctx}.${name}`);
    }
  }
}

describe('SDC schema.yaml validation (themes/lokatech/components)', () => {
  it('discovers exactly the 15 expected component directories', () => {
    const dirs = readComponentDirs();
    expect(dirs).toEqual([...EXPECTED_COMPONENT_NAMES].sort());
  });

  it('every component directory has a schema.yaml file', () => {
    for (const name of EXPECTED_COMPONENT_NAMES) {
      const schemaPath = path.join(COMPONENTS_DIR, name, 'schema.yaml');
      expect(
        fs.existsSync(schemaPath),
        `Missing schema: ${schemaPath}`,
      ).toBe(true);
    }
  });

  it('every schema.yaml has required fields: label and fields', () => {
    for (const name of EXPECTED_COMPONENT_NAMES) {
      const schema = loadSchema(name);
      expect(schema, `${name}: parsed schema`).toBeTruthy();
      expect(schema.label, `${name}: label`).toBeDefined();
      expect(schema.fields, `${name}: fields`).toBeDefined();
    }
  });

  it('each schema label is a non-empty string', () => {
    for (const name of EXPECTED_COMPONENT_NAMES) {
      const schema = loadSchema(name);
      expect(typeof schema.label, `${name}.label type`).toBe('string');
      expect((schema.label as string).trim().length, `${name}.label empty`).toBeGreaterThan(0);
    }
  });

  it('all field types in schemas are valid (text, textarea, media, select, boolean, number, repeater)', () => {
    for (const name of EXPECTED_COMPONENT_NAMES) {
      const schema = loadSchema(name);
      assertFieldTypesValid(schema.fields, name);
    }
  });

  it('repeater fields have nested fields definitions', () => {
    function collectRepeaterPaths(
      fields: Record<string, FieldDefYaml> | undefined,
      prefix: string,
    ): string[] {
      if (!fields) return [];
      const paths: string[] = [];
      for (const [key, def] of Object.entries(fields)) {
        if (def.type === 'repeater') {
          paths.push(`${prefix}.${key}`);
          expect(def.fields, `${prefix}.${key} repeater`).toBeDefined();
          if (def.fields) {
            paths.push(
              ...collectRepeaterPaths(def.fields, `${prefix}.${key}`),
            );
          }
        }
      }
      return paths;
    }

    for (const name of EXPECTED_COMPONENT_NAMES) {
      const schema = loadSchema(name);
      collectRepeaterPaths(schema.fields, name);
    }
  });

  it('all 15 components have valid schemas (iterate over fixed list)', () => {
    for (const name of EXPECTED_COMPONENT_NAMES) {
      const schema = loadSchema(name);
      expect(schema.label).toBeTruthy();
      expect(schema.fields).toBeTruthy();
      assertFieldTypesValid(schema.fields, name);
    }
  });
});
