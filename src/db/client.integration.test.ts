import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createDb, type Database } from './client.js';

let container: StartedPostgreSqlContainer;
let database: Database;

beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:17-alpine').start();
  database = createDb(container.getConnectionUri());
}, 120_000);

afterAll(async () => {
  await database.close();
  await container.stop();
});

describe('client Drizzle', () => {
  it('se connecte au Postgres conteneurisé et exécute une requête', async () => {
    const result = await database.db.execute(sql`select 1 as one`);
    expect(result.rows).toEqual([{ one: 1 }]);
  });
});
