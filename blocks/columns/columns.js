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

const FA_PLAY = '<svg class="svg-inline--fa fa-play" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path></svg>';
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

export default function decorate(block) {
  if (block.classList.contains('landing')) { decorateLanding(block); return; }
  if (block.classList.contains('rte')) { decorateRte(block); return; }
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
}
