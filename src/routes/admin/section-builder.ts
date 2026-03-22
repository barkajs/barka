import crypto from 'node:crypto';
import { Hono } from 'hono';
import { eq, asc, sql } from 'drizzle-orm';
import { getDb } from '../../db/connection.js';
import * as schema from '../../db/schema.js';
import { loadSectionTypes } from '../../lib/config-files.js';
import { esc } from './layout.js';
import type { AdminUser } from './layout.js';
import type { FieldDefinition, SectionType, SectionTypeDefaults } from '../../lib/types.js';

type AdminEnv = {
  Variables: { user: AdminUser };
};

// ---------------------------------------------------------------------------
// Icon map — simple Unicode glyphs for each section type icon name
// ---------------------------------------------------------------------------

const ICON_MAP: Record<string, string> = {
  star: '★',
  grid: '⊞',
  megaphone: '📣',
  text: '¶',
  image: '🖼',
  hash: '#',
  quote: '❝',
  'help-circle': '❓',
  'credit-card': '💳',
  list: '☰',
  mail: '✉',
  'play-circle': '▶',
  layers: '◫',
  columns: '▥',
};

const SECTION_DESCRIPTIONS: Record<string, string> = {
  hero: 'Full-width banner with heading and CTA',
  features: 'Grid of feature cards',
  cta: 'Call to action with buttons',
  text: 'Rich text content block',
  text_with_image: 'Text alongside an image',
  counters: 'Animated number counters',
  testimonials: 'Customer testimonials',
  faq: 'Frequently asked questions',
  pricing: 'Pricing plan comparison',
  gallery: 'Image gallery grid',
  blog_listing: 'Dynamic blog post listing',
  form: 'Contact or signup form',
  video: 'YouTube or Vimeo embed',
  logo_slider: 'Logo / partner showcase',
  columns: 'Multi-column layout',
};

function iconHtml(name?: string): string {
  const glyph = ICON_MAP[name ?? ''] ?? '◆';
  return `<span class="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded bg-indigo-100 text-indigo-600 text-xs font-bold">${glyph}</span>`;
}

// ---------------------------------------------------------------------------
// Preview text for a section — shown in the collapsed card header
// ---------------------------------------------------------------------------

function previewText(data: Record<string, unknown>): string {
  if (typeof data.heading === 'string' && data.heading) return data.heading.slice(0, 60);
  if (typeof data.body === 'string' && data.body) return data.body.slice(0, 60);
  if (typeof data.quote === 'string' && data.quote) return data.quote.slice(0, 60);
  for (const v of Object.values(data)) {
    if (Array.isArray(v)) return `${v.length} item${v.length !== 1 ? 's' : ''}`;
  }
  return '';
}

// ---------------------------------------------------------------------------
// Nested value helpers for form parsing
// ---------------------------------------------------------------------------

function setNested(obj: Record<string, unknown>, dotPath: string, value: string): void {
  const parts = dotPath.split('.');
  let cur: Record<string, unknown> = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const nextIsIndex = /^\d+$/.test(parts[i + 1]);
    if (cur[key] === undefined) {
      cur[key] = nextIsIndex ? [] : {};
    }
    cur = cur[key] as Record<string, unknown>;
  }

  const last = parts[parts.length - 1];
  (cur as Record<string, unknown>)[last] = value;
}

function compactArrays(obj: Record<string, unknown>): void {
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (Array.isArray(val)) {
      obj[key] = val.filter((x) => x != null);
      for (const item of obj[key] as unknown[]) {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          compactArrays(item as Record<string, unknown>);
        }
      }
    } else if (val && typeof val === 'object') {
      compactArrays(val as Record<string, unknown>);
    }
  }
}

function coerceTypes(
  data: Record<string, unknown>,
  fields: Record<string, FieldDefinition>,
): void {
  for (const [name, def] of Object.entries(fields)) {
    if (def.type === 'boolean') {
      data[name] = data[name] === 'true' || data[name] === 'on' || data[name] === '1';
    } else if (def.type === 'number' && typeof data[name] === 'string') {
      data[name] = data[name] ? Number(data[name]) : (def.default ?? 0);
    } else if (def.type === 'repeater' && def.fields && Array.isArray(data[name])) {
      for (const item of data[name] as Record<string, unknown>[]) {
        if (item) coerceTypes(item, def.fields);
      }
    }
  }
  // Set missing booleans to false
  for (const [name, def] of Object.entries(fields)) {
    if (def.type === 'boolean' && !(name in data)) {
      data[name] = false;
    }
  }
}

