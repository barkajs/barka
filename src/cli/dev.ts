import path from 'node:path';
import { serve } from '@hono/node-server';
import { watch } from 'chokidar';
import { createApp } from '../app.js';
import { hasDatabase } from '../db/connection.js';
import { loadSites } from '../lib/multisite.js';

export interface DevOptions {
  port: number;
  contentDir: string;
  configDir: string;
  themesDir: string;
  publicDir: string;
  dataDir: string;
}

export async function startDevServer(opts: DevOptions): Promise<void> {
  const dataDir = path.resolve(opts.dataDir);
  const dbDetected = hasDatabase(dataDir);

  const { app, engine } = createApp({
    contentDir: opts.contentDir,
    configDir: opts.configDir,
    themesDir: opts.themesDir,
    publicDir: opts.publicDir,
    dataDir,
  });

  const watchPaths = [
    opts.contentDir,
    opts.configDir,
    opts.themesDir,
  ].map((p) => path.resolve(p));

  const watcher = watch(watchPaths, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 100 },
  });

  watcher.on('all', (event, filePath) => {
    const rel = path.relative(process.cwd(), filePath);
    const ts = new Date().toLocaleTimeString();

    if (filePath.startsWith(path.resolve(opts.contentDir))) {
      engine.invalidateCache();
      console.log(`  ${ts}  \x1b[36m${event}\x1b[0m ${rel}`);
    } else {
      engine.invalidateCache();
      console.log(`  ${ts}  \x1b[33m${event}\x1b[0m ${rel} (full reload)`);
    }
  });

  const sites = loadSites(path.resolve(opts.configDir));

  serve({ fetch: app.fetch, port: opts.port }, (info) => {
    const mode = dbDetected
      ? '\x1b[33mDatabase\x1b[0m (SQLite)'
      : '\x1b[36mFile-only\x1b[0m (Markdown)';

    console.log('');
    console.log('  \x1b[1m\x1b[35m⬡ Barka\x1b[0m dev server');
    console.log('');
    console.log(`  \x1b[2m➜\x1b[0m  Local:   \x1b[36mhttp://localhost:${info.port}\x1b[0m`);

    const sitesWithLocalhost = sites.filter((s) => s.localhost);
    if (sitesWithLocalhost.length > 0) {
      console.log(`  \x1b[2m➜\x1b[0m  Sites:`);
      const maxDomain = Math.max(...sitesWithLocalhost.map((s) => (s.domain ?? s.id).length));
      for (const s of sitesWithLocalhost) {
        const domain = (s.domain ?? s.id).padEnd(maxDomain);
        const langs = s.languages?.join(', ') ?? 'global';
        console.log(`      ${domain}  → \x1b[36mhttp://${s.localhost}:${info.port}\x1b[0m  \x1b[2m(${langs})\x1b[0m`);
      }
    }

    console.log(`  \x1b[2m➜\x1b[0m  Mode:    ${mode}`);
    console.log(`  \x1b[2m➜\x1b[0m  Content: \x1b[2m${path.resolve(opts.contentDir)}\x1b[0m`);
    console.log(`  \x1b[2m➜\x1b[0m  Config:  \x1b[2m${path.resolve(opts.configDir)}\x1b[0m`);
    if (dbDetected) {
      console.log(`  \x1b[2m➜\x1b[0m  Data:    \x1b[2m${dataDir}\x1b[0m`);
    }
    console.log('');
    console.log('  Watching for changes…');
    console.log('');
  });
}
