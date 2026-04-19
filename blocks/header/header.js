import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'search', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandText = navBrand.textContent.trim();
    navBrand.innerHTML = `<a href="/" class="brand-link">${brandText}</a>`;
  }

  const navSearch = nav.querySelector('.nav-search');
  if (navSearch) {
    const searchPlaceholder = navSearch.textContent.trim() || 'Search the collection...';
    navSearch.innerHTML = `
      <div class="search-container group">
        <span class="material-symbols-outlined search-icon">search</span>
        <input type="text" placeholder="${searchPlaceholder}" class="search-input" />
      </div>
    `;
  }

  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const icons = Array.from(navTools.querySelectorAll('.icon'));
    navTools.innerHTML = '';
    icons.forEach((icon) => {
      const iconName = Array.from(icon.classList)
        .find((c) => c.startsWith('icon-'))
        ?.replace('icon-', '');
      
      let materialIcon = iconName;
      // Map standard icons to material icons if needed
      if (iconName === 'button') materialIcon = 'history';
      if (iconName === 'setting') materialIcon = 'settings';
      
      const btn = document.createElement('button');
      btn.className = 'tool-btn material-symbols-outlined';
      btn.setAttribute('aria-label', materialIcon);
      btn.textContent = materialIcon;
      navTools.append(btn);
    });
  }

  // Wrap brand and search in a left container
  const navLeft = document.createElement('div');
  navLeft.className = 'nav-left';
  if (navBrand) navLeft.append(navBrand);
  if (navSearch) navLeft.append(navSearch);

  nav.prepend(navLeft);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
