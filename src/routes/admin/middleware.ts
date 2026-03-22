import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import { getDb } from '../../db/connection.js';
import { validateSession } from '../../lib/auth.js';
import type { AdminUser } from './layout.js';

export type AdminEnv = {
  Variables: {
    user: AdminUser;
  };
};

export function requireAuth(dataDir: string) {
  return createMiddleware<AdminEnv>(async (c, next) => {
    if (c.req.path === '/admin/login') {
      await next();
      return;
    }

    const sessionId = getCookie(c, 'barka_session');
    if (!sessionId) {
      return c.redirect('/admin/login');
    }

    const db = getDb(dataDir);
    const result = validateSession(db, sessionId);
    if (!result) {
      return c.redirect('/admin/login');
    }

    c.set('user', {
      userId: result.userId,
      name: result.name,
      email: result.email,
      role: result.role,
    });

    await next();
  });
}
