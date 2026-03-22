import type { Context } from 'hono';
import { count, eq, desc } from 'drizzle-orm';
import { getDb } from '../../db/connection.js';
import * as schema from '../../db/schema.js';
import { adminLayout, escapeHtml } from './layout.js';
import type { AdminEnv } from './middleware.js';

function statusBadge(status: string): string {
  switch (status) {
    case 'published':
      return '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Published</span>';
    case 'draft':
      return '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Draft</span>';
    case 'archived':
      return '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Archived</span>';
    default:
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">${escapeHtml(status)}</span>`;
  }
}

function formatDate(date: Date | null): string {
  if (!date) return '\u2014';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function statCard(label: string, value: number, color: string): string {
  const palette: Record<string, string> = {
    indigo: 'text-indigo-700',
    green: 'text-green-700',
    yellow: 'text-yellow-700',
    blue: 'text-blue-700',
  };
  const textCls = palette[color] ?? palette.indigo;
  return `<div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
    <p class="text-sm font-medium text-gray-500">${escapeHtml(label)}</p>
    <p class="mt-2 text-3xl font-bold ${textCls}">${value}</p>
  </div>`;
}

export function dashboardHandler(dataDir: string) {
  return async (c: Context<AdminEnv>) => {
    const user = c.get('user');
    const db = getDb(dataDir);

    const totalContent = db.select({ value: count() }).from(schema.content).get()?.value ?? 0;
    const publishedCount = db.select({ value: count() }).from(schema.content).where(eq(schema.content.status, 'published')).get()?.value ?? 0;
    const draftCount = db.select({ value: count() }).from(schema.content).where(eq(schema.content.status, 'draft')).get()?.value ?? 0;
    const totalUsers = db.select({ value: count() }).from(schema.users).get()?.value ?? 0;

    const recentContent = db
      .select()
      .from(schema.content)
      .orderBy(desc(schema.content.updatedAt))
      .limit(5)
      .all();

    const recentRows = recentContent.length > 0
      ? recentContent
          .map(
            (item) => `<tr class="border-t border-gray-100">
            <td class="px-5 py-3">
              <a href="/admin/content/${escapeHtml(item.id)}/edit" class="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors">${escapeHtml(item.title)}</a>
            </td>
            <td class="px-5 py-3 text-sm text-gray-500">${escapeHtml(item.type)}</td>
            <td class="px-5 py-3">${statusBadge(item.status)}</td>
            <td class="px-5 py-3 text-sm text-gray-400">${formatDate(item.updatedAt)}</td>
          </tr>`,
          )
          .join('\n')
      : '<tr><td colspan="4" class="px-5 py-8 text-center text-sm text-gray-400">No content yet</td></tr>';

    const content = `
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Welcome back, ${escapeHtml(user.name)}</h1>
        <p class="mt-1 text-sm text-gray-500">Here\u2019s what\u2019s happening with your site.</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        ${statCard('Total Content', totalContent, 'indigo')}
        ${statCard('Published', publishedCount, 'green')}
        ${statCard('Drafts', draftCount, 'yellow')}
        ${statCard('Users', totalUsers, 'blue')}
      </div>

      <!-- Quick Actions -->
      <div class="flex gap-3 mb-8">
        <a href="/admin/content/new?type=article" class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          New Article
        </a>
        <a href="/admin/content/new?type=page" class="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          New Page
        </a>
      </div>

      <!-- Recent Content -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900">Recent Content</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th class="px-5 py-3">Title</th>
                <th class="px-5 py-3">Type</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              ${recentRows}
            </tbody>
          </table>
        </div>
      </div>
    `;

    return c.html(
      adminLayout({
        title: 'Dashboard',
        user,
        activePage: 'dashboard',
        content,
      }),
    );
  };
}
