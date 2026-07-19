# Plan — Mini-CRUD « notes »

Spec : [2026-07-19-notes-crud.md](2026-07-19-notes-crud.md). Chaque étape : test d'abord (rouge), code minimal (vert), lint + typecheck, case cochée. Une étape à la fois.

- [x] **1. Schéma + migration**
  - Test : intégration (testcontainers) — les migrations s'appliquent, une note s'insère et se relit via le schéma Drizzle.
  - Code : table `notes` dans `src/db/schema.ts` (id uuid généré, content text, created_at timestamptz) ; migration générée par `npm run db:generate`.
  - Vérification : test d'intégration vert, fichier de migration versionné.

- [x] **2. Schémas Zod des entrées**
  - Test : unitaire — contenu valide (1–500 après trim), vide rejeté, 501 caractères rejeté ; id UUID valide accepté, id mal formé rejeté.
  - Code : `src/lib/notes/schemas.ts` (`noteInputSchema`, `noteIdSchema`).
  - Vérification : tests unitaires verts.

- [x] **3. Service notes (accès base)**
  - Test : intégration — `listNotes` (ordre récentes d'abord), `createNote`, `deleteNote` (true si supprimée, false si inexistante).
  - Code : `src/lib/notes/service.ts`, requêtes via Drizzle uniquement.
  - Vérification : tests d'intégration verts.

- [x] **4. Routes + templates HTMX**
  - Test : intégration via `app.inject` (base testcontainers) — GET /notes 200 avec formulaire ; POST valide → fragment avec la note ; POST invalide → 400 avec message ; DELETE → fragment sans la note ; DELETE id inconnu → 404, id mal formé → 400 ; une note `<script>` est échappée dans le HTML.
  - Code : `src/server/routes/notes.ts`, vues `pages/notes.eta` + partial `partials/notes-list.eta` (un endpoint = un fragment) ; injection du client db dans `buildApp` ; `DATABASE_URL` ajouté à l'env validé.
  - Vérification : suite complète verte, couverture ≥ 80 %.

- [x] **5. E2E Playwright + CI**
  - Test : E2E — ouvrir /notes, ajouter une note, la voir apparaître sans rechargement, la supprimer, la voir disparaître.
  - Code : service Postgres dans le job `e2e` de `ci.yml` (migrations avant démarrage du serveur) ; lien « Notes » dans le layout.
  - Vérification : E2E vert en local (Docker requis) et en CI.

- [ ] **6. Livraison (/ship)**
  - Vérification complète (tests + couverture, lint, format, typecheck, gitleaks, npm audit), Definition of Done point par point, PR avec preuves, CI verte, merge.
