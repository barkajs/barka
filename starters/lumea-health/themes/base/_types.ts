export interface ThemeConfig {
  name: string;
  label: string;
  description?: string;
  version?: string;
  author?: string;
  base?: string;
  settings?: Record<string, ThemeSettingDefinition>;
}

export interface ThemeSettingDefinition {
  type: string;
  label: string;
  default?: any;
  options?: string[];
}

export interface Content {
  id: string;
  type: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  langcode: string;
  body: string;
  bodyHtml: string;
  fields: Record<string, any>;
  sections?: Section[];
  seo?: SeoData;
  siteId?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  filePath?: string;
}

export interface Section {
  type: string;
  weight: number;
  data: Record<string, any>;
  settings: SectionSettings;
  children?: Section[];
}

export interface SectionSettings {
  background: 'light' | 'dark' | 'primary' | 'custom';
  background_color?: string;
  background_image?: string;
  spacing: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
  width: 'contained' | 'wide' | 'full';
  css_class?: string;
  anchor_id?: string;
  hidden?: boolean;
}

export interface SeoData {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  canonical?: string;
}

export interface SiteConfig {
  site_name: string;
  base_url: string;
  theme: string;
  theme_settings?: Record<string, any>;
  seo?: {
    title_separator?: string;
    default_description?: string;
    default_image?: string;
    google_site_verification?: string;
    json_ld?: {
      organization?: { name: string; logo: string; url: string };
    };
  };
}

export interface LayoutProps {
  content: Content;
  site: SiteConfig;
  theme: ThemeConfig;
  themeSettings: Record<string, any>;
  children?: any;
}

export interface SectionProps {
  data: Record<string, any>;
  settings: SectionSettings;
  theme: ThemeConfig;
  themeSettings: Record<string, any>;
}
