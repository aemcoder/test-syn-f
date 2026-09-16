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

export default function decorate(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]);
  const label = cells.map((c) => c.querySelector('p'))
    .find((p) => p && !p.querySelector('a'));
  const list = block.querySelector('ul');
  const ctaP = [...block.querySelectorAll('p')]
    .find((p) => p.querySelector('a'));
  const cta = ctaP ? ctaP.querySelector('a') : null;

  // TOC targets: sections carrying section-metadata `id` — delivered as a real id (rendering v2);
  // the client-side path leaves it as data-id, so promote that too
  document.querySelectorAll('main .section[data-id]').forEach((s) => { if (!s.id) s.id = s.dataset.id; });

  const holder = el('div', 'tableOfContents');
  const section = el('section', 'table-of-contents-product-layout cmp-tableofcontents', { 'data-hide-progress-bar': 'true', 'data-analytics-link-region': 'utility' });
  const container = el('div', 'container');
  const init = el('li', 'init');
  const initA = el('a');
  const initSpan = el('span');
  // the authored paragraph itself (EW1); display: contents via toc.css
  if (label) initSpan.append(label);
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
    ctaP.className = 'button-wrapper'; // neutralised wrapper (display: contents via toc.css)
    btn.append(ctaP);
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
  const anchors = () => [...document.querySelectorAll('main .section[id]')];
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
      if (t >= zoneTop && t <= zone) activeId = s.id;
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
