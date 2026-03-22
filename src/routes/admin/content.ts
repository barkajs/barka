import { Hono } from 'hono';
import { contentListRoutes } from './content-list.js';
import { contentEditRoutes } from './content-edit.js';

export function contentRoutes(dataDir: string, configDir: string): Hono {
  const routes = new Hono();

  const list = contentListRoutes(dataDir, configDir);
  const edit = contentEditRoutes(dataDir, configDir);

  routes.route('/', list);
  routes.route('/', edit);

  return routes;
}
