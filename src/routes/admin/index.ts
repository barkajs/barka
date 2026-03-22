import { Hono } from 'hono';
import { requireAuth, type AdminEnv } from './middleware.js';
import { handleLoginGet, handleLoginPost } from './login.js';
import { dashboardHandler } from './dashboard.js';
import { contentRoutes } from './content.js';
import { mediaRoutes } from './media.js';
import { settingsRoutes } from './settings.js';
import { usersRoutes } from './users.js';
import { exportRoute } from './export-route.js';
import { sectionBuilderRoutes } from './section-builder.js';
import { taxonomyRoutes } from './taxonomy.js';

export function createAdminRoutes(
  dataDir: string,
  options: { configDir: string; themesDir: string; publicDir: string; contentDir: string },
): Hono<AdminEnv> {
  const admin = new Hono<AdminEnv>();

  admin.get('/login', handleLoginGet(dataDir));
  admin.post('/login', handleLoginPost(dataDir));

  admin.use('/*', requireAuth(dataDir));

  admin.get('/', dashboardHandler(dataDir));
  admin.route('/', sectionBuilderRoutes(dataDir, options.configDir));
  admin.route('/content', contentRoutes(dataDir, options.configDir));
  admin.route('/media', mediaRoutes(dataDir, options.publicDir));
  admin.route('/taxonomy', taxonomyRoutes(dataDir, options.configDir));
  admin.route('/settings', settingsRoutes(options.configDir, options.themesDir));
  admin.route('/users', usersRoutes(dataDir));
  admin.route('/export', exportRoute(dataDir, options.contentDir));

  return admin;
}
