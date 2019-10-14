function prettySelect() {
  const selects = document.querySelectorAll('select');

  for(select of selects) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('pretty-select');
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
  }
}

window.addEventListener('DOMContentLoaded', (e) => {
  prettySelect();
});
