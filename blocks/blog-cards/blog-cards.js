/**
 * blog-cards — dynamic "card B" listings of blog / article / success-story pages (source:
 * cmp-dynamiccards, component-card-b): image, label, read time + date, title, author avatars and
 * links, tags, CTA. Up to three cards render as a static row; more become a slick-style carousel
 * (3 per view from 730px, 1 centred below, infinite via clones — observed).
 *
 * Authoring rows — one per card, two or three cells:
 *   1. <picture>
 *   2. [<p>label</p>] [<p>read time / date</p>] <h3><a href>title</a></h3>
 *      [<p>By <a>author</a>…</p>]
 *      [<p>Tags: <a>tag</a>, …</p>] <p><a href>CTA</a></p>
 *   3. optional author avatar <picture>s (one per author)
 * The label / date paragraphs precede the heading; the authors paragraph starts with the authored
 * "By", the tags paragraph with the authored "Tags:" (classification by cell text, display by
 * MOVING the element — EW1). Wrappers carry the card classes (EW2); carousel clones are stripped of
 * editor indices (EW4). A card without authors and tags renders the source's `non-blog-page` skin.
 */

const FA_CHEVRON = '<svg class="svg-inline--fa fa-chevron-right" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M299.3 244.7c6.2 6.2 6.2 16.4 0 22.6l-192 192c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6L265.4 256 84.7 75.3c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l192 192z"></path></svg>';
const FA_PREV = '<svg class="svg-inline--fa fa-chevron-left" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M20.7 267.3c-6.2-6.2-6.2-16.4 0-22.6l192-192c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6L54.6 256 235.3 436.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0l-192-192z"></path></svg>';
const COUNT = ['', 'one', 'two', 'three'];

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
const pictures = (cell) => (cell ? [...cell.querySelectorAll('picture, img')].filter((m) => !(m.tagName === 'IMG' && m.closest('picture'))) : []);

function card(cells, index) {
  const [mediaCell, textCell, avatarCell] = cells;
  const heading = textCell.querySelector('h1, h2, h3, h4');
  const link = heading ? heading.querySelector('a') : null;
  const href = link ? link.getAttribute('href') : '#';
  const paragraphs = [...textCell.querySelectorAll('p')];
  const order = [...textCell.querySelectorAll('p, h1, h2, h3, h4')];
  const hIdx = heading ? order.indexOf(heading) : order.length;
  const before = paragraphs.filter((p) => order.indexOf(p) < hIdx && text(p));
  const after = paragraphs.filter((p) => order.indexOf(p) > hIdx && text(p));
  const authors = after.find((p) => /^By\b/.test(text(p)));
  const tags = after.find((p) => /^Tags:/.test(text(p)));
  const cta = [...after].reverse().find((p) => p !== authors && p !== tags && p.querySelector('a'));
  let label = null; let date = null;
  if (before.length >= 2) [label, date] = before;
  else if (before.length === 1) { if (/\d/.test(text(before[0]))) [date] = before; else [label] = before; }
  const avatars = pictures(avatarCell);

  const col = el('div', 'card-col col-xs-12 col-sm-4 carousel-slide', { 'data-link': href });
  const cardEl = el('div', `component-card-b no-link${!authors && !tags ? ' non-blog-page' : ''}`);
  const imageWrap = el('div', 'image-wrapper');
  const imageLink = el('a', '', { href });
  const [pic] = pictures(mediaCell);
  if (pic && pic.tagName === 'IMG') { const wrap = document.createElement('picture'); wrap.append(pic); imageLink.append(wrap); } else if (pic) imageLink.append(pic);
  imageWrap.append(imageLink);
  const body = el('div', 'component-text card-text');
  const labelDate = el('div', 'label-date-wrapper');
  if (label) { const l = el('div', 'label'); l.append(label); labelDate.append(l); }
  const dt = el('div', 'date-time');
  if (date) dt.append(date);
  labelDate.append(dt);
  body.append(labelDate);
  if (heading) {
    const h = el('div', 'heading');
    if (link) { const span = document.createElement('span'); span.append(...link.childNodes); link.append(span); }
    h.append(heading);
    body.append(h);
  }
  { // the source renders the author row on every card (empty circle + links on non-blog cards)
    const info = el('div', 'author-info');
    const circle = el('div', `profile-circle ${COUNT[Math.min(avatars.length, 3)] || 'three'}`);
    avatars.forEach((a) => { const d = document.createElement('div'); d.append(a); circle.append(d); });
    const links = el('div', 'authors-links');
    if (authors) links.append(authors);
    info.append(circle, links);
    body.append(info);
  }
  if (tags) { const holder = el('div', 'tag-holder'); holder.append(tags); body.append(holder); }
  if (cta) {
    const wrap = el('div', 'cta');
    const a = cta.querySelector('a');
    const span = document.createElement('span');
    span.append(...a.childNodes);
    a.append(span, svg(FA_CHEVRON));
    wrap.append(cta);
    body.append(wrap);
  }
  cardEl.append(imageWrap, body);
  col.append(cardEl);
  col.dataset.slickIndex = String(index);
  return col;
}

