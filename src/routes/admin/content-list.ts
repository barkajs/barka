import { Hono } from 'hono';
import { eq, desc, and, sql } from 'drizzle-orm';
import { getDb } from '../../db/connection.js';
import * as schema from '../../db/schema.js';
import { loadContentTypes } from '../../lib/config-files.js';
import { adminLayout, esc } from './layout.js';
import type { AdminUser } from './layout.js';

type AdminEnv = {
  Variables: { user: AdminUser };
};

const PER_PAGE = 20;

function statusBadge(status: string): string {
  const styles: Record<string, string> = {
    published: 'background:#dcfce7;color:#166534',
    draft: 'background:#fef9c3;color:#854d0e',
    archived: 'background:#f1f5f9;color:#475569',
  };
  const style = styles[status] ?? styles.archived;
  return `<span class="badge" style="${style}">${esc(status)}</span>`;
}

function formatDate(date: Date | null): string {
  if (!date) return '—';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function filterParams(type: string, status: string, page: number): string {
  const p = new URLSearchParams();
  if (type) p.set('type', type);
  if (status) p.set('status', status);
  if (page > 1) p.set('page', String(page));
  const qs = p.toString();
  return qs ? `?${qs}` : '';
}

function renderTablePartial(
  items: (typeof schema.content.$inferSelect)[],
  typeLabels: Record<string, string>,
  total: number,
  page: number,
  typeFilter: string,
  statusFilter: string,
): string {
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const rows = items.length === 0
    ? `<tr><td colspan="5"><div class="empty-state"><p>No content found.</p></div></td></tr>`
    : items.map((item) => `<tr id="row-${esc(item.id)}">
          <td><a href="/admin/content/${esc(item.id)}" style="color:var(--primary);text-decoration:none;font-weight:500">${esc(item.title)}</a></td>
          <td style="color:var(--text-muted)">${esc(typeLabels[item.type] ?? item.type)}</td>
          <td>${statusBadge(item.status)}</td>
          <td style="color:var(--text-muted)">${formatDate(item.updatedAt)}</td>
          <td style="text-align:right">
            <button class="btn btn-ghost btn-sm"
              hx-delete="/admin/content/${esc(item.id)}"
              hx-confirm="Delete &quot;${esc(item.title)}&quot;? This cannot be undone."
              hx-target="#row-${esc(item.id)}"
              hx-swap="outerHTML"
              style="color:var(--danger)">Delete</button>
          </td>
        </tr>`).join('');

  const pagination: string[] = [];
  if (totalPages > 1) {
    if (page > 1) {
      const href = `/admin/content${filterParams(typeFilter, statusFilter, page - 1)}`;
      pagination.push(`<a href="${href}" hx-get="${href}" hx-target="#content-table" hx-push-url="true" class="btn btn-ghost btn-sm">&larr; Prev</a>`);
    }
    pagination.push(`<span style="font-size:.8rem;color:var(--text-muted)">Page ${page} of ${totalPages}</span>`);
    if (page < totalPages) {
      const href = `/admin/content${filterParams(typeFilter, statusFilter, page + 1)}`;
      pagination.push(`<a href="${href}" hx-get="${href}" hx-target="#content-table" hx-push-url="true" class="btn btn-ghost btn-sm">Next &rarr;</a>`);
    }
  }

  return `
    <table>
      <thead><tr>
        <th>Title</th><th>Type</th><th>Status</th><th>Updated</th><th style="width:80px"></th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${pagination.length ? `<div style="display:flex;align-items:center;justify-content:center;gap:.5rem;padding:1rem">${pagination.join('')}</div>` : ''}
  `;
}

export function contentListRoutes(dataDir: string, configDir: string): Hono<AdminEnv> {
  const routes = new Hono<AdminEnv>();

  routes.get('/', async (c) => {
    const db = getDb(dataDir);
    const user = c.get('user');
    const contentTypes = loadContentTypes(configDir);

    const typeLabels: Record<string, string> = {};
    for (const ct of contentTypes) typeLabels[ct.name] = ct.label;

    const typeFilter = c.req.query('type') ?? '';
    const statusFilter = c.req.query('status') ?? '';
    const page = Math.max(1, parseInt(c.req.query('page') ?? '1', 10));
    const offset = (page - 1) * PER_PAGE;

    const conditions = [];
    if (typeFilter) conditions.push(eq(schema.content.type, typeFilter));
    if (statusFilter) conditions.push(eq(schema.content.status, statusFilter));
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const totalRow = db
      .select({ value: sql<number>`count(*)` })
      .from(schema.content)
      .where(where)
      .get();
    const total = totalRow?.value ?? 0;

    const items = db
      .select()
      .from(schema.content)
      .where(where)
      .orderBy(desc(schema.content.updatedAt))
      .limit(PER_PAGE)
      .offset(offset)
      .all();

    const tableHtml = renderTablePartial(items, typeLabels, total, page, typeFilter, statusFilter);

    if (c.req.header('HX-Request')) {
      return c.html(tableHtml);
    }

    const typeOptions = contentTypes
      .map((ct) => `<option value="${esc(ct.name)}"${typeFilter === ct.name ? ' selected' : ''}>${esc(ct.label)}</option>`)
      .join('');

    const statusOptions = ['published', 'draft', 'archived']
      .map((s) => `<option value="${s}"${statusFilter === s ? ' selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`)
      .join('');

    const newLinks = contentTypes
      .map((ct) => `<a href="/admin/content/new/${esc(ct.name)}" class="dropdown-link">${esc(ct.label)}</a>`)
      .join('');

    const saved = c.req.query('saved');
    const deleted = c.req.query('deleted');
    const flash = saved
      ? '<div class="alert alert-success">Content saved successfully.</div>'
      : deleted
        ? '<div class="alert alert-success">Content deleted.</div>'
        : '';

    const pageContent = `
      <style>
        .content-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;flex-wrap:wrap;gap:.75rem}
        .content-filters{display:flex;gap:.5rem;align-items:center}
        .content-filters select{padding:.45rem .75rem;border:1px solid var(--border);border-radius:var(--radius);font-size:.875rem;background:var(--surface);color:var(--text)}
        .new-dropdown{position:relative;display:inline-block}
        .new-dropdown-menu{display:none;position:absolute;right:0;top:calc(100% + 4px);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 4px 12px rgba(0,0,0,.1);min-width:180px;z-index:10;overflow:hidden}
        .new-dropdown:hover .new-dropdown-menu{display:block}
        .dropdown-link{display:block;padding:.5rem 1rem;text-decoration:none;color:var(--text);font-size:.875rem}
        .dropdown-link:hover{background:var(--bg)}
      </style>
      ${flash}
      <div class="content-toolbar">
        <div class="content-filters" id="content-filters">
          <select name="type" hx-get="/admin/content" hx-target="#content-table" hx-include="#content-filters" hx-push-url="true">
            <option value="">All types</option>
            ${typeOptions}
          </select>
          <select name="status" hx-get="/admin/content" hx-target="#content-table" hx-include="#content-filters" hx-push-url="true">
            <option value="">All statuses</option>
            ${statusOptions}
          </select>
        </div>
        <div class="new-dropdown">
          <button class="btn btn-primary">+ New</button>
          <div class="new-dropdown-menu">${newLinks}</div>
        </div>
      </div>
      <div class="card">
        <div id="content-table">${tableHtml}</div>
      </div>
    `;

    return c.html(adminLayout({ title: 'Content', user, activePage: 'content', content: pageContent }));
  });

  return routes;
}
