/**
 * benefits — "Design the Future Today with Synopsys": two titled columns of key-benefit tiles
 * (icon, title,
 * description; the tile is a link). Schema: stardust/eds-schema/home.json section 5.
 * The section heading is default content above the block (styled in place, .benefits-container).
 *
 * Authoring rows: row 1 = the two column titles (<h3> per cell); every further row = one tile per
 * column:
 *   <picture> icon, <p><a href><strong>title</strong></a></p>, <p>description</p> (an empty cell =
 * no tile).
 * Tier: reconstructive. Authored nodes are MOVED (EW1); the tile's inner anchor is unwrapped after
 * reading its
 * href and the whole tile becomes the link (EW6).
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  return node;
}

// #104: the runtime's wrapTextNodes folds a media-led cell into ONE <p> (img + title + description)
// — expand it back
// so the authored paragraphs are addressable; DA-shaped content (picture wrapped in its own <p>)
// passes through.
function cellNodes(cell) {
  let kids = [...cell.children];
  if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length && kids[0].querySelector('picture, img')) {
    kids = [...kids[0].childNodes].map((n) => {
      if (n.nodeType === 1) return n;
      if (n.textContent.trim()) { const p = document.createElement('p'); p.append(n); return p; } // harness-only (EW5)
      return null;
    }).filter(Boolean);
  }
  return kids;
}

function tile(cell) {
  const kids = cellNodes(cell);
  const pic = kids.find((k) => k.matches('picture, img')) || cell.querySelector('picture, img');
  const paragraphs = kids.filter((k) => k.tagName === 'P' && k.textContent.trim());
  const titleP = paragraphs.find((p) => p.querySelector('a')) || paragraphs[0];
  const desc = paragraphs.find((p) => p !== titleP);
  const link = titleP ? titleP.querySelector('a') : null;
  const href = link ? link.getAttribute('href') : '#';
  if (link) link.replaceWith(...link.childNodes);

  const host = el('div', 'keyBenefits');
  const section = el('section', 'cmp-key-benefits', { 'data-analytics-link-region': 'card' });
  const a = el('a', 'cmp-key-benefits__link', { href });
  const wrapper = el('div', 'cmp-key-benefits__wrapper');
  const imgText = el('div', 'cmp-key-benefits__img-text');
  const imgWrap = el('div', 'cmp-key-benefits__img-wrapper');
  const compImg = el('div', 'component-image');
  if (pic) compImg.append(pic);
  imgWrap.append(compImg);
  const title = el('div', 'cmp-key-benefits__title');
  if (titleP) title.append(titleP);
  imgText.append(imgWrap, title);
  const description = el('div', 'cmp-key-benefits__description');
  if (desc) description.append(desc);
  wrapper.append(imgText, description);
  a.append(wrapper);
  section.append(a);
  host.append(section);
  return host;
}

/* tiles variant (landing pages): no column titles, every row = one visual row of tiles,
   cells = columns */
function decorateTiles(block, rows) {
  const n = Math.max(...rows.map((r) => r.length));
  let colClass = 'col-xs-12 col-sm-6';
  if (n === 3) colClass = 'col-xs-12 col-sm-4 three';
  else if (n === 4) colClass = 'col-xs-12 col-sm-3 four';
  const columns = Array.from({ length: n }, () => el('div', colClass));
  rows.forEach((cells) => cells.forEach((cell, i) => {
    if (cell.textContent.trim() || cell.querySelector('picture, img')) columns[i].append(tile(cell));
  }));
  const outer = el('div', 'column');
  const container = el('div', 'container');
  const row = el('section', 'component-column row');
  columns.forEach((c) => row.append(c));
  container.append(row);
  outer.append(container);
  block.replaceChildren(outer);
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children]);
  if (!rows.length) return;
  if (block.classList.contains('tiles')) { decorateTiles(block, rows); return; }
  const [titleRow, ...tileRows] = rows;
  const columns = titleRow.map((cell) => {
    const col = el('div', 'col-xs-12 col-sm-6');
    const textHost = el('div', 'text');
    const bg = el('div', 'background-component vert-pad-top-sm vert-pad-bottom-sm');
    const container = el('div', 'container');
    const section = el('section', 'component-textcomp text-align-left');
    const title = el('div', 'title text-size-normal');
    const heading = cell.querySelector('h1, h2, h3, h4');
    if (heading) title.append(heading);
    section.append(title);
    container.append(section);
    bg.append(container);
    textHost.append(bg);
    col.append(textHost);
    return col;
  });
  tileRows.forEach((cells) => {
    cells.forEach((cell, i) => {
      if (columns[i] && cell.textContent.trim()) columns[i].append(tile(cell));
    });
  });
  const outer = el('div', 'column');
  const container = el('div', 'container');
  const row = el('section', 'component-column row');
  columns.forEach((c) => row.append(c));
  container.append(row);
  outer.append(container);
  block.replaceChildren(outer);
}
