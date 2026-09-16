/**
 * toc — the product "Table of Contents" bar under a landing hero (source: cmp-tableofcontents,
 * product layout). Sticks below the fixed nav once reached, highlights the section in view,
 * offers a
 * "Get Started" CTA and a scroll-to-top button; on mobile it collapses to the active title.
 *
 * Authoring rows: 1. <p>Table of Contents</p> (mobile label) · 2. <ul> of <a href="#id">links</a>
 * · 3. optional <p><strong><a>CTA</a></strong></p>. Targets are sections carrying section-metadata
 * `id` (delivered as data-id); the block gives them their id so URL hashes resolve too.
 * Tier: template-slotted; authored anchors and paragraphs are MOVED (EW1/EW3).
 * Behaviours are the observed ones (stardust/replica/motion/ai.json): sticky, active section,
 * mobile open toggle, smooth scroll, scroll-to-top.
 */

const CARET = '<svg class="svg-inline--fa fa-caret-down" aria-hidden="true" focusable="false" data-prefix="fass" data-icon="caret-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M320 240L160 384 0 240l0-48 320 0 0 48z"></path></svg>';

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

/* ---- pinned variant (landing family, /products): the article-layout TOC — a 25% column that
   sticks at top:128px
   (≥730, CSS sticky) while the page's FOLLOWING sections scroll in the 75% column the block adopts
   (the sections up to
   the next fragment/banner section or a section carrying data-pinned-end; EW9: whole decorated
   sections are moved).
   Below 730 it is the collapsed mobile bar (fixed once scrolled past, tap to open). Rows: 1.
   <p>Table of Contents</p>
   2. <ul> of <a href="#id">links</a>; targets are the adopted sections' section-metadata ids
   (data-id).
   Behaviours ported from the article prototype (stardust/prototypes/js/article.js): sticky, active
   section, mobile open
   toggle, link scroll, scroll-to-top. The mobile init row repeats the label as a stripped clone
   (EW4). ---- */
