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

import { loadFragment } from '../fragment/fragment.js';

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

/* ---- fragments variant (listing family): a two-column layout whose columns are authored as
   separate documents (page-scoped fragments, as the tabs block does) — the newsroom
   "featured stories | sidebar"
   band. Authoring: one row, one cell per column holding <p><a href="/page/columns/name">…</a></p>.
   Variant `sidebar` = 8/4 split (source col-sm-8 | col-sm-4), default 6/6; `divider` adds the
   vertical rule. Vertical spacing comes from the section tokens. Each fragment's sections are
   decorated by the
   fragment loader and MOVED whole into the column (EW1/EW9). ---- */
async function decorateFragments(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]).filter((c) => c.querySelector('a'));
  const divider = block.classList.contains('divider');
  const sidebar = block.classList.contains('sidebar');
  const container = el('div', 'container');
  const row = el('section', `component-column row${divider ? ' divider-row' : ''}`);
  const spans = sidebar && cells.length === 2 ? ['col-sm-8', 'col-sm-4'] : cells.map(() => ({ 3: 'col-sm-4', 4: 'col-sm-3' }[cells.length] || 'col-sm-6'));
  const cols = cells.map((cell, i) => {
    if (divider && i > 0) { const d = el('div', 'snps-col-divider col divider-spacing-small-30'); d.append(el('div', 'vl')); row.append(d); }
    const col = el('div', `col-xs-12 ${spans[i]}${divider ? ' divider-spacing-small-30' : ''}`);
    const grid = el('div', 'aem-Grid');
    col.append(grid);
    row.append(col);
    const link = cell.querySelector('a');
    return { grid, path: link ? new URL(link.href, window.location.href).pathname : null };
  });
  container.append(row);
  block.replaceChildren(container);
  await Promise.all(cols.map(async (c) => {
    if (!c.path) return;
    const fragment = await loadFragment(c.path);
    if (fragment) c.grid.append(...fragment.querySelectorAll(':scope > .section, :scope > div'));
  }));
}

/* ---- static family variants (stardust/eds-fanout/static.md) ---- */

/* image-text-cta — the source component-imageTextCta (careers/benefits): one row per band, two
   cells in VISUAL order — the picture cell and the text cell (<h2> title, optional <h3> subtitle,
   copy, <strong>/<em> CTAs). Image first = the source `mediatext` row, text first = `textmedia`
   (image pushed right). Tier: reconstructive; authored nodes are MOVED into the source DOM (EW1),
   the wrappers carry the source classes (EW2), CTA paragraphs move whole (EW3). */
function imageTextCtaRow(cells) {
  const imgCell = cells.find((c) => c.querySelector('picture, img'));
  const textCell = cells.find((c) => c !== imgCell) || cells[0];
  const imageRight = imgCell && cells.indexOf(imgCell) > cells.indexOf(textCell);
  const container = el('div', 'container');
  const section = el('section', 'component-imageTextCta', { 'data-analytics-link-region': 'card' });
  const inner = el('div', 'container');
  const row = el('div', `row ${imageRight ? 'textmedia' : 'mediatext'}`);
  const imgCol = el('div', `col-xs-12 col-sm-6${imageRight ? ' col-sm-push-6' : ''} img-col`);
  const ci = el('div', 'component-image');
  const cmp = el('div', 'cmp-image');
  const pic = imgCell ? (imgCell.querySelector('picture') || imgCell.querySelector('img')) : null;
  if (pic) {
    (pic.querySelector('img') || pic).classList.add('img-responsive');
    cmp.append(pic);
  }
  ci.append(cmp);
  imgCol.append(ci);
  const textCol = el('div', `col-xs-12 col-sm-6 text-col${imageRight ? ' col-sm-pull-6' : ''}`);
  const [heading, sub] = [...textCell.querySelectorAll('h1, h2, h3, h4')];
  const nodes = [...textCell.querySelectorAll('p, ul, ol')];
  const isCta = (p) => {
    const link = p.querySelector('a');
    if (!link || p.tagName !== 'P' || p.textContent.trim() !== link.textContent.trim()) return false;
    return link.classList.contains('button') || !!p.querySelector('strong, em');
  };
  const ctas = nodes.filter(isCta);
  const copy = nodes.filter((n) => !ctas.includes(n));
  if (heading) {
    const t = el('div', 'title text-size-normal');
    t.append(heading);
    textCol.append(t);
  }
  if (sub) {
    const s = el('div', 'subtitle');
    s.append(sub);
    textCol.append(s);
  }
  if (copy.length) {
    const ct = el('div', 'component-text');
    copy.forEach((n) => ct.append(n));
    textCol.append(ct);
  }
  if (ctas.length) {
    const buttons = el('div', 'buttons align-left');
    ctas.forEach((p) => {
      const link = p.querySelector('a');
      const secondary = link.classList.contains('secondary')
        || (!link.classList.contains('button') && !!p.querySelector('em'));
      const b = el('div', `component-button ${secondary ? 'secondary' : 'primary'} darkButtonRollover`);
      b.append(p);
      buttons.append(b);
    });
    textCol.append(buttons);
  }
  row.append(imgCol, textCol);
  inner.append(row);
  section.append(inner);
  container.append(section);
  return container;
}

