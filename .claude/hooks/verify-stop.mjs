// Hook Stop : Claude ne peut pas terminer son tour avec un typecheck ou des tests unitaires rouges.
// stop_hook_active évite la boucle infinie si le hook a déjà bloqué une fois.
import { execSync } from 'node:child_process';

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);

try {
  const input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  if (input.stop_hook_active) process.exit(0);
} catch {
  process.exit(0);
}

try {
  execSync('npm run typecheck', { stdio: 'pipe' });
  execSync('npm run test:unit', { stdio: 'pipe' });
} catch (error) {
  const output = [error.stdout, error.stderr].filter(Boolean).join('\n').slice(-2000);
  process.stderr.write(`Vérification échouée (typecheck ou tests unitaires) :\n${output}`);
  process.exit(2);
}
process.exit(0);