function decoratePinned(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]);
  const label = cells.map((c) => c.querySelector('p')).find((p) => p && !p.querySelector('a'));
  const list = block.querySelector('ul');
  const mySection = block.closest('.section');
  const adopted = [];
  let s = mySection && mySection.nextElementSibling;
  while (s && s.classList.contains('section') && !s.querySelector('.fragment, .banner') && !s.hasAttribute('data-pinned-end')) { adopted.push(s); s = s.nextElementSibling; }
  adopted.forEach((sec) => { if (sec.dataset.id && !sec.id) sec.id = sec.dataset.id; });

  const column = el('div', 'column');
  const container = el('div', 'container');
  const row = el('section', 'component-column row');
  const left = el('div', 'col-xs-12 col-sm-3 two2575PinnedLeft tocSictkyArticlesMobile');
  const leftGrid = el('div', 'aem-Grid');
  const holder = el('div', 'tableOfContents');
  const inner = el('div', 'container');
  const section = el('section', 'cmp-tableofcontents table-of-contents-article-layout', { 'data-hide-progress-bar': 'true', 'data-analytics-link-region': 'utility' });
  const header = el('div', 'cmp-tableofcontents__header');
  const title = el('div', 'cmp-tableofcontents__title');
  if (label) title.append(label);
  header.append(title);
  const contentList = el('div', 'cmp-tableofcontents__content-list');
  const ul = list || el('ul');
  ul.className = 'cmp-tableofcontents__content-list-wraper';
  const init = el('li', 'init');
  const initA = el('a');
  const initSpan = el('span');
  const initLabel = label ? stripInstrumentation(label.cloneNode(true)) : null;
  if (initLabel) initSpan.append(initLabel);
  initA.append(initSpan, svg(CARET));
  init.append(initA);
  [...ul.children].forEach((li) => {
    li.className = 'cmp-tableofcontents__content-item';
    const a = li.querySelector('a');
    if (a) {
      const wrap = el('div', 'cmp-tableofcontents__content-item-wraper');
      a.className = 'cmp-tableofcontents__content-item-text';
      a.dataset.href = a.getAttribute('href');
      wrap.append(a);
      li.append(wrap);
    }
  });
  ul.prepend(init);
  contentList.append(ul);
  section.append(header, contentList);
  const topP = el('p', 'cmp-tableofcontents__scroll-to-top-container');
  const topA = el('a', 'cmp-tableofcontents__scroll-to-top visible', { 'data-href': '#', href: '#', 'aria-label': 'Scroll to top' });
  topP.append(topA);
  section.append(topP);
  inner.append(section);
  holder.append(inner);
  leftGrid.append(holder);
  left.append(leftGrid);
  const right = el('div', 'col-xs-12 col-sm-9 two2575Right');
  const rightGrid = el('div', 'aem-Grid');
  adopted.forEach((sec) => rightGrid.append(sec));
  right.append(rightGrid);
  row.append(left, right);
  container.append(row);
  column.append(container);
  block.replaceChildren(column);

  /* ---- behaviours ---- */
  const mq = window.matchMedia('(min-width: 730px)');
  const links = [...ul.querySelectorAll('.cmp-tableofcontents__content-item-text')];
  const targetFor = (link) => { const id = (link.dataset.href || '').replace(/^.*#/, ''); return document.getElementById(id) || adopted.find((sec) => sec.dataset.id === id) || null; };
  const initText = (t) => {
    if (initLabel) initLabel.textContent = t; else initSpan.textContent = t;
  };
  const defaultLabel = label ? label.textContent : '';
  function onScroll() {
    let stickyNow = mq.matches ? left.getBoundingClientRect().top <= 128 : section.getBoundingClientRect().top <= 70 || holder.classList.contains('makeSticky');
    if (!mq.matches && holder.classList.contains('makeSticky')) stickyNow = holder.getBoundingClientRect().top <= 70;
    holder.classList.toggle('makeSticky', !!stickyNow);
    const zone = window.innerHeight * 0.6;
    let activeIdx = -1;
    links.forEach((l, i) => {
      const t = targetFor(l);
      if (!t) return;
      const { top } = t.getBoundingClientRect();
      if (top >= 0 && top <= zone) activeIdx = i;
    });
    if (activeIdx < 0) {
      const past = links.map((l) => targetFor(l))
        .filter((t) => t && t.getBoundingClientRect().top < 0);
      if (past.length) activeIdx = links.findIndex((l) => targetFor(l) === past[past.length - 1]);
    }
    links.forEach((l, i) => l.classList.toggle('activeSection', i === activeIdx));
    if (!mq.matches) initText(activeIdx >= 0 ? links[activeIdx].textContent : defaultLabel);
  }
  links.forEach((l) => l.addEventListener('click', (e) => {
    e.preventDefault();
    const t = targetFor(l);
    if (t) { t.scrollIntoView({ block: 'start', behavior: 'smooth' }); if (window.history.replaceState) window.history.replaceState(null, '', l.dataset.href); }
    section.classList.remove('open');
  }));
  init.addEventListener('click', () => section.classList.toggle('open'));
  topA.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  if ('ResizeObserver' in window) new ResizeObserver(onScroll).observe(block);
  onScroll();
}

export default function decorate(block) {
  if (block.classList.contains('pinned')) { decoratePinned(block); return; }
  const cells = [...block.children].flatMap((row) => [...row.children]);
  const label = cells.map((c) => c.querySelector('p')).find((p) => p && !p.querySelector('a'));
  const list = block.querySelector('ul');
  const cta = [...block.querySelectorAll('p')].map((p) => p.querySelector('a')).find(Boolean);

  // TOC targets: sections carrying section-metadata `id` get a real id (URL hashes resolve)
  document.querySelectorAll('main .section[data-id]').forEach((s) => { if (!s.id) s.id = s.dataset.id; });

  const holder = el('div', 'tableOfContents');
  const section = el('section', 'table-of-contents-product-layout cmp-tableofcontents', { 'data-hide-progress-bar': 'true', 'data-analytics-link-region': 'utility' });
  const container = el('div', 'container');
  const init = el('li', 'init');
  const initA = el('a');
  const initSpan = el('span');
  if (label) initSpan.append(...label.childNodes);
  initA.append(initSpan, svg(CARET));
  init.append(initA);
  const ul = list || el('ul');
  ul.className = 'table-of-contents-product-layout-ul';
  [...ul.children].forEach((li) => {
    li.className = 'cmp-productsolutions__content-item';
    const a = li.querySelector('a');
    if (a) {
      a.className = 'cmp-productsolutions__content-item-text';
      a.dataset.href = a.getAttribute('href');
      a.dataset.text = a.textContent.trim();
    }
  });
  ul.prepend(init);
  container.append(ul);
  if (cta) {
    const btn = el('div', 'cmp-productsolutions__button-link');
    cta.className = 'cmp-productsolutions__button-text';
    cta.title = cta.textContent.trim();
    btn.append(cta);
    container.append(btn);
  }
  section.append(container);
  const topP = el('p', 'cmp-tableofcontents__scroll-to-top-container');
  const topA = el('a', 'cmp-tableofcontents__scroll-to-top visible', { 'data-href': '#', href: '#', 'aria-label': 'Scroll to top' });
  topP.append(topA);
  section.append(topP);
  holder.append(section);
  const gradient = el('div', 'container gradient-class');
  const pc = el('div', 'linear-gradient-pc');
  pc.style.display = 'none';
  pc.append(el('div', 'linear-gradient-ol'), el('div', 'linear-gradient-bg'));
  gradient.append(el('div', 'linear-gradient-class'), pc);
  holder.append(gradient);
  block.replaceChildren(holder);

  /* ---- behaviours (ported from the gated prototype) ---- */
  const mq = window.matchMedia('(min-width: 730px)');
  const nav = () => document.getElementById('topNav');
  const links = [...ul.querySelectorAll('.cmp-productsolutions__content-item-text')];
  const initDefault = initSpan.textContent.trim();
  let activeId = null;
  const anchors = () => [...document.querySelectorAll('main .section[data-id]')];
  const hdrH = () => (nav() ? nav().offsetHeight : 80);
  function onScroll() {
    if (!holder.offsetParent && !holder.classList.contains('makeSticky')) return; // section still hidden
    const h = hdrH();
    const holderTop = holder.getBoundingClientRect().top;
    const stickyNow = holder.classList.contains('makeSticky') ? holderTop <= h : section.getBoundingClientRect().top <= h;
    holder.classList.toggle('makeSticky', !!stickyNow);
    section.style.top = `${h}px`;
    const zone = window.innerHeight * 0.6;
    const zoneTop = h + section.offsetHeight;
    const list2 = anchors();
    list2.forEach((s) => {
      const t = s.getBoundingClientRect().top;
      if (t >= zoneTop && t <= zone) activeId = s.dataset.id;
    });
    if (list2[0] && list2[0].getBoundingClientRect().top > zone) activeId = null;
    let activeLink = null;
    links.forEach((l) => { const on = activeId && (l.dataset.href || '') === `#${activeId}`; l.classList.toggle('activeSection', !!on); if (on) activeLink = l; });
    if (!mq.matches) {
      initSpan.textContent = activeLink ? activeLink.textContent.trim() : initDefault;
    }
  }
  links.forEach((l) => l.addEventListener('click', (e) => {
    e.preventDefault();
    const id = (l.dataset.href || '').replace(/^#/, '');
    const t = document.getElementById(id);
    if (t) {
      const offset = hdrH() + section.offsetHeight - 1;
      const y = t.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      if (window.history.replaceState) window.history.replaceState(null, '', `#${id}`);
    }
    section.classList.remove('open');
  }));
  init.addEventListener('click', () => section.classList.toggle('open'));
  topA.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  if ('ResizeObserver' in window) new ResizeObserver(onScroll).observe(holder);
  onScroll();
}
