import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import type { ThemeResolver } from './theme-types.js';

export interface SectionFieldSchema {
  type: string;
  label: string;
  required?: boolean;
  default?: any;
  options?: string[];
  fields?: Record<string, SectionFieldSchema>;
}

export interface SectionSchema {
  label: string;
  icon?: string;
  description?: string;
  status?: 'stable' | 'beta' | 'deprecated';
  fields: Record<string, SectionFieldSchema>;
}

interface GlobalSectionTypes {
  _defaults?: { settings?: Record<string, SectionFieldSchema> };
  [type: string]: any;
}

let globalCache: GlobalSectionTypes | null = null;

function loadGlobalConfig(configDir: string): GlobalSectionTypes {
  if (globalCache) return globalCache;
  const filePath = path.join(configDir, 'section-types.yaml');
  if (!fs.existsSync(filePath)) {
    globalCache = {};
    return globalCache;
  }
  globalCache = yaml.load(fs.readFileSync(filePath, 'utf-8')) as GlobalSectionTypes;
  return globalCache;
}

export function clearSchemaCache(): void {
  globalCache = null;
}

/**
 * Load schema for a section type. Priority:
 * 1. Component-level schema.yaml (via ThemeResolver)
 * 2. Global config/section-types.yaml entry
 */
export function loadSectionSchema(
  sectionType: string,
  themeResolver: ThemeResolver,
  configDir: string,
): SectionSchema | null {
  const componentSchemaPath = themeResolver.resolveComponentSchema(sectionType);
  if (componentSchemaPath && fs.existsSync(componentSchemaPath)) {
    const raw = yaml.load(fs.readFileSync(componentSchemaPath, 'utf-8')) as SectionSchema;
    return raw;
  }

  const global = loadGlobalConfig(configDir);
  const normalizedType = sectionType.replace(/-/g, '_');
  const entry = global[sectionType] ?? global[normalizedType];
  if (!entry) return null;

  return {
    label: entry.label,
    icon: entry.icon,
    fields: entry.fields ?? {},
  };
}

export function getDefaultSettings(configDir: string): Record<string, SectionFieldSchema> {
  const global = loadGlobalConfig(configDir);
  return global._defaults?.settings ?? {};
}
