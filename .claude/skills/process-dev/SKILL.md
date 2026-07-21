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
4. **Implémentation TDD — déléguée à un sous-agent par étape.** Pour chaque étape du plan, dans l'ordre, une seule à la fois, la session principale **délègue à un sous-agent** (outil Task/Agent) plutôt que d'implémenter elle-même. Le sous-agent :
   a. Écrit le test → vérifie qu'il échoue (rouge)
   b. Écrit le code minimal qui le fait passer (vert)
   c. Lint + typecheck propres
   d. Ne remonte qu'un **résumé court** : fichiers touchés, résultat des tests, ligne de couverture, points d'attention. Ni le diff complet, ni les sorties brutes.

   La session principale coche alors la case du plan et lance l'étape suivante. Elle garde en contexte la spec, le plan et les résumés — pas les détails d'implémentation. Voir « Discipline de contexte » ci-dessous. Une étape triviale (renommage, correction de typo) peut être faite directement, sans sous-agent.

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

## Discipline de contexte (obligatoire)

Le coût en tokens d'une session ≈ taille du contexte × nombre de requêtes. Le contexte ne se purge pas tout seul : il faut le tenir court activement.

- **Implémentation par sous-agents** (voir étape 4) : les gros consommateurs — diffs, sorties de tests, exploration de fichiers — sont brûlés dans le contexte isolé d'un sous-agent, jeté à la fin. La session principale n'orchestre que spec, plan et résumés.
- **Une session par bloc, pas par lot.** Après chaque étape mergée (ou tous les 2–3 pas), repartir d'une session neuve (`/clear`). Le point de reprise est le plan à cases cochées dans `docs/specs/` — aucune connaissance n'est perdue. Ne jamais dérouler un lot entier dans une seule session.
- **Sorties d'outils.** Ne jamais recracher une sortie de commande longue dans la réponse ; s'appuyer sur les résumés. Le hook `shrink-output` compresse déjà les grosses sorties, mais éviter de les générer reste préférable.
- **Lectures ciblées.** Lire la portion utile d'un fichier, pas le fichier entier ; ne pas relire un fichier déjà en contexte.

## Definition of Done

Spec et plan validés · toutes les cases cochées · tests écrits avant le code et verts · couverture ≥ 80 % · lint/format/typecheck propres · scan secrets et audit propres · doc impactée à jour (ADR si décision d'architecture) · PR verte, reviewée.
