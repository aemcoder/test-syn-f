/**
 * columns — side-by-side text columns. Variant `divider`: two text columns on a light-grey band
 * separated by a
 * vertical rule ("Support & Services" / "Careers"). Schema: stardust/eds-schema/home.json section
 * 10.
 *
 * Authoring: one row, one cell per column: <h2>title</h2>, <p>copy</p>, <p><a href>text
 * link</a></p>
 * (the link is a chevron text link, not a button — plain <a>, D6). Tier: reconstructive; nodes are
 * MOVED (EW1).
 */

const FA_CTA = '<svg class="svg-inline--fa fa-chevron-right arrow-icon" aria-hidden="true" focusable="false" data-prefix="far" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M305 239c9.4 9.4 9.4 24.6 0 33.9L113 465c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l175-175L79 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L305 239z"></path></svg>';

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

function column(cell, divider) {
  const col = el('div', `col-xs-12 col-sm-6${divider ? ' divider-spacing-small-30' : ''}`);
  const textHost = el('div', 'text');
  const container = el('div', 'container');
  const section = el('section', 'component-textcomp text-align-left');
  const heading = cell.querySelector('h1, h2, h3, h4');
  const paragraphs = [...cell.querySelectorAll('p')];
  const linkPs = paragraphs.filter((p) => p.querySelector('a'));
  const copy = paragraphs.filter((p) => !linkPs.includes(p));
  const lists = [...cell.querySelectorAll('ul, ol')];
  if (heading) { const t = el('div', 'title text-size-normal'); t.append(heading); section.append(t); }
  if (copy.length || lists.length) { const ct = el('div', 'component-text'); copy.forEach((p) => ct.append(p)); lists.forEach((l) => ct.append(l)); section.append(ct); }
  if (linkPs.length) {
    const buttons = el('div', 'buttons align-left');
    linkPs.forEach((p) => {
      const a = p.querySelector('a');
      if (a.classList.contains('button')) { const b = el('div', `component-button ${a.classList.contains('secondary') ? 'secondary' : 'primary'}`); b.append(p); buttons.append(b); return; }
      a.classList.add('cta-link'); p.classList.add('cta-link-wrap'); a.append(svg(FA_CTA)); buttons.append(p);
    });
    section.append(buttons);
  }
  container.append(section);
  textHost.append(container);
  col.append(textHost);
  return col;
}

/* ---- speakers variant (webinar landing pages): one cell per speaker — <picture> headshot +
   <p><strong><a>name</a></strong></p>
   + <p><em>title</em></p> + <p>bio</p>; rendered as the source's nested 25/75 image | text
      columns, two per row ---- */
function decorateSpeakers(block) {
  const cells = [...block.children].flatMap((row) => [...row.children])
    .filter((c) => c.textContent.trim() || c.querySelector('picture, img'));
  const bg = el('div', 'background-component');
  const container = el('div', 'container');
  const row = el('section', 'component-column row');
  cells.forEach((cell) => {
    const col = el('div', 'col-xs-12 col-sm-6');
    const grid = el('div', 'aem-Grid');
    const colBlock = el('div', 'column');
    const inner = el('div', 'container');
    const pair = el('section', 'component-column row');
    const left = el('div', 'col-xs-12 col-sm-3 two2575Left');
    const lg = el('div', 'aem-Grid');
    const image = el('div', 'image');
    const ibg = el('div', 'background-component vert-pad-bottom-sm');
    const ic = el('div', 'container');
    const ci = el('div', 'component-image');
    const cmp = el('div', 'cmp-image');
    const pic = cell.querySelector('picture, img');
    if (pic) { const im = pic.querySelector('img') || pic; im.classList.add('img-responsive'); cmp.append(pic); }
    ci.append(cmp);
    ic.append(ci);
    ibg.append(ic);
    image.append(ibg);
    lg.append(image);
    left.append(lg);
    const right = el('div', 'col-xs-12 col-sm-9 two2575Right');
    const rg = el('div', 'aem-Grid');
    const text = el('div', 'text');
    const tc = el('div', 'container');
    const sec = el('section', 'component-textcomp');
    const ct = el('div', 'component-text');
    [...cell.children].filter((n) => !n.querySelector('picture, img') && n.textContent.trim()).forEach((n) => ct.append(n));
    sec.append(ct); tc.append(sec); text.append(tc); rg.append(text); right.append(rg);
    pair.append(left, right);
    inner.append(pair);
    colBlock.append(inner);
    grid.append(colBlock);
    col.append(grid);
    row.append(col);
  });
  container.append(row);
  bg.append(container);
  block.replaceChildren(bg);
}

export default function decorate(block) {
  if (block.classList.contains('speakers')) { decorateSpeakers(block); return; }
  const divider = block.classList.contains('divider');
  const rows = [...block.children].map((row) => [...row.children]).filter((cells) => cells.length);
  if (!rows.length) return;
  const bg = el('div', divider ? 'background-component light-grey-bg vert-pad-top-md vert-pad-bottom-md' : 'background-component');
  const container = el('div', 'container');
  rows.forEach((cells) => {
    const row = el('section', `component-column row${divider ? ' divider-row' : ''}`);
    cells.forEach((cell, i) => {
      if (divider && i > 0) { const d = el('div', 'snps-col-divider col divider-spacing-small-30'); d.append(el('div', 'vl')); row.append(d); }
      row.append(column(cell, divider));
    });
    container.append(row);
  });
  bg.append(container);
  block.replaceChildren(bg);
  if (block.classList.contains('prose-links')) {
    // variant: the source keeps the column's links as prose links inside .component-text (no
    // chevron CTA row)
    block.querySelectorAll('.buttons').forEach((buttons) => {
      const section = buttons.closest('.component-textcomp');
      let ct = section.querySelector('.component-text');
      if (!ct) { ct = el('div', 'component-text'); buttons.before(ct); }
      [...buttons.children].forEach((p) => {
        p.classList.remove('cta-link-wrap');
        p.querySelectorAll('a').forEach((a) => { a.classList.remove('cta-link'); a.querySelectorAll('svg').forEach((x) => x.remove()); });
        ct.append(p);
      });
      buttons.remove();
    });
  }
}
