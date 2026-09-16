/**
 * quotes — the customer-quote carousel (source: carousel panelcontainer of component-quote slides,
 * contact-sales "We Help Our Customer Achieve Success"): one quote card per slide, fading between
 * slides, dots + arrows.
 * Authoring rows: one per quote, three cells — <p>"quote"</p> | <p>Name</p><p>Role, Company</p> |
 * <p><img logo></p>.
 * Tier: reconstructive; authored nodes are MOVED into the source card DOM (EW1), wrappers carry the
 * source classes (EW2). Behaviour: the observed content-carousel (first slide active, prev/next
 * wrap, dots select).
 */

const FA_PREV = '<svg class="svg-inline--fa fa-chevron-left" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M15 239c-9.4 9.4-9.4 24.6 0 33.9L207 465c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L65.9 256 241 81c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L15 239z"></path></svg>';
const FA_NEXT = '<svg class="svg-inline--fa fa-chevron-right" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M305 239c9.4 9.4 9.4 24.6 0 33.9L113 465c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l175-175L79 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L305 239z"></path></svg>';

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

function quoteCard(cells) {
  const hasMedia = (c) => !!c.querySelector('picture, img');
  const textCell = cells.find((c) => c.querySelector('p') && !hasMedia(c)) || cells[0];
  const attributionCell = cells.find((c) => c !== textCell && !hasMedia(c));
  const logoCell = cells.find(hasMedia);
  const host = el('div', 'quote image');
  const container = el('div', 'container');
  const section = el('section', 'component-quote', { 'data-analytics-link-region': 'body' });
  const ct = el('div', 'component-text');
  const quote = el('div', 'quote-text quote-english');
  [...textCell.querySelectorAll('p')].forEach((p) => quote.append(p));
  ct.append(quote);
  section.append(ct);
  if (attributionCell) {
    const wrap = el('div', 'quote-attribution-wrapper');
    [...attributionCell.querySelectorAll('p')].forEach((p, i) => {
      if (i) {
        const sep = el('span', 'separator');
        sep.textContent = '|';
        wrap.append(sep);
      }
      const attribution = el('div', 'quote-attribution');
      attribution.append(p);
      wrap.append(attribution);
    });
    section.append(wrap);
  }
  if (logoCell) {
    const imgWrap = el('div', 'quote-img-wrapper');
    const imgBox = el('div', 'quote-img');
    const cmp = el('div', 'cmp-image');
    const pic = logoCell.querySelector('picture') || logoCell.querySelector('img');
    (pic.querySelector('img') || pic).classList.add('img-responsive');
    cmp.append(pic);
    imgBox.append(cmp);
    imgWrap.append(imgBox);
    section.append(imgWrap);
  }
  container.append(section);
  host.append(container);
  return host;
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children]).filter((cells) => cells.length);
  if (!rows.length) return;
  const scope = el('div', 'carousel panelcontainer');
  const holder = el('section', 'cmp-carousel container carousel-holder', {
    'carousel-type': 'content-carousel', 'data-cmp-is': 'carousel',
  });
  const content = el('div', 'cmp-carousel__content carousel-list-holder slick-initialized slick-slider slick-dotted');
  const list = el('div', 'slick-list');
  const track = el('div', 'slick-track');
  const slides = rows.map((cells, k) => {
    const slide = el('div', 'cmp-carousel__item list slick-slide', {
      id: `slick-slide0${k}`,
      'data-slick-index': String(k),
      role: 'tabpanel',
      'aria-describedby': `slick-slide-control0${k}`,
    });
    slide.append(quoteCard(cells));
    track.append(slide);
    return slide;
  });
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
  scope.append(holder);
  block.replaceChildren(scope);

  let cur = 0;
  const dots = slides.map((s, k) => {
    const li = el('li', '', { role: 'presentation' });
    li.addEventListener('click', () => show(k)); // eslint-disable-line no-use-before-define
    dotsUl.append(li);
    return li;
  });
  function show(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const on = k === cur;
      s.classList.toggle('slick-active', on);
      s.classList.toggle('slick-current', on);
      s.classList.toggle('cmp-carousel__item--active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dots.forEach((d, k) => d.classList.toggle('slick-active', k === cur));
  }
  prev.addEventListener('click', () => show(cur - 1));
  next.addEventListener('click', () => show(cur + 1));
  show(0);
}
