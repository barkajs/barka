import crypto from 'node:crypto';
import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { getDb } from '../../db/connection.js';
import * as schema from '../../db/schema.js';
import { hashPassword } from '../../lib/auth.js';
import { adminLayout } from './layout.js';
import type { AdminUser } from './layout.js';

type Env = { Variables: { user: AdminUser } };

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function roleBadge(role: string): string {
  const cls = role === 'admin' ? 'badge-admin' : role === 'editor' ? 'badge-editor' : 'badge-author';
  return `<span class="badge ${cls}">${esc(role)}</span>`;
}

function requireAdmin(user: AdminUser): string | null {
  if (user.role !== 'admin') {
    return `<div class="alert alert-error">Access denied. Only administrators can manage users.</div>`;
  }
  return null;
}

function renderUserForm(opts: {
  action: string;
  method: string;
  user?: typeof schema.users.$inferSelect;
  error?: string;
}): string {
  const u = opts.user;
  const isEdit = !!u;

  return `
${opts.error ? `<div class="alert alert-error">${esc(opts.error)}</div>` : ''}
<form method="POST" action="${opts.action}"
  ${isEdit ? `hx-put="${opts.action}" hx-swap="none"` : `hx-post="${opts.action}" hx-swap="none"`}>
  ${isEdit ? '<input type="hidden" name="_method" value="PUT" />' : ''}

  <div class="card">
    <div class="card-body">
      <div class="form-row">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" name="name" id="name" value="${esc(u?.name ?? '')}" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" name="email" id="email" value="${esc(u?.email ?? '')}" required />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="password">Password${isEdit ? ' (leave blank to keep current)' : ''}</label>
          <input type="password" name="password" id="password" ${isEdit ? '' : 'required'} minlength="8" />
        </div>
        <div class="form-group">
          <label for="role">Role</label>
          <select name="role" id="role">
            <option value="admin"${u?.role === 'admin' ? ' selected' : ''}>Admin</option>
            <option value="editor"${(!u || u.role === 'editor') ? ' selected' : ''}>Editor</option>
            <option value="author"${u?.role === 'author' ? ' selected' : ''}>Author</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div style="margin-top:1.25rem;display:flex;gap:.5rem">
    <button type="submit" class="btn btn-primary">${isEdit ? 'Update user' : 'Create user'}</button>
    <a href="/admin/users" class="btn btn-ghost">Cancel</a>
  </div>
</form>`;
}

