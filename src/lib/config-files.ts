import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import type {
  SiteConfig,
  ContentType,
  SectionType,
  SectionTypeDefaults,
  FieldDefinition,
} from './types.js';

const DEFAULT_SITE_CONFIG: SiteConfig = {
  site_name: 'Barka Site',
  base_url: 'http://localhost:3000',
  theme: 'base',
};

const DEFAULT_SECTION_SETTINGS: Record<string, FieldDefinition> = {
  background: { type: 'select', label: 'Background', options: ['light', 'dark', 'primary', 'custom'], default: 'light' },
  background_color: { type: 'text', label: 'Background Color' },
  background_image: { type: 'media', label: 'Background Image' },
  spacing: { type: 'select', label: 'Spacing', options: ['none', 'small', 'medium', 'large', 'xlarge'], default: 'medium' },
  width: { type: 'select', label: 'Width', options: ['contained', 'wide', 'full'], default: 'contained' },
  css_class: { type: 'text', label: 'CSS Class' },
  anchor_id: { type: 'text', label: 'Anchor ID' },
  hidden: { type: 'boolean', label: 'Hidden', default: false },
};

function readYaml<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(raw) as T;
}

export function loadSiteConfig(configDir: string): SiteConfig {
  const filePath = path.join(configDir, 'settings.yaml');
  const data = readYaml<Partial<SiteConfig>>(filePath);
  if (!data) return { ...DEFAULT_SITE_CONFIG };
  return {
    ...DEFAULT_SITE_CONFIG,
    ...data,
  };
}

export function loadContentTypes(configDir: string): ContentType[] {
  const filePath = path.join(configDir, 'content-types.yaml');
  const data = readYaml<Record<string, any>>(filePath);
  if (!data) return [];

  return Object.entries(data).map(([name, def]) => ({
    name,
    label: def.label ?? name,
    fields: def.fields ?? {},
    path_pattern: def.path_pattern,
  }));
}

export function loadSectionTypes(configDir: string): {
  defaults: SectionTypeDefaults;
  types: SectionType[];
} {
  const filePath = path.join(configDir, 'section-types.yaml');
  const data = readYaml<Record<string, any>>(filePath);

  if (!data) {
    return {
      defaults: { settings: { ...DEFAULT_SECTION_SETTINGS } },
      types: [],
    };
  }

  const rawDefaults = data._defaults;
  const defaults: SectionTypeDefaults = {
    settings: rawDefaults?.settings
      ? { ...DEFAULT_SECTION_SETTINGS, ...rawDefaults.settings }
      : { ...DEFAULT_SECTION_SETTINGS },
  };

  const types: SectionType[] = Object.entries(data)
    .filter(([key]) => key !== '_defaults')
    .map(([name, def]: [string, any]) => ({
      name,
      label: def.label ?? name,
      fields: def.fields ?? {},
      icon: def.icon,
    }));

  return { defaults, types };
}
