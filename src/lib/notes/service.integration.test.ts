import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createDb, type Database } from '../../db/client.js';
import { notes } from '../../db/schema.js';
import { createNote, deleteNote, listNotes } from './service.js';

let container: StartedPostgreSqlContainer;
let database: Database;

beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:17-alpine').start();
  database = createDb(container.getConnectionUri());
  await migrate(database.db, { migrationsFolder: 'src/db/migrations' });
}, 120_000);

beforeEach(async () => {
  await database.db.delete(notes);
});

afterAll(async () => {
  await database.close();
  await container.stop();
});

describe('createNote', () => {
  it('crée une note et la retourne complète', async () => {
    const note = await createNote(database.db, 'ma note');
    expect(note.content).toBe('ma note');
    expect(note.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(note.createdAt).toBeInstanceOf(Date);
  });
});

describe('listNotes', () => {
  it('retourne les notes les plus récentes en premier', async () => {
    await database.db.insert(notes).values([
      { content: 'ancienne', createdAt: new Date('2026-01-01T10:00:00Z') },
      { content: 'récente', createdAt: new Date('2026-01-02T10:00:00Z') },
    ]);

    const result = await listNotes(database.db);
    expect(result.map((n) => n.content)).toEqual(['récente', 'ancienne']);
  });

  it('retourne un tableau vide sans note', async () => {
    expect(await listNotes(database.db)).toEqual([]);
  });
});

describe('deleteNote', () => {
  it('supprime la note et retourne true', async () => {
    const note = await createNote(database.db, 'à supprimer');
    expect(await deleteNote(database.db, note.id)).toBe(true);
    expect(await listNotes(database.db)).toEqual([]);
  });

  it('retourne false pour un id inexistant', async () => {
    expect(await deleteNote(database.db, '3f2b8c9e-1a4d-4e6f-9b2a-7c5d8e0f1a2b')).toBe(false);
  });
});
