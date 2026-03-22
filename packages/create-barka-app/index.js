#!/usr/bin/env node

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const name = args[0];

if (!name) {
  console.log(`
  \x1b[1m\x1b[35m⬡ create-barka-app\x1b[0m

  Usage: npx create-barka-app <project-name> [options]

  Options:
    --starter <name>   Starter profile (lokatech, kadoservices, blank)
                       Default: lokatech

  Examples:
    npx create-barka-app my-site
    npx create-barka-app my-site --starter kadoservices
    npx create-barka-app my-site --starter blank
`);
  process.exit(1);
}

// Parse --starter flag
let starter = 'lokatech';
const starterIdx = args.indexOf('--starter');
if (starterIdx !== -1 && args[starterIdx + 1]) {
  starter = args[starterIdx + 1];
}

const targetDir = path.resolve(process.cwd(), name);

if (fs.existsSync(targetDir)) {
  console.error(`\n  \x1b[31m✗\x1b[0m Directory "${name}" already exists.\n`);
  process.exit(1);
}

console.log(`
  \x1b[1m\x1b[35m⬡ create-barka-app\x1b[0m

  Creating \x1b[36m${name}\x1b[0m with starter \x1b[36m${starter}\x1b[0m...
`);

// Create directory
fs.mkdirSync(targetDir, { recursive: true });

// Write package.json
const pkg = {
  name,
  private: true,
  type: 'module',
  scripts: {
    dev: 'barka dev',
    build: 'barka build',
    'db:init': 'barka db:init',
  },
  dependencies: {
    '@barkajs/barka': '^0.1.0',
  },
};
fs.writeFileSync(
  path.join(targetDir, 'package.json'),
  JSON.stringify(pkg, null, 2) + '\n',
);

// Write .gitignore
fs.writeFileSync(
  path.join(targetDir, '.gitignore'),
  `node_modules/
dist/
data/
*.db
.env
.DS_Store
`,
);

// Write README
fs.writeFileSync(
  path.join(targetDir, 'README.md'),
  `# ${name}

Built with [Barka CMS](https://github.com/barkajs/barka) — AI-native progressive Content-as-Code CMS.

## Quick Start

\`\`\`bash
npm install
npm run dev     # http://localhost:3000
\`\`\`

## Commands

\`\`\`bash
npm run dev       # Dev server with hot reload
npm run build     # Static site to dist/
npm run db:init   # Add SQLite + admin UI at /admin
\`\`\`
`,
);

console.log(`  \x1b[32m✓\x1b[0m Project created`);

// Install dependencies
console.log(`  \x1b[2m➜\x1b[0m Installing dependencies...\n`);
try {
  execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
} catch {
  console.error('\n  \x1b[31m✗\x1b[0m npm install failed. Run it manually:\n');
  console.log(`    cd ${name} && npm install\n`);
  process.exit(1);
}

// Run barka init with starter
console.log(`\n  \x1b[2m➜\x1b[0m Initializing with starter \x1b[36m${starter}\x1b[0m...\n`);
try {
  execSync(`npx barka init --starter ${starter} --force`, {
    cwd: targetDir,
    stdio: 'inherit',
  });
} catch {
  console.error(`\n  \x1b[33m⚠\x1b[0m  Starter init failed. Run manually:\n`);
  console.log(`    cd ${name} && npx barka init --starter ${starter}\n`);
}

console.log(`
  \x1b[32m✓\x1b[0m \x1b[1m${name}\x1b[0m is ready!

  Next steps:
    cd ${name}
    npm run dev

  Open \x1b[36mhttp://localhost:3000\x1b[0m

  Docs: \x1b[36mhttps://github.com/barkajs/barka\x1b[0m
`);
