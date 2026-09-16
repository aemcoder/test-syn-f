/**
 * logo-carousel — the "Ecosystem Partners" marquee: a continuous slick strip of partner logos, one
 * slide every
 * 5 s with a 5 s linear transition (observed live), 5 logos per view from 730px and 3 below,
 * infinite via clones.
 * Schema: stardust/eds-schema/home.json section 7. The section heading is default content above the
 * block.
 *
 * Authoring rows: one per logo — <p><a href><picture></picture></a></p>.
 * Tier: reconstructive. The authored paragraph (link + image) is MOVED into the slide (EW1); clones
 * are stripped
 * of editor indices (EW4). The marquee is frozen at the gate state (slide 5 desktop / 6 mobile)
 * like the prototype.
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  return node;
}

function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  return node;
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children]).filter((cells) => cells.length);
  if (!rows.length) return;
  const mq = window.matchMedia('(min-width: 730px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const bg = el('div', 'background-component light-grey-bg');
  const container = el('div', 'container');
  const row = el('section', 'component-column row', { id: 'partnersBlock' });
  const col = el('div', 'col-xs-12');
  const host = el('div', 'logoCarousel');
  const inner = el('div', 'container');
  const section = el('section', 'cmp-logo-carousel');
  const slider = el('div', 'logo-carousel slider slick-initialized slick-slider', { dir: 'ltr' });
  const list = el('div', 'slick-list draggable');
  const track = el('div', 'slick-track');
  const reals = rows.map((cells, i) => {
    const slide = el('div', 'slick-slide', { 'data-slick-index': String(i), 'aria-hidden': 'true', tabindex: '0' });
    const cell = cells[0];
    const p = cell.querySelector('p') || cell;
    const a = p.querySelector('a');
    const pic = p.querySelector('picture, img');
    if (a) { if (pic && !a.contains(pic)) a.append(pic); slide.append(a.closest('p') || a); } else if (pic) slide.append(pic.closest('p') || pic);
    return slide;
  });
  reals.forEach((s) => track.append(s));
  list.append(track);
  slider.append(list);
  section.append(slider);
  inner.append(section);
  host.append(inner);
  col.append(host);
  row.append(col);
  container.append(row);
  bg.append(container);
  block.replaceChildren(bg);

  let show = 5; let idx = 0;
  const pitch = () => list.clientWidth / show;
  const jump = (k, animate) => { track.style.transition = animate ? 'transform 5s linear' : 'none'; track.style.transform = `translate3d(${-(show + k) * pitch()}px,0,0)`; };
  function setActive(from) {
    reals.forEach((r, k) => {
      const on = k >= from && k < from + show;
      r.classList.toggle('slick-active', on); r.classList.toggle('slick-current', k === from); r.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
  }
  function buildClones() {
    track.querySelectorAll('.is-clone').forEach((n) => n.remove());
    const n = reals.length;
    const before = document.createDocumentFragment();
    const after = document.createDocumentFragment();
    const cloneOf = (real, i) => {
      const c = stripInstrumentation(real.cloneNode(true));
      c.classList.remove('slick-current', 'slick-active'); c.classList.add('is-clone', 'slick-cloned');
      c.setAttribute('aria-hidden', 'true'); c.setAttribute('tabindex', '-1'); c.setAttribute('data-slick-index', String(i));
      c.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
      return c;
    };
    for (let i = n - show; i < n; i += 1) before.append(cloneOf(reals[i], i - n));
    for (let i = 0; i < n; i += 1) after.append(cloneOf(reals[i], n + i));
    track.insertBefore(before, reals[0]); track.append(after);
  }
  function layout() {
    show = mq.matches ? 5 : 3;
    buildClones();
    idx = mq.matches ? 5 : 6;
    setActive(idx % reals.length);
    jump(idx, false);
  }
  function step() {
    idx += 1;
    jump(idx, true);
    if (idx >= reals.length) setTimeout(() => { idx -= reals.length; jump(idx, false); }, 5000);
  }
  layout();
  mq.addEventListener('change', layout);
  // decorate() can run while the section is still hidden (pitch 0): re-place the track once
  // the block has a size
  if ('ResizeObserver' in window) new ResizeObserver(() => jump(idx, false)).observe(block);
  window.addEventListener('resize', () => jump(idx, false));
  if (!reduced) setInterval(step, 5000);
}
