/**
 * cards — card grids of the synopsys.com replica. Two variants (one block, same authoring shape,
 * D9):
 *   `solutions` — the four hover cards (image + title + description + "Learn More"); the whole card
 * is the link.
 *   `carousel`  — the "What's New" asset-card carousel (image, label, date, heading, description,
 * link) with
 *                 arrows + dots, 3 cards per view from 730px, 1 below, infinite via clones
 * (observed live).
 * Schema: stardust/eds-schema/home.json sections 3 and 9.
 *
 * Authoring rows — one per card, two cells:
 *   1. picture
 *   2. solutions: <h3><a href>title</a></h3>, <p>description</p>, <p>button label</p>
 *      carousel:  <p>label</p>, <p>date</p>, <h3>heading</h3>, [<p>description</p>], <p><a
 * href>Learn more</a></p>
 * Authored nodes are MOVED into the prototype's card DOM (EW1); the card link's inner anchor is
 * unwrapped after
 * its href is read (EW6); carousel clones are stripped of editor indices (EW4).
 */

const FA_CARD_BUTTON = '<svg class="svg-inline--fa fa-chevron-right" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M299.3 244.7c6.2 6.2 6.2 16.4 0 22.6l-192 192c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6L265.4 256 84.7 75.3c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l192 192z"></path></svg>';
const FA_NEWS_LINK = '<svg class="svg-inline--fa fa-chevron-right" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M299.3 244.7c6.2 6.2 6.2 16.4 0 22.6l-192 192c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6L265.4 256 84.7 75.3c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l192 192z"></path></svg>';

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

function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  return node;
}

const text = (node) => (node ? node.textContent.trim() : '');
const media = (cell) => (cell ? cell.querySelector('picture, img') : null);

/* ---------------- solutions ---------------- */
function solutionCard(cells) {
  const [mediaCell, textCell] = cells;
  const heading = textCell.querySelector('h1, h2, h3, h4');
  const link = heading ? heading.querySelector('a') : textCell.querySelector('a');
  const href = link ? link.getAttribute('href') : '#';
  const paragraphs = [...textCell.querySelectorAll('p')].filter((p) => !p.querySelector('a'));
  const [desc, button] = paragraphs;

  const col = el('div', 'col-xs-12 col-sm-3 four');
  const cards = el('div', 'cards');
  const section = el('section', 'component-solutioncard component-textcomp text-align-center', { 'data-analytics-link-region': 'card' });
  const a = el('a', '', { href });
  const image = el('div', 'image');
  const hover = el('div', 'text-hover');
  if (heading) {
    if (link) link.replaceWith(...link.childNodes); // card-as-link: no nested anchors (EW6)
    hover.append(heading);
  }
  if (desc) hover.append(desc);
  if (button) { const b = el('div', 'button'); b.append(button, svg(FA_CARD_BUTTON)); hover.append(b); }
  const pic = media(mediaCell);
  const img = el('div', 'cmp-image');
  if (pic) img.append(pic);
  image.append(hover, el('div', 'overlay'), img);
  a.append(image);
  section.append(a);
  cards.append(section);
  col.append(cards);
  return col;
}

function decorateSolutions(block, rows) {
  const column = el('div', 'column'); // the source nests the card row in a column block (its mobile spacing rule keys on it)
  const container = el('div', 'container'); // vertical spacing = section tokens (pad-top-md pad-bottom-md on the home)
  const row = el('section', 'component-column row');
  rows.forEach((cells) => row.append(solutionCard(cells)));
  container.append(row);
  column.append(container);
  block.replaceChildren(column);
}

/* ---------------- carousel (asset cards) ---------------- */
function assetCard(cells, index) {
  const [mediaCell, textCell] = cells;
  const heading = textCell.querySelector('h1, h2, h3, h4');
  const paragraphs = [...textCell.querySelectorAll('p')];
  const linkP = paragraphs.find((p) => p.querySelector('a'));
  const plain = paragraphs.filter((p) => p !== linkP && text(p));
  const order = [...textCell.querySelectorAll('p, h1, h2, h3, h4')];
  const hIdx = heading ? order.indexOf(heading) : order.length;
  const before = plain.filter((p) => order.indexOf(p) < hIdx);
  const after = plain.filter((p) => order.indexOf(p) > hIdx);
  const [label, date] = before;
  const link = linkP ? linkP.querySelector('a') : null;

  const card = el('section', 'component-assetcard no-link cmp-carousel__item list slick-slide', {
    'data-card-type': 'asset-card', 'data-analytics-link-region': 'card', 'data-slick-index': String(index), role: 'tabpanel',
  });
  if (link) card.setAttribute('data-link', link.getAttribute('href'));
  const img = el('div', 'cmp-image');
  const pic = media(mediaCell);
  if (pic) img.append(pic);
  const textWrap = el('div', 'component-text card-text');
  const labelDate = el('div', 'label-date-wrapper');
  if (label) { const lw = el('div', 'label-wrapper'); const l = el('div', 'label'); l.append(label); lw.append(l); labelDate.append(lw); }
  if (date) { const d = el('div', 'date-time'); d.append(date); labelDate.append(d); }
  const hd = el('div', 'heading-desc-wrapper');
  const h = el('div', 'heading');
  if (heading) {
    // presentation refinement inside the authored heading (EW2): the live card wraps its title
    // text in a <span>
    const span = document.createElement('span');
    span.append(...heading.childNodes);
    heading.append(span);
    h.append(heading);
  }
  hd.append(h);
  after.forEach((p) => hd.append(p));
  if (!after.length) hd.append(el('p', 'desc-empty'));
  textWrap.append(labelDate, hd);
  if (linkP) { linkP.classList.add('card-link'); link.append(svg(FA_NEWS_LINK)); textWrap.append(linkP); }
  card.append(img, textWrap);
  return card;
}

