import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

interface InitOptions {
  starter: string;
  startersDir: string;
  targetDir: string;
  force?: boolean;
}

interface StarterConfig {
  name: string;
  label: string;
  description: string;
  theme?: string;
  copies: Array<{ from: string; to: string }>;
}

const USER_OWNED_DIRS = ['content', 'config', 'themes'];

function copyRecursive(src: string, dest: string): number {
  let count = 0;
  if (!fs.existsSync(src)) return count;

  const stat = fs.statSync(src);
  if (stat.isFile()) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, dest);
    return 1;
  }

  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      count += copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}

function dirHasFiles(dir: string): boolean {
  return fs.existsSync(dir) && fs.readdirSync(dir).length > 0;
}

export async function runInit(opts: InitOptions): Promise<void> {
  const starterDir = path.join(opts.startersDir, opts.starter);

  if (!fs.existsSync(starterDir)) {
    const available = listStarters(opts.startersDir);
    console.error(`\n  ✗ Starter "${opts.starter}" not found.\n`);
    if (available.length > 0) {
      console.log('  Available starters:\n');
      for (const s of available) {
        console.log(`    • ${s.name.padEnd(14)} ${s.label}`);
      }
      console.log();
    }
    process.exit(1);
  }

  const configPath = path.join(starterDir, 'starter.yaml');
  if (!fs.existsSync(configPath)) {
    console.error(`\n  ✗ Missing starter.yaml in ${starterDir}\n`);
    process.exit(1);
  }

  const config = yaml.load(fs.readFileSync(configPath, 'utf-8')) as StarterConfig;

  if (!opts.force) {
    const conflicts: string[] = [];
    for (const dir of USER_OWNED_DIRS) {
      if (dirHasFiles(path.join(opts.targetDir, dir))) {
        conflicts.push(dir + '/');
      }
    }
    if (conflicts.length > 0) {
      console.error(`\n  ✗ The following directories are not empty:`);
      for (const c of conflicts) {
        console.error(`      ${c}`);
      }
      console.error('    Use --force to overwrite existing files.\n');
      process.exit(1);
    }
  } else {
    // Clean target directories before copying to avoid leftover files from a previous starter
    for (const dir of USER_OWNED_DIRS) {
      const target = path.join(opts.targetDir, dir);
      if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true, force: true });
      }
    }
  }

  console.log(`\n  \x1b[1m\x1b[35m⬡ Barka\x1b[0m init\n`);
  console.log(`  \x1b[2m➜\x1b[0m  Starter: \x1b[36m${config.label}\x1b[0m`);
  console.log(`  \x1b[2m➜\x1b[0m  Theme:   \x1b[36m${config.theme ?? 'base'}\x1b[0m`);
  console.log();

  let totalFiles = 0;
  for (const copy of config.copies) {
    const src = path.join(starterDir, copy.from);
    const dest = path.join(opts.targetDir, copy.to);
    const count = copyRecursive(src, dest);
    totalFiles += count;

    const label = copy.from.replace(/\/$/, '').padEnd(12);
    console.log(`  \x1b[32m✓\x1b[0m ${label} → ${copy.to.padEnd(12)} \x1b[2m(${count} files)\x1b[0m`);
  }

  console.log(`\n  \x1b[32m✓\x1b[0m Initialized with ${totalFiles} files from "${config.name}" starter.`);
  console.log(`\n  \x1b[2mEverything in content/, config/, and themes/ is now yours.\x1b[0m`);
  console.log(`  \x1b[2mCustomize freely — framework updates won't touch these directories.\x1b[0m`);
  console.log(`\n  Next steps:`);
  console.log(`    barka dev           Start the development server`);
  console.log(`    barka build         Build static site to dist/`);
  console.log();
}

export function listStarters(startersDir: string): StarterConfig[] {
  if (!fs.existsSync(startersDir)) return [];

  const results: StarterConfig[] = [];
  for (const entry of fs.readdirSync(startersDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const configPath = path.join(startersDir, entry.name, 'starter.yaml');
    if (!fs.existsSync(configPath)) continue;
    const config = yaml.load(fs.readFileSync(configPath, 'utf-8')) as StarterConfig;
    results.push(config);
  }
  return results;
}
