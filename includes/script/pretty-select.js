// loosely based on https://www.w3schools.com/howto/howto_custom_select.asp

prettySelect = (select) => {
  const self = 'pretty-select';
  const activeClass = self + '--active';
  let isOpen = false;

  // create the new nodes
  const wrapper = document.createElement('div');
  const current = document.createElement('div');
  const list = document.createElement('ul');

  let selectClassNames = null;
  select.hasAttribute('class') ? selectClassNames = select.getAttribute('class') : selectClassNames = '';

  // wrap the select in a div and add the relevant classnames
  wrapper.setAttribute('class', selectClassNames);
  wrapper.classList.add(self);
  wrapper.setAttribute('tabindex', '0');
  select.parentNode.insertBefore(wrapper, select);
  select.classList.add(self + '__select');
  wrapper.appendChild(select);

  // add the selected option to the wrapper as a a separate div
  // refer to this as current because it shows the currently selected option
  current.classList.add(self + '__current');
  current.innerHTML = select.options[select.selectedIndex].innerHTML;
  checkForIcon(select.options[select.selectedIndex], current);
  wrapper.appendChild(current);

  current.addEventListener('click', (e) => {
     // When the select box is clicked, open/close the current select box
    toggleSelect(!isOpen);
  });

  // next is the cloned list of options
  // duplicate any existing class names
  list.setAttribute('class', selectClassNames);
  list.classList.add(self + '__list');

  // build the list of items in the ul
  // a for of loop would have been preferable, but throws errors in ie11 after transpilation
  for (let i=0; i<select.length; i++) {
    option = select[i];

    // For each option in the original select element,
    // create a new DIV that will act as an option item:
    const optionItem = document.createElement('li');
    optionItem.innerHTML = option.innerHTML;
    optionItem.classList.add(self + '__item');
    checkForIcon(option, optionItem);

    // highlight the selected item
    if(option == select.options[select.selectedIndex]) {
      optionItem.classList.add(self + '__item--selected');
    }
    list.appendChild(optionItem);
    wrapper.appendChild(list);

    optionItem.addEventListener('click', function(e) {
      // When an item is clicked, update the original select box,
      // and the selected item
      for (let j=0; j<select.length; j++) {
        option = select[j];

        if (option.textContent == this.textContent) {
          select.selectedIndex = j;
          current.innerHTML = this.innerHTML;
          const selectedOption = wrapper.querySelector('.' + self + '__item--selected');
          selectedOption.classList.remove(self + '__item--selected');
          this.classList.add(self + '__item--selected');
          break;
        }
      }
      // and close the pretty select. A choice was made
      toggleSelect(false);
    });
  }

  // listen for clickoutside events on the pretty select. Close it when user clicks outside
  // avoid using e.stopPropagation(), see https://css-tricks.com/dangers-stopping-event-propagation/
  // thanks to https://www.blustemy.io/detecting-a-click-outside-an-element-in-javascript/
  document.addEventListener('click', (e) => {
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

  wrapper.addEventListener('keydown', (e) => {
    const focusedClass = self + '__item--focus';
    const focusedOption = list.querySelector('.' + focusedClass) || list.querySelector('.' + self + '__item--selected');
    const items = list.querySelectorAll('.' + self + '__item');

    switch(e.keyCode) {
      case 32:
      case 13:
        // space or enter
        toggleSelect(!isOpen);
        if(list.querySelector('.' + focusedClass)) {
          list.querySelector('.' + focusedClass).click();
          resetItems();
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
              resetItems();
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
              resetItems();
              focusedOption.previousSibling.classList.add(focusedClass);
            }
          }
        }

        break;
      case 27:
      case 9:
        // esc or tab
        toggleSelect(false);
        resetItems();
        break;
      default:
        break;
    }

    function resetItems() {
      for(let i=0; i<items.length; i++) {
        items[i].classList.remove(focusedClass);
      }
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

  function checkForIcon(nativeElement, clonedElement) {
    // check if the native option item has a data-icon attribute
    // if so, add an extra dom element to the cloned list item
    const dataIcon = nativeElement.getAttribute('data-icon');
    if(dataIcon != null) {
      const iconEl = document.createElement('span');
      iconEl.classList.add(self + '__icon');
      iconEl.classList.add(self + '__icon--' + dataIcon);
      // IE11 doesn't support prepend
      clonedElement.insertBefore(iconEl, clonedElement.firstChild);
    }
  }
}