// ---------------------------------------------------------------------------
// Parse section form data (d.* → data, s.* → settings)
// ---------------------------------------------------------------------------

function parseSectionForm(
  body: Record<string, string | File>,
  typeDef: SectionType,
  settingsSchema: Record<string, FieldDefinition>,
): { data: Record<string, unknown>; settings: Record<string, unknown> } {
  const data: Record<string, unknown> = {};
  const settings: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(body)) {
    if (typeof value !== 'string') continue;
    if (key.startsWith('d.')) setNested(data, key.slice(2), value);
    else if (key.startsWith('s.')) settings[key.slice(2)] = value;
  }

  compactArrays(data);
  coerceTypes(data, typeDef.fields);

  for (const [key, def] of Object.entries(settingsSchema)) {
    if (def.type === 'boolean') {
      settings[key] = settings[key] === 'true' || settings[key] === 'on';
    }
    if (settings[key] === undefined || settings[key] === '') {
      settings[key] = def.default ?? '';
    }
  }

  return { data, settings };
}

// ---------------------------------------------------------------------------
// Field renderers for the section edit form
// ---------------------------------------------------------------------------

function renderEditField(
  name: string,
  def: FieldDefinition,
  value: unknown,
  prefix: string,
): string {
  const fieldName = `${prefix}.${name}`;
  const id = `sf-${fieldName.replace(/\./g, '-')}`;
  const strVal = value != null ? String(value) : (def.default != null ? String(def.default) : '');
  const req = def.required ? ' required' : '';
  const reqBadge = def.required
    ? '<span class="text-red-500 ml-0.5">*</span>'
    : '';
  const lbl = `<label for="${id}" class="block text-xs font-medium text-gray-600 mb-1">${esc(def.label)}${reqBadge}</label>`;

  switch (def.type) {
    case 'text':
      return `<div>${lbl}<input type="text" id="${id}" name="${fieldName}" value="${esc(strVal)}" class="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"${req}></div>`;

    case 'textarea':
      return `<div>${lbl}<textarea id="${id}" name="${fieldName}" rows="3" class="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"${req}>${esc(strVal)}</textarea></div>`;

    case 'number':
      return `<div>${lbl}<input type="number" id="${id}" name="${fieldName}" value="${esc(strVal)}" class="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"${req}></div>`;

    case 'boolean': {
      const checked = value === true || value === 'true' || value === '1' || value === 'on';
      return `<div class="flex items-center gap-2 py-1">
        <input type="checkbox" id="${id}" name="${fieldName}" value="true"${checked ? ' checked' : ''} class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-300">
        <label for="${id}" class="text-xs font-medium text-gray-600">${esc(def.label)}</label>
      </div>`;
    }

    case 'select': {
      const opts = (def.options ?? [])
        .map((o) => `<option value="${esc(o)}"${strVal === o ? ' selected' : ''}>${esc(o)}</option>`)
        .join('');
      return `<div>${lbl}<select id="${id}" name="${fieldName}" class="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"${req}><option value="">— Select —</option>${opts}</select></div>`;
    }

    case 'media':
      return `<div>${lbl}<input type="text" id="${id}" name="${fieldName}" value="${esc(strVal)}" placeholder="File path or URL" class="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"></div>`;

    default:
      return `<div>${lbl}<input type="text" id="${id}" name="${fieldName}" value="${esc(strVal)}" class="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"${req}></div>`;
  }
}

function renderRepeaterItem(
  index: number,
  subFields: Record<string, FieldDefinition>,
  itemData: Record<string, unknown> | undefined,
  prefix: string,
): string {
  const fields = Object.entries(subFields)
    .map(([n, d]) => renderEditField(n, d, itemData?.[n], `${prefix}.${index}`))
    .join('');

  return `<div class="repeater-item border border-gray-200 rounded p-3 bg-gray-50 space-y-2" data-index="${index}">
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs font-semibold text-gray-500">Item ${index + 1}</span>
      <button type="button" onclick="this.closest('.repeater-item').remove()" class="text-xs text-red-500 hover:text-red-700">&times; Remove</button>
    </div>
    ${fields}
  </div>`;
}

