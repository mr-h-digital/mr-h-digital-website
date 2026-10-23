const ecosystem = document.querySelector('[data-ecosystem]');
if (ecosystem) {
  const tabList = ecosystem.querySelector('[role="tablist"]');
  const tabs = [...tabList.querySelectorAll('[role="tab"]')];
  tabList.hidden = false;
  function activate(tab) {
    for (const option of tabs) {
      const selected = option === tab;
      option.setAttribute('aria-selected', String(selected));
      option.tabIndex = selected ? 0 : -1;
      document.getElementById(option.getAttribute('aria-controls')).hidden = !selected;
    }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activate(tabs[next]);
      tabs[next].focus();
    });
  });
}

const filters = document.querySelector('[data-gallery-filters]');
if (filters) {
  const buttons = [...filters.querySelectorAll('button')];
  const cards = [...document.querySelectorAll('[data-category]')];
  const count = document.getElementById('gallery-count');
  filters.hidden = false;
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      for (const option of buttons) option.setAttribute('aria-pressed', String(option === button));
      let visible = 0;
      for (const card of cards) {
        const matches = category === 'all' || card.dataset.category.split(' ').includes(category);
        card.hidden = !matches;
        if (matches) visible += 1;
      }
      count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'} shown`;
    });
  });
}
