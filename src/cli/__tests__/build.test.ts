import { describe, it, expect, afterAll, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { runBuild, type BuildOptions } from '../build.js';

const FIXTURE_DIR = path.resolve(__dirname, 'fixtures/build-test');
const DIST_DIR = path.join(FIXTURE_DIR, 'dist');

function buildOpts(overrides?: Partial<BuildOptions>): BuildOptions {
  return {
    contentDir: path.join(FIXTURE_DIR, 'content'),
    configDir: path.join(FIXTURE_DIR, 'config'),
    themesDir: path.join(FIXTURE_DIR, 'themes'),
    publicDir: path.join(FIXTURE_DIR, 'public'),
    dataDir: path.join(FIXTURE_DIR, 'data'),
    distDir: DIST_DIR,
    ...overrides,
  };
}

function readDist(relativePath: string): string {
  return fs.readFileSync(path.join(DIST_DIR, relativePath), 'utf-8');
}

function distExists(relativePath: string): boolean {
  return fs.existsSync(path.join(DIST_DIR, relativePath));
}

function listDistFiles(): string[] {
  const files: string[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else files.push(path.relative(DIST_DIR, full));
    }
  }
  if (fs.existsSync(DIST_DIR)) walk(DIST_DIR);
  return files;
}

describe('barka build', () => {
  beforeEach(() => {
    if (fs.existsSync(DIST_DIR)) {
      fs.rmSync(DIST_DIR, { recursive: true });
    }
    delete process.env.BASE_URL;
  });

  afterAll(() => {
    if (fs.existsSync(DIST_DIR)) {
      fs.rmSync(DIST_DIR, { recursive: true });
    }
  });

  it('uses theme engine, not hardcoded fallback HTML', async () => {
    await runBuild(buildOpts());

    const html = readDist('about/index.html');
    // Should NOT contain the old hardcoded inline styles from minimal renderer
    expect(html).not.toContain('max-width:72ch');
    expect(html).not.toContain('Powered by Barka.');
    // Should contain DOCTYPE from theme engine
    expect(html).toContain('<!DOCTYPE html');
  });

  it('copies theme static assets to /static/ (not /theme/)', async () => {
    const staticDir = path.join(FIXTURE_DIR, 'themes/starter/static/images');
    fs.mkdirSync(staticDir, { recursive: true });
    fs.writeFileSync(path.join(staticDir, 'test.png'), 'fake-image');

    await runBuild(buildOpts());

    expect(distExists('static/images/test.png')).toBe(true);
    expect(distExists('theme/images/test.png')).toBe(false);

    fs.unlinkSync(path.join(staticDir, 'test.png'));
  });

  it('generates homepage at /index.html from homepage slug', async () => {
    await runBuild(buildOpts());

    expect(distExists('index.html')).toBe(true);
  });

  it('generates individual content pages', async () => {
    await runBuild(buildOpts());

    // Content pages generated at their resolved paths
    expect(distExists('test-article/index.html')).toBe(true);
    expect(distExists('about/index.html')).toBe(true);
    expect(distExists('homepage/index.html')).toBe(true);
  });

  it('generates listing pages for content types', async () => {
    await runBuild(buildOpts());

    expect(distExists('articles/index.html')).toBe(true);
    const html = readDist('articles/index.html');
    expect(html).toContain('Insights'); // listing title
  });

  it('builds multi-language pages at /<lang>/ prefix', async () => {
    await runBuild(buildOpts());

    // PL article at /pl/ prefix
    expect(distExists('pl/test-article/index.html')).toBe(true);
    // PL listing
    expect(distExists('pl/articles/index.html')).toBe(true);
    // EN article at root (no prefix)
    expect(distExists('test-article/index.html')).toBe(true);
  });

  it('does not produce duplicate pages', async () => {
    await runBuild(buildOpts());

    const htmlFiles = listDistFiles().filter(f => f.endsWith('index.html'));
    const unique = new Set(htmlFiles);
    expect(htmlFiles.length).toBe(unique.size);
  });

  it('supports BASE_URL env override in sitemap', async () => {
    process.env.BASE_URL = 'https://example.com';
    await runBuild(buildOpts());

    const sitemap = readDist('sitemap.xml');
    expect(sitemap).toContain('https://example.com');
    expect(sitemap).not.toContain('http://localhost:3000');
  });

  it('uses settings.yaml base_url when BASE_URL not set', async () => {
    await runBuild(buildOpts());

    const sitemap = readDist('sitemap.xml');
    expect(sitemap).toContain('http://localhost:3000');
  });

  it('generates sitemap.xml', async () => {
    await runBuild(buildOpts());

    expect(distExists('sitemap.xml')).toBe(true);
    const sitemap = readDist('sitemap.xml');
    expect(sitemap).toContain('<urlset');
  });

  it('generates robots.txt', async () => {
    await runBuild(buildOpts());
    expect(distExists('robots.txt')).toBe(true);
  });

  it('generates RSS feed', async () => {
    await runBuild(buildOpts());

    expect(distExists('feed.xml')).toBe(true);
    const feed = readDist('feed.xml');
    expect(feed).toContain('<rss');
  });

  it('collects component CSS to /static/components.css', async () => {
    const compDir = path.join(FIXTURE_DIR, 'themes/starter/components/hero');
    fs.mkdirSync(compDir, { recursive: true });
    fs.writeFileSync(path.join(compDir, 'hero.css'), '.hero { color: red; }');

    await runBuild(buildOpts());

    expect(distExists('static/components.css')).toBe(true);
    const css = readDist('static/components.css');
    expect(css).toContain('.hero { color: red; }');

    fs.rmSync(path.join(FIXTURE_DIR, 'themes/starter/components'), { recursive: true });
  });

  it('skips languages with no content', async () => {
    await runBuild(buildOpts());

    // DE has no content, should not create /de/ directory
    expect(distExists('de')).toBe(false);
  });
});
