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

export default function decorate(block) {
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
    a.classList.add('has-arrow');
    a.append(svg(FA_ARROW));
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
