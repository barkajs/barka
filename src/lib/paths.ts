import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Find the root of the @barkajs/barka package by walking up from this file.
 * Works whether running from source (src/lib/) or compiled (dist/lib/).
 */
export function getPackageRoot(): string {
  let dir = __dirname;
  while (dir !== path.dirname(dir)) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        if (pkg.name === '@barkajs/barka' || pkg.name === 'barka') return dir;
      } catch { /* ignore */ }
    }
    dir = path.dirname(dir);
  }
  return path.resolve(__dirname, '..', '..');
}
