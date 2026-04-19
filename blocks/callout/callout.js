export default function decorate(block) {
  const [titleRow, descRow] = block.children;

  const title = titleRow?.textContent.trim();
  const desc = descRow?.textContent.trim();

  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'callout-container';

  if (title) {
    const pTitle = document.createElement('p');
    pTitle.className = 'callout-title';
    pTitle.textContent = title;
    container.append(pTitle);
  }

  if (desc) {
    const pDesc = document.createElement('p');
    pDesc.className = 'callout-desc';
    pDesc.textContent = desc;
    container.append(pDesc);
  }

  block.append(container);
}
