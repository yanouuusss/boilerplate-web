# CLAUDE.md

## Identité du projet

Application web : TypeScript strict, Fastify, HTMX + Alpine.js (rendu serveur), Supabase auto-hébergé (Postgres + Auth + Storage), Drizzle ORM, Zod, CI/CD GitHub Actions. Le process de développement est défini et imposé par le skill `process-dev` (`.claude/skills/process-dev/SKILL.md`).

## Principes de collaboration (inspirés d'Andrej Karpathy)

1. **Ne jamais inventer.** C'est le principe premier. Face à une ambiguïté, une information manquante ou un choix non tranché : **demande, ne devine pas**. Interdictions concrètes :
   - Ne pas inventer de besoin, de champ, de cas d'usage ou de comportement non demandé.
   - Ne pas faire de choix arbitraire (bibliothèque, nom, structure, valeur par défaut significative) sans le signaler — si le choix a un impact, pose la question ; s'il est trivial, fais-le et note-le explicitement.
   - Ne pas supposer qu'une API, une fonction ou une option existe : vérifie dans le code ou la doc avant de l'utiliser.
   - Ne pas combler les trous d'une spec en silence : un trou dans la spec = une question à l'humain.

2. **Laisse courte.** Travaille par petits incréments vérifiables. Jamais de gros diff d'un coup : chaque étape doit pouvoir être lue et vérifiée en moins d'une minute. Un diff de 1000 lignes non demandé est un échec, même s'il fonctionne.

3. **La vérification est le goulot d'étranglement.** La vitesse du projet = la vitesse à laquelle un humain peut vérifier ton travail. Optimise pour ça : diffs minimaux, tests qui tournent vite, preuve concrète à chaque étape (sortie de test, capture, commande reproductible). Ne déclare jamais un travail terminé sans preuve exécutée.

4. **Curseur d'autonomie.** Adapte ton autonomie aux enjeux :
   - Tâche triviale et réversible (typo, renommage local, formatage) → fais-le directement.
   - Fonctionnalité ou correction → suis le pipeline `/feature` ou `/bug` (spec et plan validés par l'humain).
   - Architecture, sécurité, dépendances, suppression de code → propose, n'agis pas sans validation.

5. **Écris pour les agents autant que pour les humains.** Le code et la doc seront lus par des LLM : explicite bat astucieux, noms descriptifs, un fichier = une responsabilité, contexte localisé (le fichier se comprend seul, sans connaissance tribale). Pas de commentaire qui paraphrase le code — seulement ce que le code ne peut pas dire.

6. **Simplicité.** La dépendance la moins chère est celle qu'on n'ajoute pas. Pas d'abstraction pour des besoins hypothétiques, pas de gestion d'erreur pour des cas impossibles, pas de flag de compatibilité quand on peut changer le code. Fais la chose la plus simple qui marche bien.

## Conventions

- Tout développement (feature, bug, refactor) suit le skill `process-dev` — sans exception.
- La vérité vit sur le serveur : aucun état métier côté client, HTMX insère du HTML rendu par Fastify, Alpine ne gère que l'éphémère.
- Le navigateur ne parle jamais à Supabase directement ; Drizzle est propriétaire du schéma.
- Validation Zod à toute frontière (routes, env, formulaires).
- Jamais de commit sur `main` ; commits conventionnels (`feat:`, `fix:`, …) ; petites branches courtes.
- Secrets uniquement en variables d'environnement — jamais dans le code, les logs ou les templates.

## Discipline de contexte

Tenir le contexte court est une contrainte de premier ordre (coût en tokens ≈ taille du contexte × nombre de requêtes). Voir la section dédiée du skill `process-dev`. En résumé : l'implémentation passe par des sous-agents, une session couvre un bloc et non un lot entier, et on repart d'une session neuve (`/clear`) entre les blocs — le plan à cases cochées dans `docs/specs/` est le point de reprise.

**Instructions de compaction** — si le contexte doit être résumé automatiquement, préserver en priorité : le cahier des charges et la spec en cours, l'état du plan (cases cochées / étape courante), les décisions d'architecture prises et leurs raisons, les commandes de vérification du projet. Peuvent être résumés agressivement : les sorties de tests, les diffs déjà appliqués, l'exploration de fichiers.