function carousel(row, cols) {
  const mq = window.matchMedia('(min-width: 730px)');
  row.classList.add('component-content-carousel', 'slick-carousel', 'horizontal-stack', 'mobile-center-mode', 'slick-initialized', 'slick-slider', 'slick-dotted');
  const prev = el('button', 'slick-prev slick-arrow', { type: 'button', 'aria-label': 'Previous' });
  prev.append(svg(FA_PREV));
  const list = el('div', 'slick-list draggable');
  const track = el('div', 'slick-track');
  cols.forEach((c) => { c.classList.add('slick-slide'); c.setAttribute('role', 'tabpanel'); track.append(c); });
  list.append(track);
  const next = el('button', 'slick-next slick-arrow', { type: 'button', 'aria-label': 'Next' });
  next.append(svg(FA_CHEVRON));
  const dotsUl = el('ul', 'slick-dots', { role: 'tablist' });
  row.append(prev, list, next, dotsUl);

  const st = {
    show: 3, pre: 3, page: 0, pages: 1, animating: false,
  };
  const pitch = () => { const s = track.querySelector('.slick-slide'); return s ? s.getBoundingClientRect().width : list.clientWidth / st.show; };
  const setX = (x, animate) => { track.style.transition = animate ? 'transform 500ms' : ''; track.style.transform = `translate3d(${x}px,0,0)`; };
  const clone = (r, idx) => {
    const c = stripInstrumentation(r.cloneNode(true));
    c.removeAttribute('id');
    c.classList.add('slick-cloned');
    c.classList.remove('slick-current', 'slick-active');
    c.setAttribute('data-slick-index', String(idx));
    c.setAttribute('aria-hidden', 'true');
    c.setAttribute('tabindex', '-1');
    return c;
  };
  function mark() {
    cols.forEach((r, i) => {
      const on = i >= st.page * st.show && i < (st.page + 1) * st.show;
      r.classList.toggle('slick-active', on);
      r.classList.toggle('slick-current', i === st.page * st.show);
      r.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dotsUl.replaceChildren();
    for (let i = 0; i < st.pages; i += 1) {
      const li = el('li', i === st.page ? 'slick-active' : '', { role: 'presentation' });
      const b = el('button', '', {
        type: 'button', role: 'tab', id: `slick-slide-control0${i}`, 'aria-controls': `slick-slide0${i * st.show}`, 'aria-label': `${i + 1} of ${st.pages}`, tabindex: i === st.page ? '0' : '-1',
      });
      if (i === st.page) b.setAttribute('aria-selected', 'true');
      b.textContent = String(i + 1);
      li.addEventListener('click', () => goTo(i)); // eslint-disable-line no-use-before-define
      li.append(b);
      dotsUl.append(li);
    }
  }
  function goTo(page) {
    if (st.animating) return;
    const n = cols.length; const p = pitch();
    const finish = (fn) => setTimeout(() => { fn(); st.animating = false; track.style.transition = ''; }, 520);
    st.animating = true;
    if (page >= st.pages) {
      st.page = 0;
      mark();
      setX(-(st.pre + n) * p, true);
      finish(() => setX(-st.pre * p, false));
      return;
    }
    if (page < 0) {
      st.page = st.pages - 1;
      mark();
      setX(-(st.pre - st.show) * p, true);
      finish(() => setX(-(st.pre + st.page * st.show) * p, false));
      return;
    }
    st.page = page; mark(); setX(-(st.pre + page * st.show) * p, true); finish(() => {});
  }
  function build() {
    track.querySelectorAll('.slick-cloned').forEach((c) => c.remove());
    st.show = mq.matches ? 3 : 1;
    st.pre = mq.matches ? 3 : 2; // slick: infiniteCount = slidesToShow (+1 with centerMode)
    list.style.padding = mq.matches ? '' : '0px 50px';
    const n = cols.length;
    for (let i = n - st.pre; i < n; i += 1) {
      track.insertBefore(clone(cols[(i + n) % n], i - n), cols[0]);
    }
    for (let j = 0; j < n; j += 1) track.append(clone(cols[j], n + j));
    st.pages = Math.ceil(n / st.show);
    st.page = Math.min(st.page, st.pages - 1);
    mark();
    setX(-(st.pre + st.page * st.show) * pitch(), false);
  }
  const reposition = () => setX(-(st.pre + st.page * st.show) * pitch(), false);
  prev.addEventListener('click', () => goTo(st.page - 1));
  next.addEventListener('click', () => goTo(st.page + 1));
  build();
  mq.addEventListener('change', build);
  window.addEventListener('resize', reposition);
  // decorate() can run while the section is still hidden (pitch 0): re-place the track once sized
  if ('ResizeObserver' in window) new ResizeObserver(reposition).observe(row);
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children])
    .filter((cells) => cells.length >= 2);
  if (!rows.length) return;
  // source nesting: a bootstrap column (column > container > row > col > grid) hosts the listing
  const column = el('div', 'column');
  const colContainer = el('div', 'container');
  const colRow = el('section', 'component-column row');
  const col = el('div', 'col-xs-12');
  const grid = el('div', 'aem-Grid');
  const outer = el('div', 'dynamicCards');
  const container = el('div', 'container');
  const section = el('section', 'cmp-dynamiccards component-card-container col-3 card-size-medium', {
    'data-dynamic-card-limit': `${rows.length}.0`, 'data-analytics-link-region': 'card',
  });
  const row = el('div', 'row', { 'data-slides-to-show': '3' });
  const cols = rows.map((cells, i) => card(cells, i));
  if (cols.length > 3) carousel(row, cols);
  else { row.classList.add('component-card-b-no-slick-carousel'); cols.forEach((c) => row.append(c)); }
  section.append(row);
  container.append(section);
  outer.append(container);
  grid.append(outer);
  col.append(grid);
  colRow.append(col);
  colContainer.append(colRow);
  column.append(colContainer);
  block.replaceChildren(column);
}
