export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.textContent = row.textContent.trim();
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
