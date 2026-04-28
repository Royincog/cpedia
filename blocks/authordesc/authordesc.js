function buildParagraph(className, text) {
  if (!text) return null;

  const paragraph = document.createElement('p');
  paragraph.className = className;
  paragraph.textContent = text;
  return paragraph;
}

function extractStructuredContent(block) {
  const rows = [...block.children].map((row) => row.firstElementChild || row);
  if (rows.length <= 1) return null;

  const [titleRow, imageRow, nameRow, roleRow, quoteRow] = rows;
  const titleHeading = titleRow?.querySelector('h1, h2, h3, h4, h5, h6');

  return {
    title: titleRow?.textContent.trim(),
    titleTag: titleHeading?.tagName.toLowerCase(),
    picture: imageRow?.querySelector('picture'),
    name: nameRow?.textContent.trim(),
    role: roleRow?.textContent.trim(),
    quote: quoteRow?.textContent.trim(),
  };
}

function extractLegacyContent(block) {
  const container = block.firstElementChild?.firstElementChild;
  if (!container) return null;

  const content = {};

  [...container.children].forEach((el) => {
    if (el.tagName.match(/^H[1-6]$/)) {
      content.title = el.textContent.trim();
      content.titleTag = el.tagName.toLowerCase();
    } else if (el.querySelector('picture') || el.tagName === 'PICTURE') {
      content.picture = el.querySelector('picture') || el;
    } else if (el.querySelector('strong, b')) {
      content.name = el.textContent.trim();
    } else if (el.querySelector('em, i')) {
      content.quote = el.textContent.trim();
    } else if (el.textContent.trim()) {
      content.role = el.textContent.trim();
    }
  });

  return content;
}

export default async function decorate(block) {
  const content = extractStructuredContent(block) || extractLegacyContent(block);
  if (!content) return;

  const {
    title,
    titleTag = 'h3',
    picture,
    name,
    role,
    quote,
  } = content;

  block.textContent = '';

  if (title) {
    const heading = document.createElement(titleTag);
    heading.className = 'authordesc-title';
    heading.textContent = title;
    block.append(heading);
  }

  const profileContainer = document.createElement('div');
  profileContainer.className = 'authordesc-profile';
  const infoContainer = document.createElement('div');
  infoContainer.className = 'authordesc-info';

  if (picture) profileContainer.append(picture);

  const nameParagraph = buildParagraph('authordesc-name', name);
  const roleParagraph = buildParagraph('authordesc-role', role);
  if (nameParagraph) infoContainer.append(nameParagraph);
  if (roleParagraph) infoContainer.append(roleParagraph);

  if (infoContainer.children.length > 0) profileContainer.append(infoContainer);
  if (profileContainer.children.length > 0) block.append(profileContainer);

  const quoteParagraph = buildParagraph('authordesc-quote', quote);
  if (quoteParagraph) block.append(quoteParagraph);
}
