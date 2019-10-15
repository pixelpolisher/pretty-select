window.addEventListener('DOMContentLoaded', function(e) {
  const selects = document.querySelectorAll('select');
  for(select of selects) {
    prettySelect(select);
  }
});
