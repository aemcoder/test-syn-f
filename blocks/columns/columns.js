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
const FA_PLAY = '<svg class="svg-inline--fa fa-play" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path></svg>';

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

/* ---- landing variant (landing family): one authored row, one cell per column — N text / media /
   rich-text columns of the
   source's component-column rows. Flags: two|three|four (columns; a two-column row with one picture
   cell is 8/4),
   media, divider (vertical rules between the columns, divider-row), purple (purple titles). A text
   cell: <h2> (normal
   title) or <h3> (smaller title), copy <p>/<ul>, CTAs (<strong>/<em> = buttons, plain <a> = chevron
   text link). A media
   cell: <p>[<a>]<picture></p>. An empty cell keeps its column slot (the source's script widget
   there is not migrated).
   Tier: reconstructive; authored nodes are MOVED (EW1). ---- */
function landingCell(cell, colClass) {
  const col = el('div', colClass);
  const grid = el('div', 'aem-Grid');
  const pic = cell.querySelector('picture, img');
  const hasText = cell.querySelector('h1, h2, h3, h4, h5, h6') || [...cell.querySelectorAll('p, li')].some((p) => !p.querySelector('picture, img') && p.textContent.trim());
  if (pic && !hasText) {
    const imageHost = el('div', 'image');
    const container = el('div', 'container');
    const compImg = el('div', 'component-image', { 'data-analytics-link-region': 'body' });
    const ci = el('div', 'cmp-image');
    const im = pic.querySelector('img') || pic;
    im.classList.add('img-responsive');
    if (/\.svg(\?|$)/i.test(im.getAttribute('src') || '')) im.classList.add('svg'); // vector logos: 140px, centred below 730
    const link = pic.closest('a');
    const p = pic.closest('p');
    ci.append(pic);
    if (link && /players\.brightcove\.net/.test(link.href)) {
      // a Brightcove video thumbnail (the source's .video.image column): poster + play glyph, the
      // link opens the player
      const video = el('div', 'cmp-video', { 'data-provider': 'Brightcove', 'data-mode': 'modal' });
      const player = el('div', 'cmp-video__player-container embed-responsive embed-responsive-16by9');
      const thumb = el('div', 'cmp-video__thumbnail');
      const btn = el('div', 'video-button-container video-button');
      btn.append(svg(FA_PLAY));
      thumb.append(btn, ci);
      player.append(thumb);
      link.replaceChildren(player);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      video.append(link);
      compImg.append(video);
    } else if (link) { link.replaceChildren(ci); compImg.append(link); } else compImg.append(ci);
    if (p) p.remove();
    container.append(compImg);
    imageHost.append(container);
    grid.append(imageHost);
    col.append(grid);
    return col;
  }
  const textHost = el('div', 'text');
  const container = el('div', 'container');
  const section = el('section', 'component-textcomp text-align-left', { 'data-analytics-link-region': 'banner' });
  const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
  const paragraphs = [...cell.querySelectorAll('p')];
  const linkPs = paragraphs.filter((p) => { const a = p.querySelector('a'); return a && p.textContent.trim() === a.textContent.trim(); });
  if (heading) { const t = el('div', `title text-size-${/^H[3-6]$/.test(heading.tagName) ? 'smaller' : 'normal'}`); t.append(heading); section.append(t); }
  const body = [...cell.children].filter((n) => n !== heading && !linkPs.includes(n) && /^(P|UL|OL)$/.test(n.tagName));
  if (body.length) { const ct = el('div', 'component-text'); body.forEach((n) => ct.append(n)); section.append(ct); }
  if (linkPs.length) {
    const buttons = el('div', 'buttons align-left');
    linkPs.forEach((p) => {
      const a = p.querySelector('a');
      if (a.classList.contains('button')) { const b = el('div', `component-button ${a.classList.contains('secondary') ? 'secondary' : 'primary'} darkButtonRollover`); b.append(p); buttons.append(b); return; }
      if (/\/dw\/ipsearch\.php/.test(a.getAttribute('href') || '')) {
        // the source's IP-search widget: a text field whose Enter key loads
        // ipsearch.php?p=<query> — the same request as a GET form. The authored paragraph
        // becomes the (visually hidden) label, its text the placeholder.
        const form = el('form', 'ip-search', {
          action: a.getAttribute('href'), method: 'get', role: 'search',
        });
        const label = el('label', 'ip-search-label', { for: 'ipsearch' });
        label.append(p);
        const input = el('input', 'textfield', {
          type: 'text',
          id: 'ipsearch',
          name: 'p',
          maxlength: '50',
          autocomplete: 'off',
          placeholder: a.textContent.trim(),
        });
        form.append(label, input);
        buttons.append(form);
        return;
      }
      a.classList.add('cta-link');
      p.classList.add('cta-link-wrap');
      const label = el('span', 'cta-text');
      label.append(...a.childNodes);
      a.append(label, ' ', svg(FA_CTA));
      buttons.append(p);
    });
    section.append(buttons);
  }
  container.append(section);
  textHost.append(container);
  grid.append(textHost);
  col.append(grid);
  return col;
}

