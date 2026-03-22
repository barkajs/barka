import { loadSites, type SiteDefinition } from '../../lib/multisite.js';
import { escapeHtml } from './layout.js';

export function renderSiteSwitcher(
  configDir: string,
  currentSiteId?: string,
): string {
  const sites = loadSites(configDir);
  if (sites.length === 0) return '';

  const options = sites
    .map((s) => {
      const selected = s.id === currentSiteId ? ' selected' : '';
      return `<option value="${escapeHtml(s.id)}"${selected}>${escapeHtml(s.label)}</option>`;
    })
    .join('\n              ');

  const allSelected = !currentSiteId ? ' selected' : '';

  return `<div class="flex items-center gap-2">
          <label for="site-switcher" class="text-xs text-gray-500 whitespace-nowrap">Site:</label>
          <select
            id="site-switcher"
            name="site"
            class="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            onchange="document.cookie='barka_site='+this.value+';path=/;max-age=31536000';window.location.reload();"
          >
            <option value=""${allSelected}>All sites</option>
            ${options}
          </select>
        </div>`;
}

export function getSiteIdFromCookie(cookieHeader: string | undefined): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(/(?:^|;\s*)barka_site=([^;]*)/);
  if (!match) return undefined;
  const val = decodeURIComponent(match[1]).trim();
  return val || undefined;
}
