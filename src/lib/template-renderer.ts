import { pathToFileURL } from 'node:url';
import { raw } from 'hono/html';
import type { Content, Section, SiteConfig } from './types.js';
import type { ThemeConfig, ThemeResolver } from './theme-types.js';

/**
 * Dynamically import a TSX template and return its default export.
 * Templates are Hono JSX components loaded at runtime via tsx.
 */
async function loadTemplate(filePath: string): Promise<(props: any) => any> {
  const mod = await import(pathToFileURL(filePath).href);
  if (!mod.default || typeof mod.default !== 'function') {
    throw new Error(`Template ${filePath} must export a default function component`);
  }
  return mod.default;
}

/**
 * Convert a Hono JSX element to an HTML string.
 * Hono JSX elements implement toString() which produces HTML markup.
 */
function jsxToString(element: any): string {
  if (element == null) return '';
  if (typeof element === 'string') return element;
  return element.toString();
}

export async function renderSection(
  section: Section,
  themeResolver: ThemeResolver,
  themeConfig: ThemeConfig,
  themeSettings: Record<string, any>,
): Promise<string> {
  if (section.settings.hidden) return '';

  const templatePath = themeResolver.resolveSection(section.type);
  if (!templatePath) {
    return `<!-- unknown section type: ${section.type} -->`;
  }

  const Component = await loadTemplate(templatePath);
  const element = Component({
    data: section.data,
    settings: section.settings,
    theme: themeConfig,
    themeSettings,
  });

  return jsxToString(element);
}

export async function renderSections(
  sections: Section[],
  themeResolver: ThemeResolver,
  themeConfig: ThemeConfig,
  themeSettings: Record<string, any>,
): Promise<string> {
  const sorted = [...sections].sort((a, b) => a.weight - b.weight);
  const parts: string[] = [];

  for (const section of sorted) {
    parts.push(
      await renderSection(section, themeResolver, themeConfig, themeSettings),
    );
  }

  return parts.join('\n');
}

export async function renderContent(
  content: Content,
  siteConfig: SiteConfig,
  themeResolver: ThemeResolver,
  themeSettings: Record<string, any>,
): Promise<string> {
  const themeConfig = themeResolver.getConfig();

  const layoutPath = themeResolver.resolveLayout(content.type, content.slug);
  if (!layoutPath) {
    throw new Error(
      `No layout found for content type "${content.type}" (slug: "${content.slug}")`,
    );
  }

  const Layout = await loadTemplate(layoutPath);

  let sectionsHtml = '';
  if (content.sections && content.sections.length > 0) {
    sectionsHtml = await renderSections(
      content.sections,
      themeResolver,
      themeConfig,
      themeSettings,
    );
  }

  const normalizedType = content.type.replace(/_/g, '-');
  const isLanding = normalizedType === 'landing-page';
  const children = isLanding
    ? raw(sectionsHtml)
    : sectionsHtml
      ? raw(sectionsHtml)
      : undefined;

  const element = Layout({
    content,
    site: siteConfig,
    theme: themeConfig,
    themeSettings,
    children,
  });

  const html = jsxToString(element);

  if (!html.startsWith('<!DOCTYPE') && !html.startsWith('<!doctype')) {
    return `<!DOCTYPE html>\n${html}`;
  }
  return html;
}
