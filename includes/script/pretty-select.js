function prettySelect(select) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('pretty-select');
  select.parentNode.insertBefore(wrapper, select);
  wrapper.appendChild(select);
}
