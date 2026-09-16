/**
 * breadcrumb — the standalone breadcrumb trail above a skinny banner (source: component-breadcrumb;
 * the landing hero carries its own copy inside the `banner image` block).
 *
 * Authoring: one cell with a <ul>; a crumb's nested <ul> is its dropdown menu.
 * Tier: reconstructive;
 * the list is MOVED (EW1). Observed behaviours: hovering a crumb opens its menu, the arrow toggles
 * it, an outside click closes.
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
  const ul = block.querySelector('ul');
  if (!ul) return;
  const container = el('div', 'container');
  const section = el('section', 'component-breadcrumb', { 'data-analytics-link-region': 'utility' });
  const nav = el('nav', 'clearfix', { id: 'primary_nav_wrap' });
  [...ul.children].forEach((li) => {
    // the pipeline wraps a list item's inline content in <p> when it also holds a nested list;
    // the source rules key on li > a (the list is one editor, the wrapper carries no index)
    const a = li.querySelector(':scope > a, :scope > p > a');
    if (a) {
      a.classList.add('parent');
      if (a.parentElement.tagName === 'P') a.parentElement.replaceWith(a);
    }
    const menu = li.querySelector(':scope > ul');
    if (menu) {
      menu.className = 'dropdown-menu';
      menu.setAttribute('role', 'menu');
      menu.querySelectorAll('a').forEach((x) => x.classList.add('subBreadcrumb'));
      li.insertBefore(document.createTextNode(' '), menu); // the source keeps a space before the arrow
      li.insertBefore(el('div', 'icon-dropdown-arrow'), menu);
    }
  });
  nav.append(ul);
  section.append(nav);
  container.append(section);
  block.replaceChildren(container);

  const items = [...ul.children];
  const closeAll = () => items.forEach((li) => {
    const m = li.querySelector(':scope > ul.dropdown-menu');
    if (m) m.classList.remove('active');
  });
  items.forEach((li) => {
    const menu = li.querySelector(':scope > ul.dropdown-menu');
    const arrow = li.querySelector(':scope > .icon-dropdown-arrow');
    const link = li.querySelector(':scope > a, :scope > p > a');
    if (!menu) return;
    if (link) link.addEventListener('mouseenter', () => { closeAll(); menu.classList.add('active'); });
    if (arrow) {
      arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = menu.classList.contains('active');
        closeAll();
        if (!open) menu.classList.add('active');
      });
    }
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.component-breadcrumb')) closeAll(); });
}
