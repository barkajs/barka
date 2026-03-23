export interface DesignTokens {
  colors?: Record<string, string>;
  fonts?: Record<string, string>;
  font_imports?: string[];
  transitions?: Record<string, string>;
}

export interface ThemeConfig {
  name: string;
  label: string;
  description?: string;
  version?: string;
  author?: string;
  base?: string;
  settings?: Record<string, ThemeSettingDefinition>;
  design_tokens?: DesignTokens;
}

export interface ThemeSettingDefinition {
  type: string;
  label: string;
  default?: any;
  options?: string[];
}

export interface ThemeResolver {
  resolveLayout(contentType: string, slug?: string): string | null;
  resolveSection(sectionType: string): string | null;
  resolvePartial(name: string): string | null;
  resolveStatic(filename: string): string | null;
  collectComponentCss(): string[];
  resolveComponentSchema(sectionType: string): string | null;
  getConfig(): ThemeConfig;
  getAvailableThemes(): ThemeConfig[];
}

export interface LayoutProps {
  content: import('./types.js').Content;
  site: import('./types.js').SiteConfig;
  theme: ThemeConfig;
  themeSettings: Record<string, any>;
  children?: any;
}

export interface SectionProps {
  data: Record<string, any>;
  settings: import('./types.js').SectionSettings;
  theme: ThemeConfig;
  themeSettings: Record<string, any>;
}
