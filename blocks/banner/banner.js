/**
 * banner — the skinny CTA banner ("Connect with Us" + Contact Sales) shared across pages via the
 * /fragments/connect-with-us fragment. Variant `skinny`. Schema: stardust/eds-schema/home.json
 * section 11.
 *
 * Authoring: one row, two cells — <h3>title</h3> | <p><strong><a href>CTA</a></strong></p>.
 * Tier: template-slotted (fixed composition): the prototype's banner DOM with two role slots;
 * authored nodes are
 * MOVED into them (EW1/EW3), the CTA paragraph keeps its editor index.
 */

const FA_PLAY = '<svg class="svg-inline--fa fa-play" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path></svg>';
const FA_DOWNLOAD = '<svg class="svg-inline--fa fa-arrow-down-to-line" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-down-to-line" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 480zM214.6 342.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 242.7 160 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 178.7 73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128z"></path></svg>';
const FA_ARROW = '<svg class="svg-inline--fa fa-chevron-right arrow-icon" aria-hidden="true" focusable="false" data-prefix="far" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M305 239c9.4 9.4 9.4 24.6 0 33.9L113 465c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l175-175L79 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L305 239z"></path></svg>';

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

/* ---- image variant: landing hero with breadcrumb, background pictures, title, subtitle,
   video CTA and buttons ---- */
const media = (cell) => [...cell.querySelectorAll('picture, img')].filter((m) => !(m.tagName === 'IMG' && m.closest('picture')));

