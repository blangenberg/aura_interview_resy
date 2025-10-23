import { Umzug, JSONStorage } from 'umzug';
import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

const dbPath = path.join(__dirname, '../reservations.db');
const db = new Database(dbPath);

const umzug = new Umzug({
  migrations: {
    glob: ['migrations/*.sql', { cwd: path.join(__dirname, '..') }],
    resolve: (params) => {
      const filepath = params.path;
      return {
        name: params.name,
        up: async () => {
          const sql = fs.readFileSync(filepath, 'utf-8');
          db.exec(sql);
        },
        down: async () => {
          // Not implementing down migrations for this exercise
          throw new Error('Down migrations not implemented');
        },
      };
    },
  },
  storage: new JSONStorage({
    path: path.join(__dirname, '../.migrations.json'),
  }),
  logger: console,
});

async function runMigrations() {
  try {
    const migrations = await umzug.up();
    console.log('Migrations completed successfully');
    migrations.forEach(m => console.log(`  - ${m.name}`));
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

runMigrations();
