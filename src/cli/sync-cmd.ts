import { getDb, closeDb } from '../db/connection.js';
import { syncContent } from '../lib/sync.js';

export async function runSync(options: {
  dataDir: string;
  contentDir: string;
}): Promise<void> {
  const db = getDb(options.dataDir);

  console.log('Syncing files <-> database...');
  const result = await syncContent(db, options.contentDir);

  console.log(
    `File -> DB: ${result.fileToDb.created} created, ${result.fileToDb.updated} updated`,
  );
  console.log(
    `DB -> File: ${result.dbToFile.created} created, ${result.dbToFile.updated} updated`,
  );

  if (result.conflicts.length > 0) {
    console.log(`\nConflicts (${result.conflicts.length}):`);
    for (const c of result.conflicts) {
      console.log(`  - ${c.slug} (${c.id}): ${c.reason}`);
    }
  }

  closeDb();
}
