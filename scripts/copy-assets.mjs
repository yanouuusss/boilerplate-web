// Copie les assets non compilés (templates, statiques) vers dist/ après tsc.
import { cp } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

await cp(path.join(root, 'src', 'views'), path.join(root, 'dist', 'views'), { recursive: true });
await cp(path.join(root, 'src', 'public'), path.join(root, 'dist', 'public'), { recursive: true });
console.log('assets: views/ et public/ copiés vers dist/');
