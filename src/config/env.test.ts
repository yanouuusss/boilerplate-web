import { describe, expect, it } from 'vitest';
import { loadEnv } from './env.js';

const DATABASE_URL = 'postgresql://postgres:secret@127.0.0.1:5432/postgres';

describe('loadEnv', () => {
  it('applique les valeurs par défaut quand seul DATABASE_URL est fourni', () => {
    const env = loadEnv({ DATABASE_URL });
    expect(env).toEqual({
      NODE_ENV: 'development',
      HOST: '127.0.0.1',
      PORT: 3000,
      LOG_LEVEL: 'info',
      DATABASE_URL,
    });
  });

  it('convertit PORT en nombre', () => {
    expect(loadEnv({ DATABASE_URL, PORT: '8080' }).PORT).toBe(8080);
  });

  it('échoue immédiatement si DATABASE_URL manque ou est invalide', () => {
    expect(() => loadEnv({})).toThrow(/invalides/);
    expect(() => loadEnv({ DATABASE_URL: 'pas-une-url' })).toThrow(/invalides/);
  });

  it('échoue immédiatement sur une valeur invalide', () => {
    expect(() => loadEnv({ DATABASE_URL, PORT: 'pas-un-port' })).toThrow(/invalides/);
    expect(() => loadEnv({ DATABASE_URL, NODE_ENV: 'staging' })).toThrow(/invalides/);
    expect(() => loadEnv({ DATABASE_URL, LOG_LEVEL: 'verbose' })).toThrow(/invalides/);
  });
});
