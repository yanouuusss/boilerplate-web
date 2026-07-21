---
description: Développer une fonctionnalité complète à partir d'un cahier des charges, en suivant le process imposé (spec → plan → TDD → review → PR)
---

Tu vas développer une fonctionnalité à partir du cahier des charges suivant :

$ARGUMENTS

Charge le skill `process-dev` et suis-le intégralement, sans sauter d'étape :

1. Utilise le workflow **superpowers** (brainstorm → spec → plan → implémentation TDD → review) comme moteur.
2. Respecte les deux points d'arrêt obligatoires : la **spec** puis le **plan** doivent être explicitement validés par moi avant de passer à la suite.
3. Implémente en TDD strict, étape par étape, en cochant le plan au fur et à mesure. **Délègue chaque étape d'implémentation à un sous-agent** (voir « Discipline de contexte » du skill) : tu orchestres et coches le plan, le sous-agent écrit test + code et te remonte un résumé court.
4. Termine par la vérification complète, `/code-review`, puis prépare la branche et la PR avec la checklist Definition of Done remplie.

Si le cahier des charges est vide ou trop vague pour écrire des critères d'acceptation testables, commence par me poser tes questions.
