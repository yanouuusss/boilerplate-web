import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

export type Database = ReturnType<typeof createDb>;

/** Crée un client Drizzle sur un pool node-postgres. Appeler `close()` à l'arrêt. */
export function createDb(connectionString: string) {
  const pool = new pg.Pool({ connectionString });
  const db = drizzle(pool, { schema });
  return { db, close: () => pool.end() };
}
