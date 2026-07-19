// Hook PostToolUse (Edit/Write) : formate et corrige le fichier modifié.
// Toujours sortie 0 — le formatage ne doit jamais bloquer le travail.
import { execSync } from 'node:child_process';

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);

let filePath;
try {
  const input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  filePath = input.tool_input?.file_path;
} catch {
  process.exit(0);
}
if (!filePath) process.exit(0);

const run = (cmd) => {
  try {
    execSync(cmd, { stdio: 'ignore' });
  } catch {
    // les erreurs de lint restantes sont remontées par les vérifications, pas par ce hook
  }
};

run(`npx prettier --write "${filePath}"`);
if (/\.(ts|js|mjs)$/.test(filePath)) {
  run(`npx eslint --fix "${filePath}"`);
}
process.exit(0);
