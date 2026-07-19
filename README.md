# boilerplate-web

Boilerplate d'applications web : TypeScript strict, Fastify, HTMX + Alpine.js (rendu serveur), Supabase auto-hébergé, Drizzle ORM, Zod. Le process de développement est imposé par la configuration Claude Code (`.claude/`) et la CI GitHub Actions.

## Démarrage

```bash
cp .env.example .env   # puis remplir les valeurs
npm install
docker compose up -d   # Postgres + stack Supabase
npm run dev            # http://localhost:3000
```

## Commandes

| Commande                          | Effet                                             |
| --------------------------------- | ------------------------------------------------- |
| `npm run dev`                     | serveur de dev avec rechargement                  |
| `npm test`                        | tests unitaires + intégration (couverture ≥ 80 %) |
| `npm run lint` / `npm run format` | qualité de code                                   |
| `npm run typecheck`               | `tsc --noEmit`                                    |
| `npm run build` / `npm start`     | build et exécution production                     |

## Architecture

- La vérité vit sur le serveur : HTMX insère du HTML rendu par Fastify, Alpine ne gère que l'état local éphémère.
- Le navigateur ne parle jamais à Supabase directement ; tout passe par Fastify.
- Drizzle est propriétaire du schéma (migrations dans `src/db/`).
- Validation Zod à toute frontière (routes, env, formulaires).

Process complet : voir `.claude/skills/process-dev/SKILL.md`.
