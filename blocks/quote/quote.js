/**
 * quote — customer quotes in a fading panel carousel (source: carousel.panelcontainer of
 * component-quote slides, success-story template). Dots + arrows step between quotes; one quote
 * is visible at a time (observed).
 *
 * Authoring rows — one per quote, two cells: 1. <picture> logo · 2. <p>"quote"</p>, <p>name</p>,
 * <p>title</p> (attribution paragraphs after the quote; the source's "|" separator is generated).
 * Tier: reconstructive; authored nodes are MOVED into the quote DOM (EW1), wrappers carry the
 * source
 * classes (EW2).
 */

const FA_PREV = '<svg class="svg-inline--fa fa-chevron-left" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M20.7 267.3c-6.2-6.2-6.2-16.4 0-22.6l192-192c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6L54.6 256 235.3 436.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0l-192-192z"></path></svg>';
const FA_NEXT = '<svg class="svg-inline--fa fa-chevron-right" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M299.3 244.7c6.2 6.2 6.2 16.4 0 22.6l-192 192c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6L265.4 256 84.7 75.3c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l192 192z"></path></svg>';

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

const media = (cell) => (cell ? cell.querySelector('picture, img') : null);

function quoteSlide(cells, index) {
  const [mediaCell, textCell] = cells;
  const paragraphs = [...textCell.querySelectorAll('p')];
  const [quote, ...attribution] = paragraphs;
  const slide = el('div', 'cmp-carousel__item list slick-slide', {
    id: `slick-slide0${index}`, 'data-slick-index': String(index), role: 'tabpanel', 'aria-describedby': `slick-slide-control0${index}`,
  });
  const column = el('div', 'column');
  const container = el('div', 'container');
  const row = el('section', 'component-column row');
  const col = el('div', 'col-xs-12');
  const grid = el('div', 'aem-Grid');
  const host = el('div', 'image');
  const inner = el('div', 'container');
  const section = el('section', 'component-quote', { 'data-analytics-link-region': 'body' });
  const text = el('div', 'component-text');
  if (quote) text.append(quote);
  section.append(text);
  if (attribution.length) {
    const wrap = el('div', 'quote-attribution-wrapper');
    attribution.forEach((p, i) => {
      if (i > 0) { const sep = el('span', 'separator'); sep.textContent = '|'; wrap.append(sep); }
      wrap.append(p);
    });
    section.append(wrap);
  }
  const pic = media(mediaCell);
  if (pic) {
    const imgWrap = el('div', 'quote-img-wrapper');
    const img = el('div', 'quote-img');
    const cmp = el('div', 'cmp-image');
    cmp.append(pic);
    img.append(cmp);
    imgWrap.append(img);
    section.append(imgWrap);
  }
  inner.append(section);
  host.append(inner);
  grid.append(host);
  col.append(grid);
  row.append(col);
  container.append(row);
  column.append(container);
  slide.append(column);
  return slide;
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children]).filter((cells) => cells.length);
  if (!rows.length) return;
  const holder = el('section', 'cmp-carousel container carousel-holder', { 'carousel-type': 'content-carousel', 'data-cmp-is': 'carousel' });
  const content = el('div', 'cmp-carousel__content carousel-list-holder slick-initialized slick-slider slick-dotted');
  const list = el('div', 'slick-list');
  const track = el('div', 'slick-track');
  const slides = rows.map((cells, i) => quoteSlide(cells, i));
  slides.forEach((s) => track.append(s));
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
  const scope = el('div', 'carousel panelcontainer');
  scope.append(holder);
  block.replaceChildren(scope);

  let cur = 0;
  function show(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const on = k === cur;
      s.classList.toggle('slick-active', on);
      s.classList.toggle('slick-current', on);
      s.classList.toggle('cmp-carousel__item--active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    [...dotsUl.children].forEach((d, k) => d.classList.toggle('slick-active', k === cur));
  }
  slides.forEach((s, k) => {
    const li = el('li', '', { role: 'presentation' });
    const b = el('button', '', {
      type: 'button', role: 'tab', id: `slick-slide-control0${k}`, 'aria-controls': `slick-slide0${k}`, 'aria-label': `${k + 1} of ${slides.length}`,
    });
    b.textContent = String(k + 1);
    li.addEventListener('click', () => show(k));
    li.append(b);
    dotsUl.append(li);
  });
  prev.addEventListener('click', () => show(cur - 1));
  next.addEventListener('click', () => show(cur + 1));
  show(0);
}