function decorateCarousel(block, rows) {
  const mq = window.matchMedia('(min-width: 730px)');
  const holder = el('section', 'cmp-carousel container carousel-holder', { 'carousel-type': 'card-carousel', 'data-cmp-is': 'carousel' }); // spacing = section tokens
  const content = el('div', 'cmp-carousel__content carousel-list-holder slick-initialized slick-slider slick-dotted', { 'container-column-layout': '3' });
  const list = el('div', 'slick-list draggable');
  const track = el('div', 'slick-track');
  const reals = rows.map((cells, i) => assetCard(cells, i));
  reals.forEach((c) => track.append(c));
  const dotsUl = el('ul', 'slick-dots', { role: 'tablist' });
  list.append(track);
  content.append(list, dotsUl);
  const nav = el('div', 'slick-nav-container');
  const prev = el('button', 'slick-prev slick-arrow', { type: 'button', 'aria-label': 'previous' });
  prev.append(svg('<svg class="svg-inline--fa fa-chevron-left" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M20.7 267.3c-6.2-6.2-6.2-16.4 0-22.6l192-192c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6L54.6 256 235.3 436.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0l-192-192z"></path></svg>'));
  const next = el('button', 'slick-next slick-arrow', { type: 'button', 'aria-label': 'next' });
  next.append(svg('<svg class="svg-inline--fa fa-chevron-right" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M299.3 244.7c6.2 6.2 6.2 16.4 0 22.6l-192 192c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6L265.4 256 84.7 75.3c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l192 192z"></path></svg>'));
  nav.append(prev, next);
  holder.append(content, nav);
  block.replaceChildren(holder);

  const state = {
    show: 1, page: 0, pages: 1, animating: false,
  };
  const pitch = () => list.clientWidth / state.show;
  const setX = (x, animate) => { track.style.transition = animate ? 'transform 0.2s ease' : 'none'; track.style.transform = `translate3d(${x}px,0,0)`; };
  function setActive(from) {
    reals.forEach((r, k) => {
      const on = k >= from && k < from + state.show;
      r.classList.toggle('slick-active', on); r.classList.toggle('slick-current', k === from);
      r.setAttribute('aria-hidden', on ? 'false' : 'true'); r.setAttribute('tabindex', on ? '0' : '-1');
    });
  }
  function renderDots() {
    dotsUl.replaceChildren();
    for (let i = 0; i < state.pages; i += 1) {
      const li = el('li', i === state.page ? 'slick-active' : '', { role: 'presentation' });
      const b = el('button', '', {
        type: 'button', role: 'tab', 'aria-label': `${i + 1} of ${state.pages}`, tabindex: i === state.page ? '0' : '-1',
      });
      if (i === state.page) b.setAttribute('aria-selected', 'true');
      b.textContent = String(i + 1);
      b.addEventListener('click', () => goTo(i)); // eslint-disable-line no-use-before-define
      li.append(b); dotsUl.append(li);
    }
  }
  function buildClones() {
    track.querySelectorAll('.is-clone').forEach((n) => n.remove());
    const n = reals.length;
    const before = document.createDocumentFragment();
    const after = document.createDocumentFragment();
    const cloneOf = (real, idx) => {
      const c = stripInstrumentation(real.cloneNode(true));
      c.classList.remove('slick-current', 'slick-active'); c.classList.add('is-clone', 'slick-cloned');
      c.setAttribute('aria-hidden', 'true'); c.setAttribute('tabindex', '-1'); c.setAttribute('data-slick-index', String(idx));
      c.querySelectorAll('a,button').forEach((a) => a.setAttribute('tabindex', '-1'));
      return c;
    };
    for (let i = n - state.show; i < n; i += 1) before.append(cloneOf(reals[i], i - n));
    for (let i = 0; i < n; i += 1) after.append(cloneOf(reals[i], n + i));
    track.insertBefore(before, reals[0]); track.append(after);
  }
  function goTo(page) {
    if (state.animating) return;
    const n = reals.length; const { show } = state; const p = pitch();
    const mark = () => { setActive(state.page * show); renderDots(); };
    const finish = () => { state.animating = false; };
    state.animating = true;
    if (page >= state.pages) {
      state.page = 0;
      mark();
      setX(-(show + n) * p, true);
      setTimeout(() => { setX(-show * p, false); finish(); }, 220);
      return;
    }
    if (page < 0) {
      state.page = state.pages - 1;
      mark();
      setX(0, true);
      setTimeout(() => { setX(-(show + state.page * show) * p, false); finish(); }, 220);
      return;
    }
    state.page = page; mark(); setX(-(show + page * show) * p, true); setTimeout(finish, 220);
  }
  function layout() {
    state.show = mq.matches ? 3 : 1;
    buildClones();
    state.pages = Math.ceil(reals.length / state.show);
    state.page = Math.min(state.page, state.pages - 1);
    setActive(state.page * state.show);
    renderDots();
    setX(-(state.show + state.page * state.show) * pitch(), false);
  }
  prev.addEventListener('click', () => goTo(state.page - 1));
  next.addEventListener('click', () => goTo(state.page + 1));
  const reposition = () => setX(-(state.show + state.page * state.show) * pitch(), false);
  layout();
  mq.addEventListener('change', layout);
  window.addEventListener('resize', reposition);
  // decorate() can run while the section is still hidden (pitch 0): re-place the track once
  // the block has a size
  if ('ResizeObserver' in window) new ResizeObserver(reposition).observe(block);

  // site JS: when the heading needs 5 clamped lines the description is hidden, otherwise clamped
  const hideDesc = () => {
    track.querySelectorAll('.component-assetcard').forEach((card) => {
      const h = card.querySelector('.heading'); const p = card.querySelector('.heading-desc-wrapper p');
      if (!h || !p) return;
      const lineHeight = parseFloat(getComputedStyle(h).lineHeight) || 23;
      const lines = Math.round(h.getBoundingClientRect().height / lineHeight);
      card.classList.toggle('hide-desc', lines >= 5);
    });
  };
  hideDesc();
  window.addEventListener('resize', hideDesc);
}

/* ---- panels (landing "What's New": fixed groups of three asset cards, fading between
   panels) ---- */
const FA_PREV = '<svg class="svg-inline--fa fa-chevron-left" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M15 239c-9.4 9.4-9.4 24.6 0 33.9L207 465c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L65.9 256 241 81c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L15 239z"></path></svg>';
const FA_NEXT = '<svg class="svg-inline--fa fa-chevron-right" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M305 239c9.4 9.4 9.4 24.6 0 33.9L113 465c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l175-175L79 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L305 239z"></path></svg>';

