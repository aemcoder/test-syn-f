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

/* ---- events variant (listing family): the "Upcoming Events" boxes of the newsroom sidebar
   (source:
   cmp-boxlink purple / cmp-boxlink__eventBox). Authoring: one row per event, three cells —
   <p>Sep 15-17, 2026</p> | <p><a href>Event title</a></p> | <p>Location</p>. The whole box is the
   link: the authored inner anchor is unwrapped after its href is read (EW6); the paragraphs are
   MOVED (EW1). ---- */
function decorateEvents(block) {
  const rows = [...block.children].map((row) => [...row.children]).filter((cells) => cells.length);
  const grid = el('div', 'aem-Grid');
  rows.forEach(([dateCell, titleCell, locationCell]) => {
    const cells = [dateCell, titleCell, locationCell].filter(Boolean);
    const linkCell = cells.find((c) => c.querySelector('a')) || titleCell || dateCell;
    const a = linkCell.querySelector('a');
    const href = a ? a.getAttribute('href') : '#';
    const target = a ? a.getAttribute('target') : null;
    if (a) a.replaceWith(...a.childNodes);
    const host = el('div', 'boxLink');
    const bg = el('div', 'background-component vert-pad-bottom-xs');
    const container = el('div', 'container');
    const section = el('section', 'cmp-boxlink purple', { 'data-analytics-link-region': 'list' });
    const link = el('a', 'topLink', { href });
    if (target) link.target = target;
    const eventBox = el('div', 'cmp-boxlink__eventBox');
    const date = el('div', 'cmp-boxlink__date');
    const title = el('div', 'cmp-boxlink__eventTitle');
    const location = el('div', 'cmp-boxlink__eventLocation');
    if (dateCell) { date.title = dateCell.textContent.trim(); date.append(...dateCell.childNodes); }
    if (titleCell) title.append(...titleCell.childNodes);
    if (locationCell) location.append(...locationCell.childNodes);
    eventBox.append(date, title, location, el('div', 'icon'));
    link.append(eventBox);
    section.append(link);
    container.append(section);
    bg.append(container);
    host.append(bg);
    grid.append(host);
  });
  block.replaceChildren(grid);
}

/* ---- container variant (landing family): the page-level component-boxLinkContainer — an (empty)
   title row and one
   boxLinkItem column per authored cell (col-sm-4 for three, col-sm-6 for two, col-sm-3 for four). A
   box is a <p> (link or
   plain label) optionally followed by a <ul> of dropdown links: the source hides the dropdown at
   rest (display:none) and
   toggles it from the icon; the icon click here toggles li.open the same way. Tier: reconstructive;
   authored nodes are
   MOVED (EW1); the dropdown list moves whole into a wrapper that carries the layout class (EW2).
   ---- */
function containerBox(p, list) {
  const a = p.querySelector('a');
  const host = el('div', 'boxLink');
  const ul = el('ul', `component-boxLink${list ? '' : ' no-dropdown'}`, { role: 'menu', 'data-analytics-link-region': 'list' });
  const li = el('li');
  const label = el('div', 'topLabel');
  if (a) a.classList.add('topLink');
  label.append(p);
  li.append(label);
  if (list) {
    const icon = el('div', 'icon', { role: 'button', tabindex: '0', 'aria-expanded': 'false' });
    const wrap = el('div', 'dropdown-wrap', { role: 'menu' });
    wrap.append(list);
    li.append(icon, wrap);
    const toggle = () => { const open = li.classList.toggle('open'); icon.setAttribute('aria-expanded', open ? 'true' : 'false'); };
    icon.addEventListener('click', toggle);
    icon.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  } else {
    const iconA = el('a', 'topLink', { href: a ? a.getAttribute('href') : '#', 'aria-hidden': 'true', tabindex: '-1' });
    if (a && a.target) iconA.target = a.target;
    iconA.append(el('div', 'icon'));
    li.append(iconA);
  }
  ul.append(li);
  host.append(ul);
  return host;
}

function decorateContainer(block) {
  const cells = [...block.children].flatMap((row) => [...row.children])
    .filter((c) => c.textContent.trim());
  const span = { 2: 'col-sm-6', 4: 'col-sm-3' }[cells.length] || 'col-sm-4';
  const container = el('div', 'container');
  const section = el('section', 'component-boxLinkContainer', { 'data-analytics-link-region': 'list' });
  const titleRow = el('div', 'row');
  titleRow.append(el('div', 'col-xs-12'));
  const row = el('div', 'row no-title');
  cells.forEach((cell) => {
    const col = el('div', `${span} boxLinkItem`);
    const inner = el('div');
    const grid = el('div', 'aem-Grid');
    const kids = [...cell.children];
    kids.forEach((k, i) => {
      if (k.tagName !== 'P' || !k.textContent.trim()) return;
      const next = kids[i + 1];
      grid.append(containerBox(k, next && /^(UL|OL)$/.test(next.tagName) ? next : null));
    });
    inner.append(grid);
    col.append(inner);
    row.append(col);
  });
  section.append(titleRow, row);
  container.append(section);
  block.replaceChildren(container);
}

export default function decorate(block) {
  if (block.classList.contains('container')) { decorateContainer(block); return; }
  if (block.classList.contains('events')) { decorateEvents(block); return; } // listing family: event boxes
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
