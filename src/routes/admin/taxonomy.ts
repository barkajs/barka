import { Hono } from 'hono';
import { sql } from 'drizzle-orm';
import { getDb } from '../../db/connection.js';
import * as dbSchema from '../../db/schema.js';
import { adminLayout, esc } from './layout.js';
import type { AdminUser } from './layout.js';
import {
  loadTaxonomies,
  getTerms,
  buildTermTree,
  createTerm,
  updateTerm,
  deleteTerm,
} from '../../lib/taxonomy.js';
import type { TaxonomyTerm, Vocabulary } from '../../lib/taxonomy.js';

type Env = { Variables: { user: AdminUser } };

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function renderTermRow(term: TaxonomyTerm, vocab: string, depth = 0): string {
  const indent = depth * 24;
  const childrenHtml = term.children
    ? term.children
        .sort((a, b) => a.weight - b.weight)
        .map((c) => renderTermRow(c, vocab, depth + 1))
        .join('')
    : '';

  return `<tr id="term-${esc(term.id)}" class="term-row" data-id="${esc(term.id)}" data-weight="${term.weight}">
  <td style="padding-left:${indent + 12}px">
    <span class="drag-handle" title="Drag to reorder" style="cursor:grab;margin-right:8px;color:var(--text-muted)">⠿</span>
    <span class="term-name"
      hx-get="/admin/taxonomy/${esc(vocab)}/${esc(term.id)}/edit-inline"
      hx-target="#term-name-${esc(term.id)}"
      hx-swap="innerHTML"
      style="cursor:pointer;font-weight:500"
      id="term-name-${esc(term.id)}">${esc(term.name)}</span>
  </td>
  <td style="color:var(--text-muted);font-family:monospace;font-size:.8rem">${esc(term.slug)}</td>
  <td style="color:var(--text-muted);font-size:.85rem">${esc(term.langcode)}</td>
  <td style="text-align:right">
    <button class="btn btn-ghost btn-sm"
      hx-delete="/admin/taxonomy/${esc(vocab)}/${esc(term.id)}"
      hx-confirm="Delete &quot;${esc(term.name)}&quot;?"
      hx-target="#term-${esc(term.id)}"
      hx-swap="outerHTML"
      style="color:var(--danger)">Delete</button>
  </td>
</tr>${childrenHtml}`;
}

function renderTermsTable(
  terms: TaxonomyTerm[],
  vocab: string,
  hierarchical: boolean,
): string {
  const displayTerms = hierarchical ? buildTermTree(terms) : terms;
  const sorted = displayTerms.sort((a, b) => a.weight - b.weight);

  if (sorted.length === 0) {
    return `<div class="empty-state" style="padding:2rem;text-align:center;color:var(--text-muted)">
      <p>No terms yet. Add your first term above.</p>
    </div>`;
  }

  const rows = sorted.map((t) => renderTermRow(t, vocab)).join('');

  return `<table>
    <thead><tr>
      <th>Name</th><th>Slug</th><th>Language</th><th style="width:80px"></th>
    </tr></thead>
    <tbody id="terms-body">${rows}</tbody>
  </table>`;
}

