import type { Context } from 'hono';
import { setCookie, getCookie } from 'hono/cookie';
import { getDb } from '../../db/connection.js';
import { validateSession, verifyPassword, createSession } from '../../lib/auth.js';
import { escapeHtml } from './layout.js';
import type { AdminEnv } from './middleware.js';

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function loginPage(error?: string): string {
  const errorHtml = error
    ? `<div class="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">${escapeHtml(error)}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in \u2014 Barka Admin</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex flex-col items-center justify-center px-4">
  <div class="w-full max-w-sm">

    <div class="text-center mb-8">
      <span class="text-indigo-500 text-4xl leading-none">&#x2B21;</span>
      <h1 class="mt-3 text-2xl font-bold text-gray-900 tracking-tight">Barka Admin</h1>
      <p class="mt-1 text-sm text-gray-500">Sign in to manage your site</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
      ${errorHtml}

      <form method="POST" action="/admin/login" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autocomplete="email"
            class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autocomplete="current-password"
            class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition"
            placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
          />
        </div>
        <button
          type="submit"
          class="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
        >Sign in</button>
      </form>
    </div>

    <p class="mt-8 text-center text-xs text-gray-400">Powered by Barka</p>
  </div>
</body>
</html>`;
}

export function handleLoginGet(dataDir: string) {
  return async (c: Context<AdminEnv>) => {
    const sessionId = getCookie(c, 'barka_session');
    if (sessionId) {
      const db = getDb(dataDir);
      const result = validateSession(db, sessionId);
      if (result) {
        return c.redirect('/admin');
      }
    }
    return c.html(loginPage());
  };
}

export function handleLoginPost(dataDir: string) {
  return async (c: Context<AdminEnv>) => {
    const body = await c.req.parseBody();
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return c.html(loginPage('Email and password are required.'));
    }

    const db = getDb(dataDir);
    const { eq } = await import('drizzle-orm');
    const schema = await import('../../db/schema.js');

    const user = db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .get();

    if (!user) {
      return c.html(loginPage('Invalid email or password.'));
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return c.html(loginPage('Invalid email or password.'));
    }

    const sessionId = createSession(db, user.id);

    setCookie(c, 'barka_session', sessionId, {
      httpOnly: true,
      sameSite: 'Lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });

    return c.redirect('/admin');
  };
}