function decoratePanels(block, rows) {
  const per = 3;
  const holder = el('section', 'cmp-carousel container carousel-holder', { 'carousel-type': 'content-carousel', 'data-cmp-is': 'carousel' });
  const content = el('div', 'cmp-carousel__content carousel-list-holder slick-initialized slick-slider slick-dotted');
  const list = el('div', 'slick-list');
  const track = el('div', 'slick-track');
  const panels = [];
  for (let i = 0; i < rows.length; i += per) {
    const k = panels.length;
    const slide = el('div', 'cmp-carousel__item list slick-slide', {
      id: `slick-slide0${k}`, 'data-slick-index': String(k), role: 'tabpanel', 'aria-describedby': `slick-slide-control0${k}`,
    });
    const column = el('div', 'column');
    const bg = el('div', 'background-component vert-pad-top-sm');
    const container = el('div', 'container');
    const row = el('section', 'component-column row');
    rows.slice(i, i + per).forEach((cells, j) => {
      const col = el('div', 'col-xs-12 col-sm-4 three');
      const grid = el('div', 'aem-Grid');
      const host = el('div', 'cards image');
      const card = assetCard(cells, i + j);
      card.className = 'component-assetcard no-link';
      ['data-slick-index', 'role', 'tabindex', 'aria-hidden'].forEach((attr) => card.removeAttribute(attr));
      host.append(card);
      grid.append(host);
      col.append(grid);
      row.append(col);
    });
    container.append(row);
    bg.append(container);
    column.append(bg);
    slide.append(column);
    track.append(slide);
    panels.push(slide);
  }
  list.append(track);
  const dotsUl = el('ul', 'slick-dots', { role: 'tablist' });
  content.append(list, dotsUl);
  const nav = el('div', 'slick-nav-container');
  const prev = el('button', 'slick-prev slick-arrow', { type: 'button', 'aria-label': 'previous' });
  prev.append(svg(FA_PREV));
  const next = el('button', 'slick-next slick-arrow', { type: 'button', 'aria-label': 'next' });
  next.append(svg(FA_NEXT));
  nav.append(prev, next);
  holder.append(content, nav, el('div'), el('div'));
  const scope = el('div', 'carousel panelcontainer'); // the source scopes the fade rules on this pair
  scope.append(holder);
  block.replaceChildren(scope);

  let cur = 0;
  const dots = panels.map((p, k) => { const li = el('li', '', { role: 'presentation' }); li.addEventListener('click', () => show(k)); dotsUl.append(li); return li; }); // eslint-disable-line no-use-before-define
  function show(i) {
    cur = (i + panels.length) % panels.length;
    panels.forEach((p, k) => {
      const on = k === cur;
      p.classList.toggle('slick-active', on); p.classList.toggle('slick-current', on); p.classList.toggle('cmp-carousel__item--active', on);
      p.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dots.forEach((d, k) => d.classList.toggle('slick-active', k === cur));
  }
  prev.addEventListener('click', () => show(cur - 1));
  next.addEventListener('click', () => show(cur + 1));
  show(0);
}

/* ==== listing family variants (stardust/scripts/eds/listing) ==== */

/* ---- blog: the "Recent Stories" blog-card carousel (source: cmp-dynamiccards / component-card-b,
   slick, 3 per view from 730px, one centred card below, infinite via clones — observed live).
   Authoring rows, one per card, two cells: <p><img></p> | <p>3 min read / Sep 15, 2026</p>,
   <h3><a href>title</a></h3>, <p><img headshot(s)> By <a>Author</a></p>,
   <p>Tags: <a>…</a>, <a>…</a></p>, <p><a href>Read Article</a></p>.
   Authored nodes are MOVED (EW1); clones are stripped (EW4). ---- */
const FA_CTA_CHEVRON = '<svg class="svg-inline--fa fa-chevron-right" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M299.3 244.7c6.2 6.2 6.2 16.4 0 22.6l-192 192c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6L265.4 256 84.7 75.3c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l192 192z"></path></svg>';

function blogCard(cells) {
  const [mediaCell, textCell] = cells;
  const heading = textCell.querySelector('h1, h2, h3, h4');
  const order = [...textCell.children];
  const hIdx = heading ? order.indexOf(heading) : -1;
  const before = order.slice(0, Math.max(hIdx, 0)).filter((n) => n.matches('p'));
  const after = order.slice(hIdx + 1).filter((n) => n.matches('p'));
  const link = heading ? heading.querySelector('a') : null;
  const href = link ? link.getAttribute('href') : '#';
  const authorP = after.find((p) => p.querySelector('picture, img'));
  const rest = after.filter((p) => p !== authorP);
  const ctaP = rest.length && rest[rest.length - 1].querySelector('a') && rest[rest.length - 1].textContent.trim() === rest[rest.length - 1].querySelector('a').textContent.trim() ? rest[rest.length - 1] : null;
  const tagsP = rest.find((p) => p !== ctaP);

  const col = el('div', 'card-col col-xs-12 col-sm-4 carousel-slide slick-slide');
  if (href) col.setAttribute('data-link', href);
  const card = el('div', 'component-card-b no-link');
  const imageWrap = el('div', 'image-wrapper');
  const imgLink = el('a', '', { href });
  const pic = media(mediaCell);
  if (pic) { const img = pic.querySelector('img') || pic; img.setAttribute('loading', 'lazy'); imgLink.append(pic); }
  imageWrap.append(imgLink);
  const textWrap = el('div', 'component-text card-text');
  const labelDate = el('div', 'label-date-wrapper');
  const dateTime = el('div', 'date-time');
  before.forEach((p) => dateTime.append(p));
  labelDate.append(dateTime);
  textWrap.append(labelDate);
  if (heading) {
    const h = el('div', 'heading');
    if (link) { const span = document.createElement('span'); span.append(...link.childNodes); link.append(span); } // live clamps the title in a span (EW2 refinement)
    h.append(heading);
    textWrap.append(h);
  }
  if (authorP) {
    const info = el('div', 'author-info');
    const pics = [...authorP.querySelectorAll('picture, img')].filter((m) => !(m.tagName === 'IMG' && m.closest('picture')));
    const circle = el('div', `profile-circle ${['one', 'two', 'three'][Math.min(pics.length, 3) - 1] || 'one'}`);
    pics.forEach((p) => { const d = el('div'); d.append(p); circle.append(d); });
    const links = el('div', 'authors-links');
    links.append(authorP);
    info.append(circle, links);
    textWrap.append(info);
  }
  if (tagsP) { const t = el('div', 'tag-holder'); t.append(tagsP); textWrap.append(t); }
  if (ctaP) {
    const cta = el('div', 'cta');
    const a = ctaP.querySelector('a');
    const span = document.createElement('span');
    span.append(...a.childNodes);
    a.append(span, svg(FA_CTA_CHEVRON));
    cta.append(ctaP);
    textWrap.append(cta);
  }
  card.append(imageWrap, textWrap);
  col.append(card);
  return col;
}

function decorateBlog(block, rows) {
  const mq = window.matchMedia('(min-width: 730px)');
  const column = el('div', 'column');
  const outer = el('div', 'container');
  const outerRow = el('section', 'component-column row');
  const outerCol = el('div', 'col-xs-12');
  const dc = el('div', 'cmp-dynamiccards component-card-container col-3 card-size-medium', { 'data-analytics-link-region': 'card' });
  const container = el('div', 'container');
  const section = el('section');
  const row = el('div', 'row component-content-carousel horizontal-stack mobile-center-mode slick-carousel', { 'data-slides-to-show': '3' });
  const prev = el('button', 'slick-prev slick-arrow', { type: 'button', 'aria-label': 'Previous' });
  prev.append(svg(FA_PREV));
  const list = el('div', 'slick-list draggable');
  const track = el('div', 'slick-track');
  const reals = rows.map(blogCard);
  reals.forEach((c) => track.append(c));
  list.append(track);
  const next = el('button', 'slick-next slick-arrow', { type: 'button', 'aria-label': 'Next' });
  next.append(svg(FA_NEXT));
  const dotsUl = el('ul', 'slick-dots', { role: 'tablist' });
  row.append(prev, list, next, dotsUl);
  section.append(row);
  container.append(section);
  dc.append(container);
  outerCol.append(dc);
  outerRow.append(outerCol);
  outer.append(outerRow);
  column.append(outer);
  block.replaceChildren(column);

  const state = {
    show: 3, pre: 3, page: 0, pages: 1, animating: false, clones: [],
  };
  const slideW = () => (mq.matches ? list.clientWidth / 3 : 260);
  const setX = (x, animate) => { track.style.transition = animate ? 'transform 0.5s ease' : 'none'; track.style.transform = `translate3d(${x}px,0,0)`; };
  const cloneOf = (real, idx) => { const c = stripInstrumentation(real.cloneNode(true)); c.classList.add('slick-cloned'); c.classList.remove('slick-active', 'slick-current'); c.setAttribute('aria-hidden', 'true'); c.setAttribute('data-slick-index', String(idx)); c.querySelectorAll('a,button').forEach((a) => a.setAttribute('tabindex', '-1')); return c; };
  function mark() {
    const start = state.page * state.show;
    reals.forEach((s, k) => { const on = k >= start && k < start + state.show; s.classList.toggle('slick-active', on); s.classList.toggle('slick-current', k === start); s.setAttribute('aria-hidden', on ? 'false' : 'true'); });
    dotsUl.replaceChildren();
    for (let i = 0; i < state.pages; i += 1) {
      const li = el('li', i === state.page ? 'slick-active' : '', { role: 'presentation' });
      const b = el('button', '', { type: 'button', role: 'tab', 'aria-label': `${i + 1} of ${state.pages}` });
      b.textContent = String(i + 1);
      b.addEventListener('click', () => goTo(i)); // eslint-disable-line no-use-before-define
      li.append(b);
      dotsUl.append(li);
    }
  }
  function build() {
    state.clones.forEach((c) => c.remove()); state.clones = [];
    const n = reals.length;
    // live: 15 slides at 1440 (3 clones + 6 + 6), 14 at 360 (2 + 6 + 6)
    state.show = mq.matches ? 3 : 1;
    state.pre = mq.matches ? 3 : 2;
    for (let i = n - state.pre; i < n; i += 1) {
      const c = cloneOf(reals[(i + n) % n], i - n);
      track.insertBefore(c, reals[0]);
      state.clones.push(c);
    }
    for (let j = 0; j < n; j += 1) {
      const d = cloneOf(reals[j], n + j);
      track.append(d);
      state.clones.push(d);
    }
    if (mq.matches) { // live drops the arrows at ≤729
      if (!prev.isConnected) row.insertBefore(prev, list);
      if (!next.isConnected) row.insertBefore(next, dotsUl);
    } else { prev.remove(); next.remove(); }
    [...track.children].forEach((s) => { s.style.width = `${slideW()}px`; });
    state.pages = Math.ceil(n / state.show); state.page = Math.min(state.page, state.pages - 1);
    mark(); setX(-(state.pre + state.page * state.show) * slideW(), false);
  }
  function goTo(page) {
    if (state.animating) return;
    const n = reals.length; const { show } = state; const w = slideW();
    state.animating = true;
    const done = (x) => setTimeout(() => {
      if (x !== undefined) setX(x, false);
      state.animating = false;
    }, 520);
    if (page >= state.pages) {
      state.page = 0; mark(); setX(-(state.pre + n) * w, true); done(-state.pre * w);
      return;
    }
    if (page < 0) {
      state.page = state.pages - 1; mark(); setX(-(state.pre - show) * w, true);
      done(-(state.pre + state.page * show) * w);
      return;
    }
    state.page = page; mark(); setX(-(state.pre + page * show) * w, true); done();
  }
  prev.addEventListener('click', () => goTo(state.page - 1));
  next.addEventListener('click', () => goTo(state.page + 1));
  const reposition = () => { [...track.children].forEach((s) => { s.style.width = `${slideW()}px`; }); setX(-(state.pre + state.page * state.show) * slideW(), false); };
  build();
  mq.addEventListener('change', build);
  window.addEventListener('resize', reposition);
  if ('ResizeObserver' in window) new ResizeObserver(reposition).observe(block); // decorate() may run while the section is hidden (pitch 0)
}

/* ---- tiles: the newsroom "content tiles" (source: component-content-tile) — a linked row of
   picture, type, date and title; variant `spotlight` frames the tiles in the "Featured Story" box
   whose title is the section head authored as default content before the block (reabsorbed, EW8).
   Authoring rows, one per
   tile, two cells: <p><img></p> | <p>News</p>, <p>Aug 26, 2026</p>, <h3><a href>title</a></h3>.
   The whole tile is the link (the authored inner anchor is unwrapped, EW6); the date shows once
   (desktop slot) and repeats as a stripped clone in the mobile slot (EW4). ---- */
function contentTile(cells) {
  const [mediaCell, textCell] = cells;
  const heading = textCell.querySelector('h1, h2, h3, h4');
  const link = heading ? heading.querySelector('a') : textCell.querySelector('a');
  const href = link ? link.getAttribute('href') : '#';
  const target = link ? link.getAttribute('target') : null;
  if (link) link.replaceWith(...link.childNodes);
  const paragraphs = [...textCell.querySelectorAll('p')].filter((p) => p.textContent.trim());
  const [typeP, dateP] = paragraphs;
  const host = el('div', 'contentTile image');
  const container = el('div', 'container');
  const section = el('section', 'component-content-tile more-padding-20', { 'data-card-type': 'content-tile', 'data-analytics-link-region': 'card' });
  const a = el('a', '', { href });
  if (target) a.target = target;
  const tile = el('div', 'content-tile-container');
  const left = el('div', 'content-tile-left-col');
  const imgWrap = el('div', 'content-tile-img');
  const ci = el('div', 'component-image');
  const cmp = el('div', 'cmp-image');
  const pic = media(mediaCell);
  if (pic) { const img = pic.querySelector('img') || pic; img.classList.add('img-responsive'); img.setAttribute('loading', 'lazy'); cmp.append(pic); }
  ci.append(cmp);
  imgWrap.append(ci);
  const dateDesk = el('div', 'content-tile-date-desktop');
  if (dateP) dateDesk.append(dateP);
  left.append(imgWrap, dateDesk);
  const right = el('div', 'content-tile-right-col');
  const typeRow = el('div', 'content-tile-type-row');
  const dateMob = el('div', 'content-tile-date-mobile');
  if (dateP) dateMob.append(stripInstrumentation(dateP.cloneNode(true)));
  const type = el('div', 'content-tile-type');
  if (typeP) type.append(typeP);
  typeRow.append(dateMob, type);
  const title = el('div', 'content-tile-title');
  if (heading) title.append(heading);
  right.append(typeRow, title);
  tile.append(left, right);
  a.append(tile);
  section.append(a);
  container.append(section);
  host.append(container);
  return host;
}

function decorateTiles(block, rows) {
  const grid = el('div', 'aem-Grid');
  rows.forEach((cells) => grid.append(contentTile(cells)));
  if (!block.classList.contains('spotlight')) { block.replaceChildren(grid); return; }
  const host = el('div', 'spotlight');
  const container = el('div', 'container');
  const section = el('section', 'component-spotlight spotlight-header-left', { 'data-analytics-link-region': 'banner' });
  const titleRow = el('div', 'row');
  const title = el('div', 'spotlight-title');
  const prev = block.parentElement ? block.parentElement.previousElementSibling : null;
  if (prev && prev.classList.contains('default-content-wrapper')) {
    const h = prev.querySelector('h1, h2, h3, h4, h5, h6');
    if (h) title.append(h);
    if (!prev.children.length) prev.remove();
  }
  titleRow.append(title);
  const bodyRow = el('div', 'row');
  const bodyCol = el('div');
  bodyCol.append(grid);
  bodyRow.append(bodyCol);
  section.append(titleRow, bodyRow);
  container.append(section);
  host.append(container);
  block.replaceChildren(host);
}

/* ---- events: the events page "Upcoming Events" cards (source: component-eventcard) — picture,
   event name, type / location / date and a "Learn more" link, stacked in two columns (first half
   left, rest
   right, as the source authored them). Authoring rows, one per event, two cells:
   <p><img></p> | <h3>Event</h3>, <p>In-Person</p>, <p>Santa Clara, CA</p>,
   <p>September 15-17, 2026</p>,
   <p><a href>Learn more</a></p>. Authored nodes are MOVED (EW1). ---- */
function eventCard(cells) {
  const [mediaCell, textCell] = cells;
  const heading = textCell.querySelector('h1, h2, h3, h4');
  const paragraphs = [...textCell.querySelectorAll('p')];
  const ctaP = paragraphs.find((p) => p.querySelector('a'));
  const meta = paragraphs.filter((p) => p !== ctaP && p.textContent.trim());
  const href = ctaP && ctaP.querySelector('a') ? ctaP.querySelector('a').getAttribute('href') : null;
  const host = el('div', 'cards image');
  const container = el('div', 'container');
  const section = el('section', 'component-eventcard no-link', { 'data-card-type': 'event-card', 'data-analytics-link-region': 'card' });
  if (href) section.setAttribute('data-link', href);
  const contents = el('div', 'event-contents');
  const cmp = el('div', 'cmp-image');
  const pic = media(mediaCell);
  if (pic) { const img = pic.querySelector('img') || pic; img.setAttribute('loading', 'lazy'); cmp.append(pic); }
  const textWrap = el('div', 'event-text-container');
  const header = el('div', 'event-header');
  if (heading) header.append(heading);
  const tld = el('div', 'type-loc-date-wrapper');
  ['event-type', 'event-location', 'event-date'].forEach((cls, i) => { if (meta[i]) { const d = el('div', cls); d.append(meta[i]); tld.append(d); } });
  textWrap.append(header, tld);
  if (ctaP) { const a = ctaP.querySelector('a'); a.append(' ', svg(FA_CTA_CHEVRON)); const cta = el('div', 'event-cta'); cta.append(ctaP); textWrap.append(cta); }
  contents.append(cmp, textWrap);
  section.append(contents);
  container.append(section);
  host.append(container);
  return host;
}

function decorateEvents(block, rows) {
  const column = el('div', 'column');
  const container = el('div', 'container');
  const row = el('section', 'component-column row');
  const half = Math.ceil(rows.length / 2);
  [rows.slice(0, half), rows.slice(half)].forEach((group) => {
    const col = el('div', 'col-xs-12 col-sm-6');
    const grid = el('div', 'aem-Grid');
    group.forEach((cells) => grid.append(eventCard(cells)));
    col.append(grid);
    row.append(col);
  });
  container.append(row);
  column.append(container);
  block.replaceChildren(column);
}

/* ---- static (static family): asset cards in a fixed bootstrap grid — 3 per row (`three`), 2 per
   row (col-sm-6) or 4 (`four`) by card count; one row per card: picture | [<p>label</p>]
   <h4>heading</h4> <p>copy</p> <p><a>Learn More</a></p>. The source keeps an invisible label
   pill on label-less cards (it reserves the pill's height), reproduced here. Spacing = tokens. */
function decorateStatic(block, rows) {
  const column = el('div', 'column');
  const container = el('div', 'container');
  const row = el('section', 'component-column row');
  const spans = { 2: 'col-xs-12 col-sm-6', 4: 'col-xs-12 col-sm-3 four' };
  const span = spans[rows.length] || 'col-xs-12 col-sm-4 three';
  rows.forEach((cells, i) => {
    const col = el('div', span);
    const grid = el('div', 'aem-Grid');
    const host = el('div', 'cards image');
    const card = assetCard(cells.length > 1 ? cells : [null, cells[0]], i);
    card.className = 'component-assetcard no-link';
    ['data-slick-index', 'role', 'tabindex', 'aria-hidden'].forEach((attr) => {
      card.removeAttribute(attr);
    });
    const link = card.querySelector('.card-text a svg');
    if (link) link.before(' '); // the source keeps a space before the chevron
    const labelDate = card.querySelector('.label-date-wrapper');
    if (labelDate && !labelDate.querySelector('.label-wrapper')) {
      const lw = el('div', 'label-wrapper invisible');
      lw.append(el('div', 'label'));
      labelDate.prepend(lw);
    }
    host.append(card);
    grid.append(host);
    col.append(grid);
    row.append(col);
  });
  container.append(row);
  column.append(container);
  block.replaceChildren(column);
}

/* ---- assets (category landing pages): a static row of asset cards, 2/3/4 per row by count. Same
   authoring as
   `panels`; a Brightcove card authors <p><a href="<player url>"><picture poster></a></p> as its
      media — rendered
   as the source's inline player frame (poster + play control; the control links to the player, no
      modal observed). ---- */
const FA_PLAY = '<svg class="svg-inline--fa fa-play" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path></svg>';

function videoMedia(link, pic) {
  const video = el('div', 'cmp-video', { 'data-provider': 'Brightcove', 'data-mode': 'modal' });
  const container = el('div', 'cmp-video__player-container embed-responsive embed-responsive-16by9');
  const thumb = el('a', 'cmp-video__thumbnail', {
    href: link.getAttribute('href'), target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'Play Video',
  });
  const button = el('div', 'video-button-container video-button');
  button.append(svg(FA_PLAY));
  thumb.append(button);
  const inlineP = el('div', 'cmp-video__player--inline embed-responsive-item');
  const player = el('div', 'embed-responsive-item video-js vjs-paused vjs-dock', { role: 'region', 'aria-label': 'Video Player' });
  const poster = el('div', 'vjs-poster');
  if (pic) poster.append(pic);
  player.append(poster);
  inlineP.append(player);
  container.append(thumb, inlineP);
  video.append(container);
  return video;
}

function decorateAssets(block, rows) {
  const n = rows.length;
  let colClass = 'col-xs-12';
  if (n === 2) colClass = 'col-xs-12 col-sm-6';
  else if (n === 3) colClass = 'col-xs-12 col-sm-4 three';
  else if (n >= 4) colClass = 'col-xs-12 col-sm-3 four';
  const column = el('div', 'column');
  const container = el('div', 'container');
  const row = el('section', 'component-column row');
  rows.forEach((cells, i) => {
    const [mediaCell] = cells;
    const link = mediaCell ? mediaCell.querySelector('a') : null;
    const card = assetCard(cells, i);
    card.className = link ? 'component-assetcard' : 'component-assetcard no-link';
    ['data-slick-index', 'role', 'tabindex', 'aria-hidden'].forEach((attr) => card.removeAttribute(attr));
    if (link) {
      const img = card.querySelector('.cmp-image');
      const pic = img ? img.querySelector('picture, img') : null;
      const video = videoMedia(link, pic);
      if (img) img.replaceWith(video); else card.prepend(video);
    }
    const col = el('div', colClass);
    const grid = el('div', 'aem-Grid');
    const host = el('div', 'cards image');
    host.append(card);
    grid.append(host);
    col.append(grid);
    row.append(col);
  });
  container.append(row);
  column.append(container);
  block.replaceChildren(column);
}

/* ---- dynamic (category landing pages): the webinar cards of the source's dynamicCards component
   (card-b),
   a slick row of 3 (1 centred below 730) with arrows + dots, 3 (2) clones per side, transform
      0.5s — as observed
   (stardust/prototypes/js/listing.js). Authoring rows — one per card, two cells:
   1. <p><a href><picture></a></p> 2. [<p>label</p>] <p>date</p>, <h4><a>heading</a></h4>, author
      <picture>s (one
   per <p>), <p>Featuring <a>author</a>, …</p>, [<p>tags</p>], <p><a>CTA</a></p>. Nodes are MOVED
      (EW1); the
   author-circle count follows the author pictures, or the names in the Featuring line when no
      pictures exist. ---- */
function dynamicCard(cells, index) {
  const [mediaCell, textCell] = cells;
  const pic = media(mediaCell);
  const imgLink = mediaCell ? mediaCell.querySelector('a') : null;
  const heading = textCell.querySelector('h1, h2, h3, h4');
  const paragraphs = [...textCell.querySelectorAll('p')];
  const picPs = paragraphs.filter((p) => p.querySelector('picture, img'));
  const rest = paragraphs.filter((p) => !picPs.includes(p) && text(p));
  const lone = (p) => { const a = p.querySelector('a'); return a && p.children.length === 1 && text(p) === text(a); };
  const ctaP = [...rest].reverse().find(lone);
  const others = rest.filter((p) => p !== ctaP);
  const order = [...textCell.querySelectorAll('p, h1, h2, h3, h4')];
  const hIdx = heading ? order.indexOf(heading) : order.length;
  const before = others.filter((p) => order.indexOf(p) < hIdx);
  const after = others.filter((p) => order.indexOf(p) > hIdx);
  const dateP = before[before.length - 1];
  const labelP = before.find((p) => p !== dateP);
  const featuring = after.find((p) => /^featuring/i.test(text(p))) || after[0];
  const tagsP = after.find((p) => p !== featuring);
  const headingLink = heading ? heading.querySelector('a') : null;
  const target = imgLink || headingLink || (ctaP ? ctaP.querySelector('a') : null);
  const col = el('div', 'card-col col-xs-12 col-sm-4 carousel-slide slick-slide', { 'data-slick-index': String(index) });
  if (target) col.dataset.link = target.getAttribute('href');
  const card = el('div', 'component-card-b no-link');
  const wrap = el('div', 'image-wrapper');
  if (pic) wrap.append(pic.closest('p') || pic);
  card.append(wrap);
  const body = el('div', 'component-text card-text');
  const ld = el('div', 'label-date-wrapper');
  if (labelP) { const l = el('div', 'label'); l.append(labelP); ld.append(l); }
  if (dateP) { const d = el('div', 'date-time'); d.append(dateP); ld.append(d); }
  body.append(ld);
  if (heading) {
    // presentation refinement inside the authored heading (EW2): the source wraps the title text
    // in a <span>
    const span = el('span');
    const holder = headingLink || heading;
    span.append(...holder.childNodes);
    holder.append(span);
    body.append(heading);
  }
  const n = picPs.length || (featuring ? text(featuring).replace(/^featuring/i, '').split(',').filter((x) => x.trim()).length : 0);
  if (n || featuring) {
    const info = el('div', 'author-info');
    const circle = el('div', `profile-circle ${['one', 'one', 'two', 'three'][Math.min(n, 3)]}`);
    for (let k = 0; k < Math.max(1, Math.min(n, 3)); k += 1) {
      const d = el('div');
      if (picPs[k]) d.append(picPs[k].querySelector('picture, img'));
      circle.append(d);
    }
    info.append(circle);
    if (featuring) { const links = el('div', 'authors-links'); links.append(featuring); info.append(links); }
    body.append(info);
  }
  if (tagsP) { const th = el('div', 'tag-holder'); th.append(tagsP); body.append(th); }
  if (ctaP) {
    const cta = el('div', 'cta');
    const a = ctaP.querySelector('a');
    const span = el('span');
    span.append(...a.childNodes);
    a.append(span, svg(FA_NEWS_LINK));
    cta.append(ctaP);
    body.append(cta);
  }
  card.append(body);
  col.append(card);
  return col;
}

function decorateDynamic(block, rows) {
  const mq = window.matchMedia('(min-width: 730px)');
  const host = el('div', 'dynamicCards');
  const container = el('div', 'container');
  const section = el('section', 'cmp-dynamiccards component-card-container col-3 card-size-medium', { 'data-analytics-link-region': 'card' });
  const row = el('div', 'row component-content-carousel horizontal-stack mobile-center-mode slick-carousel', { 'data-slides-to-show': '3' });
  const prev = el('button', 'slick-prev slick-arrow', { type: 'button', 'aria-label': 'Previous' });
  prev.append(svg(FA_PREV));
  const next = el('button', 'slick-next slick-arrow', { type: 'button', 'aria-label': 'Next' });
  next.append(svg(FA_NEXT));
  const list = el('div', 'slick-list draggable');
  const track = el('div', 'slick-track');
  const dotsUl = el('ul', 'slick-dots', { role: 'tablist' });
  const reals = rows.map((cells, i) => dynamicCard(cells, i));
  reals.forEach((c) => track.append(c));
  list.append(track);
  row.append(prev, list, next, dotsUl);
  section.append(row);
  container.append(section);
  host.append(container);
  block.replaceChildren(host);

  const state = {
    show: 3, pre: 3, page: 0, pages: 1, animating: false, clones: [],
  };
  const slideW = () => (mq.matches ? list.clientWidth / 3 : 260);
  const setX = (x, animate) => { track.style.transition = animate ? 'transform 0.5s ease' : 'none'; track.style.transform = `translate3d(${x}px,0,0)`; };
  const rest = () => -(state.pre + state.page * state.show) * slideW();
  function mark() {
    const start = state.page * state.show;
    reals.forEach((s, k) => { const on = k >= start && k < start + state.show; s.classList.toggle('slick-active', on); s.classList.toggle('slick-current', k === start); s.setAttribute('aria-hidden', on ? 'false' : 'true'); });
    dotsUl.replaceChildren();
    for (let i = 0; i < state.pages; i += 1) {
      const li = el('li', i === state.page ? 'slick-active' : '', { role: 'presentation' });
      const b = el('button', '', { type: 'button', role: 'tab', 'aria-label': `${i + 1} of ${state.pages}` });
      b.textContent = String(i + 1);
      b.addEventListener('click', () => goTo(i)); // eslint-disable-line no-use-before-define
      li.append(b);
      dotsUl.append(li);
    }
  }
  function goTo(page) {
    if (state.animating) return;
    const n = reals.length;
    const w = slideW();
    state.animating = true;
    const finish = () => { state.animating = false; };
    if (page >= state.pages) {
      state.page = 0; mark(); setX(-(state.pre + n) * w, true);
      setTimeout(() => { setX(rest(), false); finish(); }, 520);
      return;
    }
    if (page < 0) {
      state.page = state.pages - 1; mark(); setX(-(state.pre - state.show) * w, true);
      setTimeout(() => { setX(rest(), false); finish(); }, 520);
      return;
    }
    state.page = page; mark(); setX(rest(), true); setTimeout(finish, 520);
  }
  function build() {
    state.clones.forEach((c) => c.remove());
    state.clones = [];
    const n = reals.length;
    state.show = mq.matches ? 3 : 1;
    state.pre = mq.matches ? 3 : 2;
    const cloneOf = (real, idx) => { const c = stripInstrumentation(real.cloneNode(true)); c.classList.add('slick-cloned'); c.setAttribute('aria-hidden', 'true'); c.setAttribute('data-slick-index', String(idx)); c.querySelectorAll('a,button').forEach((a) => a.setAttribute('tabindex', '-1')); return c; };
    for (let i = n - state.pre; i < n; i += 1) {
      const c = cloneOf(reals[(i + n) % n], i - n);
      track.insertBefore(c, reals[0]);
      state.clones.push(c);
    }
    for (let j = 0; j < n; j += 1) {
      const c = cloneOf(reals[j], n + j);
      track.append(c);
      state.clones.push(c);
    }
    // slick drops the arrows below 730 (responsive arrows:false — observed)
    if (mq.matches) {
      if (!prev.isConnected) row.insertBefore(prev, list);
      if (!next.isConnected) row.insertBefore(next, dotsUl);
    } else { prev.remove(); next.remove(); }
    [...track.children].forEach((s) => { s.style.width = `${slideW()}px`; });
    state.pages = Math.ceil(n / state.show);
    state.page = Math.min(state.page, state.pages - 1);
    mark();
    setX(rest(), false);
  }
  const relayout = () => { [...track.children].forEach((s) => { s.style.width = `${slideW()}px`; }); setX(rest(), false); };
  prev.addEventListener('click', () => goTo(state.page - 1));
  next.addEventListener('click', () => goTo(state.page + 1));
  build();
  mq.addEventListener('change', build);
  window.addEventListener('resize', relayout);
  // decorate() can run while the section is still hidden (list width 0): re-place the track once
  // the block has a size
  if ('ResizeObserver' in window) new ResizeObserver(relayout).observe(block);
}

/* ---- grid (landing family): static rows of asset cards — variant two|three|four = cards per row
   (the source's
   column[assetCard × N] rows and the nested column[column[card|card]|column[card|card]] 2×2 rows,
   flattened to one row
   of slots). Same authoring rows as panels/carousel (picture | label, date, heading, description,
   link; an image-less card
   has an empty first cell). Tier: reconstructive; authored nodes are MOVED (EW1). ---- */
function decorateGrid(block, rows) {
  let per = 3;
  if (block.classList.contains('two')) per = 2;
  else if (block.classList.contains('four')) per = 4;
  const colClass = { 4: 'col-xs-12 col-sm-3 four', 3: 'col-xs-12 col-sm-4 three' }[per] || 'col-xs-12 col-sm-6';
  const column = el('div', 'column');
  const container = el('div', 'container');
  let row = null;
  rows.forEach((cells, i) => {
    if (i % per === 0) { row = el('section', 'component-column row'); container.append(row); }
    const col = el('div', colClass);
    const grid = el('div', 'aem-Grid');
    const host = el('div', 'cards image');
    const card = assetCard(cells, i);
    card.className = 'component-assetcard no-link';
    ['data-slick-index', 'role', 'tabindex', 'aria-hidden'].forEach((attr) => card.removeAttribute(attr));
    // an image-less card has NO .cmp-image on the source (its .card-text keeps the 32px top
    // padding; `.cmp-image + .card-text` is the 20px case) and keeps an EMPTY label wrapper (an
    // inline box with 4px+4px padding — 8px on the live card)
    const ci = card.querySelector('.cmp-image');
    if (ci && !ci.querySelector('picture, img')) ci.remove();
    const ldw = card.querySelector('.label-date-wrapper');
    if (ldw && !ldw.children.length) {
      const lw = el('div', 'label-wrapper');
      lw.append(el('div', 'label'));
      ldw.append(lw);
    }
    host.append(card);
    grid.append(host);
    col.append(grid);
    row.append(col);
  });
  column.append(container);
  block.replaceChildren(column);
  // site JS: when the heading needs 5 clamped lines the description is hidden (same rule as the
  // carousel)
  const hideDesc = () => {
    block.querySelectorAll('.component-assetcard').forEach((card) => {
      const h = card.querySelector('.heading'); const p = card.querySelector('.heading-desc-wrapper p');
      if (!h || !p) return;
      const lineHeight = parseFloat(getComputedStyle(h).lineHeight) || 23;
      const lines = Math.round(h.getBoundingClientRect().height / lineHeight);
      card.classList.toggle('hide-desc', lines >= 5);
      // decoded from the captured inline styles on every landing capture: the description gets
      // 5 − <heading lines> clamped lines (1-line heading → 4, 2 → 3, 3 → 2, 4 → 1)
      p.style.webkitLineClamp = String(Math.max(1, 5 - lines));
    });
  };
  hideDesc();
  window.addEventListener('resize', hideDesc);
  if ('ResizeObserver' in window) new ResizeObserver(hideDesc).observe(block);
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children]).filter((cells) => cells.length);
  if (!rows.length) return;
  if (block.classList.contains('static')) {
    decorateStatic(block, rows);
    return;
  }
  if (block.classList.contains('blog')) { decorateBlog(block, rows); return; } // listing family variants
  if (block.classList.contains('tiles')) { decorateTiles(block, rows); return; }
  if (block.classList.contains('events')) { decorateEvents(block, rows); return; }
  if (block.classList.contains('assets')) decorateAssets(block, rows);
  else if (block.classList.contains('dynamic')) decorateDynamic(block, rows);
  else if (block.classList.contains('grid')) decorateGrid(block, rows);
  else if (block.classList.contains('panels')) decoratePanels(block, rows);
  else if (block.classList.contains('carousel')) decorateCarousel(block, rows);
  else decorateSolutions(block, rows);
  // listing family: solution-card rows of two / three (source col-sm-6 / col-sm-4 three)
  if (block.classList.contains('two') || block.classList.contains('three')) {
    const span = block.classList.contains('two') ? ['col-sm-6'] : ['col-sm-4', 'three'];
    block.querySelectorAll('.col-sm-3.four').forEach((c) => { c.classList.remove('col-sm-3', 'four'); c.classList.add(...span); });
  }
}
