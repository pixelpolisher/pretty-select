// based on https://www.w3schools.com/howto/howto_custom_select.asp

function prettySelect(select) {
  var comp = 'pretty-select';
  var activeClass = comp + '--active';
  var isOpen = false;
  var activeIndex = select.selectedIndex || 0;

  // wrap the select in a div and add the relevant classnames
  var selectClassNames = select.getAttribute('class');
  var wrapper = document.createElement('div');
  wrapper.setAttribute('class', selectClassNames);
  wrapper.classList.add(comp);
  wrapper.setAttribute('tabindex', '0');
  select.parentNode.insertBefore(wrapper, select);
  select.classList.add(comp + '__select');
  wrapper.appendChild(select);

  // add the selected option to the wrapper as a a separate div
  var current = document.createElement('div');
  current.classList.add(comp + '__current');
  current.innerHTML = select.options[select.selectedIndex].innerHTML;
  checkForIcon(select.options[select.selectedIndex], current);
  wrapper.appendChild(current);

  current.addEventListener('click', function(e) {
     // When the select box is clicked, open/close the current select box
    toggleSelect(!isOpen);
  });

  var clonedSelect = document.createElement('ul');
  if(selectClassNames) {
    // console.log(optionClassNames)
    clonedSelect.setAttribute('class', selectClassNames);
  }
  clonedSelect.classList.add(comp + '__list');
  for (var i = 0; i < select.length; i++) {

    // For each option in the original select element,
    // create a new DIV that will act as an option item:
    var optionItem = document.createElement('li');
    optionItem.innerHTML = select.options[i].innerHTML;
    optionItem.classList.add(comp + '__item');
    checkForIcon(select.options[i], optionItem);

    if(select.options[i] == select.options[select.selectedIndex]) {
      optionItem.classList.add(comp + '__item--selected');
    }

    optionItem.addEventListener('click', function(e) {
      // When an item is clicked, update the original select box,
      // and the selected item
      var selectEl = this.parentNode.parentNode.getElementsByTagName('select')[0];
      var activeDiv = this.parentNode.previousSibling;

      for (var j = 0; j < selectEl.length; j ++) {
        if (selectEl.options[j].textContent == this.textContent) {
          activeIndex = j;
          selectEl.selectedIndex = activeIndex;
          activeDiv.innerHTML = this.innerHTML;
          var selectedOption = this.parentNode.getElementsByClassName(comp + '__item--selected');
          for (var k = 0; k < selectedOption.length; k++) {
            selectedOption[k].classList.remove(comp + '__item--selected');
          }
          this.classList.add(comp + '__item--selected');
          break;
        }
      }
      toggleSelect(false);
    });
    clonedSelect.appendChild(optionItem);
  }
  wrapper.appendChild(clonedSelect);

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
    toggleSelect(false);
  });

  wrapper.addEventListener('keydown', function(e) {
    var focusedClass = comp + '__item--focus';
    var selectEl = this.querySelector('select');
    var clonedEl = this.querySelector('.' + comp + '__list');
    var focusedOption = clonedEl.querySelector('.' + focusedClass) || clonedEl.querySelector('.' + comp + '__item--selected');
    var items = clonedEl.querySelectorAll('.' + comp + '__item');

    switch(e.keyCode) {
      case 32:
      case 13:
        // space or enter
        toggleSelect(!isOpen);
        if(clonedEl.querySelector('.' + focusedClass)) {
          clonedEl.querySelector('.' + focusedClass).click();
          resetItems(items, focusedClass);
        }
        break;
      case 40:
        // down
        if (isOpen == false) {
          toggleSelect(true);
        } else {
          if(!focusedOption) {
            // focus the first item in the list
            items[0].classList.add(focusedClass);
          }
          else {
            if(focusedOption.nextSibling) {
              resetItems(items, focusedClass);
              focusedOption.nextSibling.classList.add(focusedClass);
            }
          }
        }
        break;
      case 38:
        // up
        if (isOpen == false) {
          toggleSelect(true);
        } else {
          if(!focusedOption) {
            items[items.length-1].classList.add(focusedClass);
          }
          else {
            if(focusedOption.previousSibling) {
              resetItems(items, focusedClass);
              focusedOption.previousSibling.classList.add(focusedClass);
            }
          }
        }

        break;
      case 27:
      case 9:
        // esc or tab
        toggleSelect(false);
        resetItems(items, focusedClass);
        break;
      default:
        break;
    }
  });

  function toggleSelect(state) {
    if(state) {
      wrapper.classList.add(activeClass);
      isOpen = true;
    } else {
      wrapper.classList.remove(activeClass);
      isOpen = false;
    }
  }

  function resetItems(items, focusedClass) {
    for(item of items) {
      item.classList.remove(focusedClass);
    }
  }

  function checkForIcon(nativeElement, clonedElement) {
    // check if the native option item has a data-icon attribute
    // if so, add an extra dom element and give it the same classname as the data-icon value
    var dataIcon = nativeElement.getAttribute('data-icon');
    if(dataIcon != null) {
      var iconEl = document.createElement('span');
      iconEl.classList.add(comp + '__icon');
      iconEl.classList.add(comp + '__icon--' + dataIcon);
      clonedElement.prepend(iconEl);
    }
  }
}