function renderRepeater(
  name: string,
  def: FieldDefinition,
  items: unknown[],
  prefix: string,
): string {
  const subFields = def.fields ?? {};
  const itemsHtml = (items as Record<string, unknown>[])
    .map((item, i) => renderRepeaterItem(i, subFields, item, `${prefix}.${name}`))
    .join('');

  const templateFields = Object.entries(subFields)
    .map(([n, d]) => renderEditField(n, d, d.default, `${prefix}.${name}.__IDX__`))
    .join('');

  const templateHtml = `<div class="repeater-item border border-gray-200 rounded p-3 bg-gray-50 space-y-2" data-index="__IDX__">
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs font-semibold text-gray-500">Item __IDX_DISPLAY__</span>
      <button type="button" onclick="this.closest('.repeater-item').remove()" class="text-xs text-red-500 hover:text-red-700">&times; Remove</button>
    </div>
    ${templateFields}
  </div>`;

  return `<div class="repeater-field" data-field="${esc(name)}">
    <label class="block text-xs font-medium text-gray-600 mb-2">${esc(def.label)}</label>
    <div class="repeater-items space-y-2">${itemsHtml}</div>
    <button type="button" onclick="addRepeaterItem(this)" class="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
      <span>+</span> Add Item
    </button>
    <template class="repeater-tpl">${templateHtml}</template>
  </div>`;
}

// ---------------------------------------------------------------------------
// HTML fragments
// ---------------------------------------------------------------------------

function sectionCardHtml(
  section: typeof schema.sections.$inferSelect,
  typeDef: SectionType | undefined,
): string {
  const data = (section.data ?? {}) as Record<string, unknown>;
  const label = typeDef?.label ?? section.type;
  const preview = previewText(data);

  return `<div class="section-card bg-white border border-gray-200 rounded-lg shadow-sm" data-section-id="${esc(section.id)}">
  <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
    <div class="flex items-center gap-3 min-w-0">
      <span class="drag-handle cursor-grab text-gray-400 hover:text-gray-600 select-none text-lg leading-none">⠿</span>
      ${iconHtml(typeDef?.icon)}
      <span class="font-medium text-sm text-gray-700">${esc(label)}</span>
      ${preview ? `<span class="text-xs text-gray-400 truncate">— ${esc(preview)}</span>` : ''}
    </div>
    <div class="flex items-center gap-1 flex-shrink-0">
      <button hx-get="/admin/sections/${esc(section.id)}/edit" hx-target="#section-form-${esc(section.id)}" hx-swap="innerHTML"
              class="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50 transition-colors">Edit</button>
      <button hx-delete="/admin/sections/${esc(section.id)}" hx-target="closest .section-card" hx-swap="outerHTML swap:0.15s"
              hx-confirm="Remove this section?"
              class="text-xs font-medium text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors">Remove</button>
    </div>
  </div>
  <div id="section-form-${esc(section.id)}"></div>
</div>`;
}

function sectionEditFormHtml(
  section: typeof schema.sections.$inferSelect,
  typeDef: SectionType,
  defaults: SectionTypeDefaults,
): string {
  const data = (section.data ?? {}) as Record<string, unknown>;
  const settings = (section.settings ?? {}) as Record<string, unknown>;

  const fieldsHtml = Object.entries(typeDef.fields)
    .map(([name, def]) => {
      if (def.type === 'repeater') {
        const items = Array.isArray(data[name]) ? (data[name] as unknown[]) : [];
        return renderRepeater(name, def, items, 'd');
      }
      return renderEditField(name, def, data[name], 'd');
    })
    .join('');

  const settingsHtml = Object.entries(defaults.settings)
    .map(([name, def]) => renderEditField(name, def, settings[name], 's'))
    .join('');

  return `<form hx-put="/admin/sections/${esc(section.id)}" hx-target="closest .section-card" hx-swap="outerHTML" class="p-4 space-y-4 border-t-0">
  <div class="space-y-3">
    ${fieldsHtml}
  </div>

  <details class="border border-gray-200 rounded">
    <summary class="px-3 py-2 text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700 bg-gray-50 rounded select-none">
      Section Settings
    </summary>
    <div class="p-3 space-y-3 border-t border-gray-200">
      ${settingsHtml}
    </div>
  </details>

  <div class="flex items-center gap-2 pt-1">
    <button type="submit" class="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors">Save</button>
    <button type="button" onclick="document.getElementById('section-form-${esc(section.id)}').innerHTML=''"
            class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">Cancel</button>
  </div>
</form>`;
}

