import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { loadEnv } from '../../config/env.js';
import { createDb, type Database } from '../../db/client.js';
import { notes } from '../../db/schema.js';
import { buildApp } from '../app.js';

let container: StartedPostgreSqlContainer;
let database: Database;
let app: FastifyInstance;

const postNote = (content: string) =>
  app.inject({
    method: 'POST',
    url: '/notes',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    payload: `content=${encodeURIComponent(content)}`,
  });

beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:17-alpine').start();
  const uri = container.getConnectionUri();
  database = createDb(uri);
  await migrate(database.db, { migrationsFolder: 'src/db/migrations' });
  app = await buildApp(
    loadEnv({ NODE_ENV: 'test', LOG_LEVEL: 'error', DATABASE_URL: uri }),
    database.db,
  );
}, 120_000);

beforeEach(async () => {
  await database.db.delete(notes);
});

afterAll(async () => {
  await app.close();
  await database.close();
  await container.stop();
});

describe('GET /notes', () => {
  it('affiche la page avec le formulaire et les notes existantes', async () => {
    await database.db.insert(notes).values({ content: 'note existante' });
    const response = await app.inject({ method: 'GET', url: '/notes' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain('<form');
    expect(response.body).toContain('note existante');
  });
});

describe('POST /notes', () => {
  it('crée la note et renvoie le fragment mis à jour', async () => {
    const response = await postNote('nouvelle note');

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toContain('<html');
    expect(response.body).toContain('nouvelle note');
    expect(await database.db.select().from(notes)).toHaveLength(1);
  });

  it('refuse un contenu vide avec un message, sans rien créer', async () => {
    const response = await postNote('   ');

    expect(response.statusCode).toBe(400);
    expect(response.body).toContain('entre 1 et 500 caractères');
    expect(await database.db.select().from(notes)).toHaveLength(0);
  });

  it('refuse un contenu de plus de 500 caractères', async () => {
    const response = await postNote('a'.repeat(501));

    expect(response.statusCode).toBe(400);
    expect(await database.db.select().from(notes)).toHaveLength(0);
  });

  it('échappe le HTML du contenu (XSS)', async () => {
    const response = await postNote('<script>alert(1)</script>');

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toContain('<script>alert(1)</script>');
    expect(response.body).toContain('&lt;script&gt;');
  });
});

describe('DELETE /notes/:id', () => {
  it('supprime la note et renvoie le fragment sans elle', async () => {
    const [note] = await database.db.insert(notes).values({ content: 'à supprimer' }).returning();

    const response = await app.inject({ method: 'DELETE', url: `/notes/${note!.id}` });

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toContain('à supprimer');
    expect(await database.db.select().from(notes)).toHaveLength(0);
  });

  it('répond 404 pour un id inexistant', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/notes/3f2b8c9e-1a4d-4e6f-9b2a-7c5d8e0f1a2b',
    });
    expect(response.statusCode).toBe(404);
  });

  it('répond 400 pour un id mal formé', async () => {
    const response = await app.inject({ method: 'DELETE', url: '/notes/42' });
    expect(response.statusCode).toBe(400);
  });
});
