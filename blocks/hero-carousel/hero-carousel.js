/**
 * hero-carousel — the home hero (banner-carousel): fading slides with title-labelled dots (progress
 * bar on the
 * active dot), previous/next arrows and a pause button. Schema: stardust/eds-schema/home.json
 * section 0.
 *
 * Authoring rows — one per slide, three cells:
 *   1. desktop picture, then mobile picture
 *   2. accessible heading (h1 on the first slide, h2 on the others), the visible title lines as
 * <p><strong>…</strong></p>,
 *      the subtitle <p>, then the CTAs: <p><strong><a>primary</a></strong></p> /
 * <p><em><a>secondary</a></em></p>
 *   3. config (@ew-exempt <p> — text-as-metadata): "desktop-gradient | mobile-gradient"
 *
 * Behaviour observed live (stardust/replica/motion/home*.json): fade 200 ms, autoplay 7000 ms with
 * a progress bar on the
 * active dot, pause toggles `.pause` on the dots list and swaps the pause/play glyph, dots and
 * arrows go to a slide.
 * Decode tier: reconstructive (repeat unit = slide); authored nodes are MOVED into the prototype's
 * slide DOM (EW1–EW3).
 */

const FA_PREV = '<svg class="svg-inline--fa fa-chevron-left" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M20.7 267.3c-6.2-6.2-6.2-16.4 0-22.6l192-192c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6L54.6 256 235.3 436.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0l-192-192z"></path></svg>';
const FA_NEXT = '<svg class="svg-inline--fa fa-chevron-right" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M299.3 244.7c6.2 6.2 6.2 16.4 0 22.6l-192 192c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6L265.4 256 84.7 75.3c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l192 192z"></path></svg>';
const FA_PAUSE = '<svg class="svg-inline--fa fa-pause" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pause" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"></path></svg>';
const FA_PLAY = '<svg class="svg-inline--fa fa-play" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path></svg>';
const FA_ARROW = '<svg class="svg-inline--fa fa-chevron-right arrow-icon" aria-hidden="true" focusable="false" data-prefix="far" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M305 239c9.4 9.4 9.4 24.6 0 33.9L113 465c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l175-175L79 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L305 239z"></path></svg>';
const AUTOPLAY = 7000;
const FADE = 200;

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

// read-only classification (never used to produce displayed text — EW1)
const text = (node) => (node ? node.textContent.trim() : '');

