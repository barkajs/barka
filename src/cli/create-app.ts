import fs from 'node:fs';
import path from 'node:path';
import { runInit, listStarters } from './init-cmd.js';
import { getPackageRoot } from '../lib/paths.js';

export async function createApp(name: string, options: { template?: string }): Promise<void> {
  const targetDir = path.resolve(process.cwd(), name);

  if (fs.existsSync(targetDir)) {
    console.error(`Directory "${name}" already exists.`);
    process.exit(1);
  }

  console.log(`\n  \x1b[1m\x1b[35m⬡ Barka\x1b[0m create ${name}\n`);

  fs.mkdirSync(targetDir, { recursive: true });

  const files: Record<string, string> = {
    'package.json': packageJson(name),
    '.gitignore': gitignoreFile,
    'README.md': readmeFile(name),
    'public/.gitkeep': '',
  };

  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(targetDir, filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf-8');
  }

  console.log(`  \x1b[32m✓\x1b[0m Project scaffolded: ${name}\n`);

  const starterName = options.template === 'blank' ? 'blank' : 'lokatech';
  const startersDir = resolveStartersDir();

  if (startersDir && fs.existsSync(path.join(startersDir, starterName))) {
    await runInit({
      starter: starterName,
      startersDir,
      targetDir,
      force: true,
    });
  } else {
    console.log(`  \x1b[33m⚠\x1b[0m  No starters directory found. Run \x1b[36mbarka init --starter ${starterName}\x1b[0m later.\n`);
    writeMinimalContent(targetDir, name);
  }

  console.log(`  Next steps:
    cd ${name}
    npm install
    npm run dev

  Start writing content in content/ directory.
  Deploy with: npm run build && npx wrangler pages deploy dist/
`);
}

function resolveStartersDir(): string | null {
  const candidates = [
    path.resolve(process.cwd(), 'starters'),     // dev mode: starters in cwd
    path.resolve(getPackageRoot(), 'starters'),   // npm mode: starters in package
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return null;
}

/**
 * Minimal content when no starter is available (e.g. installed via npm).
 * The built-in fallback theme will handle rendering.
 */
function writeMinimalContent(targetDir: string, name: string): void {
  const dirs = ['content/pages', 'content/landing-pages', 'config'];
  for (const d of dirs) {
    fs.mkdirSync(path.join(targetDir, d), { recursive: true });
  }

  fs.writeFileSync(
    path.join(targetDir, 'config/settings.yaml'),
    `site_name: "${name}"
base_url: "http://localhost:3000"
theme: _builtin

seo:
  title_separator: " | "
  default_description: "A site powered by Barka CMS"
`,
  );

  fs.writeFileSync(
    path.join(targetDir, 'config/content-types.yaml'),
    `article:
  label: Article
  path_pattern: "/articles/{slug}"
  fields:
    summary:
      type: textarea
      label: Summary

page:
  label: Page
  path_pattern: "/{slug}"
  fields:
    subtitle:
      type: text
      label: Subtitle

landing_page:
  label: Landing Page
  path_pattern: "/{slug}"
  fields:
    subtitle:
      type: text
      label: Subtitle
`,
  );

  fs.writeFileSync(
    path.join(targetDir, 'content/pages/about.md'),
    `---
title: About
slug: about
---

## About ${name}

Edit this page at \`content/pages/about.md\`.
`,
  );

  fs.writeFileSync(
    path.join(targetDir, 'content/landing-pages/homepage.yaml'),
    `title: Home
slug: home
path: /
sections:
  - type: hero
    heading: "Welcome to ${name}"
    subheading: "A modern site powered by Barka CMS."
    cta_text: "Get Started"
    cta_url: "/about"
    settings:
      background: dark
`,
  );
}

function packageJson(name: string): string {
  return JSON.stringify(
    {
      name,
      private: true,
      type: 'module',
      scripts: {
        dev: 'barka dev',
        build: 'barka build',
        init: 'barka init',
        'db:init': 'barka db:init',
      },
      dependencies: {
        '@barkajs/barka': '^1.0.0',
      },
    },
    null,
    2,
  ) + '\n';
}

const gitignoreFile = `node_modules/
dist/
data/
*.db
.env
.DS_Store
`;

function readmeFile(name: string): string {
  return `# ${name}

A site powered by [Barka CMS](https://github.com/barkajs/barka).

## Quick Start

\`\`\`bash
npm install
npm run dev     # Start dev server at http://localhost:3000
npm run build   # Build static site to dist/
\`\`\`

## Initialize with a Starter

\`\`\`bash
barka init --starter lokatech   # Full demo site with premium theme
barka init --starter blank      # Empty project with base theme
\`\`\`

After init, \`content/\`, \`config/\`, and \`themes/\` are yours to customize.
Framework updates won't touch them.

## Adding a Database

\`\`\`bash
npm run db:init   # Create SQLite DB, enable /admin
\`\`\`

Admin login: admin@example.com / Admin123!SecurePass
`;
}
