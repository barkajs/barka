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

export interface ContentType {
  name: string;
  label: string;
  fields: Record<string, FieldDefinition>;
  path_pattern?: string;
}

export interface FieldDefinition {
  type: string;
  label: string;
  required?: boolean;
  default?: any;
  options?: string[];
  fields?: Record<string, FieldDefinition>;
}

export interface SectionType {
  name: string;
  label: string;
  fields: Record<string, FieldDefinition>;
  icon?: string;
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
    feeds?: Array<{ type: string; path: string; content_types: string[]; limit: number }>;
    json_ld?: {
      organization?: { name: string; logo: string; url: string };
    };
  };
}

export interface SectionTypeDefaults {
  settings: Record<string, FieldDefinition>;
}
