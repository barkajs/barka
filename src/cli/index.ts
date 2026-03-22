#!/usr/bin/env tsx
import fs from 'node:fs';
import path from 'node:path';
import { Command } from 'commander';
import { startDevServer } from './dev.js';
import { runBuild } from './build.js';
import { runDbInit } from './db-init.js';
import { runImport } from './import-cmd.js';
import { runExport } from './export-cmd.js';
import { runSync } from './sync-cmd.js';
import { runInit, listStarters } from './init-cmd.js';
import { getPackageRoot } from '../lib/paths.js';

const program = new Command();

program
  .name('barka')
  .description('Barka — progressive Content-as-Code CMS')
  .version('0.1.0');

function resolveDir(dir: string): string {
  return path.resolve(process.cwd(), dir);
}

program
  .command('dev')
  .description('Start the development server with hot-reload')
  .option('-p, --port <number>', 'Port to listen on', '3000')
  .option('--content <dir>', 'Content directory', 'content')
  .option('--config <dir>', 'Config directory', 'config')
  .option('--themes <dir>', 'Themes directory', 'themes')
  .option('--public <dir>', 'Public assets directory', 'public')
  .option('--data <dir>', 'Data directory (SQLite database)', 'data')
  .action(async (opts) => {
    await startDevServer({
      port: parseInt(opts.port, 10),
      contentDir: resolveDir(opts.content),
      configDir: resolveDir(opts.config),
      themesDir: resolveDir(opts.themes),
      publicDir: resolveDir(opts.public),
      dataDir: resolveDir(opts.data),
    });
  });

program
  .command('build')
  .description('Build static site to dist/')
  .option('--content <dir>', 'Content directory', 'content')
  .option('--config <dir>', 'Config directory', 'config')
  .option('--themes <dir>', 'Themes directory', 'themes')
  .option('--public <dir>', 'Public assets directory', 'public')
  .option('--data <dir>', 'Data directory (SQLite database)', 'data')
  .option('-o, --out <dir>', 'Output directory', 'dist')
  .option('--site <id>', 'Build only content for a specific site')
  .action(async (opts) => {
    await runBuild({
      contentDir: resolveDir(opts.content),
      configDir: resolveDir(opts.config),
      themesDir: resolveDir(opts.themes),
      publicDir: resolveDir(opts.public),
      dataDir: resolveDir(opts.data),
      distDir: resolveDir(opts.out),
      site: opts.site,
    });
  });

program
  .command('db:init')
  .description('Initialize SQLite database and import content files')
  .option('--data <dir>', 'Data directory for database', 'data')
  .option('--content <dir>', 'Content directory', 'content')
  .option('--config <dir>', 'Config directory', 'config')
  .action(async (opts) => {
    await runDbInit({
      dataDir: resolveDir(opts.data),
      contentDir: resolveDir(opts.content),
      configDir: resolveDir(opts.config),
    });
  });

program
  .command('import')
  .description('Import content files into database')
  .option('--data <dir>', 'Data directory', 'data')
  .option('--content <dir>', 'Content directory', 'content')
  .argument('[path]', 'Specific directory or file to import')
  .action(async (importPath, opts) => {
    await runImport({
      dataDir: resolveDir(opts.data),
      contentDir: resolveDir(opts.content),
      path: importPath,
    });
  });

program
  .command('export')
  .description('Export database content to files')
  .option('--data <dir>', 'Data directory', 'data')
  .option('--content <dir>', 'Content directory', 'content')
  .option('--type <type>', 'Filter by content type')
  .action(async (opts) => {
    await runExport({
      dataDir: resolveDir(opts.data),
      contentDir: resolveDir(opts.content),
      type: opts.type,
    });
  });

program
  .command('sync')
  .description('Bidirectional sync between files and database')
  .option('--data <dir>', 'Data directory', 'data')
  .option('--content <dir>', 'Content directory', 'content')
  .action(async (opts) => {
    await runSync({
      dataDir: resolveDir(opts.data),
      contentDir: resolveDir(opts.content),
    });
  });

program
  .command('init')
  .description('Initialize project with a starter profile (lokatech, blank)')
  .option('-s, --starter <name>', 'Starter profile to use', 'lokatech')
  .option('--starters-dir <dir>', 'Starters directory', 'starters')
  .option('--force', 'Overwrite existing content', false)
  .action(async (opts) => {
    let startersDir = resolveDir(opts.startersDir);
    if (!fs.existsSync(startersDir)) {
      const pkgStarters = path.resolve(getPackageRoot(), 'starters');
      if (fs.existsSync(pkgStarters)) startersDir = pkgStarters;
    }
    await runInit({
      starter: opts.starter,
      startersDir,
      targetDir: process.cwd(),
      force: opts.force,
    });
  });

program
  .command('starters')
  .description('List available starter profiles')
  .option('--starters-dir <dir>', 'Starters directory', 'starters')
  .action((opts) => {
    let startersPath = resolveDir(opts.startersDir);
    if (!fs.existsSync(startersPath)) {
      const pkgStarters = path.resolve(getPackageRoot(), 'starters');
      if (fs.existsSync(pkgStarters)) startersPath = pkgStarters;
    }
    const starters = listStarters(startersPath);
    if (starters.length === 0) {
      console.log('\n  No starters found.\n');
      return;
    }
    console.log('\n  Available starters:\n');
    for (const s of starters) {
      console.log(`    \x1b[36m${s.name.padEnd(14)}\x1b[0m ${s.label}`);
      console.log(`    ${''.padEnd(14)} \x1b[2m${s.description.trim().split('\n')[0]}\x1b[0m`);
      console.log();
    }
  });

program
  .command('create <name>')
  .description('Create a new Barka project')
  .option('-t, --template <template>', 'Starter template', 'default')
  .action(async (name: string, opts: { template?: string }) => {
    const { createApp } = await import('./create-app.js');
    await createApp(name, opts);
  });

program.parse();
