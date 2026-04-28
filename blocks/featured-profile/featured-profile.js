export default function decorate(block) {
  const [titleRow, imgRow, nameRow, roleRow, quoteRow] = block.children;

  const title = titleRow?.textContent.trim();
  const picture = imgRow?.querySelector('picture');
  const name = nameRow?.textContent.trim();
  const role = roleRow?.textContent.trim();
  const quote = quoteRow?.textContent.trim();

  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'featured-profile-container';

  if (title) {
    const h4 = document.createElement('h4');
    h4.textContent = title;
    container.append(h4);
  }

  const profileHeader = document.createElement('div');
  profileHeader.className = 'profile-header';

  if (picture) {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'profile-image';
    imgWrapper.append(picture);
    profileHeader.append(imgWrapper);
  }

  const nameRoleWrapper = document.createElement('div');
  nameRoleWrapper.className = 'profile-name-role';

  if (name) {
    const pName = document.createElement('p');
    pName.className = 'profile-name';
    pName.textContent = name;
    nameRoleWrapper.append(pName);
  }

  if (role) {
    const pRole = document.createElement('p');
    pRole.className = 'profile-role';
    pRole.textContent = role;
    nameRoleWrapper.append(pRole);
  }

  if (name || role) {
    profileHeader.append(nameRoleWrapper);
  }

  if (profileHeader.children.length > 0) {
    container.append(profileHeader);
  }

  if (quote) {
    const pQuote = document.createElement('p');
    pQuote.className = 'profile-quote';
    // ensure quotes aren't doubled if author already provided them
    const cleanQuote = quote.replace(/^"|"$/g, '');
    pQuote.textContent = `"${cleanQuote}"`;
    container.append(pQuote);
  }

  block.append(container);
}
