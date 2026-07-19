# Runbook

## Build & images

Chaque merge sur `main` déclenche `deploy.yml` : build de l'image Docker et push sur GHCR
(`ghcr.io/yanouuusss/boilerplate-web`), taguée `sha-<commit>` et `latest`.

## Déploiement staging / production

**Non branché pour l'instant** — aucune cible d'hébergement n'existe encore. Quand elle existera :

1. Ajouter les jobs `staging` puis `production` dans `deploy.yml` (production derrière un
   GitHub Environment avec approbation manuelle).
2. Ajouter des smoke tests Playwright post-déploiement (`tests/e2e`, projet dédié).
3. Documenter ici l'URL, l'accès et la procédure exacte.

## Rollback

Les images sont taguées par SHA : redéployer le tag du commit précédent.

```bash
docker pull ghcr.io/yanouuusss/boilerplate-web:sha-<commit-precedent>
```

## Incidents

- Logs applicatifs : pino (JSON en production) — brancher l'agrégation au moment du premier déploiement.
- Sentry : prévu par le process, à configurer avec la cible d'hébergement (DSN en variable d'environnement).
