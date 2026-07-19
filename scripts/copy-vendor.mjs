// Copie les bibliothèques front depuis node_modules vers src/public/vendor/.
// Lancé par `postinstall` — les fichiers vendorisés ne sont pas versionnés.
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const vendorDir = path.join(root, 'src', 'public', 'vendor');

const files = [
  ['node_modules/htmx.org/dist/htmx.min.js', 'htmx.min.js'],
  ['node_modules/alpinejs/dist/cdn.min.js', 'alpine.min.js'],
];

await mkdir(vendorDir, { recursive: true });
for (const [source, target] of files) {
  await copyFile(path.join(root, source), path.join(vendorDir, target));
}
console.log(`vendor: ${files.length} fichiers copiés vers src/public/vendor/`);
