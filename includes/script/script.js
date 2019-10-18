window.addEventListener('DOMContentLoaded', function(e) {
  var selects = document.querySelectorAll('select');
  for(i=0; i<selects.length; i++) {
    prettySelect(selects[i]);
  }
});
