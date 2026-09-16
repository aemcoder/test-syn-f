/**
 * box-links — the "Featured Solutions" link boxes (source: component-boxLink): each link is a
 * bordered box with an arrow icon, laid out in columns.
 * Authoring: one row, one cell per column; each cell lists its links as <p><a href>Label</a></p>.
 * Tier: reconstructive; the authored paragraph (with its link) is MOVED into the box (EW1); the
 * icon anchor repeats the href.
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  return node;
}

function box(p) {
  const a = p.querySelector('a');
  const host = el('div', 'boxLink');
  const ul = el('ul', 'component-boxLink no-dropdown', { role: 'menu', 'data-analytics-link-region': 'list' });
  const li = el('li');
  const label = el('div', 'topLabel');
  if (a) a.classList.add('topLink');
  label.append(p);
  const iconA = el('a', 'topLink', { href: a ? a.getAttribute('href') : '#', 'aria-hidden': 'true', tabindex: '-1' });
  if (a && a.target) iconA.target = a.target;
  iconA.append(el('div', 'icon'));
  li.append(label, iconA);
  ul.append(li);
  host.append(ul);
  return host;
}

/* ---- container variant (source: component-boxLinkContainer): one cell per column; each <p><a>
   is a box link, a
   <ul> right after it lists that link's dropdown entries (rest state: closed, no open behaviour
      was observed) ---- */
function decorateContainer(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]).filter((c) => c.querySelector('a'));
  const section = el('section', 'component-boxLinkContainer', { 'data-analytics-link-region': 'list' });
  const titleRow = el('div', 'row');
  titleRow.append(el('div', 'col-xs-12'));
  const row = el('div', 'row no-title');
  const span = { 3: 'col-sm-4', 4: 'col-sm-3' }[cells.length] || 'col-sm-6';
  cells.forEach((cell) => {
    const col = el('div', `${span} boxLinkItem`);
    const wrap = el('div');
    const grid = el('div', 'aem-Grid');
    [...cell.children].forEach((node) => {
      if (node.tagName !== 'P' || !node.querySelector('a')) return;
      const a = node.querySelector('a');
      const next = node.nextElementSibling;
      const list = next && next.tagName === 'UL' ? next : null;
      const host = el('div', 'boxLink');
      const ul = el('ul', `component-boxLink${list ? '' : ' no-dropdown'}`, { 'data-analytics-link-region': 'list' });
      if (!list) ul.setAttribute('role', 'menu');
      const li = el('li');
      const label = el('div', 'topLabel');
      a.classList.add('topLink');
      label.append(node);
      li.append(label);
      if (list) {
        li.append(el('div', 'icon'));
        const dd = el('div', 'dropdown-link', { role: 'menu' });
        dd.append(list);
        li.append(dd);
      } else {
        const iconA = el('a', 'topLink', { href: a.getAttribute('href'), 'aria-hidden': 'true', tabindex: '-1' });
        if (a.target) iconA.target = a.target;
        iconA.append(el('div', 'icon'));
        li.append(iconA);
      }
      ul.append(li);
      host.append(ul);
      grid.append(host);
    });
    wrap.append(grid);
    col.append(wrap);
    row.append(col);
  });
  section.append(titleRow, row);
  const container = el('div', 'container');
  container.append(section);
  block.replaceChildren(container);
}

export default function decorate(block) {
  if (block.classList.contains('container')) { decorateContainer(block); return; }
  const cells = [...block.children].flatMap((row) => [...row.children]).filter((c) => c.querySelector('a'));
  const boxesPerCell = cells.map((cell) => [...cell.querySelectorAll('p')].filter((p) => p.querySelector('a')).map(box));
  if (boxesPerCell.length <= 1) {
    const grid = el('div', 'aem-Grid');
    (boxesPerCell[0] || []).forEach((b) => grid.append(b));
    block.replaceChildren(grid);
    return;
  }
  const column = el('div', 'column');
  const container = el('div', 'container');
  const row = el('section', 'component-column row');
  const span = { 3: 'col-sm-4', 4: 'col-sm-3' }[boxesPerCell.length] || 'col-sm-6';
  const colClass = `col-xs-12 ${span}`;
  boxesPerCell.forEach((boxes) => {
    const col = el('div', colClass);
    const grid = el('div', 'aem-Grid');
    boxes.forEach((b) => grid.append(b));
    col.append(grid);
    row.append(col);
  });
  container.append(row);
  column.append(container);
  block.replaceChildren(column);
}
