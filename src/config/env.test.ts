import { describe, expect, it } from 'vitest';
import { loadEnv } from './env.js';

describe('loadEnv', () => {
  it('applique les valeurs par défaut sur un environnement vide', () => {
    const env = loadEnv({});
    expect(env).toEqual({
      NODE_ENV: 'development',
      HOST: '127.0.0.1',
      PORT: 3000,
      LOG_LEVEL: 'info',
    });
  });

  it('convertit PORT en nombre', () => {
    expect(loadEnv({ PORT: '8080' }).PORT).toBe(8080);
  });

  it('échoue immédiatement sur une valeur invalide', () => {
    expect(() => loadEnv({ PORT: 'pas-un-port' })).toThrow(/invalides/);
    expect(() => loadEnv({ NODE_ENV: 'staging' })).toThrow(/invalides/);
    expect(() => loadEnv({ LOG_LEVEL: 'verbose' })).toThrow(/invalides/);
  });
});
