import { loadEnv } from '../config/env.js';
import { buildApp } from './app.js';

const env = loadEnv();
const app = await buildApp(env);

try {
  await app.listen({ host: env.HOST, port: env.PORT });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
