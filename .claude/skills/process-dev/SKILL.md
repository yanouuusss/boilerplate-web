---
name: process-dev
description: >-
  Process OBLIGATOIRE pour toute implémentation de fonctionnalité, correction de
  bug ou refactoring dans ce projet. À charger AVANT d'écrire la moindre ligne de
  code. Définit les étapes imposées : spec, plan, TDD, vérification, sécurité,
  review, PR. Ne s'applique pas aux réponses purement conversationnelles.
---

# Process de développement

Ce skill est la source de vérité du process de ce repo. Aucune étape n'est optionnelle.

## Pipeline obligatoire (feature ou refactor)

1. **Brainstorm** — via le workflow superpowers : poser des questions jusqu'à lever toute ambiguïté du cahier des charges. Ne pas supposer.
2. **Spec** — écrire dans `docs/specs/<nom>.md` : objectif, critères d'acceptation testables, hors-périmètre, impacts sécurité. **STOP : validation humaine avant de continuer.**
3. **Plan** — fichier markdown à cases à cocher. Étapes de ≤ 1h. Chaque étape définit : le test à écrire, le code à produire, le critère de vérification. **STOP : validation humaine avant de continuer.**
4. **Implémentation TDD** — pour chaque étape, dans l'ordre, une seule à la fois :
   a. Écrire le test → vérifier qu'il échoue (rouge)
   b. Écrire le code minimal qui le fait passer (vert)
   c. Lint + typecheck propres
   d. Cocher la case du plan
5. **Vérification finale** — suite complète : `npm test`, `npm run lint`, `npm run typecheck`, scan secrets. Tout doit être vert.
6. **Review** — lancer `/code-review`. Si le diff touche auth, session, entrées utilisateur, upload ou SQL brut : appliquer en plus la checklist sécurité de la PR.
7. **PR** — branche `feat/…` ou `fix/…`, commits conventionnels, PR avec la checklist Definition of Done remplie.

## Pipeline bug

1. **Reproduction d'abord** : écrire un test qui échoue et reproduit le bug. Interdiction de corriger avant d'avoir ce test rouge.
2. Diagnostic (cause racine, pas symptôme).
3. Correction minimale — le test de reproduction passe au vert et devient test de régression.
4. Suite complète verte → review → PR (`fix/…`).

## Règles non négociables

- Jamais de code sans test préalable. Jamais de commit avec des tests rouges.
- Jamais d'édition directe sur `main`.
- Toute entrée utilisateur validée par Zod à la frontière (route Fastify).
- La vérité vit sur le serveur : pas d'état métier côté client, pas de React, pas de bundler.
- Le navigateur ne parle jamais à Supabase ; Drizzle possède le schéma (toute modif de schéma = migration générée par drizzle-kit, jamais de SQL manuel sur la base).
- Un diff = une intention. Pas de refactoring opportuniste mélangé à une feature.
- Chaque affirmation de progrès s'appuie sur une preuve exécutée (sortie de test, commande) — sinon dire explicitement "non vérifié".

## Definition of Done

Spec et plan validés · toutes les cases cochées · tests écrits avant le code et verts · couverture ≥ 80 % · lint/format/typecheck propres · scan secrets et audit propres · doc impactée à jour (ADR si décision d'architecture) · PR verte, reviewée.
