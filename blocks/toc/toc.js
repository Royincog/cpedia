export default function decorate(block) {
  const headingText = block.textContent.trim() || 'Contents';
  const tocNav = document.createElement('nav');
  const section = block.closest('.section');
  
  const tocHeading = document.createElement('h3');
  tocHeading.innerHTML = `<span class="material-symbols-outlined text-primary">menu_book</span> ${headingText}`;
  tocNav.append(tocHeading);
  
  const ul = document.createElement('ul');
  
  const headings = section
    ? section.querySelectorAll('.default-content-wrapper h2')
    : document.querySelectorAll('main h2');
  
  headings.forEach((h2, index) => {
    if (h2.closest('.toc')) return; // ignore our own h2 just in case
    
    if (!h2.id) {
       h2.id = `heading-${index + 1}`;
    }
    
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${h2.id}`;
    a.textContent = `${index + 1}. ${h2.textContent}`;
    li.append(a);
    ul.append(li);
  });
  
  tocNav.append(ul);
  block.textContent = '';
  block.append(tocNav);
}
