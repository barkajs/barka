import { getDb, closeDb } from '../db/connection.js';
import { exportContent } from '../lib/sync.js';

export async function runExport(options: {
  dataDir: string;
  contentDir: string;
  type?: string;
}): Promise<void> {
  const db = getDb(options.dataDir);

  console.log(`Exporting to ${options.contentDir}...`);
  const result = await exportContent(db, options.contentDir, {
    type: options.type,
  });

  console.log(`Export complete: ${result.exported} files written`);
  closeDb();
}
