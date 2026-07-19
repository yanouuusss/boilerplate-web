import { loadEnv } from '../config/env.js';
import { createDb } from '../db/client.js';
import { buildApp } from './app.js';

const env = loadEnv();
const database = createDb(env.DATABASE_URL);
const app = await buildApp(env, database.db);

app.addHook('onClose', () => database.close());

try {
  await app.listen({ host: env.HOST, port: env.PORT });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
