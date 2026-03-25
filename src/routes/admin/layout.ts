export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function svgIcon(inner: string): string {
  return `<svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

const ICONS: Record<string, string> = {
  dashboard: svgIcon(
    '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
  ),
  content: svgIcon(
    '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
  ),
  media: svgIcon(
    '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
  ),
  settings: svgIcon(
    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
  ),
  users: svgIcon(
    '<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
  ),
  taxonomy: svgIcon(
    '<path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M14 14h7v7h-7z"/><path d="M3 14h7v7H3z"/><path d="M10 7h4"/><path d="M7 10v4"/><path d="M17 10v4"/>',
  ),
  back: svgIcon('<path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>'),
  external: svgIcon(
    '<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/>',
  ),
};

export interface AdminUser {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export const esc = escapeHtml;

export interface AdminLayoutOptions {
  title: string;
  user: AdminUser;
  activePage: string;
  content: string;
  siteSwitcherHtml?: string;
}

export function adminLayout(opts: AdminLayoutOptions): string {
  const { title, user, activePage, content } = opts;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin' },
    { id: 'content', label: 'Content', href: '/admin/content' },
    { id: 'media', label: 'Media', href: '/admin/media' },
    { id: 'taxonomy', label: 'Taxonomy', href: '/admin/taxonomy' },
    { id: 'settings', label: 'Settings', href: '/admin/settings' },
  ];

  if (user.role === 'admin') {
    navItems.push({ id: 'users', label: 'Users', href: '/admin/users' });
  }

  const sidebarItems = navItems
    .map((item) => {
      const active = item.id === activePage;
      const cls = active
        ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-600 text-white font-medium'
        : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors';
      return `<a href="${item.href}" class="${cls}">${ICONS[item.id] ?? ''}<span>${escapeHtml(item.label)}</span></a>`;
    })
    .join('\n          ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} — Barka Admin</title>
  <meta name="generator" content="BarkaCMS (https://www.barka.dev)">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/htmx.org@2.0.4"></script>
</head>
<body class="bg-gray-50">
  <div class="flex min-h-screen">

    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 w-64 bg-gray-900 flex flex-col z-20">
      <div class="px-5 py-5 border-b border-gray-800">
        <a href="/admin" class="flex items-center gap-2 text-white">
          <span class="text-indigo-400 text-2xl leading-none">&#x2B21;</span>
          <span class="text-lg font-bold tracking-tight">Barka</span>
        </a>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          ${sidebarItems}
      </nav>

      <div class="px-3 py-4 border-t border-gray-800">
        <a href="/" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
          ${ICONS.external}<span>View Site</span>
        </a>
      </div>
    </aside>

    <!-- Main area -->
    <div class="flex-1 ml-64 flex flex-col">

      <!-- Topbar -->
      <header class="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between shrink-0">
        <h2 class="text-base font-semibold text-gray-800">${escapeHtml(title)}</h2>
        <div class="flex items-center gap-4">
          ${opts.siteSwitcherHtml ?? ''}
          <div class="flex items-center gap-2 text-sm">
            <div class="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-xs">
              ${escapeHtml(user.name.charAt(0).toUpperCase())}
            </div>
            <span class="font-medium text-gray-700">${escapeHtml(user.name)}</span>
            <span class="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">${escapeHtml(user.role)}</span>
          </div>
          <button
            hx-post="/api/auth/logout"
            hx-swap="none"
            hx-on::after-request="window.location.href='/admin/login'"
            class="text-sm text-gray-400 hover:text-red-600 transition-colors"
          >Sign out</button>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 p-6">
        ${content}
      </main>

    </div>
  </div>
</body>
</html>`;
}
