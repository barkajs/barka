import crypto from 'node:crypto';
import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { getDb } from '../../db/connection.js';
import * as schema from '../../db/schema.js';
import { loadContentTypes } from '../../lib/config-files.js';
import { adminLayout, esc } from './layout.js';
import type { AdminUser } from './layout.js';
import type { ContentType, FieldDefinition } from '../../lib/types.js';

type AdminEnv = {
  Variables: { user: AdminUser };
};

// ---------------------------------------------------------------------------
// Dynamic field renderer
// ---------------------------------------------------------------------------

function renderField(name: string, def: FieldDefinition, value: unknown): string {
  const id = `field-${name}`;
  const inputName = `_field_${name}`;
  const strVal = value != null ? String(value) : (def.default != null ? String(def.default) : '');
  const req = def.required ? ' required' : '';
  const reqMark = def.required ? ' <span style="color:var(--danger)">*</span>' : '';
  const label = `<label for="${id}">${esc(def.label)}${reqMark}</label>`;

  switch (def.type) {
    case 'text':
      return `<div class="form-group">${label}<input type="text" id="${id}" name="${inputName}" value="${esc(strVal)}"${req}></div>`;

    case 'textarea':
      return `<div class="form-group">${label}<textarea id="${id}" name="${inputName}" rows="4"${req}>${esc(strVal)}</textarea></div>`;

    case 'number':
      return `<div class="form-group">${label}<input type="number" id="${id}" name="${inputName}" value="${esc(strVal)}"${req}></div>`;

    case 'boolean': {
      const checked = value === true || value === 'true' || value === '1' || value === 'on';
      return `<div class="form-group" style="display:flex;align-items:center;gap:.5rem;padding-top:.25rem">
        <input type="checkbox" id="${id}" name="${inputName}" value="1"${checked ? ' checked' : ''} style="width:16px;height:16px">
        <label for="${id}" style="margin:0">${esc(def.label)}</label>
      </div>`;
    }

    case 'select': {
      const options = (def.options ?? [])
        .map((o) => `<option value="${esc(o)}"${strVal === o ? ' selected' : ''}>${esc(o)}</option>`)
        .join('');
      return `<div class="form-group">${label}<select id="${id}" name="${inputName}"${req}><option value="">— Select —</option>${options}</select></div>`;
    }

    case 'media':
      return `<div class="form-group">${label}<input type="text" id="${id}" name="${inputName}" value="${esc(strVal)}" placeholder="File path or URL"></div>`;

    default:
      return `<div class="form-group">${label}<input type="text" id="${id}" name="${inputName}" value="${esc(strVal)}"${req}></div>`;
  }
}

// ---------------------------------------------------------------------------
// Edit / create form
// ---------------------------------------------------------------------------

