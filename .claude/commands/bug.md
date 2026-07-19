---
description: Corriger un bug avec reproduction obligatoire avant correction (test rouge → diagnostic → fix → régression → PR)
---

Tu vas corriger le bug suivant :

$ARGUMENTS

Charge le skill `process-dev` et applique le pipeline bug, dans cet ordre strict :

1. **Reproduction** — écris d'abord un test automatisé qui reproduit le bug et vérifie qu'il échoue. Interdiction absolue de toucher au code de production avant d'avoir ce test rouge. Si le bug n'est pas reproductible avec les informations fournies, pose-moi tes questions.
2. **Diagnostic** — identifie la cause racine (pas le symptôme). Explique-la en une ou deux phrases avant de corriger.
3. **Correction minimale** — le test de reproduction passe au vert. Pas de refactoring opportuniste dans le même diff.
4. **Régression** — lance la suite complète (tests, lint, typecheck) et montre les résultats.
5. **PR** — branche `fix/…`, commit conventionnel, `/code-review`, puis PR.
