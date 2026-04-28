import { decorateIcons } from '../../scripts/aem.js';

/**
 * decorates the sidenav block
 * @param {Element} block The sidenav block element
 */
export default async function decorate(block) {
  const rows = [...block.children];
  document.body.classList.add('has-sidenav');

  const aside = document.createElement('aside');
  aside.className = 'sidenav-wrapper';

  const container = document.createElement('div');
  container.className = 'sidenav-container';
  aside.append(container);

  if (rows.length > 0) {
    const titleCol = rows[0].children[0];
    const titleDiv = document.createElement('div');
    titleDiv.className = 'sidenav-title-group';

    const h2 = titleCol.querySelector('h2, h1, h3, h4');
    if (h2) {
      h2.className = 'sidenav-title';
      titleDiv.append(h2);
    } else {
      const div = document.createElement('h2');
      div.className = 'sidenav-title';
      div.innerHTML = titleCol.firstElementChild?.innerHTML || titleCol.innerHTML;
      titleDiv.append(div);
      if (titleCol.children.length > 1) {
        titleCol.firstElementChild.remove();
      } else {
        titleCol.innerHTML = '';
      }
    }

    if (titleCol.textContent.trim()) {
      const p = document.createElement('p');
      p.className = 'sidenav-subtitle';
      p.textContent = titleCol.textContent.trim();
      titleDiv.append(p);
    }

    container.append(titleDiv);
  }

  if (rows.length > 1) {
    const navCol = rows[1].children[0];
    const nav = document.createElement('nav');
    nav.className = 'sidenav-primary-nav';

    const ul = navCol.querySelector('ul');
    if (ul) {
      const listItems = ul.querySelectorAll('li');
      listItems.forEach((li, i) => {
        let a = li.querySelector('a');
        if (!a) {
          a = document.createElement('a');
          a.href = '#';
          a.innerHTML = li.innerHTML;
        } else {
          // If the anchor doesn't contain all of li's content (like an icon outside), we could move it, but for primary nav it's usually just text.
        }
        const isActive = i === 0; // First defaults to active for demo or could use pathname match
        a.className = isActive ? 'sidenav-link active' : 'sidenav-link';
        nav.append(a);
      });
    }

    container.append(nav);
  }

  if (rows.length > 2) {
    const footCol = rows[2].children[0];
    const footNav = document.createElement('div');
    footNav.className = 'sidenav-secondary-nav';

    const ul = footCol.querySelector('ul');
    if (ul) {
      const listItems = ul.querySelectorAll('li');
      listItems.forEach((li) => {
        let a = li.querySelector('a');

        // If no link authored, wrap everything in a link
        if (!a) {
          a = document.createElement('a');
          a.href = '#';
          a.innerHTML = li.innerHTML;
        } else {
          // If there is an icon outside the anchor, move it inside
          const icon = li.querySelector('.icon');
          if (icon && !a.contains(icon)) {
            a.prepend(icon);
          }

          // Also grab any stray text nodes outside the anchor if they exist,
          // like in case of `• :help: Help` -> `<li><span icon/> <a/>Text</li>`
          Array.from(li.childNodes).forEach((child) => {
            if (child !== a && child.textContent.trim()) {
              a.append(child);
            }
          });
        }

        a.className = 'sidenav-link secondary';

        // Safety check to ensure icon exists inside
        const icon = a.querySelector('.icon');
        if (icon) {
          // It's already inside, but we can ensure it's at the front if needed
          a.prepend(icon);

          if (!a.textContent.trim()) {
            if (icon.className.includes('help')) a.append(' Help');
            if (icon.className.includes('volunteer_activism')) a.append(' Donate');
          }
        }

        footNav.append(a);
      });
    }

    container.append(footNav);
  }

  block.replaceChildren(aside);
  await decorateIcons(aside);
}