function pickerModalHtml(types: SectionType[], contentId: string): string {
  const cards = types
    .map(
      (t) => `<button type="button"
        hx-post="/admin/content/${esc(contentId)}/sections"
        hx-vals='${JSON.stringify({ type: t.name })}'
        hx-target="#section-picker-modal"
        hx-swap="innerHTML"
        class="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors text-center group">
        <span class="text-2xl leading-none group-hover:scale-110 transition-transform">${ICON_MAP[t.icon ?? ''] ?? '◆'}</span>
        <span class="text-sm font-medium text-gray-700">${esc(t.label)}</span>
        <span class="text-[11px] text-gray-400 leading-snug">${esc(SECTION_DESCRIPTIONS[t.name] ?? '')}</span>
      </button>`,
    )
    .join('\n');

  return `<div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onclick="if(event.target===this)this.parentElement.innerHTML=''">
  <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
    <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
      <h3 class="text-base font-semibold text-gray-800">Add Section</h3>
      <button type="button" onclick="this.closest('#section-picker-modal').innerHTML=''" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
    </div>
    <div class="p-4 overflow-y-auto grid grid-cols-3 gap-3">
      ${cards}
    </div>
  </div>
</div>`;
}

function builderScript(contentId: string): string {
  return `<script>
(function(){
  var list = document.getElementById('sections-list');
  if (list && typeof Sortable !== 'undefined') {
    new Sortable(list, {
      handle: '.drag-handle',
      animation: 150,
      ghostClass: 'opacity-30',
      onEnd: function() {
        var ids = Array.from(list.querySelectorAll('.section-card')).map(function(el){ return el.dataset.sectionId; });
        fetch('/admin/content/${contentId}/sections/reorder', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({order: ids})
        });
      }
    });
  }
})();

function addRepeaterItem(btn) {
  var field = btn.closest('.repeater-field');
  var items = field.querySelector('.repeater-items');
  var tpl = field.querySelector('.repeater-tpl');
  var idx = items.children.length;
  var html = tpl.innerHTML.replace(/__IDX__/g, String(idx)).replace(/__IDX_DISPLAY__/g, String(idx + 1));
  items.insertAdjacentHTML('beforeend', html);
}
</script>`;
}

// ---------------------------------------------------------------------------
// Route factory
// ---------------------------------------------------------------------------