function buildSlide(cells, index) {
  const [mediaCell, textCell, configCell] = cells;
  const pictures = mediaCell ? [...mediaCell.querySelectorAll('picture, img')] : [];
  const heading = textCell ? textCell.querySelector('h1, h2, h3') : null;
  const paragraphs = textCell ? [...textCell.querySelectorAll('p')] : [];
  const ctas = paragraphs.filter((p) => p.querySelector('a'));
  const titles = paragraphs.filter((p) => !ctas.includes(p) && p.querySelector('strong, b'));
  const subs = paragraphs.filter((p) => !ctas.includes(p) && !titles.includes(p) && text(p));
  const config = text(configCell).split('|').map((s) => s.trim());
  const [gDesktop = 'dark-purple-gradient', gMobile = gDesktop] = config;
  const hasForeground = config.includes('foreground');
  const noDesktop = config.includes('no-desktop');
  const fgPic = hasForeground ? pictures[pictures.length - 1] : null;
  const bgPics = hasForeground ? pictures.slice(0, -1) : pictures;
  const desktopPic = noDesktop ? null : bgPics[0];
  const mobilePic = noDesktop ? bgPics[0] : bgPics[1];

  const slide = el('div', 'cmp-carousel__item list slick-slide', {
    id: `slick-slide0${index}`, role: 'tabpanel', 'aria-describedby': `slick-slide-control0${index}`, 'data-slick-index': String(index), title: text(heading),
  });
  const section = el('section', 'component-banner carousel-wrapper-hp', {
    'data-card-type': 'banner', 'data-is-carousel-item': 'true', 'data-type': 'content-align-left', 'data-mobile-type': 'stacked', 'data-color-theme': 'dark',
  });
  section.append(el('div', 'image-overlay opacity-0'));
  section.append(el('div', `bg-desktop carousel-banner ${gDesktop} component-image`));
  section.append(el('div', `bg-mobile ${gMobile} component-image`));
  const dmDesktop = el('div', 'dm-desktop');
  const dmMobile = el('div', 'dm-mobile');
  if (desktopPic) dmDesktop.append(desktopPic);
  if (mobilePic) dmMobile.append(mobilePic);
  section.append(dmDesktop, dmMobile);

  const center = el('div', 'center-wrapper');
  const textWrap = el('div', 'text-wrapper');
  const title = el('div', 'title');
  if (heading) title.append(heading);
  titles.forEach((p) => title.append(p));
  textWrap.append(title);
  if (subs.length) { const sub = el('div', 'sub-title'); subs.forEach((p) => sub.append(p)); textWrap.append(sub); }
  if (ctas.length) {
    const wrap = el('div', 'cta-wrapper');
    ctas.forEach((p) => {
      const a = p.querySelector('a');
      const secondary = a.classList.contains('secondary') || (!a.classList.contains('button') && !!p.querySelector('em'));
      const btn = el('div', `component-button ${secondary ? 'secondary' : 'primary'} dark darkButtonRollover`);
      btn.append(p); // the paragraph carries the editor index (EW3)
      a.classList.add('has-arrow');
      a.append(svg(FA_ARROW));
      wrap.append(btn);
    });
    textWrap.append(wrap);
  }
  center.append(textWrap);
  if (fgPic) { const fg = el('div', 'foreground cmp-image'); fg.append(fgPic); center.append(fg); }
  section.append(center);
  slide.append(section);
  return { slide, label: text(heading) };
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children]);
  if (!rows.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const holder = el('section', 'cmp-carousel carousel-holder', { 'carousel-type': 'banner-carousel', role: 'banner', 'data-cmp-is': 'carousel' });
  const content = el('div', 'cmp-carousel__content carousel-list-holder slick-initialized slick-slider slick-dotted');
  const list = el('div', 'slick-list');
  const track = el('div', 'slick-track');
  const dotsUl = el('ul', 'slick-dots', { role: 'tablist' });
  const built = rows.map((cells, i) => buildSlide(cells, i));
  built.forEach(({ slide, label }, i) => {
    track.append(slide);
    const li = el('li', '', { role: 'presentation' });
    const b = el('button', '', {
      type: 'button', role: 'tab', id: `slick-slide-control0${i}`, 'aria-controls': `slick-slide0${i}`, 'aria-label': `${i + 1} of ${built.length}`, tabindex: '-1',
    });
    b.textContent = label; // generated control label (UI, not authored content)
    li.append(b, el('span', 'slider-progress-bar'));
    dotsUl.append(li);
  });
  list.append(track);
  content.append(list, dotsUl);
  const nav = el('div', 'slick-nav-container');
  const prev = el('button', 'slick-prev slick-arrow', { type: 'button', 'aria-label': 'previous' });
  prev.append(svg(FA_PREV));
  const next = el('button', 'slick-next slick-arrow', { type: 'button', 'aria-label': 'next' });
  next.append(svg(FA_NEXT));
  nav.append(prev, next);
  const pauseBtn = el('button', 'pause-btn', { type: 'button', 'aria-label': 'Pause' });
  pauseBtn.append(svg(FA_PAUSE));
  holder.append(content, nav, pauseBtn);
  block.replaceChildren(holder);

  // LCP: the first desktop image loads eagerly (#100)
  const first = track.querySelector('.dm-desktop img');
  if (first) { first.setAttribute('loading', 'eager'); first.setAttribute('fetchpriority', 'high'); }

  const slides = [...track.children];
  const dots = [...dotsUl.children];
  let cur = 0; let paused = reduced; let startedAt = 0;
  function show(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const on = k === cur;
      s.classList.toggle('slick-active', on); s.classList.toggle('slick-current', on); s.classList.toggle('cmp-carousel__item--active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true'); s.setAttribute('tabindex', on ? '0' : '-1');
      s.style.cssText = on
        ? 'width:100%;position:relative;left:0;top:0;z-index:999;opacity:1;transition:opacity .2s ease'
        : 'width:100%;position:absolute;left:0;top:0;z-index:998;opacity:0;transition:opacity .2s ease';
    });
    dots.forEach((d, k) => {
      const on = k === cur; d.classList.toggle('slick-active', on);
      const b = d.querySelector('button'); if (b) { b.tabIndex = on ? 0 : -1; if (on) b.setAttribute('aria-selected', 'true'); else b.removeAttribute('aria-selected'); }
      const bar = d.querySelector('.slider-progress-bar'); if (bar) bar.style.width = on ? bar.style.width : '0%';
    });
    startedAt = performance.now() + FADE;
    const bar = dots[cur] && dots[cur].querySelector('.slider-progress-bar'); if (bar) bar.style.width = '0%';
  }
  function tick(now) {
    if (!paused) {
      const f = Math.max(0, Math.min(1, (now - startedAt) / AUTOPLAY));
      const bar = dots[cur] && dots[cur].querySelector('.slider-progress-bar'); if (bar) bar.style.width = `${(f * 100).toFixed(4)}%`;
      if (f >= 1) show(cur + 1);
    }
    requestAnimationFrame(tick);
  }
  dots.forEach((d, k) => { const b = d.querySelector('button'); if (b) b.addEventListener('click', () => show(k)); });
  prev.addEventListener('click', () => show(cur - 1));
  next.addEventListener('click', () => show(cur + 1));
  pauseBtn.addEventListener('click', () => {
    paused = !paused; dotsUl.classList.toggle('pause', paused);
    pauseBtn.replaceChildren(svg(paused ? FA_PLAY : FA_PAUSE)); pauseBtn.setAttribute('aria-label', paused ? 'Play' : 'Pause');
    if (!paused) { const bar = dots[cur].querySelector('.slider-progress-bar'); startedAt = performance.now() - (parseFloat(bar.style.width || '0') / 100) * AUTOPLAY; }
  });
  if (reduced) dotsUl.classList.add('pause');
  show(0);
  requestAnimationFrame(tick);
}
