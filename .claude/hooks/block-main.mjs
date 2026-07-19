// Hook PreToolUse (Edit/Write) : bloque toute modification de fichier quand la branche est main.
// Sortie 2 = action bloquée, le message stderr est renvoyé à Claude.
import { execSync } from 'node:child_process';

let branch = '';
try {
  branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
} catch {
  process.exit(0); // pas un repo git : rien à bloquer
}

if (branch === 'main') {
  process.stderr.write(
    'Édition refusée : la branche courante est main. Crée une branche feat/… ou fix/… avant de modifier des fichiers (process-dev).',
  );
  process.exit(2);
}
process.exit(0);
