/**
 * tags — the page-tag pill list under an article body (source: cmp-blogsdev "pagetags").
 *
 * Authoring: one cell with a <ul> of tag links. Tier: reconstructive; the list is MOVED into the
 * source wrapper (EW1), the wrapper carries the list class (EW2).
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  return node;
}

export default function decorate(block) {
  const list = block.querySelector('ul');
  const outer = el('div', 'blogsDev');
  const container = el('div', 'container');
  const section = el('section', 'cmp-blogsdev', { 'data-analytics-link-region': 'utility' });
  const holder = el('div', 'cmp-blogsdev__pagetags-container');
  if (list) holder.append(list);
  section.append(holder);
  container.append(section);
  outer.append(container);
  block.replaceChildren(outer);
}
