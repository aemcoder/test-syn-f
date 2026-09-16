/**
 * rail — the right-rail cards of the support page (source: rightRailItem / component-railCard): a
 * purple flag with the card title and a link line below; the "Related items" page list (source:
 * component-pageList) that follows the block as default content (<h5> + <ul>) is reabsorbed into
 * the rail column (EW8). The rail sits beside the main column through the section token
 * `rail-layout` (styles/styles.css, static family).
 * Authoring rows: one per card, two cells — <p><a href>Flag title</a></p> (or plain text) |
 * <p><a href><strong>NEW</strong> Link text</a></p>.
 * Tier: reconstructive; authored nodes are MOVED (EW1), wrappers carry the source classes (EW2);
 * the source's `label-new` span is the authored <strong>.
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  return node;
}

function railCard(cells) {
  const [flagCell, textCell] = cells.length > 1 ? cells : [null, cells[0]];
  const host = el('div', 'rightRailItem image');
  const section = el('section', 'component-railCard', { 'data-analytics-link-region': 'rail' });
  const flag = el('div', 'flag');
  flag.style.backgroundColor = '#5A2A82';
  const flagText = el('div');
  if (flagCell) [...flagCell.querySelectorAll('p')].forEach((p) => flagText.append(p));
  const triangle = el('div', 'triangle');
  triangle.style.background = 'linear-gradient(to right bottom, #5A2A82 50%, transparent 50%)';
  flag.append(flagText, triangle);
  const ct = el('div', 'component-text');
  if (textCell) [...textCell.querySelectorAll('p, ul, ol')].forEach((n) => ct.append(n));
  section.append(flag, ct);
  host.append(section);
  return host;
}

/* the page list that follows the block as default content (heading + link list) joins the rail
   column (EW8): nodes are MOVED into the source pageList DOM, the emptied wrapper removed */
function pageList(next) {
  const host = el('div', 'pageList');
  const section = el('section', 'component-pageList', { 'data-analytics-link-region': 'list' });
  const row = el('div', 'row');
  const col = el('div', 'col-xs-12');
  const heading = next.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) col.append(heading);
  const links = el('div', 'pageLinks one-column');
  links.append(...next.querySelectorAll('ul, ol'));
  col.append(links);
  [...next.childNodes].forEach((n) => col.append(n)); // anything else the author put there stays
  row.append(col);
  section.append(row);
  host.append(section);
  next.remove();
  return host;
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children]).filter((cells) => cells.length);
  const grid = el('div', 'aem-Grid');
  rows.forEach((cells) => grid.append(railCard(cells)));
  const next = block.parentElement && block.parentElement.nextElementSibling;
  if (next && next.classList.contains('default-content-wrapper') && next.querySelector('ul, ol')) {
    grid.append(pageList(next));
  }
  block.replaceChildren(grid);
}