export function sectionBuilderRoutes(
  dataDir: string,
  configDir: string,
): Hono<AdminEnv> {
  const app = new Hono<AdminEnv>();

  function getTypesAndDefaults() {
    return loadSectionTypes(configDir);
  }

  // GET /content/:id/sections — full section list (HTMX partial)
  app.get('/content/:id/sections', async (c) => {
    const contentId = c.req.param('id');
    const db = getDb(dataDir);
    const { types } = getTypesAndDefaults();

    const sections = db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.contentId, contentId))
      .orderBy(asc(schema.sections.weight))
      .all();

    const typeMap = new Map(types.map((t) => [t.name, t]));

    const cards = sections
      .map((s) => sectionCardHtml(s, typeMap.get(s.type)))
      .join('\n');

    const html = `
      <div id="sections-list" class="space-y-3">${cards}</div>
      <button type="button"
        hx-get="/admin/sections/picker?contentId=${esc(contentId)}"
        hx-target="#section-picker-modal"
        hx-swap="innerHTML"
        class="w-full mt-3 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
        + Add Section
      </button>
      <div id="section-picker-modal"></div>
      <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js"></script>
      ${builderScript(contentId)}`;

    return c.html(html);
  });

  // GET /sections/picker — section type picker modal
  app.get('/sections/picker', async (c) => {
    const contentId = c.req.query('contentId') ?? '';
    const { types } = getTypesAndDefaults();
    return c.html(pickerModalHtml(types, contentId));
  });

  // POST /content/:id/sections — add a new section
  app.post('/content/:id/sections', async (c) => {
    const contentId = c.req.param('id');
    const db = getDb(dataDir);
    const body = await c.req.parseBody();
    const typeName = String(body.type ?? '');

    const { types } = getTypesAndDefaults();
    const typeDef = types.find((t) => t.name === typeName);
    if (!typeDef) return c.html(`<p class="text-red-600 text-sm">Unknown section type: ${esc(typeName)}</p>`, 400);

    // Calculate next weight
    const last = db
      .select({ maxW: sql<number>`max(${schema.sections.weight})` })
      .from(schema.sections)
      .where(eq(schema.sections.contentId, contentId))
      .get();
    const nextWeight = (last?.maxW ?? -1) + 1;

    const id = crypto.randomUUID();
    const now = new Date();
    void now; // not used — sections table has no timestamps

    db.insert(schema.sections)
      .values({
        id,
        contentId,
        type: typeName,
        weight: nextWeight,
        data: {},
        settings: {},
        parentId: null,
        langcode: 'en',
      })
      .run();

    const section = db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.id, id))
      .get()!;

    // OOB: append new card to sections-list AND clear picker modal
    const cardHtml = sectionCardHtml(section, typeDef);
    return c.html(`<div id="sections-list" hx-swap-oob="beforeend">${cardHtml}</div>`);
  });

  // GET /sections/:sectionId/edit — edit form partial
  app.get('/sections/:sectionId/edit', async (c) => {
    const sectionId = c.req.param('sectionId');
    const db = getDb(dataDir);

    const section = db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.id, sectionId))
      .get();
    if (!section) return c.html('<p class="text-red-600 text-sm p-4">Section not found.</p>', 404);

    const { types, defaults } = getTypesAndDefaults();
    const typeDef = types.find((t) => t.name === section.type);
    if (!typeDef) return c.html(`<p class="text-red-600 text-sm p-4">Unknown type: ${esc(section.type)}</p>`, 400);

    return c.html(sectionEditFormHtml(section, typeDef, defaults));
  });

  // PUT /sections/:sectionId — update section data & settings
  app.put('/sections/:sectionId', async (c) => {
    const sectionId = c.req.param('sectionId');
    const db = getDb(dataDir);

    const section = db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.id, sectionId))
      .get();
    if (!section) return c.html('<p class="text-red-600 text-sm">Section not found.</p>', 404);

    const { types, defaults } = getTypesAndDefaults();
    const typeDef = types.find((t) => t.name === section.type);
    if (!typeDef) return c.html(`<p class="text-red-600 text-sm">Unknown type: ${esc(section.type)}</p>`, 400);

    const body = await c.req.parseBody();
    const { data, settings } = parseSectionForm(
      body as Record<string, string | File>,
      typeDef,
      defaults.settings,
    );

    db.update(schema.sections)
      .set({ data, settings })
      .where(eq(schema.sections.id, sectionId))
      .run();

    const updated = db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.id, sectionId))
      .get()!;

    return c.html(sectionCardHtml(updated, typeDef));
  });

  // DELETE /sections/:sectionId
  app.delete('/sections/:sectionId', async (c) => {
    const sectionId = c.req.param('sectionId');
    const db = getDb(dataDir);
    db.delete(schema.sections).where(eq(schema.sections.id, sectionId)).run();
    return c.body(null, 200);
  });

  // POST /content/:id/sections/reorder — reorder via SortableJS
  app.post('/content/:id/sections/reorder', async (c) => {
    const db = getDb(dataDir);
    const { order } = await c.req.json<{ order: string[] }>();

    for (let i = 0; i < order.length; i++) {
      db.update(schema.sections)
        .set({ weight: i })
        .where(eq(schema.sections.id, order[i]))
        .run();
    }

    return c.json({ ok: true });
  });

  return app;
}
