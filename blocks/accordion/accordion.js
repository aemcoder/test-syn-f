/**
 * accordion — the FAQ list (source: component-faq): single-open items with a caret that flips.
 * Authoring rows: one per item, two cells — <h4>question</h4> | answer (paragraphs, lists).
 * Tier: reconstructive; authored nodes are MOVED (the question heading into the toggle button, the
 * answer nodes into the detail panel — EW1). Behaviour observed live: one item open at a time.
 */

const CARET_UP = '<svg class="svg-inline--fa fa-caret-up" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"></path></svg>';
const CARET_DOWN = '<svg class="svg-inline--fa fa-caret-down" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"></path></svg>';

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  return node;
}

function svg(markup) {
  const t = document.createElement('template');
  t.innerHTML = markup.trim();
  return t.content.firstElementChild;
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children]).filter((cells) => cells.length);
  const section = el('section', 'component-faq', { 'data-analytics-link-region': 'expandable' });
  const container = el('div', 'container');
  const row = el('div', 'row');
  const col = el('div', 'col-sm-12');
  const list = el('div', 'accordion-list');
  const items = rows.map(([qCell, aCell]) => {
    const item = el('div', 'item');
    const btn = el('button', 'title', { type: 'button', 'aria-expanded': 'false' });
    const heading = qCell.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) btn.append(heading);
    else { const h4 = el('h4'); h4.append(...qCell.childNodes); btn.append(h4); }
    btn.append(svg(CARET_UP), svg(CARET_DOWN));
    const detail = el('div', 'detail');
    if (aCell) detail.append(...aCell.childNodes);
    item.append(btn, detail);
    return item;
  });
  list.append(...items);
  col.append(list);
  row.append(col);
  container.append(row);
  section.append(container);
  block.replaceChildren(section);

  items.forEach((it) => {
    const btn = it.querySelector('.title');
    btn.addEventListener('click', () => {
      const open = it.classList.contains('open');
      items.forEach((o) => { o.classList.remove('open'); o.querySelector('.title').setAttribute('aria-expanded', 'false'); });
      if (!open) { it.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
}
