// Hook PostToolUse (Bash/PowerShell) : compresse les grosses sorties de commandes
// avant qu'elles n'entrent dans le contexte du modèle, pour limiter la consommation
// de tokens sur les longues sessions.
//
// Conservateur par conception :
// - ne touche rien en dessous du seuil (petites sorties intactes) ;
// - garde la tête, la queue, ET toute ligne ressemblant à une erreur (rien d'utile perdu) ;
// - en cas de doute ou d'erreur du hook, laisse la sortie d'origine (exit 0, aucune sortie).

const THRESHOLD_CHARS = 2500;
const HEAD_LINES = 15;
const TAIL_LINES = 45;
const MAX_ERROR_LINES = 25;
const ERROR_RE = /(error|fail|✗|×|✘|✖|exception|cannot|refused|denied|not found|introuvable|échou)/i;

function passthrough() {
  process.exit(0); // aucune sortie → Claude Code conserve le résultat original
}

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);

let input;
try {
  input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
} catch {
  passthrough();
}

if (!/^(Bash|PowerShell)$/.test(input?.tool_name ?? '')) passthrough();

const resp = input.tool_response;
let text;
if (typeof resp === 'string') text = resp;
else if (resp && typeof resp === 'object')
  text =
    typeof resp.stdout === 'string'
      ? resp.stdout
      : typeof resp.output === 'string'
        ? resp.output
        : JSON.stringify(resp);
else passthrough();

if (text.length <= THRESHOLD_CHARS) passthrough();

const lines = text.split('\n');
if (lines.length <= HEAD_LINES + TAIL_LINES + 5) passthrough();

const head = lines.slice(0, HEAD_LINES);
const tail = lines.slice(lines.length - TAIL_LINES);
const middle = lines.slice(HEAD_LINES, lines.length - TAIL_LINES);
const errorLines = middle.filter((l) => ERROR_RE.test(l)).slice(0, MAX_ERROR_LINES);
const cut = middle.length - errorLines.length;

const parts = [...head];
if (errorLines.length) parts.push(`… [lignes d'erreur conservées :]`, ...errorLines);
parts.push(
  `… [${cut} lignes coupées par shrink-output (${text.length} caractères au total) ; relance la commande si tu as besoin du détail] …`,
);
parts.push(...tail);

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      updatedToolOutput: parts.join('\n'),
    },
  }),
);
process.exit(0);
