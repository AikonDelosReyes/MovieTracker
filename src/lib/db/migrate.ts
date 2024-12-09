import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import * as fs from 'fs';
import * as path from 'path';

const sqlite = new Database('sqlite.db');
sqlite.pragma('foreign_keys = ON');

const db = drizzle(sqlite, { schema });

// This will create the tables in the database
console.log('Running migrations...');
try {
  const migrationSQL = fs.readFileSync(
    path.join(process.cwd(), 'drizzle', '0005_watchlist_fix.sql'),
    'utf-8'
  );

  const statements = migrationSQL
    .split(';')
    .map(statement => statement.trim())
    .filter(statement => statement.length > 0);

  for (const statement of statements) {
    console.log('Executing:', statement);
    sqlite.exec(statement + ';');
  }

  console.log('Migrations complete!');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
