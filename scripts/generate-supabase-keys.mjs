// Génère le secret JWT et les clés anon / service_role pour la stack Supabase locale.
// Usage : node scripts/generate-supabase-keys.mjs  → coller la sortie dans .env
import { createHmac, randomBytes } from 'node:crypto';

const base64url = (input) => Buffer.from(input).toString('base64url');

function signJwt(payload, secret) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify(payload));
  const signature = createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

const secret = randomBytes(40).toString('base64url');
const iat = Math.floor(Date.now() / 1000);
const exp = iat + 10 * 365 * 24 * 3600; // 10 ans — clés de dev local uniquement

const claims = (role) => ({ role, iss: 'supabase', iat, exp });

console.log(`JWT_SECRET=${secret}`);
console.log(`SUPABASE_ANON_KEY=${signJwt(claims('anon'), secret)}`);
console.log(`SUPABASE_SERVICE_ROLE_KEY=${signJwt(claims('service_role'), secret)}`);
