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

/* ---- media: an image column beside a text column (bootstrap 4/8 split — the cell with the
   picture takes col-sm-4, the text cell col-sm-8, in authored order). Variant classes:
   `image-top` / `image-bottom` = the source image wrapper's vert-pad-top-sm / vert-pad-bottom-sm,
   `small` = text-size-smaller title, `purple` = the #5A2A82 title. ---- */
function decorateMedia(block, rows) {
  const host = el('div', 'column');
  const container = el('div', 'container');
  rows.forEach((cells) => {
    const row = el('section', 'component-column row');
    cells.forEach((cell) => {
      const pic = cell.querySelector('picture, img');
      if (pic) {
        const col = el('div', 'col-xs-12 col-sm-4');
        const grid = el('div', 'aem-Grid');
        const image = el('div', 'image');
        let padCls = '';
        if (block.classList.contains('image-top')) padCls = 'background-component vert-pad-top-sm';
        if (block.classList.contains('image-bottom')) padCls = 'background-component vert-pad-bottom-sm';
        const inner = el('div', 'container');
        const ci = el('div', 'component-image');
        const cmp = el('div', 'cmp-image');
        cmp.append(pic);
        ci.append(cmp);
        inner.append(ci);
        if (padCls) { const pad = el('div', padCls); pad.append(inner); image.append(pad); } else image.append(inner);
        grid.append(image);
        col.append(grid);
        row.append(col);
      } else {
        const col = column(cell, false);
        col.className = 'col-xs-12 col-sm-8';
        row.append(col);
      }
    });
    container.append(row);
  });
  host.append(container);
  block.replaceChildren(host);
}

export default function decorate(block) {
  const divider = block.classList.contains('divider');
  const rows = [...block.children].map((row) => [...row.children]).filter((cells) => cells.length);
  if (!rows.length) return;
  if (block.classList.contains('media')) { decorateMedia(block, rows); return; }
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
}
