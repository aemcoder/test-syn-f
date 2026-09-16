/**
 * carousel — the "Customer Success" quote carousel of the Cloud landing page (source:
 * component-content-carousel,
 * one slide per view): each slide is a linked customer logo on the left and a large quote, the
 * attribution line and a
 * chevron text link on the right; arrows + dots below. Rest state = slide 1 (the source's autoplay
 * attribute was not
 * observed advancing in the live capture; no autoplay here).
 *
 * Authoring rows: one per slide, two cells — <p><a href><picture></a></p> | <p>quote</p>,
 * <p><strong>Name | Title</strong></p>,
 * <p><a href>Read Success Story</a></p>.
 * Tier: reconstructive; authored nodes are MOVED into the source slide DOM (EW1); the quote
 * paragraph is wrapped by a
 * `.quote` box that carries the source's h5 typography (EW2).
 */

const FA_PREV = '<svg class="svg-inline--fa fa-chevron-left" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M20.7 267.3c-6.2-6.2-6.2-16.4 0-22.6l192-192c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6L54.6 256 235.3 436.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0l-192-192z"></path></svg>';
const FA_NEXT = '<svg class="svg-inline--fa fa-chevron-right" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M299.3 244.7c6.2 6.2 6.2 16.4 0 22.6l-192 192c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6L265.4 256 84.7 75.3c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l192 192z"></path></svg>';
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

function slideOf(cells, i) {
  const [mediaCell, textCell] = cells;
  const slide = el('div', 'carousel-slide slick-slide', { 'data-slick-index': String(i), role: 'tabpanel', id: `slick-slide0${i}` });
  const grid = el('div', 'aem-Grid');
  const column = el('div', 'column');
  const container = el('div', 'container');
  const row = el('section', 'component-column row');
  // logo column
  const c1 = el('div', 'col-xs-12 col-sm-4');
  const g1 = el('div', 'aem-Grid');
  const imageHost = el('div', 'image');
  const ic = el('div', 'container');
  const compImg = el('div', 'component-image', { 'data-analytics-link-region': 'body' });
  const pic = mediaCell ? mediaCell.querySelector('picture, img') : null;
  if (pic) {
    const im = pic.querySelector('img') || pic;
    im.classList.add('img-responsive', 'horizontal-padding-md');
    // the site marks vector logos (140px tall, centred below 730)
    if (/\.svg(\?|$)/i.test(im.getAttribute('src') || '')) im.classList.add('svg');
    const link = pic.closest('a');
    const p = pic.closest('p');
    const ci = el('div', 'cmp-image');
    ci.append(pic);
    if (link) { link.replaceChildren(ci); compImg.append(link); } else compImg.append(ci);
    if (p) p.remove();
  }
  ic.append(compImg);
  imageHost.append(ic);
  g1.append(imageHost);
  c1.append(g1);
  // quote column
  const c2 = el('div', 'col-xs-12 col-sm-8');
  const g2 = el('div', 'aem-Grid');
  const paragraphs = textCell ? [...textCell.querySelectorAll('p')] : [];
  const linkPs = paragraphs.filter((p) => p.querySelector('a'));
  const plain = paragraphs.filter((p) => !linkPs.includes(p) && p.textContent.trim());
  const [quote, ...rest] = plain;
  if (quote) {
    const rteHost = el('div', 'richTextEditor');
    const rc = el('div', 'container');
    const rs = el('section', 'component-rtecomp', { 'data-analytics-link-region': 'body' });
    const rte = el('div', 'component-rte');
    const q = el('div', 'quote');
    q.append(quote);
    rte.append(q);
    rs.append(rte);
    rc.append(rs);
    rteHost.append(rc);
    g2.append(rteHost);
  }
  const textHost = el('div', 'text');
  const tc = el('div', 'container');
  const ts = el('section', 'component-textcomp text-align-left', { 'data-analytics-link-region': 'banner' });
  if (rest.length) { const ct = el('div', 'component-text'); rest.forEach((p) => ct.append(p)); ts.append(ct); }
  if (linkPs.length) {
    const buttons = el('div', 'buttons align-left');
    linkPs.forEach((p) => {
      const a = p.querySelector('a');
      a.classList.add('cta-link');
      p.classList.add('cta-link-wrap');
      const label = el('span', 'cta-text');
      label.append(...a.childNodes);
      a.append(label, ' ', svg(FA_CTA));
      buttons.append(p);
    });
    ts.append(buttons);
  }
  tc.append(ts);
  textHost.append(tc);
  g2.append(textHost);
  c2.append(g2);
  row.append(c1, c2);
  container.append(row);
  column.append(container);
  grid.append(column);
  slide.append(grid);
  return slide;
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children]).filter((cells) => cells.length);
  if (!rows.length) return;
  const container = el('div', 'container component-content-carousel-container');
  const section = el('section', 'component-content-carousel slick-carousel slick-initialized slick-slider slick-dotted', { 'data-slides-to-show': '1' });
  const prev = el('button', 'slick-prev slick-arrow', { type: 'button', 'aria-label': 'Previous' });
  prev.append(svg(FA_PREV));
  const next = el('button', 'slick-next slick-arrow', { type: 'button', 'aria-label': 'Next' });
  next.append(svg(FA_NEXT));
  const list = el('div', 'slick-list draggable');
  const track = el('div', 'slick-track');
  const slides = rows.map((cells, i) => slideOf(cells, i));
  slides.forEach((s) => track.append(s));
  list.append(track);
  const dots = el('ul', 'slick-dots', { role: 'tablist' });
  section.append(prev, list, next, dots);
  container.append(section);
  block.replaceChildren(container);

  /* ---- behaviours: one slide per view, arrows + dots, wrap-around ---- */
  let cur = 0;
  const pitch = () => list.clientWidth;
  const setX = (animate) => { track.style.transition = animate ? 'transform 0.5s ease' : 'none'; track.style.transform = `translate3d(${-cur * pitch()}px,0,0)`; };
  const dotEls = slides.map((s, k) => {
    const li = el('li', k === 0 ? 'slick-active' : '', { role: 'presentation' });
    const b = el('button', '', {
      type: 'button', role: 'tab', 'aria-label': `${k + 1} of ${slides.length}`, 'aria-controls': s.id,
    });
    b.textContent = String(k + 1);
    b.addEventListener('click', () => show(k)); // eslint-disable-line no-use-before-define
    li.append(b);
    dots.append(li);
    return li;
  });
  function show(i, animate = true) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const on = k === cur;
      s.classList.toggle('slick-current', on);
      s.classList.toggle('slick-active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
      s.tabIndex = on ? 0 : -1;
    });
    dotEls.forEach((d, k) => d.classList.toggle('slick-active', k === cur));
    setX(animate);
  }
  const layout = () => {
    const w = pitch();
    slides.forEach((s) => { s.style.width = `${w}px`; });
    track.style.width = `${w * slides.length}px`;
    setX(false);
  };
  prev.addEventListener('click', () => show(cur - 1));
  next.addEventListener('click', () => show(cur + 1));
  layout();
  show(0, false);
  window.addEventListener('resize', layout);
  // decorate() can run while the section is still hidden (pitch 0): re-place the track once the
  // block has a size
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(block);
}
