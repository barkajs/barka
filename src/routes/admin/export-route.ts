import { Hono } from 'hono';
import { getDb } from '../../db/connection.js';
import * as schema from '../../db/schema.js';
import { exportContent } from '../../lib/sync.js';
import type { AdminUser } from './layout.js';

type Env = { Variables: { user: AdminUser } };

export function exportRoute(dataDir: string, contentDir: string): Hono<Env> {
  const app = new Hono<Env>();

  // POST /admin/export — export DB content to files
  app.post('/', async (c) => {
    const db = getDb(dataDir);
    const { exported } = await exportContent(
      db as Parameters<typeof exportContent>[0],
      contentDir,
    );

    if (c.req.header('HX-Request')) {
      c.header('X-Toast', `Exported ${exported} file${exported !== 1 ? 's' : ''} successfully`);
      c.header('X-Toast-Type', 'success');
      return c.html(
        `<div class="alert alert-success">Exported ${exported} file${exported !== 1 ? 's' : ''} successfully.</div>`,
      );
    }

    return c.json({ exported });
  });

  return app;
}