function renderForm(opts: {
  contentType: ContentType;
  item: typeof schema.content.$inferSelect | null;
  user: AdminUser;
}): string {
  const { contentType, item, user } = opts;
  const isNew = !item;
  const title = item?.title ?? '';
  const slug = item?.slug ?? '';
  const body = item?.body ?? '';
  const status = item?.status ?? 'draft';
  const fields = (item?.fields ?? {}) as Record<string, unknown>;

  const seoTitle = String(fields._seo_title ?? '');
  const seoDesc = String(fields._seo_description ?? '');
  const seoImage = String(fields._seo_image ?? '');
  const seoNoindex = fields._seo_noindex === true || fields._seo_noindex === 'true';

  const action = isNew ? '/admin/content' : `/admin/content/${item!.id}`;
  const hxMethod = isNew ? 'hx-post' : 'hx-put';

  const customFields = Object.entries(contentType.fields)
    .map(([n, d]) => renderField(n, d, fields[n]))
    .join('');

  return `
    <style>
      .edit-grid{display:grid;grid-template-columns:2fr 1fr;gap:1.25rem}
      @media(max-width:900px){.edit-grid{grid-template-columns:1fr}}
      .edit-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem}
      .seo-toggle{display:flex;align-items:center;justify-content:space-between;width:100%;background:none;border:1px solid var(--border);border-radius:var(--radius);padding:.6rem 1rem;font-size:.875rem;cursor:pointer;color:var(--text-muted)}
      .seo-panel{display:none}
      .seo-panel.open{display:block}
      .sidebar-section+.sidebar-section{margin-top:1rem}
    </style>

    <form ${hxMethod}="${esc(action)}">
      <div class="edit-top">
        <a href="/admin/content" class="btn btn-ghost">&larr; Back</a>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>

      ${isNew ? `<input type="hidden" name="type" value="${esc(contentType.name)}">` : ''}
      <input type="hidden" name="authorId" value="${esc(user.userId)}">

      <div class="edit-grid">
        <!-- Main -->
        <div>
          <div class="card card-body">
            <div class="form-group">
              <label for="title">Title</label>
              <input type="text" id="title" name="title" value="${esc(title)}" required
                oninput="document.getElementById('slug').value=this.value.toLowerCase().replace(/\\s+/g,'-').replace(/[^a-z0-9-]/g,'')">
            </div>
            <div class="form-group">
              <label for="slug">Slug</label>
              <input type="text" id="slug" name="slug" value="${esc(slug)}" required style="color:var(--text-muted)">
            </div>
            <div class="form-group">
              <label for="body">Body <span style="color:var(--text-muted);font-weight:400">(Markdown)</span></label>
              <textarea id="body" name="body" rows="18" style="font-family:ui-monospace,SFMono-Regular,monospace;font-size:.8rem">${esc(body)}</textarea>
            </div>
          </div>

          ${!isNew && item ? `<div style="margin-top:1.25rem">
            <div class="card card-body">
              <div style="font-weight:600;font-size:.95rem;margin-bottom:.75rem">Sections</div>
              <div hx-get="/admin/content/${item.id}/sections" hx-trigger="load" hx-swap="innerHTML" id="sections-container">
                <span style="color:var(--text-muted);font-size:.875rem">Loading sections…</span>
              </div>
            </div>
          </div>` : ''}

          <div style="margin-top:1.25rem">
            <button type="button" class="seo-toggle" onclick="this.nextElementSibling.classList.toggle('open');this.querySelector('span').textContent=this.nextElementSibling.classList.contains('open')?'▲':'▼'">
              SEO Settings <span>▼</span>
            </button>
            <div class="seo-panel card card-body" style="border-top:none;border-radius:0 0 var(--radius) var(--radius)">
              <div class="form-group">
                <label for="seo_title">Title override</label>
                <input type="text" id="seo_title" name="_seo_title" value="${esc(seoTitle)}" placeholder="Leave blank to use content title">
              </div>
              <div class="form-group">
                <label for="seo_description">Meta description</label>
                <textarea id="seo_description" name="_seo_description" rows="3" placeholder="Brief description for search engines">${esc(seoDesc)}</textarea>
              </div>
              <div class="form-group">
                <label for="seo_image">OG Image</label>
                <input type="text" id="seo_image" name="_seo_image" value="${esc(seoImage)}" placeholder="URL or file path">
              </div>
              <div class="form-group" style="display:flex;align-items:center;gap:.5rem">
                <input type="checkbox" id="seo_noindex" name="_seo_noindex" value="true"${seoNoindex ? ' checked' : ''} style="width:16px;height:16px">
                <label for="seo_noindex" style="margin:0">Prevent indexing (noindex)</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div>
          <div class="card card-body sidebar-section">
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" name="status">
                <option value="draft"${status === 'draft' ? ' selected' : ''}>Draft</option>
                <option value="published"${status === 'published' ? ' selected' : ''}>Published</option>
                <option value="archived"${status === 'archived' ? ' selected' : ''}>Archived</option>
              </select>
            </div>
            <div class="form-group">
              <label>Content type</label>
              <input type="text" value="${esc(contentType.label)}" disabled style="background:var(--bg);color:var(--text-muted)">
            </div>
          </div>
          ${customFields ? `<div class="card card-body sidebar-section"><div style="font-weight:600;font-size:.875rem;margin-bottom:.75rem">Fields</div>${customFields}</div>` : ''}
        </div>
      </div>
    </form>`;
}

// ---------------------------------------------------------------------------
// Parse submitted form data
// ---------------------------------------------------------------------------

