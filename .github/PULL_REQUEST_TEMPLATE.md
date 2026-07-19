## Résumé

<!-- Quoi et pourquoi, en 2-3 phrases. Lien vers la spec : docs/specs/… -->

## Preuves de vérification

<!-- Sorties de commandes : tests + couverture, lint, typecheck. Capture si UI. -->

## Definition of Done

- [ ] Spec et plan validés, toutes les cases du plan cochées
- [ ] Tests écrits avant le code, suite complète verte, couverture ≥ 80 %
- [ ] Lint, format, typecheck propres
- [ ] Scan secrets + audit dépendances propres
- [ ] Documentation impactée à jour (ADR si décision d'architecture)

## Checklist sécurité

<!-- Obligatoire si le diff touche : auth, session, entrées utilisateur, upload, SQL brut. Sinon, cocher N/A. -->

- [ ] N/A — le diff ne touche aucune zone sensible
- [ ] Entrées utilisateur validées par Zod à la frontière
- [ ] Aucun secret dans le code, les logs ou les templates
- [ ] Sortie HTML échappée (pas de `<%~ %>` sur des données utilisateur)
- [ ] Autorisation vérifiée côté serveur pour toute nouvelle route
