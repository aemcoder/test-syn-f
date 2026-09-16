/**
 * blog-banner — the gradient title banner of blog / technical / glossary articles (source:
 * cmp-blogbanner, variant "article"): breadcrumb trail, title, authors, date and read time.
 *
 * Authoring rows: 1. <ul> of breadcrumb links · 2. <h1>title</h1>, <p>author links</p>,
 * <p>date / read time</p>. Variant class = the source gradient (`purple-purple`, `purple-blue`,
 * `green-blue`, `blue-blue`).
 * Tier: template-slotted; the authored nodes are MOVED into the banner's slots (EW1), the wrappers
 * carry the source classes (EW2). The date paragraph's text is split into date / slash / read-time
 * spans (presentation refinement inside the authored element — same textContent).
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  return node;
}

/* "Jul 25, 2023 / 5 min read" → <span class="date">…</span> <span class="slash">/</span>
   <span class="read-time">…</span> */
function splitDate(p) {
  const node = [...p.childNodes].find((n) => n.nodeType === 3 && n.textContent.includes(' / '));
  if (!node) return;
  const [before, after] = node.textContent.split(' / ');
  const date = el('span', 'date');
  date.textContent = before;
  const slash = el('span', 'slash');
  slash.textContent = '/';
  const read = el('span', 'read-time');
  read.textContent = after;
  node.replaceWith(date, ' ', slash, ' ', read);
}

const GRADIENTS = ['purple-purple', 'purple-blue', 'green-blue', 'blue-blue'];

export default function decorate(block) {
  const list = block.querySelector('ul');
  const heading = block.querySelector('h1, h2, h3');
  const paragraphs = [...block.querySelectorAll('p')];
  const authors = paragraphs.find((p) => p.querySelector('a'));
  const date = paragraphs.find((p) => p !== authors && p.textContent.trim());
  const gradient = GRADIENTS.find((g) => block.classList.contains(g)) || 'purple-purple';

  const outer = el('div', 'blogBanner image');
  const container = el('div', 'container component-blog-banner-container');
  const section = el('section', 'cmp-blogbanner', { 'data-blog-banner-variant': 'article', 'data-analytics-link-region': 'hero' });
  const banner = el('div', `blog-banner ${gradient}-gradient`);
  const overlay = el('div', 'text-overlay');
  if (list) {
    const crumb = el('div', 'breadcrumb');
    const nav = el('nav', 'clearfix', { id: 'primary_nav_wrap' });
    nav.append(list);
    crumb.append(nav);
    overlay.append(crumb);
  }
  const info = el('div', 'info-holder');
  if (heading) { const t = el('div', 'title'); t.append(heading); info.append(t); }
  if (authors) { const w = el('div', 'authors'); w.append(authors); info.append(w); }
  if (date) { const w = el('div', 'date-time'); splitDate(date); w.append(date); info.append(w); }
  overlay.append(info);
  banner.append(overlay);
  section.append(banner);
  container.append(section);
  outer.append(container);
  block.replaceChildren(outer);
}
