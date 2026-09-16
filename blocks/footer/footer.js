/**
 * footer — Synopsys site footer (stardust:replica Phase 5, template-slotted chrome, D12).
 *
 * Authored document: /footer (content/footer.html), sections in this fixed order:
 *   1. logo link            — <p><a href><img alt></a></p>            → .logo-top (and, cloned +
 * instrumentation-stripped, .logo-bottom)
 *   2–5. link columns       — <h3> + <ul> of <li><a>                    →
 * nav.col-xs-6.col-sm-5ths.col-lg-5ths (aria-label = the heading text)
 *   6. language list        — <ul> of <li><a> (current language first)   → <select
 * class="global-nav-link-select"> (built from the list; the
 *                                                                          authored list stays in
 * the DOM, visually hidden, so it remains editable)
 *   7. social links         — <ul> of <li><a href title>                → .social-icons-wrapper ul
 * (brand SVG glyph injected per host, text kept hidden)
 *   8. copyright / legal    — one <p> with text and links                → .copyright
 *
 * DOM = the gated prototype's footer (stardust/scripts/lib/chrome.mjs § FOOTER) with
 * div.site-footer as the root class hook.
 * Experience Workspace: authored elements are MOVED into wrapper slots (EW1); wrappers carry the
 * layout classes (EW2).
 * @ew-exempt <select> options — derived from the authored language list (section 6), which stays
 * editable in the DOM.
 * Observed behaviour (stardust/replica/motion/home.json): ≤992px a column heading toggles its list
 * (nav.active).
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const ICONS = {
  'x.com': '<svg class="svg-inline--fa fa-x-twitter" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="x-twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>',
  'twitter.com': '<svg class="svg-inline--fa fa-x-twitter" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="x-twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>',
  'linkedin.com': '<svg class="svg-inline--fa fa-linkedin-in" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="linkedin-in" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path></svg>',
  'facebook.com': '<svg class="svg-inline--fa fa-facebook" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"></path></svg>',
  'youtube.com': '<svg class="svg-inline--fa fa-youtube" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="youtube" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg>',
  'instagram.com': '<svg class="svg-inline--fa fa-instagram" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="instagram" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>',
};

function el(tag, className, attrs = {}) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  Object.entries(attrs).forEach(([k, v]) => { if (v != null) e.setAttribute(k, v); });
  return e;
}

// Presentational clones must not keep the editor's indices (EW4).
function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  node.removeAttribute('data-image-index');
  return node;
}

function iconFor(href) {
  try {
    const host = new URL(href, window.location.href).hostname.replace(/^www\./, '');
    const key = Object.keys(ICONS).find((k) => host === k || host.endsWith(`.${k}`));
    return key ? ICONS[key] : '';
  } catch (e) {
    return '';
  }
}

/** Section 1 → logo slot: the authored <p><a><picture> moves in whole. */
function logoSlot(section, className) {
  const wrap = el('div', className);
  const p = section.querySelector('p');
  if (p) wrap.append(p);
  return wrap;
}

/**
 * Sections 2–5 → one nav column each; the authored h3 + ul move in, the heading text names
 * the landmark.
 */
function columnSlot(section) {
  const heading = section.querySelector('h1, h2, h3, h4');
  const list = section.querySelector('ul');
  const nav = el('nav', 'col-xs-6 col-sm-5ths col-lg-5ths', { role: 'navigation', 'aria-label': heading ? heading.textContent.trim() : null });
  if (heading) nav.append(heading);
  if (list) nav.append(list);
  // observed on live ≤992px: tapping the heading toggles the column list
  if (heading) heading.addEventListener('click', () => { if (window.matchMedia('(min-width: 993px)').matches) return; nav.classList.toggle('active'); });
  return nav;
}

/** Section 6 → the language <select>; the authored list stays (hidden) for editing. */
function languageSlot(section) {
  const col = el('div', 'col-xs-6 col-sm-5ths col-lg-5ths');
  const row = el('div', 'row'); const inner = el('div', 'col-xs-12'); const dd = el('div', 'global-footer-dropdown');
  const list = section.querySelector('ul');
  const select = el('select', 'global-nav-link-select', { name: 'dropdown', 'aria-label': 'Language' });
  if (list) {
    [...list.querySelectorAll('li')].forEach((li, i) => {
      const a = li.querySelector('a');
      const opt = el('option', 'global-nav-link', { value: a ? a.getAttribute('href') : '' });
      opt.textContent = li.textContent.trim();
      if (i === 0 || li.querySelector('strong')) opt.selected = true;
      select.append(opt);
    });
    select.addEventListener('change', () => { if (select.value) window.location.assign(select.value); });
    list.setAttribute('aria-hidden', 'true');
    dd.append(select, list);
  }
  inner.append(dd); row.append(inner); col.append(row);
  return col;
}

/** Section 7 → social icon row: brand glyph per host, authored link text kept (visually hidden). */
function socialList(section) {
  const list = section.querySelector('ul');
  if (!list) return null;
  [...list.querySelectorAll('a')].forEach((a) => {
    const svg = iconFor(a.getAttribute('href'));
    if (!a.getAttribute('title')) a.setAttribute('title', a.textContent.trim());
    const label = el('span', 'visually-hidden');
    label.append(...a.childNodes);
    a.append(label);
    if (svg) a.insertAdjacentHTML('afterbegin', svg);
  });
  return list;
}

/**
 * Section 8 → copyright row: the authored paragraph is the flex row; its leading text becomes
 * the padded span.
 */
function copyrightSlot(section) {
  const wrap = el('div', 'copyright');
  const p = section.querySelector('p');
  if (p) {
    const first = p.firstChild;
    if (first && first.nodeType === 3 && first.textContent.trim()) {
      const span = document.createElement('span');
      const text = first.textContent; const m = text.match(/^(.*?)(\s*\|\s*)$/);
      if (m) {
        const [, lead, rest] = m;
        span.textContent = lead;
        first.textContent = rest;
        p.insertBefore(span, first);
      } else {
        span.append(first);
        p.prepend(span);
      }
    }
    p.querySelectorAll('a[href^="#cookie"]').forEach((a) => { a.removeAttribute('href'); a.classList.add('optanon-show-settings'); });
    wrap.append(p);
  }
  return wrap;
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  block.textContent = '';
  if (!fragment) return;
  const sections = [...fragment.querySelectorAll(':scope > .section, :scope > div')];
  const [logo, ...rest] = sections;
  const columns = rest.slice(0, 4);
  const [language, social, copyright] = rest.slice(4);

  const root = el('div', 'site-footer', { 'data-analytics-link-region': 'footer' });
  const container = el('div', 'container');
  root.append(container);

  const logoTop = logo ? logoSlot(logo, 'logo-top') : null;
  if (logoTop) container.append(logoTop);

  const links = el('div', 'row links-wrapper');
  columns.forEach((s) => links.append(columnSlot(s)));
  if (language) links.append(languageSlot(language));
  container.append(links);

  const socialWrap = el('div', 'social-icons-wrapper d-flex');
  const socialUl = social ? socialList(social) : null;
  if (socialUl) socialWrap.append(socialUl);
  if (logoTop) { const bottom = el('div', 'logo-bottom'); const clone = logoTop.firstElementChild ? stripInstrumentation(logoTop.firstElementChild.cloneNode(true)) : null; if (clone) bottom.append(clone); socialWrap.append(bottom); }
  container.append(socialWrap);

  if (copyright) container.append(copyrightSlot(copyright));
  block.append(root);
}