function decorateImageTextCta(block, rows) {
  // vertical spacing and the grey band come from the section tokens
  const host = el('div', 'imageTextCta image');
  rows.forEach((cells) => host.append(imageTextCtaRow(cells)));
  block.replaceChildren(host);
}

/* text-image — the source component-text-image-2-column units of the support page (inside the
   rail layout): one row per unit — picture | <h4> title, copy, plain "Learn More" link. Each unit
   paints the source's own vert-pad wrapper (they sit inside a column, not in their own section).
   Tier: reconstructive, nodes MOVED (EW1); the title text is wrapped in the source's presentation
   <span> inside the authored heading (EW2 refinement, as cards.js does). */
function textImageRow(cells, last) {
  const [imgCell, textCell] = cells.length > 1 ? cells : [null, cells[0]];
  const host = el('div', 'textImage2Column image');
  const bg = el('div', `background-component vert-pad-top-sm${last ? '' : ' vert-pad-bottom-xs'}`);
  const link = [...textCell.querySelectorAll('p')].map((p) => p.querySelector('a')).find(Boolean);
  const section = el('section', 'component-text-image-2-column no-link', {
    'data-analytics-link-region': 'body',
  });
  if (link) section.setAttribute('data-link', link.getAttribute('href'));
  const row = el('div', 'row');
  const imgCol = el('div', 'col-xs-12 img-col col-sm-4');
  const ci = el('div', 'component-image', { 'data-analytics-link-region': 'body' });
  const cmp = el('div', 'cmp-image');
  const pic = imgCell ? (imgCell.querySelector('picture') || imgCell.querySelector('img')) : null;
  if (pic) {
    (pic.querySelector('img') || pic).classList.add('img-responsive');
    cmp.append(pic);
  }
  ci.append(cmp);
  imgCol.append(ci);
  const textCol = el('div', 'col-xs-12 col-sm-8');
  const heading = textCell.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    const span = document.createElement('span');
    span.className = 'text-size-normal';
    span.style.color = '#5A2A82';
    span.append(...heading.childNodes);
    heading.append(span);
    const t = el('div', 'component-text');
    t.append(heading);
    textCol.append(t);
  }
  const nodes = [...textCell.querySelectorAll('p, ul, ol')];
  const linkP = link ? link.closest('p') : null;
  const copy = nodes.filter((n) => n !== linkP);
  if (copy.length) {
    const ct = el('div', 'component-text');
    copy.forEach((n) => ct.append(n));
    textCol.append(ct);
  }
  if (linkP) {
    const lt = el('div', 'component-text cta-text'); // the source link inherits the body size, not a <p>'s
    lt.append(linkP);
    textCol.append(lt);
  }
  row.append(imgCol, textCol);
  section.append(row);
  bg.append(section);
  host.append(bg);
  return host;
}

function decorateTextImage(block, rows) {
  const list = el('div', 'text-image-units');
  rows.forEach((cells, i) => list.append(textImageRow(cells, i === rows.length - 1)));
  block.replaceChildren(list);
}

export default async function decorate(block) {
  if (block.classList.contains('fragments')) { await decorateFragments(block); return; } // listing family: fragment columns
  const divider = block.classList.contains('divider');
  const rows = [...block.children].map((row) => [...row.children]).filter((cells) => cells.length);
  if (!rows.length) return;
  if (block.classList.contains('image-text-cta')) {
    decorateImageTextCta(block, rows);
    return;
  }
  if (block.classList.contains('text-image')) {
    decorateTextImage(block, rows);
    return;
  }
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
  if (block.classList.contains('small')) { // listing family: smaller titles + 30px top pad (source text-size-smaller / vert-pad-top-sm)
    block.querySelectorAll('.text > .container').forEach((cont) => { const wrap = el('div', 'background-component vert-pad-top-sm'); cont.replaceWith(wrap); wrap.append(cont); });
    block.querySelectorAll('.component-textcomp .title').forEach((t) => t.classList.add('text-size-smaller'));
  }
  if (block.classList.contains('three')) { // listing family: three divider columns (source col-sm-4 three)
    block.querySelectorAll('.col-sm-6:not(.snps-col-divider)').forEach((c) => { c.classList.remove('col-sm-6'); c.classList.add('col-sm-4', 'three'); });
    bg.classList.remove('vert-pad-top-md', 'vert-pad-bottom-md');
  }
}
