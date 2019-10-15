function prettySelect(select) {
  var comp = 'pretty-select';

  // wrap the select in a div and add the relevant classnames
  var wrapper = document.createElement('div');
  wrapper.classList.add(comp);
  select.parentNode.insertBefore(wrapper, select);
  select.classList.add(comp + '__select');
  wrapper.appendChild(select);
  wrapper.classList.add(comp + '--inactive')

  // add the selected option to the wrapper in the form of a div
  var selectedOption = document.createElement('div');
  selectedOption.classList.add(comp + '__cover');
  selectedOption.innerHTML = select.options[select.selectedIndex].innerHTML;
  wrapper.appendChild(selectedOption);

  var clonedSelect = document.createElement('div');
  clonedSelect.classList.add(comp + '__clone');
  for (var i = 1; i < select.length; i++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    var optionDiv = document.createElement('div');
    optionDiv.innerHTML = select.options[i].innerHTML;
    if(select.options[i] == select.options[select.selectedIndex]) {
      optionDiv.classList.add(comp + '__option--selected');
    }
    optionDiv.addEventListener('click', function(e) {
      /* When an item is clicked, update the original select box,
      and the selected item: */
      var selectEl = this.parentNode.parentNode.getElementsByTagName('select')[0];
      var activeDiv = this.parentNode.previousSibling;
      for (var j = 0; j < selectEl.length; j ++) {
        if (selectEl.options[j].innerHTML == this.innerHTML) {
          selectEl.selectedIndex = j;
          activeDiv.innerHTML = this.innerHTML;
          var selectedOption = this.parentNode.getElementsByClassName(comp + '__option--selected');
          for (var k = 0; k < selectedOption.length; k++) {
            selectedOption[k].removeAttribute('class');
          }
          this.classList.add(comp + '__option--selected');
          break;
        }
      }
      activeDiv.click();
    });
    clonedSelect.appendChild(optionDiv);
  }
  wrapper.appendChild(clonedSelect);

  selectedOption.addEventListener('click', function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.parentNode.classList.toggle(comp + '--inactive');
  });

  function closeAllSelect(element) {
    
  }
}
