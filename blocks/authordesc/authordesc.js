export default async function decorate(block) {
  const container = block.firstElementChild?.firstElementChild;
  if (!container) return;
  const elements = Array.from(container.children);

  block.textContent = '';

  const profileContainer = document.createElement('div');
  profileContainer.className = 'authordesc-profile';
  const infoContainer = document.createElement('div');
  infoContainer.className = 'authordesc-info';

  let heading; let picture; let name; let role; let
    quote;

  elements.forEach((el) => {
    if (el.tagName.match(/^H[1-6]$/)) {
      heading = el;
      heading.className = 'authordesc-title';
    } else if (el.querySelector('picture') || el.tagName === 'PICTURE') {
      picture = el.querySelector('picture') || el;
    } else if (el.querySelector('strong, b')) {
      name = document.createElement('p');
      name.className = 'authordesc-name';
      name.textContent = el.textContent;
    } else if (el.querySelector('em, i')) {
      quote = document.createElement('p');
      quote.className = 'authordesc-quote';
      quote.textContent = el.textContent;
    } else if (el.textContent.trim() !== '') {
      role = document.createElement('p');
      role.className = 'authordesc-role';
      role.textContent = el.textContent;
    }
  });

  if (heading) block.append(heading);
  if (picture) profileContainer.append(picture);
  if (name) infoContainer.append(name);
  if (role) infoContainer.append(role);
  if (infoContainer.children.length > 0) profileContainer.append(infoContainer);
  if (profileContainer.children.length > 0) block.append(profileContainer);
  if (quote) block.append(quote);
}
