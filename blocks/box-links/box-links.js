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

export default function decorate(block) {
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