function breadcrumb(ul) {
  const container = el('div', 'breadcrumb-container image-background dark-mode');
  const inner = el('div', 'container');
  const section = el('section', 'component-breadcrumb', { 'data-analytics-link-region': 'breadcrumb' });
  const nav = el('nav', 'clearfix', { id: 'primary_nav_wrap' });
  [...ul.children].forEach((li) => {
    // the pipeline wraps a list item's inline content in <p> when the item also holds a nested list
    const a = li.querySelector(':scope > a, :scope > p > a');
    if (a) {
      a.classList.add('parent');
      // the source rules key on li > a; the list is one editor, so the wrapper carries no index of
      // its own
      if (a.parentElement.tagName === 'P') a.parentElement.replaceWith(a);
    }
    const menu = li.querySelector(':scope > ul');
    if (menu) {
      menu.className = 'dropdown-menu';
      menu.setAttribute('role', 'menu');
      menu.querySelectorAll('a').forEach((x) => x.classList.add('subBreadcrumb'));
      li.insertBefore(document.createTextNode(' '), menu); // the source keeps a space before the arrow
      li.insertBefore(el('div', 'icon-dropdown-arrow'), menu);
    }
  });
  nav.append(ul);
  section.append(nav);
  inner.append(section);
  container.append(inner);
  // observed: hovering a crumb opens its menu, the arrow toggles it, an outside click closes
  const items = [...ul.children];
  const closeAll = () => items.forEach((li) => { const m = li.querySelector(':scope > ul.dropdown-menu'); if (m) m.classList.remove('active'); });
  items.forEach((li) => {
    const menu = li.querySelector(':scope > ul.dropdown-menu');
    const arrow = li.querySelector(':scope > .icon-dropdown-arrow');
    const link = li.querySelector(':scope > a, :scope > p > a');
    if (!menu) return;
    if (link) link.addEventListener('mouseenter', () => { closeAll(); menu.classList.add('active'); });
    if (arrow) arrow.addEventListener('click', (e) => { e.stopPropagation(); const open = menu.classList.contains('active'); closeAll(); if (!open) menu.classList.add('active'); });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.component-breadcrumb')) closeAll(); });
  return container;
}

function decorateImage(block) {
  const rows = [...block.children].map((row) => [...row.children]);
  const cells = rows.map((r) => r[0]).filter(Boolean);
  const crumbCell = cells.find((c) => c.querySelector('ul') && !c.querySelector('picture, img, h1, h2'));
  const mediaCell = cells.find((c) => c.querySelector('picture, img'));
  const textCell = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6')) || cells[cells.length - 1];
  const configPs = mediaCell ? [...mediaCell.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img') && p.textContent.trim()) : [];
  const config = configPs.map((p) => p.textContent.trim().toLowerCase());

  const section = el('section', 'component-banner', { 'data-card-type': 'banner', 'data-analytics-link-region': 'hero' });
  if (config.includes('desktop-on-mobile')) section.classList.add('dm-desktop-on-mobile');
  const wrapper = el('div', 'desktop-wrapper breadcrumbTrue reg-banner');
  wrapper.append(el('div', 'image-overlay opacity-0'));
  if (crumbCell) wrapper.append(breadcrumb(crumbCell.querySelector('ul')));
  const bannerImg = el('div', 'banner-img');
  bannerImg.append(el('div', 'cropped-img'), el('div', 'bg-mobile black-gradient'));
  const [desk, mob] = mediaCell ? media(mediaCell) : [];
  [[desk, 'dm-desktop'], [mob, 'dm-mobile']].forEach(([pic, cls]) => {
    if (!pic) return;
    const host = el('div', `${cls} component-image cmp-image`);
    const img = pic.querySelector('img') || pic;
    img.classList.add('img-responsive');
    if (cls === 'dm-desktop') { img.loading = 'eager'; img.setAttribute('fetchpriority', 'high'); }
    host.append(pic);
    bannerImg.append(host);
  });
  const configHost = el('div', 'banner-config visually-hidden'); // authored config tokens stay editable (EW1)
  configPs.forEach((p) => configHost.append(p));
  bannerImg.append(configHost);
  wrapper.append(bannerImg);

  const overlay = el('div', 'text-overlay flex-container content-align-center text-align-center');
  const content = el('div', 'content-wrapper text-width-80 paddingSmall');
  const textWrap = el('div', 'text-wrapper contentValignCenter');
  const outerText = el('div', 'component-text');
  const heading = textCell.querySelector('h1, h2, h3, h4, h5, h6');
  const paragraphs = [...textCell.querySelectorAll('p')];
  const linkPs = paragraphs.filter((p) => p.querySelector('a'));
  const plain = paragraphs.filter((p) => !p.querySelector('a') && p.textContent.trim());
  const titleP = plain.find((p) => p.querySelector('strong')) || plain[0];
  const subs = plain.filter((p) => p !== titleP);
  const title = el('div', 'title');
  if (heading) { heading.classList.add('ui-helper-hidden-accessible'); title.append(heading); }
  const visible = el('div', 'text-size-normal');
  visible.style.color = '#ffffff';
  if (titleP) visible.append(titleP);
  title.append(visible);
  const innerText = el('div', 'component-text');
  if (subs.length) { const sub = el('div', 'sub-title'); sub.style.color = '#ffffff'; subs.forEach((p) => sub.append(p)); innerText.append(sub); }
  linkPs.forEach((p) => {
    const a = p.querySelector('a');
    const secondary = a.classList.contains('secondary') || !!p.querySelector('em');
    const primary = a.classList.contains('primary') || !!p.querySelector('strong');
    const label = el('span', primary || secondary ? '' : 'btn-text');
    label.append(...a.childNodes);
    if (primary || secondary) {
      const btn = el('div', `component-button ${secondary ? 'secondary' : 'primary'} dark${secondary ? ' video-secondary-button' : ''} darkButtonRollover`);
      a.append(secondary ? svg(FA_DOWNLOAD) : svg(FA_ARROW), ' ', label, ' ');
      btn.append(p);
      innerText.append(btn);
    } else {
      // a plain link = the video CTA (play glyph); the link opens the player the source modal wraps
      const video = el('div', 'cmp-video cmp-video-cta', { 'data-provider': 'Brightcove', 'data-mode': 'modal' });
      const thumb = el('div', 'cmp-video__thumbnail component-button dark darkButtonRollover');
      a.append(svg(FA_PLAY), label, ' ');
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      thumb.append(p);
      video.append(thumb);
      innerText.append(video);
    }
  });
  outerText.append(title, innerText);
  textWrap.append(outerText);
  content.append(textWrap);
  overlay.append(content);
  wrapper.append(overlay);
  section.append(wrapper);
  block.replaceChildren(section);
}

/* ---- skinny-hero variant (listing family): the 285px skinny hero with breadcrumb of the listing
   pages
   (newsroom, blogs, events). Authoring rows: 1. <ul> breadcrumb (nested <ul> = dropdown),
   2. optional
   <p><img></p> background picture (no picture = the dark-purple gradient band), 3. <h1>Page</h1> +
   <p><strong>Page</strong></p> (the visible title; the h1 is the accessible one, as the source).
   Tier: template-slotted; authored nodes are MOVED (EW1/EW3). ---- */
function decorateSmall(block) {
  const cells = [...block.children].map((row) => [...row.children])
    .map((r) => r[0]).filter(Boolean);
  const crumbCell = cells.find((c) => c.querySelector('ul') && !c.querySelector('picture, img, h1, h2'));
  const mediaCell = cells.find((c) => c.querySelector('picture, img'));
  const textCell = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6')) || cells[cells.length - 1];
  const gradient = !mediaCell || block.classList.contains('gradient');
  const section = el('section', 'componentSkinnyBanner component-banner', { 'data-card-type': 'banner', 'data-analytics-link-region': 'hero' });
  const wrapper = el('div', gradient ? 'desktop-wrapper small-banner bg-desktop dark-purple-gradient' : 'desktop-wrapper small-banner');
  wrapper.append(el('div', 'image-overlay opacity-0'));
  if (crumbCell) {
    const crumbs = breadcrumb(crumbCell.querySelector('ul'));
    crumbs.className = gradient ? 'breadcrumb-container gradient-background dark-purple-gradient' : 'breadcrumb-container image-background dark-mode';
    wrapper.append(crumbs);
  }
  const bannerImg = el('div', 'banner-img');
  bannerImg.append(el('div', 'cropped-img'));
  if (mediaCell) {
    const [desk, mob] = media(mediaCell);
    [[desk, 'dm-desktop'], [mob, 'dm-mobile']].forEach(([pic, cls]) => {
      if (!pic) return;
      const host = el('div', `${cls} component-image cmp-image`);
      const img = pic.querySelector('img') || pic;
      img.classList.add('img-responsive');
      if (cls === 'dm-desktop') { img.loading = 'eager'; img.setAttribute('fetchpriority', 'high'); }
      host.append(pic);
      bannerImg.append(host);
    });
    if (!mob) section.classList.add('dm-desktop-on-mobile'); // a lone desktop picture shows at every width (source per-instance style)
  }
  wrapper.append(bannerImg);
  const overlay = el('div', 'text-overlay flex-container text-align-center');
  const content = el('div', 'content-wrapper');
  const textWrap = el('div', 'text-wrapper contentValignCenter');
  const outerText = el('div', 'component-text');
  const title = el('div', 'title');
  const heading = textCell ? textCell.querySelector('h1, h2, h3, h4, h5, h6') : null;
  if (heading) { heading.classList.add('ui-helper-hidden-accessible'); title.append(heading); }
  const visible = el('div', 'text-size-normal');
  visible.style.color = '#ffffff';
  const paragraphs = textCell ? [...textCell.querySelectorAll('p')] : [];
  const titleP = paragraphs.find((p) => !p.querySelector('a') && p.textContent.trim());
  if (titleP) visible.append(titleP);
  title.append(visible);
  const innerText = el('div', 'component-text');
  const sub = el('div', 'sub-title');
  sub.style.color = '#ffffff';
  paragraphs.filter((p) => p !== titleP && !p.querySelector('a') && p.textContent.trim()).forEach((p) => sub.append(p));
  innerText.append(sub);
  outerText.append(title, innerText);
  textWrap.append(outerText);
  content.append(textWrap);
  overlay.append(content);
  wrapper.append(overlay);
  section.append(wrapper);
  block.replaceChildren(section);
}

export default function decorate(block) {
  if (block.classList.contains('skinny-hero')) { decorateSmall(block); return; } // listing family: skinny hero with breadcrumb
  if (block.classList.contains('image')) { decorateImage(block); return; }
  const cells = [...block.children].flatMap((row) => [...row.children]);
  if (!cells.length) return;
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const ctas = [...block.querySelectorAll('p')].filter((p) => p.querySelector('a'));
  const copy = [...block.querySelectorAll('p')].filter((p) => !ctas.includes(p) && p.textContent.trim());

  const section = el('section', 'componentSkinnyBanner component-banner', { 'data-card-type': 'banner', 'data-analytics-link-region': 'banner' });
  const wrapper = el('div', 'desktop-wrapper small-banner bg-desktop dark-purple-gradient');
  const bannerImg = el('div', 'banner-img');
  bannerImg.append(el('div', 'cropped-img'), el('div', 'image-overlay opacity-0'));
  const overlay = el('div', 'text-overlay flex-container text-align-center');
  const content = el('div', 'content-wrapper');
  const textWrap = el('div', 'text-wrapper contentValignCenter');
  const outerText = el('div', 'component-text');
  const title = el('div', 'title');
  if (heading) title.append(heading);
  copy.forEach((p) => title.append(p));
  const innerText = el('div', 'component-text');
  ctas.forEach((p) => {
    const a = p.querySelector('a');
    const secondary = a.classList.contains('secondary') || (!a.classList.contains('button') && !!p.querySelector('em'));
    const btn = el('div', `component-button ${secondary ? 'secondary' : 'primary'} dark darkButtonRollover`);
    btn.append(p);
    if (block.classList.contains('arrow')) { a.classList.add('has-arrow'); a.append(svg(FA_ARROW)); }
    innerText.append(btn);
  });
  outerText.append(title, innerText);
  textWrap.append(outerText);
  content.append(textWrap);
  overlay.append(content);
  wrapper.append(bannerImg, overlay);
  section.append(wrapper);
  block.replaceChildren(section);
}