function parseFormBody(body: Record<string, string | File>): {
  title: string;
  slug: string;
  status: string;
  bodyText: string;
  type: string;
  authorId: string;
  fields: Record<string, unknown>;
} {
  const fields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value !== 'string') continue;
    if (key.startsWith('_field_')) fields[key.slice(7)] = value;
    if (key.startsWith('_seo_')) fields[key] = value === 'true' ? true : value;
  }
  return {
    title: String(body.title ?? ''),
    slug: String(body.slug ?? ''),
    status: String(body.status ?? 'draft'),
    bodyText: String(body.body ?? ''),
    type: String(body.type ?? ''),
    authorId: String(body.authorId ?? ''),
    fields,
  };
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export function contentEditRoutes(dataDir: string, configDir: string): Hono<AdminEnv> {
  const routes = new Hono<AdminEnv>();

  // Create form
  routes.get('/new/:type', async (c) => {
    const user = c.get('user');
    const typeName = c.req.param('type');
    const contentTypes = loadContentTypes(configDir);
    const contentType = contentTypes.find((ct) => ct.name === typeName);

    if (!contentType) {
      return c.html(adminLayout({
        title: 'Not Found',
        user,
        activePage: 'content',
        content: '<div class="empty-state"><p>Content type not found.</p></div>',
      }), 404);
    }

    return c.html(adminLayout({
      title: `New ${contentType.label}`,
      user,
      activePage: 'content',
      content: renderForm({ contentType, item: null, user }),
    }));
  });

  // Edit form
  routes.get('/:id', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');
    const db = getDb(dataDir);

    const item = db.select().from(schema.content).where(eq(schema.content.id, id)).get();
    if (!item) {
      return c.html(adminLayout({
        title: 'Not Found',
        user,
        activePage: 'content',
        content: '<div class="empty-state"><p>Content not found.</p></div>',
      }), 404);
    }

    const contentTypes = loadContentTypes(configDir);
    const contentType = contentTypes.find((ct) => ct.name === item.type) ?? {
      name: item.type,
      label: item.type,
      fields: {},
    };

    return c.html(adminLayout({
      title: `Edit: ${item.title}`,
      user,
      activePage: 'content',
      content: renderForm({ contentType, item, user }),
    }));
  });

  // Create
  routes.post('/', async (c) => {
    const db = getDb(dataDir);
    const body = await c.req.parseBody();
    const parsed = parseFormBody(body as Record<string, string | File>);
    const now = new Date();
    const id = crypto.randomUUID();

    db.insert(schema.content).values({
      id,
      type: parsed.type,
      title: parsed.title,
      slug: parsed.slug,
      status: parsed.status,
      langcode: 'en',
      body: parsed.bodyText,
      fields: parsed.fields,
      authorId: parsed.authorId || null,
      createdAt: now,
      updatedAt: now,
      publishedAt: parsed.status === 'published' ? now : null,
    }).run();

    db.insert(schema.contentRevisions).values({
      id: crypto.randomUUID(),
      contentId: id,
      version: 1,
      data: { title: parsed.title, slug: parsed.slug, status: parsed.status, body: parsed.bodyText, fields: parsed.fields },
      message: 'Initial version',
      userId: parsed.authorId || null,
      createdAt: now,
    }).run();

    if (c.req.header('HX-Request')) {
      c.header('HX-Redirect', '/admin/content?saved=1');
      return c.body(null, 204);
    }
    return c.redirect('/admin/content?saved=1');
  });

  // Update
  routes.put('/:id', async (c) => {
    const db = getDb(dataDir);
    const id = c.req.param('id');
    const body = await c.req.parseBody();
    const parsed = parseFormBody(body as Record<string, string | File>);
    const now = new Date();

    const existing = db.select().from(schema.content).where(eq(schema.content.id, id)).get();
    if (!existing) {
      return c.json({ error: 'Content not found' }, 404);
    }

    db.update(schema.content).set({
      title: parsed.title,
      slug: parsed.slug,
      status: parsed.status,
      body: parsed.bodyText,
      fields: parsed.fields,
      updatedAt: now,
      publishedAt: parsed.status === 'published' && !existing.publishedAt ? now : existing.publishedAt,
    }).where(eq(schema.content.id, id)).run();

    const lastRev = db
      .select()
      .from(schema.contentRevisions)
      .where(eq(schema.contentRevisions.contentId, id))
      .orderBy(desc(schema.contentRevisions.version))
      .limit(1)
      .get();
    const nextVersion = (lastRev?.version ?? 0) + 1;

    db.insert(schema.contentRevisions).values({
      id: crypto.randomUUID(),
      contentId: id,
      version: nextVersion,
      data: { title: parsed.title, slug: parsed.slug, status: parsed.status, body: parsed.bodyText, fields: parsed.fields },
      message: `Revision ${nextVersion}`,
      userId: parsed.authorId || null,
      createdAt: now,
    }).run();

    if (c.req.header('HX-Request')) {
      c.header('HX-Redirect', '/admin/content?saved=1');
      return c.body(null, 204);
    }
    return c.redirect('/admin/content?saved=1');
  });

  // Delete
  routes.delete('/:id', async (c) => {
    const db = getDb(dataDir);
    const id = c.req.param('id');

    db.delete(schema.content).where(eq(schema.content.id, id)).run();

    if (c.req.header('HX-Request')) {
      return c.body(null, 200);
    }
    return c.redirect('/admin/content?deleted=1');
  });

  return routes;
}
