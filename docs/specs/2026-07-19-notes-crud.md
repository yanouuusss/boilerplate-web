# Spec — Mini-CRUD « notes »

## Objectif

Feature d'exemple de référence du boilerplate : démontrer le flux complet
HTMX → Fastify → Zod → Drizzle → Postgres avec les trois niveaux de tests.
Toute feature future s'écrira sur ce modèle.

## Critères d'acceptation (testables)

1. `GET /notes` affiche la page « Notes » : liste des notes, plus récentes en premier, avec un formulaire d'ajout. Rendu 100 % serveur.
2. `POST /notes` avec un contenu de 1 à 500 caractères crée la note et renvoie le **fragment HTML** de la liste mise à jour (inséré par HTMX, sans rechargement).
3. Contenu vide ou > 500 caractères → réponse 400 avec message d'erreur affiché au-dessus du formulaire ; aucune note créée.
4. `DELETE /notes/:id` supprime la note (suppression définitive) et renvoie le fragment de liste mis à jour. Id inexistant → 404. Id mal formé → 400.
5. Le contenu d'une note est échappé à l'affichage : une note contenant `<script>` s'affiche comme texte, ne s'exécute pas.
6. Tests : unitaires (schémas Zod), intégration (routes + Postgres testcontainers, y compris migration appliquée), E2E Playwright (parcours ajout puis suppression).

## Schéma

Table `notes` : `id` uuid (clé primaire, générée), `content` text non nul, `created_at` timestamptz non nul (défaut now). Migration générée par drizzle-kit.

## Hors périmètre

Authentification, édition de note, pagination, recherche, multi-utilisateur, soft delete.

## Impacts sécurité

- Entrées validées par Zod à la frontière (body du POST, params du DELETE).
- Échappement HTML systématique du contenu (protection XSS — critère 5 testé).
- Aucun SQL brut : requêtes via Drizzle uniquement.
