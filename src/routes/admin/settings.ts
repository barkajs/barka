import fs from 'node:fs';
import path from 'node:path';
import { Hono } from 'hono';
import yaml from 'js-yaml';
import { getAvailableThemes, loadThemeConfig } from '../../lib/theme-loader.js';
import type { ThemeSettingDefinition } from '../../lib/theme-types.js';
import type { SiteConfig } from '../../lib/types.js';
import { adminLayout } from './layout.js';
import type { AdminUser } from './layout.js';

type Env = { Variables: { user: AdminUser } };

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function loadSettings(configDir: string): SiteConfig {
  const filePath = path.join(configDir, 'settings.yaml');
  if (!fs.existsSync(filePath)) {
    return { site_name: 'Barka Site', base_url: 'http://localhost:3000', theme: 'starter' };
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = yaml.load(raw) as Partial<SiteConfig> | null;
  return {
    site_name: 'Barka Site',
    base_url: 'http://localhost:3000',
    theme: 'starter',
    ...data,
  };
}

function saveSettings(configDir: string, settings: SiteConfig): void {
  fs.mkdirSync(configDir, { recursive: true });
  const filePath = path.join(configDir, 'settings.yaml');
  fs.writeFileSync(filePath, yaml.dump(settings, { lineWidth: 120 }), 'utf-8');
}

function renderSettingField(
  key: string,
  def: ThemeSettingDefinition,
  value: unknown,
): string {
  const name = `theme_${key}`;
  const label = esc(def.label);
  const current = value ?? def.default ?? '';

  switch (def.type) {
    case 'select': {
      const options = (def.options ?? [])
        .map((o) => `<option value="${esc(o)}"${current === o ? ' selected' : ''}>${esc(o)}</option>`)
        .join('');
      return `<div class="form-group">
        <label for="${name}">${label}</label>
        <select name="${name}" id="${name}">${options}</select>
      </div>`;
    }
    case 'boolean':
      return `<div class="form-group">
        <label style="display:flex;align-items:center;gap:.5rem">
          <input type="checkbox" name="${name}" value="true"${current ? ' checked' : ''} style="width:auto" />
          ${label}
        </label>
      </div>`;
    case 'color':
      return `<div class="form-group">
        <label for="${name}">${label}</label>
        <input type="color" name="${name}" id="${name}" value="${esc(String(current))}" />
      </div>`;
    case 'number':
      return `<div class="form-group">
        <label for="${name}">${label}</label>
        <input type="number" name="${name}" id="${name}" value="${esc(String(current))}" />
      </div>`;
    default:
      return `<div class="form-group">
        <label for="${name}">${label}</label>
        <input type="text" name="${name}" id="${name}" value="${esc(String(current))}" />
      </div>`;
  }
}

export function settingsRoutes(configDir: string, themesDir: string): Hono<Env> {
  const app = new Hono<Env>();

  // GET /admin/settings — settings form
  app.get('/', (c) => {
    const user = c.get('user');
    const settings = loadSettings(configDir);
    const themes = getAvailableThemes(themesDir);

    let themeSettingsHtml = '';
    const activeThemeDir = path.join(themesDir, settings.theme);
    if (fs.existsSync(path.join(activeThemeDir, 'theme.yaml'))) {
      try {
        const themeConfig = loadThemeConfig(activeThemeDir);
        if (themeConfig.settings && Object.keys(themeConfig.settings).length > 0) {
          const currentVals = settings.theme_settings ?? {};
          const fields = Object.entries(themeConfig.settings)
            .map(([key, def]) => renderSettingField(key, def, currentVals[key]))
            .join('');
          themeSettingsHtml = `
          <div class="card" style="margin-top:1.5rem">
            <div class="card-body">
              <h2 style="font-size:1.1rem;font-weight:600;margin-bottom:1rem">Theme Settings — ${esc(themeConfig.label)}</h2>
              ${fields}
            </div>
          </div>`;
        }
      } catch {
        // theme config unreadable — skip
      }
    }

    const themeOptions = themes
      .map((t) => `<option value="${esc(t.name)}"${t.name === settings.theme ? ' selected' : ''}>${esc(t.label)}</option>`)
      .join('');

    const seo = settings.seo ?? {};

    const content = `
<form method="POST" action="/admin/settings" hx-post="/admin/settings" hx-swap="none">

  <div class="card">
    <div class="card-body">
      <h2 style="font-size:1.1rem;font-weight:600;margin-bottom:1rem">Site</h2>
      <div class="form-row">
        <div class="form-group">
          <label for="site_name">Site name</label>
          <input type="text" name="site_name" id="site_name" value="${esc(settings.site_name)}" required />
        </div>
        <div class="form-group">
          <label for="base_url">Base URL</label>
          <input type="url" name="base_url" id="base_url" value="${esc(settings.base_url)}" required />
        </div>
      </div>
      <div class="form-group">
        <label for="theme">Active theme</label>
        <select name="theme" id="theme">${themeOptions}${themes.length === 0 ? `<option value="${esc(settings.theme)}" selected>${esc(settings.theme)}</option>` : ''}</select>
      </div>
    </div>
  </div>

  ${themeSettingsHtml}

  <div class="card" style="margin-top:1.5rem">
    <div class="card-body">
      <h2 style="font-size:1.1rem;font-weight:600;margin-bottom:1rem">SEO</h2>
      <div class="form-group">
        <label for="seo_description">Default description</label>
        <textarea name="seo_description" id="seo_description" rows="2">${esc(seo.default_description ?? '')}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="seo_image">Default OG image URL</label>
          <input type="text" name="seo_image" id="seo_image" value="${esc(seo.default_image ?? '')}" />
        </div>
        <div class="form-group">
          <label for="seo_separator">Title separator</label>
          <input type="text" name="seo_separator" id="seo_separator" value="${esc(seo.title_separator ?? '|')}" />
        </div>
      </div>
      <div class="form-group">
        <label for="seo_google">Google site verification</label>
        <input type="text" name="seo_google" id="seo_google" value="${esc(seo.google_site_verification ?? '')}" />
      </div>
    </div>
  </div>

  <div style="margin-top:1.5rem;display:flex;gap:.5rem">
    <button type="submit" class="btn btn-primary">Save settings</button>
  </div>

</form>`;

    return c.html(adminLayout({ title: 'Settings', user, activePage: 'settings', content }));
  });

  // POST /admin/settings — save settings
  app.post('/', async (c) => {
    const user = c.get('user');
    const body = await c.req.parseBody();

    const val = (key: string): string => {
      const v = body[key];
      return typeof v === 'string' ? v.trim() : '';
    };

    const current = loadSettings(configDir);

    const updated: SiteConfig = {
      site_name: val('site_name') || current.site_name,
      base_url: val('base_url') || current.base_url,
      theme: val('theme') || current.theme,
    };

    // Collect theme settings from theme_ prefixed fields
    const themeSettings: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (key.startsWith('theme_') && typeof value === 'string') {
        themeSettings[key.slice(6)] = value === 'true' ? true : value;
      }
    }
    if (Object.keys(themeSettings).length > 0) {
      updated.theme_settings = themeSettings as Record<string, string>;
    }

    // SEO
    const seoDesc = val('seo_description');
    const seoImage = val('seo_image');
    const seoSep = val('seo_separator');
    const seoGoogle = val('seo_google');

    if (seoDesc || seoImage || seoSep || seoGoogle) {
      updated.seo = {
        ...(current.seo ?? {}),
        default_description: seoDesc || undefined,
        default_image: seoImage || undefined,
        title_separator: seoSep || undefined,
        google_site_verification: seoGoogle || undefined,
      };
    } else if (current.seo) {
      updated.seo = current.seo;
    }

    saveSettings(configDir, updated);

    if (c.req.header('HX-Request')) {
      c.header('HX-Trigger', JSON.stringify({ showToast: 'Settings saved' }));
      c.header('X-Toast', 'Settings saved');
      c.header('X-Toast-Type', 'success');
      return c.html('');
    }

    return c.redirect('/admin/settings');
  });

  return app;
}
