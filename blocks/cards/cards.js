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
  const wrap = el('div', 'background-component vert-pad-top-md vert-pad-bottom-md');
  const container = el('div', 'container');
  const row = el('section', 'component-column row');
  rows.forEach((cells) => row.append(solutionCard(cells)));
  container.append(row);
  wrap.append(container);
  column.append(wrap);
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
  const wrap = el('div', 'background-component vert-pad-top-xs vert-pad-bottom-md');
  const holder = el('section', 'cmp-carousel container carousel-holder', { 'carousel-type': 'card-carousel', 'data-cmp-is': 'carousel' });
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
  wrap.append(holder);
  block.replaceChildren(wrap);

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

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children]).filter((cells) => cells.length);
  if (!rows.length) return;
  if (block.classList.contains('carousel')) decorateCarousel(block, rows);
  else decorateSolutions(block, rows);
}
