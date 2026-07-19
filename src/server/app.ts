import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Fastify, { type FastifyInstance } from 'fastify';
import fastifyFormbody from '@fastify/formbody';
import fastifyHelmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import { Eta } from 'eta';
import type { Env } from '../config/env.js';
import type { Database } from '../db/client.js';
import { registerNotesRoutes } from './routes/notes.js';

const serverDir = path.dirname(fileURLToPath(import.meta.url));

export async function buildApp(env: Env, db: Database['db']): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      ...(env.NODE_ENV === 'development' ? { transport: { target: 'pino-pretty' } } : {}),
    },
  });

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // Alpine.js évalue ses expressions via new Function(), ce qui exige 'unsafe-eval'.
        scriptSrc: ["'self'", "'unsafe-eval'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
      },
    },
  });

  await app.register(fastifyView, {
    engine: { eta: new Eta() },
    root: path.join(serverDir, '..', 'views'),
    viewExt: 'eta',
  });

  await app.register(fastifyStatic, {
    root: path.join(serverDir, '..', 'public'),
    prefix: '/public/',
  });

  await app.register(fastifyFormbody);

  app.get('/health', () => ({ status: 'ok' }));

  app.get('/', (_request, reply) => reply.view('pages/home', { title: 'Boilerplate web' }));

  registerNotesRoutes(app, db);

  return app;
}
