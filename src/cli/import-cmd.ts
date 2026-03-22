import { getDb, closeDb } from '../db/connection.js';
import { importContent } from '../lib/sync.js';

export async function runImport(options: {
  dataDir: string;
  contentDir: string;
  path?: string;
}): Promise<void> {
  const db = getDb(options.dataDir);
  const targetDir = options.path ?? options.contentDir;

  console.log(`Importing from ${targetDir}...`);
  const result = await importContent(db, targetDir);

  console.log(
    `Import complete: ${result.created} created, ${result.updated} updated, ${result.skipped} skipped`,
  );
  closeDb();
}
