import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createDb, type Database } from './client.js';
import { notes } from './schema.js';

let container: StartedPostgreSqlContainer;
let database: Database;

beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:17-alpine').start();
  database = createDb(container.getConnectionUri());
  await migrate(database.db, { migrationsFolder: 'src/db/migrations' });
}, 120_000);

afterAll(async () => {
  await database.close();
  await container.stop();
});

describe('table notes', () => {
  it("s'insère et se relit après application des migrations", async () => {
    const [created] = await database.db
      .insert(notes)
      .values({ content: 'première note' })
      .returning();

    expect(created?.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(created?.createdAt).toBeInstanceOf(Date);

    const all = await database.db.select().from(notes);
    expect(all).toHaveLength(1);
    expect(all[0]?.content).toBe('première note');
  });
});