export function usersRoutes(dataDir: string): Hono<Env> {
  const app = new Hono<Env>();

  // GET /admin/users — user list
  app.get('/', (c) => {
    const user = c.get('user');
    const denied = requireAdmin(user);
    if (denied) {
      return c.html(adminLayout({ title: 'Users', user, activePage: 'users', content: denied }), 403);
    }

    const db = getDb(dataDir);
    const users = db.select().from(schema.users).orderBy(desc(schema.users.createdAt)).all();

    const rows = users.map((u) => `
      <tr>
        <td><strong>${esc(u.name)}</strong></td>
        <td>${esc(u.email)}</td>
        <td>${roleBadge(u.role)}</td>
        <td>${formatDate(u.createdAt)}</td>
        <td style="text-align:right">
          <a href="/admin/users/${u.id}" class="btn btn-sm btn-ghost">Edit</a>
          ${u.id !== user.userId
            ? `<button class="btn btn-sm btn-danger" hx-delete="/admin/users/${u.id}" hx-target="closest tr" hx-swap="outerHTML" hx-confirm="Delete ${esc(u.name)}?">Delete</button>`
            : ''}
        </td>
      </tr>`).join('');

    const content = `
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem">
  <p style="color:var(--text-muted);font-size:.875rem">${users.length} user${users.length !== 1 ? 's' : ''}</p>
  <a href="/admin/users/new" class="btn btn-primary">+ New user</a>
</div>

${users.length > 0 ? `
<div class="card">
  <table>
    <thead>
      <tr><th>Name</th><th>Email</th><th>Role</th><th>Created</th><th></th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</div>` : `<div class="empty-state"><div style="font-size:2.5rem">👤</div><p>No users yet.</p></div>`}`;

    return c.html(adminLayout({ title: 'Users', user, activePage: 'users', content }));
  });

  // GET /admin/users/new — create form
  app.get('/new', (c) => {
    const user = c.get('user');
    const denied = requireAdmin(user);
    if (denied) {
      return c.html(adminLayout({ title: 'Users', user, activePage: 'users', content: denied }), 403);
    }

    const content = renderUserForm({ action: '/admin/users', method: 'POST' });
    return c.html(adminLayout({ title: 'New User', user, activePage: 'users', content }));
  });

  // POST /admin/users — create user
  app.post('/', async (c) => {
    const user = c.get('user');
    const denied = requireAdmin(user);
    if (denied) return c.html(denied, 403);

    const db = getDb(dataDir);
    const body = await c.req.parseBody();
    const val = (k: string) => { const v = body[k]; return typeof v === 'string' ? v.trim() : ''; };

    const name = val('name');
    const email = val('email');
    const password = val('password');
    const role = val('role') || 'editor';

    if (!name || !email || !password) {
      const content = renderUserForm({ action: '/admin/users', method: 'POST', error: 'All fields are required.' });
      return c.html(adminLayout({ title: 'New User', user, activePage: 'users', content }), 400);
    }

    const existing = db.select().from(schema.users).where(eq(schema.users.email, email)).get();
    if (existing) {
      const content = renderUserForm({ action: '/admin/users', method: 'POST', error: 'A user with this email already exists.' });
      return c.html(adminLayout({ title: 'New User', user, activePage: 'users', content }), 409);
    }

    const passwordHash = await hashPassword(password);
    const id = crypto.randomUUID();
    db.insert(schema.users).values({ id, email, passwordHash, name, role, createdAt: new Date() }).run();

    if (c.req.header('HX-Request')) {
      c.header('HX-Redirect', '/admin/users');
      return c.html('');
    }
    return c.redirect('/admin/users');
  });

  // GET /admin/users/:id — edit form
  app.get('/:id', (c) => {
    const currentUser = c.get('user');
    const denied = requireAdmin(currentUser);
    if (denied) {
      return c.html(adminLayout({ title: 'Users', user: currentUser, activePage: 'users', content: denied }), 403);
    }

    const db = getDb(dataDir);
    const id = c.req.param('id');
    const target = db.select().from(schema.users).where(eq(schema.users.id, id)).get();

    if (!target) {
      return c.html(adminLayout({
        title: 'User not found',
        user: currentUser,
        activePage: 'users',
        content: '<div class="alert alert-error">User not found.</div><a href="/admin/users" class="btn btn-ghost">Back</a>',
      }), 404);
    }

    const content = renderUserForm({ action: `/admin/users/${id}`, method: 'PUT', user: target });
    return c.html(adminLayout({ title: `Edit ${target.name}`, user: currentUser, activePage: 'users', content }));
  });

  // PUT /admin/users/:id — update user
  app.put('/:id', async (c) => {
    const currentUser = c.get('user');
    const denied = requireAdmin(currentUser);
    if (denied) return c.html(denied, 403);

    const db = getDb(dataDir);
    const id = c.req.param('id');
    const body = await c.req.parseBody();
    const val = (k: string) => { const v = body[k]; return typeof v === 'string' ? v.trim() : ''; };

    const target = db.select().from(schema.users).where(eq(schema.users.id, id)).get();
    if (!target) return c.html('User not found', 404);

    const name = val('name') || target.name;
    const email = val('email') || target.email;
    const role = val('role') || target.role;
    const password = val('password');

    if (email !== target.email) {
      const dup = db.select().from(schema.users).where(eq(schema.users.email, email)).get();
      if (dup && dup.id !== id) {
        const content = renderUserForm({
          action: `/admin/users/${id}`, method: 'PUT', user: target,
          error: 'A user with this email already exists.',
        });
        return c.html(adminLayout({ title: `Edit ${target.name}`, user: currentUser, activePage: 'users', content }), 409);
      }
    }

    const updates: Record<string, unknown> = { name, email, role };
    if (password) {
      updates.passwordHash = await hashPassword(password);
    }

    db.update(schema.users).set(updates).where(eq(schema.users.id, id)).run();

    if (c.req.header('HX-Request')) {
      c.header('HX-Redirect', '/admin/users');
      c.header('X-Toast', 'User updated');
      c.header('X-Toast-Type', 'success');
      return c.html('');
    }
    return c.redirect('/admin/users');
  });

  // DELETE /admin/users/:id — delete user
  app.delete('/:id', async (c) => {
    const currentUser = c.get('user');
    const denied = requireAdmin(currentUser);
    if (denied) return c.html(denied, 403);

    const id = c.req.param('id');

    if (id === currentUser.userId) {
      return c.html(`<tr><td colspan="5"><div class="alert alert-error" style="margin:0">Cannot delete your own account.</div></td></tr>`, 400);
    }

    const db = getDb(dataDir);
    db.delete(schema.users).where(eq(schema.users.id, id)).run();

    return c.html('');
  });

  return app;
}
