import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { loadEnv } from '../config/env.js';
import { createDb } from '../db/client.js';
import { buildApp } from './app.js';

let app: FastifyInstance;

beforeAll(async () => {
  // Le pool pg est paresseux : aucune connexion tant qu'aucune route ne requête la base.
  const database = createDb('postgresql://postgres:unused@127.0.0.1:9/unused');
  app = await buildApp(
    loadEnv({
      NODE_ENV: 'test',
      LOG_LEVEL: 'error',
      DATABASE_URL: 'postgresql://postgres:unused@127.0.0.1:9/unused',
    }),
    database.db,
  );
});

afterAll(async () => {
  await app.close();
});

describe('GET /health', () => {
  it('répond 200 avec le statut ok', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });
});

describe('GET /', () => {
  it("rend la page d'accueil dans le layout", async () => {
    const response = await app.inject({ method: 'GET', url: '/' });
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.body).toContain('<!doctype html>');
    expect(response.body).toContain('<h1>Boilerplate web</h1>');
    expect(response.body).toContain('/public/vendor/htmx.min.js');
  });

  it('envoie les headers de sécurité (CSP)', async () => {
    const response = await app.inject({ method: 'GET', url: '/' });
    expect(response.headers['content-security-policy']).toContain("default-src 'self'");
  });
});

describe('GET /public/*', () => {
  it('sert les assets statiques', async () => {
    const response = await app.inject({ method: 'GET', url: '/public/css/app.css' });
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/css');
  });
});
