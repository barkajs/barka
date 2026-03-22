import {
  hasDatabase,
  createDatabase,
  initializeSchema,
  closeDb,
} from '../db/connection.js';
import { importContent } from '../lib/sync.js';
import { importTaxonomy } from '../lib/taxonomy.js';
import { importSites } from '../lib/multisite.js';
import { createUser } from '../lib/auth.js';

export async function runDbInit(options: {
  dataDir: string;
  contentDir: string;
  configDir: string;
}): Promise<void> {
  const { dataDir, contentDir } = options;

  if (hasDatabase(dataDir)) {
    console.log(
      'Warning: Database already exists. Delete it first to re-initialize.',
    );
    return;
  }

  console.log('Creating database...');
  const db = createDatabase(dataDir);
  initializeSchema(db);

  console.log('Importing content files...');
  const result = await importContent(db, contentDir);

  console.log('Importing taxonomy terms...');
  const taxResult = importTaxonomy(db, options.configDir);
  console.log(`${taxResult.created} taxonomy terms imported.`);

  console.log('Importing sites...');
  const sitesResult = importSites(db, options.configDir);
  console.log(`${sitesResult.created} sites imported.`);

  console.log('Creating admin user...');
  await createUser(db, 'admin@example.com', 'Admin123!SecurePass', 'Admin', 'admin');

  console.log(
    `Database created. ${result.created} content items imported. Admin: admin@example.com`,
  );
  closeDb();
}
