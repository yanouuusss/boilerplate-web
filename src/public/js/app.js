// HTMX ignore les réponses 4xx par défaut ; on autorise le swap des 400 pour
// afficher les erreurs de validation rendues par le serveur (fragment complet).
document.body.addEventListener('htmx:beforeSwap', (event) => {
  if (event.detail.xhr.status === 400) {
    event.detail.shouldSwap = true;
    event.detail.isError = false;
  }
});
