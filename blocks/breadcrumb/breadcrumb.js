/**
 * breadcrumb — the standalone breadcrumb bar above a skinny (purple gradient) hero (source:
 * component-breadcrumb outside a banner, e.g. company/corporate-governance-ethics).
 * Authoring: one cell with a <ul>; each <li> is a crumb link, an optional nested <ul> lists that
 * level's sibling pages (the dropdown opened by hover / the arrow).
 * Tier: template-slotted; the authored list is MOVED into the source nav (EW1; a list is one
 * editable unit). Behaviours observed on the banner breadcrumb (blocks/banner): hover opens a
 * menu, the arrow toggles it, an outside click closes.
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
    // the pipeline wraps a crumb that carries a dropdown in <p>; the list is the editable unit
    li.querySelectorAll(':scope > p').forEach((p) => p.replaceWith(...p.childNodes));
    const a = li.querySelector(':scope > a');
    if (a) a.classList.add('parent');
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
    const link = li.querySelector(':scope > a');
    if (!menu) return;
    if (link) {
      link.addEventListener('mouseenter', () => {
        closeAll();
        menu.classList.add('active');
      });
    }
    if (arrow) {
      arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = menu.classList.contains('active');
        closeAll();
        if (!open) menu.classList.add('active');
      });
    }
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.component-breadcrumb')) closeAll();
  });
}