export function taxonomyRoutes(dataDir: string, configDir: string): Hono<Env> {
  const app = new Hono<Env>();

  // GET / — vocabulary list
  app.get('/', (c) => {
    const db = getDb(dataDir);
    const user = c.get('user');
    const vocabularies = loadTaxonomies(configDir);

    const counts: Record<string, number> = {};
    for (const vocab of vocabularies) {
      const row = db
        .select({ value: sql<number>`count(*)` })
        .from(dbSchema.taxonomyTerms)
        .where(sql`vocabulary = ${vocab.name}`)
        .get();
      counts[vocab.name] = row?.value ?? 0;
    }

    const cards = vocabularies.length === 0
      ? `<div class="empty-state" style="padding:2rem;text-align:center;color:var(--text-muted)">
          <p>No vocabularies defined. Add them in <code>config/taxonomies.yaml</code>.</p>
        </div>`
      : vocabularies
          .map(
            (v) => `<a href="/admin/taxonomy/${esc(v.name)}" class="vocab-card">
        <div class="vocab-card-header">
          <h3 class="vocab-label">${esc(v.label)}</h3>
          <span class="vocab-count">${counts[v.name]} term${counts[v.name] === 1 ? '' : 's'}</span>
        </div>
        ${v.description ? `<p class="vocab-desc">${esc(v.description)}</p>` : ''}
        <div class="vocab-meta">
          <span class="badge" style="background:${v.hierarchical ? '#dbeafe;color:#1e40af' : '#f3e8ff;color:#7c3aed'}">${v.hierarchical ? 'Hierarchical' : 'Flat'}</span>
        </div>
      </a>`,
          )
          .join('');

    const content = `
<style>
  .vocab-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem}
  .vocab-card{display:block;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem;text-decoration:none;color:inherit;transition:box-shadow .15s,border-color .15s}
  .vocab-card:hover{box-shadow:0 2px 8px rgba(0,0,0,.06);border-color:var(--primary)}
  .vocab-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem}
  .vocab-label{font-size:1rem;font-weight:600;margin:0;color:var(--text)}
  .vocab-count{font-size:.8rem;color:var(--text-muted);background:var(--bg);padding:.15rem .5rem;border-radius:999px}
  .vocab-desc{font-size:.85rem;color:var(--text-muted);margin:0 0 .75rem}
  .vocab-meta{display:flex;gap:.5rem}
</style>
<div class="vocab-grid">${cards}</div>`;

    return c.html(
      adminLayout({ title: 'Taxonomy', user, activePage: 'taxonomy', content }),
    );
  });

  // GET /:vocabulary — term list
  app.get('/:vocabulary', (c) => {
    const db = getDb(dataDir);
    const user = c.get('user');
    const vocabName = c.req.param('vocabulary');
    const vocabularies = loadTaxonomies(configDir);
    const vocab = vocabularies.find((v) => v.name === vocabName);

    if (!vocab) {
      return c.html(
        adminLayout({
          title: 'Not Found',
          user,
          activePage: 'taxonomy',
          content: '<p>Vocabulary not found.</p>',
        }),
        404,
      );
    }

    const terms = getTerms(db, vocabName);
    const tableHtml = renderTermsTable(terms, vocabName, vocab.hierarchical);

    if (c.req.header('HX-Request')) {
      return c.html(tableHtml);
    }

    const parentOptions = vocab.hierarchical
      ? terms
          .filter((t) => !t.parentId)
          .map(
            (t) =>
              `<option value="${esc(t.id)}">${esc(t.name)}</option>`,
          )
          .join('')
      : '';

    const content = `
<style>
  .taxonomy-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;flex-wrap:wrap;gap:.75rem}
  .add-term-form{display:flex;gap:.5rem;align-items:center;flex-wrap:wrap}
  .add-term-form input,.add-term-form select{padding:.45rem .75rem;border:1px solid var(--border);border-radius:var(--radius);font-size:.875rem;background:var(--surface);color:var(--text)}
  .add-term-form input:focus,.add-term-form select:focus{outline:none;border-color:var(--primary)}
  .drag-handle:hover{color:var(--text)!important}
</style>

<div class="taxonomy-toolbar">
  <a href="/admin/taxonomy" class="btn btn-ghost btn-sm">&larr; All vocabularies</a>
</div>

<div class="card" style="margin-bottom:1.25rem;padding:1rem">
  <form class="add-term-form"
    hx-post="/admin/taxonomy/${esc(vocabName)}"
    hx-target="#terms-container"
    hx-swap="innerHTML">
    <input type="text" name="name" placeholder="Term name…" required style="min-width:180px" />
    <input type="text" name="slug" placeholder="slug (auto)" style="min-width:140px" />
    ${vocab.hierarchical ? `<select name="parentId"><option value="">— No parent —</option>${parentOptions}</select>` : ''}
    <button type="submit" class="btn btn-primary btn-sm">+ Add term</button>
  </form>
</div>

<div class="card">
  <div id="terms-container">${tableHtml}</div>
</div>

<script>
(function(){
  document.body.addEventListener('htmx:afterSwap', function(){
    var bodies = document.querySelectorAll('#terms-body');
    bodies.forEach(function(tbody){
      var rows = tbody.querySelectorAll('.term-row');
      var draggedRow = null;
      rows.forEach(function(row){
        var handle = row.querySelector('.drag-handle');
        if(!handle) return;
        handle.setAttribute('draggable','true');
        handle.addEventListener('dragstart',function(e){
          draggedRow = row;
          row.style.opacity = '0.4';
          e.dataTransfer.effectAllowed = 'move';
        });
        row.addEventListener('dragover',function(e){
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        });
        row.addEventListener('drop',function(e){
          e.preventDefault();
          if(!draggedRow || draggedRow === row) return;
          tbody.insertBefore(draggedRow, row);
          updateWeights(tbody);
        });
        handle.addEventListener('dragend',function(){
          if(draggedRow) draggedRow.style.opacity = '1';
          draggedRow = null;
        });
      });
    });
  });
  function updateWeights(tbody){
    var rows = tbody.querySelectorAll('.term-row');
    rows.forEach(function(row, i){
      var id = row.dataset.id;
      var vocab = '${esc(vocabName)}';
      fetch('/admin/taxonomy/'+vocab+'/'+id, {
        method:'PUT',
        headers:{'Content-Type':'application/x-www-form-urlencoded','HX-Request':'true'},
        body:'weight='+i
      });
    });
  }
  document.dispatchEvent(new Event('htmx:afterSwap'));
})();
</script>`;

    return c.html(
      adminLayout({
        title: vocab.label,
        user,
        activePage: 'taxonomy',
        content,
      }),
    );
  });

  // GET /:vocabulary/:id/edit-inline — return inline edit form
  app.get('/:vocabulary/:id/edit-inline', (c) => {
    const vocab = c.req.param('vocabulary');
    const id = c.req.param('id');
    const db = getDb(dataDir);
    const row = db
      .select()
      .from(dbSchema.taxonomyTerms)
      .where(sql`id = ${id}`)
      .get();

    if (!row) return c.html('Not found', 404);

    return c.html(`<form style="display:inline-flex;gap:.25rem;align-items:center"
  hx-put="/admin/taxonomy/${esc(vocab)}/${esc(id)}"
  hx-target="#terms-container"
  hx-swap="innerHTML">
  <input type="text" name="name" value="${esc(row.name)}" style="padding:.25rem .5rem;border:1px solid var(--primary);border-radius:4px;font-size:.875rem" autofocus />
  <input type="text" name="slug" value="${esc(row.slug)}" style="padding:.25rem .5rem;border:1px solid var(--border);border-radius:4px;font-size:.8rem;width:120px" />
  <button type="submit" class="btn btn-sm btn-primary">Save</button>
  <button type="button" class="btn btn-sm btn-ghost"
    hx-get="/admin/taxonomy/${esc(vocab)}"
    hx-target="#terms-container"
    hx-swap="innerHTML">Cancel</button>
</form>`);
  });

  // POST /:vocabulary — create term
  app.post('/:vocabulary', async (c) => {
    const db = getDb(dataDir);
    const vocabName = c.req.param('vocabulary');
    const body = await c.req.parseBody();
    const name = typeof body['name'] === 'string' ? body['name'].trim() : '';
    const slugRaw = typeof body['slug'] === 'string' ? body['slug'].trim() : '';
    const parentId = typeof body['parentId'] === 'string' && body['parentId'] ? body['parentId'] : undefined;

    if (!name) {
      return c.html('<div class="alert alert-danger">Name is required.</div>', 400);
    }

    const slug = slugRaw || slugify(name);

    const terms = getTerms(db, vocabName);
    const maxWeight = terms.reduce((m, t) => Math.max(m, t.weight), -1);

    createTerm(db, {
      vocabulary: vocabName,
      name,
      slug,
      parentId,
      weight: maxWeight + 1,
      langcode: 'en',
    });

    const vocabularies = loadTaxonomies(configDir);
    const vocab = vocabularies.find((v) => v.name === vocabName);
    const updatedTerms = getTerms(db, vocabName);
    return c.html(renderTermsTable(updatedTerms, vocabName, vocab?.hierarchical ?? false));
  });

  // PUT /:vocabulary/:id — update term
  app.put('/:vocabulary/:id', async (c) => {
    const db = getDb(dataDir);
    const vocabName = c.req.param('vocabulary');
    const id = c.req.param('id');
    const body = await c.req.parseBody();

    const data: Partial<TaxonomyTerm> = {};
    if (typeof body['name'] === 'string' && body['name'].trim()) data.name = body['name'].trim();
    if (typeof body['slug'] === 'string' && body['slug'].trim()) data.slug = body['slug'].trim();
    if (typeof body['weight'] === 'string') data.weight = parseInt(body['weight'], 10);
    if (typeof body['parentId'] === 'string') data.parentId = body['parentId'] || undefined;

    updateTerm(db, id, data);

    const vocabularies = loadTaxonomies(configDir);
    const vocab = vocabularies.find((v) => v.name === vocabName);
    const terms = getTerms(db, vocabName);
    return c.html(renderTermsTable(terms, vocabName, vocab?.hierarchical ?? false));
  });

  // DELETE /:vocabulary/:id — delete term
  app.delete('/:vocabulary/:id', (c) => {
    const db = getDb(dataDir);
    const id = c.req.param('id');
    deleteTerm(db, id);
    return c.html('');
  });

  return app;
}
