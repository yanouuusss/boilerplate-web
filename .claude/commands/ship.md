---
description: Vérifications finales et préparation de la PR (suite complète, sécurité, Definition of Done, branche, PR)
---

Le travail en cours est prêt à être livré. Exécute la séquence de livraison :

1. **Vérification complète** — lance et montre les résultats de : tests (avec couverture), lint, format, typecheck, scan secrets (gitleaks), `npm audit`. Tout doit être vert ; si quelque chose échoue, corrige d'abord.
2. **Review** — lance `/code-review` sur le diff. Applique la checklist sécurité si le diff touche auth, session, entrées utilisateur, upload ou SQL.
3. **Definition of Done** — parcours la checklist du skill `process-dev` point par point et affiche l'état de chacun. Si un point n'est pas satisfait, arrête-toi et dis-le.
4. **PR** — vérifie qu'on est sur une branche `feat/…` ou `fix/…` (jamais `main`), commits conventionnels propres, puis crée la PR avec : résumé du changement, preuves de vérification, checklist DoD remplie.

Ne crée pas la PR tant qu'un seul point est rouge.
