import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { getDb } from '../../db/connection.js';
import * as schema from '../../db/schema.js';
import { adminLayout } from './layout.js';
import type { AdminUser } from './layout.js';

type Env = { Variables: { user: AdminUser } };

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + units[i];
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
}

function isImage(mime: string): boolean {
  return mime.startsWith('image/');
}

function fileIcon(mime: string): string {
  if (mime.startsWith('video/')) return '🎬';
  if (mime.startsWith('audio/')) return '🎵';
  if (mime.includes('pdf')) return '📄';
  if (mime.includes('zip') || mime.includes('tar') || mime.includes('gz')) return '📦';
  if (mime.includes('spreadsheet') || mime.includes('csv') || mime.includes('excel')) return '📊';
  if (mime.includes('document') || mime.includes('word')) return '📝';
  return '📎';
}

function renderMediaCard(item: typeof schema.media.$inferSelect): string {
  const preview = isImage(item.mimeType)
    ? `<img src="${esc(item.path)}" alt="${esc(item.alt ?? '')}" loading="lazy" />`
    : `<div class="file-icon">${fileIcon(item.mimeType)}</div>`;

  return `<div class="media-card" id="media-${item.id}">
  <div class="media-preview">${preview}</div>
  <div class="media-meta">
    <span class="media-filename" title="${esc(item.filename)}">${esc(item.filename)}</span>
    <span class="media-size">${formatBytes(item.size)} · ${formatDate(item.createdAt)}</span>
  </div>
  <form class="media-edit" hx-put="/admin/media/${item.id}" hx-target="#media-${item.id}" hx-swap="outerHTML">
    <input type="text" name="alt" value="${esc(item.alt ?? '')}" placeholder="Alt text…" class="alt-input" />
    <div class="media-actions">
      <button type="submit" class="btn btn-sm btn-ghost" title="Save">✓</button>
      <button type="button" class="btn btn-sm btn-danger"
        hx-delete="/admin/media/${item.id}" hx-target="#media-${item.id}" hx-swap="outerHTML"
        hx-confirm="Delete ${esc(item.filename)}?" title="Delete">✕</button>
    </div>
  </form>
</div>`;
}

export function mediaRoutes(dataDir: string, publicDir: string): Hono<Env> {
  const app = new Hono<Env>();
  const mediaDir = path.join(publicDir, 'media');

  // GET /admin/media — media library grid
  app.get('/', (c) => {
    const db = getDb(dataDir);
    const user = c.get('user');
    const items = db.select().from(schema.media).orderBy(desc(schema.media.createdAt)).all();

    const cards = items.length > 0
      ? items.map(renderMediaCard).join('')
      : `<div class="empty-state"><div style="font-size:2.5rem">📁</div><p>No media files yet. Upload your first file above.</p></div>`;

    const content = `
<style>
  .upload-zone {
    border: 2px dashed var(--border); border-radius: var(--radius); padding: 2rem;
    text-align: center; margin-bottom: 1.5rem; transition: all .2s; background: var(--surface);
  }
  .upload-zone.dragover { border-color: var(--primary); background: var(--primary-light); }
  .upload-zone p { color: var(--text-muted); margin-bottom: .75rem; }
  .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
  .media-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    overflow: hidden; transition: box-shadow .15s;
  }
  .media-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,.06); }
  .media-preview { height: 140px; display: flex; align-items: center; justify-content: center; background: #f8fafc; overflow: hidden; }
  .media-preview img { width: 100%; height: 100%; object-fit: cover; }
  .file-icon { font-size: 2.5rem; }
  .media-meta { padding: .5rem .75rem; }
  .media-filename { display: block; font-size: .8rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .media-size { font-size: .7rem; color: var(--text-muted); }
  .media-edit { padding: 0 .75rem .75rem; }
  .alt-input { width: 100%; padding: .3rem .5rem; font-size: .8rem; border: 1px solid var(--border); border-radius: 4px; margin-bottom: .35rem; }
  .alt-input:focus { outline: none; border-color: var(--primary); }
  .media-actions { display: flex; gap: .25rem; justify-content: flex-end; }
</style>

<div id="upload-zone" class="upload-zone">
  <p>Drag &amp; drop files here, or</p>
  <form id="upload-form" hx-post="/admin/media/upload" hx-encoding="multipart/form-data"
        hx-target="#media-grid" hx-swap="afterbegin">
    <input type="file" name="file" id="file-input" style="display:none"
      onchange="if(this.files.length) this.closest('form').requestSubmit()" />
    <button type="button" class="btn btn-primary" onclick="document.getElementById('file-input').click()">Browse files</button>
  </form>
</div>

<div class="media-grid" id="media-grid">${cards}</div>

<script>
(function() {
  var zone = document.getElementById('upload-zone');
  zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', function() { zone.classList.remove('dragover'); });
  zone.addEventListener('drop', function(e) {
    e.preventDefault();
    zone.classList.remove('dragover');
    var files = e.dataTransfer.files;
    if (!files.length) return;
    var input = document.getElementById('file-input');
    input.files = files;
    document.getElementById('upload-form').requestSubmit();
  });
})();
</script>`;

    return c.html(adminLayout({ title: 'Media Library', user, activePage: 'media', content }));
  });

  // POST /admin/media/upload — handle file upload
  app.post('/upload', async (c) => {
    const db = getDb(dataDir);
    const body = await c.req.parseBody();
    const file = body['file'];

    if (!(file instanceof File)) {
      if (c.req.header('HX-Request')) {
        return c.html(`<div class="toast error" style="margin-bottom:.5rem">No file provided</div>`);
      }
      return c.redirect('/admin/media');
    }

    const filename = sanitizeFilename(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());

    fs.mkdirSync(mediaDir, { recursive: true });
    fs.writeFileSync(path.join(mediaDir, filename), buffer);

    const id = crypto.randomUUID();
    const row: typeof schema.media.$inferInsert = {
      id,
      filename,
      path: `/media/${filename}`,
      mimeType: file.type || 'application/octet-stream',
      size: buffer.length,
      alt: null,
      width: null,
      height: null,
      createdAt: new Date(),
    };

    db.insert(schema.media).values(row).run();

    const inserted = db.select().from(schema.media).where(eq(schema.media.id, id)).get()!;
    return c.html(renderMediaCard(inserted));
  });

  // PUT /admin/media/:id — update alt text
  app.put('/:id', async (c) => {
    const db = getDb(dataDir);
    const id = c.req.param('id');
    const body = await c.req.parseBody();
    const alt = typeof body['alt'] === 'string' ? body['alt'] : '';

    db.update(schema.media).set({ alt }).where(eq(schema.media.id, id)).run();

    const updated = db.select().from(schema.media).where(eq(schema.media.id, id)).get();
    if (!updated) {
      return c.html('', 404);
    }
    return c.html(renderMediaCard(updated));
  });

  // DELETE /admin/media/:id — delete media item
  app.delete('/:id', async (c) => {
    const db = getDb(dataDir);
    const id = c.req.param('id');

    const item = db.select().from(schema.media).where(eq(schema.media.id, id)).get();
    if (item) {
      const filePath = path.join(publicDir, item.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      db.delete(schema.media).where(eq(schema.media.id, id)).run();
    }

    return c.html('');
  });

  return app;
}
