import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import type { ThemeConfig, ThemeResolver } from './theme-types.js';
import { getPackageRoot } from './paths.js';

const STARTER_THEME = 'base';

const BUILTIN_THEME_DIR = path.resolve(getPackageRoot(), 'src', 'built-in-theme');

export function loadThemeConfig(themePath: string): ThemeConfig {
  const yamlPath = path.join(themePath, 'theme.yaml');
  if (!fs.existsSync(yamlPath)) {
    throw new Error(`theme.yaml not found in ${themePath}`);
  }
  const raw = fs.readFileSync(yamlPath, 'utf-8');
  const data = yaml.load(raw) as Record<string, any>;

  return {
    name: data.name,
    label: data.label ?? data.name,
    description: data.description,
    version: data.version,
    author: data.author,
    base: data.base,
    settings: data.settings,
    design_tokens: data.design_tokens,
  };
}

export function getAvailableThemes(themesDir: string): ThemeConfig[] {
  if (!fs.existsSync(themesDir)) return [];

  const entries = fs.readdirSync(themesDir, { withFileTypes: true });
  const themes: ThemeConfig[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const themePath = path.join(themesDir, entry.name);
    const yamlPath = path.join(themePath, 'theme.yaml');
    if (fs.existsSync(yamlPath)) {
      try {
        themes.push(loadThemeConfig(themePath));
      } catch {
        // skip malformed themes
      }
    }
  }

  return themes;
}

function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Build the chain of theme directories to search, from most specific to least:
 * active → base (if set and differs) → starter (if in user themes) → built-in fallback
 */
function buildThemeChain(themesDir: string, activeConfig: ThemeConfig): string[] {
  const chain: string[] = [path.join(themesDir, activeConfig.name)];

  if (activeConfig.base && activeConfig.base !== activeConfig.name) {
    const baseDir = path.join(themesDir, activeConfig.base);
    if (fs.existsSync(baseDir)) {
      chain.push(baseDir);
    }
  }

  const starterDir = path.join(themesDir, STARTER_THEME);
  if (!chain.some((d) => path.basename(d) === STARTER_THEME) && fs.existsSync(starterDir)) {
    chain.push(starterDir);
  }

  if (fs.existsSync(BUILTIN_THEME_DIR)) {
    chain.push(BUILTIN_THEME_DIR);
  }

  return chain;
}

export function createThemeResolver(
  themesDir: string,
  activeThemeName: string,
): ThemeResolver {
  const activeDir = path.join(themesDir, activeThemeName);

  let activeConfig: ThemeConfig;
  try {
    activeConfig = loadThemeConfig(activeDir);
  } catch {
    if (fs.existsSync(BUILTIN_THEME_DIR)) {
      activeConfig = loadThemeConfig(BUILTIN_THEME_DIR);
    } else {
      throw new Error(`Theme "${activeThemeName}" not found in ${themesDir} and no built-in fallback available.`);
    }
  }

  const themeChain = buildThemeChain(themesDir, activeConfig);
  const allThemes = getAvailableThemes(themesDir);

  return {
    resolveLayout(contentType: string, slug?: string): string | null {
      const variants = [contentType];
      const hyphenated = contentType.replace(/_/g, '-');
      const underscored = contentType.replace(/-/g, '_');
      if (hyphenated !== contentType) variants.push(hyphenated);
      if (underscored !== contentType) variants.push(underscored);

      if (slug) {
        for (const v of variants) {
          const specific = path.join(themeChain[0], 'layouts', `${v}--${slug}.tsx`);
          if (fileExists(specific)) return specific;
        }
      }

      for (const dir of themeChain) {
        for (const v of variants) {
          const candidate = path.join(dir, 'layouts', `${v}.tsx`);
          if (fileExists(candidate)) return candidate;
        }
      }

      for (const dir of themeChain) {
        const pageFallback = path.join(dir, 'layouts', 'page.tsx');
        if (fileExists(pageFallback)) return pageFallback;
      }

      return null;
    },

    resolveSection(sectionType: string): string | null {
      const variants = [sectionType];
      const hyphenated = sectionType.replace(/_/g, '-');
      const underscored = sectionType.replace(/-/g, '_');
      if (hyphenated !== sectionType) variants.push(hyphenated);
      if (underscored !== sectionType) variants.push(underscored);

      for (const dir of themeChain) {
        for (const v of variants) {
          const sdcCandidate = path.join(dir, 'components', v, `${v}.tsx`);
          if (fileExists(sdcCandidate)) return sdcCandidate;
        }
      }
      return null;
    },

    collectComponentCss(): string[] {
      const cssFiles: string[] = [];
      const seen = new Set<string>();
      for (const dir of themeChain) {
        const componentsDir = path.join(dir, 'components');
        if (!fs.existsSync(componentsDir)) continue;
        let entries: fs.Dirent[];
        try {
          entries = fs.readdirSync(componentsDir, { withFileTypes: true });
        } catch {
          continue;
        }
        for (const entry of entries) {
          if (!entry.isDirectory() || seen.has(entry.name)) continue;
          const cssPath = path.join(componentsDir, entry.name, `${entry.name}.css`);
          if (fileExists(cssPath)) {
            cssFiles.push(cssPath);
            seen.add(entry.name);
          }
        }
      }
      return cssFiles;
    },

    resolveComponentSchema(sectionType: string): string | null {
      const variants = [sectionType];
      const hyphenated = sectionType.replace(/_/g, '-');
      const underscored = sectionType.replace(/-/g, '_');
      if (hyphenated !== sectionType) variants.push(hyphenated);
      if (underscored !== sectionType) variants.push(underscored);

      for (const dir of themeChain) {
        for (const v of variants) {
          const candidate = path.join(dir, 'components', v, 'schema.yaml');
          if (fileExists(candidate)) return candidate;
        }
      }
      return null;
    },

    resolvePartial(name: string): string | null {
      for (const dir of themeChain) {
        const candidate = path.join(dir, 'partials', `${name}.tsx`);
        if (fileExists(candidate)) return candidate;
      }
      return null;
    },

    resolveStatic(filename: string): string | null {
      for (const dir of themeChain) {
        const candidate = path.join(dir, 'static', filename);
        if (fileExists(candidate)) return candidate;
      }
      return null;
    },

    getConfig(): ThemeConfig {
      return activeConfig;
    },

    getAvailableThemes(): ThemeConfig[] {
      return allThemes;
    },
  };
}
