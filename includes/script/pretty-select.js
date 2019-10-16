// based on https://www.w3schools.com/howto/howto_custom_select.asp

function prettySelect(select) {
  var comp = 'pretty-select';

  // wrap the select in a div and add the relevant classnames
  var wrapper = document.createElement('div');
  wrapper.classList.add(comp);
  select.parentNode.insertBefore(wrapper, select);
  var selectClassNames = select.getAttribute('class');
  select.classList.add(comp + '__select');
  wrapper.appendChild(select);
  wrapper.classList.add(comp + '--inactive')

  // add the selected option to the wrapper in the form of a div
  var selectedOption = document.createElement('div');
  selectedOption.classList.add(comp + '__cover');
  selectedOption.innerHTML = select.options[select.selectedIndex].innerHTML;
  wrapper.appendChild(selectedOption);

  var clonedSelect = document.createElement('div');
  if(selectClassNames) {
    // console.log(optionClassNames)
    clonedSelect.setAttribute('class', selectClassNames);
  }
  clonedSelect.classList.add(comp + '__clone');
  for (var i = 0; i < select.length; i++) {

    // For each option in the original select element,
    // create a new DIV that will act as an option item:
    var optionDiv = document.createElement('div');
    optionDiv.innerHTML = select.options[i].innerHTML;

    // transplant existing classnames on option elements to the newly created div
    var optionClassNames = select.options[i].getAttribute('class');
    if(optionClassNames) {
      // console.log(optionClassNames)
      optionDiv.setAttribute('class', optionClassNames);
    }

    if(select.options[i] == select.options[select.selectedIndex]) {
      optionDiv.classList.add(comp + '__option--selected');
    }

    optionDiv.addEventListener('click', function(e) {
      // When an item is clicked, update the original select box,
      // and the selected item
      var selectEl = this.parentNode.parentNode.getElementsByTagName('select')[0];
      var activeDiv = this.parentNode.previousSibling;

      for (var j = 0; j < selectEl.length; j ++) {
        if (selectEl.options[j].innerHTML == this.innerHTML) {
          selectEl.selectedIndex = j;
          activeDiv.innerHTML = this.innerHTML;
          var selectedOption = this.parentNode.getElementsByClassName(comp + '__option--selected');
          for (var k = 0; k < selectedOption.length; k++) {
            selectedOption[k].classList.remove(comp + '__option--selected');
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
     // When the select box is clicked, open/close the current select box
    this.parentNode.classList.toggle(comp + '--inactive');
  });

  // listen for clickoutside events on the pretty select. Close it when user clicks outside
  // avoid using e.stopPropagation(), see https://css-tricks.com/dangers-stopping-event-propagation/
  // thanks to https://www.blustemy.io/detecting-a-click-outside-an-element-in-javascript/
  document.addEventListener('click', function(e) {
    var targetElement = e.target;  // clicked element

    do {
      if (targetElement == wrapper) {
        // clicked inside, simply return
        return;
      }
      // Go up the DOM
      targetElement = targetElement.parentNode;
    } while (targetElement);

    // Clicked outside.
    wrapper.classList.add(comp + '--inactive');
});

}