function decorateLanding(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]);
  if (!cells.length) return;
  const n = cells.length;
  const divider = block.classList.contains('divider');
  // a media cell holds a picture and nothing else (a picture followed by a caption line is a
  // text column)
  const isMedia = (c) => !!c.querySelector('picture, img')
    && !c.querySelector('h1, h2, h3, h4, h5, h6')
    && ![...c.querySelectorAll('p, li')]
      .some((p) => !p.querySelector('picture, img') && p.textContent.trim());
  const media = n === 2 && cells.some(isMedia);
  const spanOf = (cell) => {
    if (media) return isMedia(cell) ? 'col-xs-12 col-sm-4' : 'col-xs-12 col-sm-8';
    return { 4: 'col-xs-12 col-sm-3 four', 3: `col-xs-12 col-sm-4${divider ? ' divider-spacing-small-30' : ''} three` }[n] || `col-xs-12 col-sm-6${divider ? ' divider-spacing-small-30' : ''}`;
  };
  const outer = el('div', 'column');
  const container = el('div', 'container');
  const row = el('section', `component-column row${divider ? ' divider-row' : ''}`);
  cells.forEach((cell, i) => {
    if (divider && i > 0) { const d = el('div', 'snps-col-divider col divider-spacing-small-30'); d.append(el('div', 'vl')); row.append(d); }
    row.append(landingCell(cell, spanOf(cell)));
  });
  container.append(row);
  outer.append(container);
  block.replaceChildren(outer);
}

/* ---- rte variant (landing family): N rich-text columns (the source's richTextEditor cells —
   company's stat trio, the
   products page's alphabetical link lists). Flags: stats (centered purple figure + grey label),
   links, two|three|four.
   Authored nodes are MOVED whole into .component-rte (EW1). ---- */
function decorateRte(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]);
  if (!cells.length) return;
  const colClass = { 4: 'col-xs-12 col-sm-3 four', 3: 'col-xs-12 col-sm-4 three' }[cells.length] || 'col-xs-12 col-sm-6';
  const outer = el('div', 'column');
  const container = el('div', 'container');
  const row = el('section', 'component-column row');
  cells.forEach((cell) => {
    const col = el('div', colClass);
    const grid = el('div', 'aem-Grid');
    const host = el('div', 'richTextEditor');
    const c = el('div', 'container');
    const section = el('section', 'component-rtecomp', { 'data-analytics-link-region': 'body' });
    const rte = el('div', 'component-rte');
    rte.append(...cell.childNodes);
    section.append(rte);
    c.append(section);
    host.append(c);
    grid.append(host);
    col.append(grid);
    row.append(col);
  });
  container.append(row);
  outer.append(container);
  block.replaceChildren(outer);
}

export default async function decorate(block) {
  if (block.classList.contains('fragments')) { await decorateFragments(block); return; } // listing family: fragment columns
  if (block.classList.contains('landing')) { decorateLanding(block); return; }
  if (block.classList.contains('rte')) { decorateRte(block); return; }
  if (block.classList.contains('speakers')) { decorateSpeakers(block); return; }
  const divider = block.classList.contains('divider');
  const rows = [...block.children].map((row) => [...row.children]).filter((cells) => cells.length);
  if (!rows.length) return;
  if (block.classList.contains('media')) { decorateMedia(block, rows); return; }
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
  // listing family (`divider three small`): smaller titles + 30px top pad (source
  // text-size-smaller / vert-pad-top-sm); the program family's `divider small prose-links` keeps
  // its
  // own CSS-only `small` (title size), so key on `three` too
  if (block.classList.contains('small') && block.classList.contains('three')) {
    block.querySelectorAll('.text > .container').forEach((cont) => { const wrap = el('div', 'background-component vert-pad-top-sm'); cont.replaceWith(wrap); wrap.append(cont); });
    block.querySelectorAll('.component-textcomp .title').forEach((t) => t.classList.add('text-size-smaller'));
  }
  if (block.classList.contains('three')) { // listing family: three divider columns (source col-sm-4 three)
    block.querySelectorAll('.col-sm-6:not(.snps-col-divider)').forEach((c) => { c.classList.remove('col-sm-6'); c.classList.add('col-sm-4', 'three'); });
    bg.classList.remove('vert-pad-top-md', 'vert-pad-bottom-md');
  }
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
