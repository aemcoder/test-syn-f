/**
 * social-share — the share-this-article icon row of the article rail (source: cmp-socialshare).
 *
 * Authoring: one row per network, one cell — <p><a href="<share intent url>">Network</a></p>
 * (X / LinkedIn / Facebook). The brand glyph is injected per host; the authored link text stays
 * as a visually hidden label. Tier: reconstructive; the link paragraphs are MOVED (EW1/EW3).
 */

const ICONS = {
  'twitter.com': '<svg class="svg-inline--fa fa-x-twitter" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="x-twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>',
  'x.com': '<svg class="svg-inline--fa fa-x-twitter" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="x-twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>',
  'linkedin.com': '<svg class="svg-inline--fa fa-linkedin-in" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="linkedin-in" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path></svg>',
  'facebook.com': '<svg class="svg-inline--fa fa-facebook-f" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>',
};

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
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

export default function decorate(block) {
  const links = [...block.querySelectorAll('a')];
  const outer = el('div', 'socialShare');
  const wrap = el('div', 'background-component vert-pad-bottom-sm tocSictkyArticlesMobile');
  const container = el('div', 'container');
  const section = el('section', 'cmp-socialshare', { 'data-analytics-link-region': 'body' });
  links.forEach((a) => {
    const p = a.closest('p') || a;
    a.setAttribute('rel', 'noreferer noopener');
    if (!a.getAttribute('target')) a.setAttribute('target', '_blank');
    const label = el('span', 'visually-hidden');
    label.append(...a.childNodes);
    a.append(label);
    const svg = iconFor(a.getAttribute('href'));
    if (svg) a.insertAdjacentHTML('afterbegin', svg);
    section.append(p);
  });
  container.append(section);
  wrap.append(container);
  outer.append(wrap);
  block.replaceChildren(outer);
}
