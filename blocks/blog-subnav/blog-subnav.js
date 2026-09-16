/**
 * blog-subnav — the blog section's sub-navigation bar (source XF "blog-sub-navigation"): blog title
 * link, search box, "Topics" toggle and the Browse-by-Tags panel. Authored once as
 * /fragments/blog-sub-navigation and linked from every blog page.
 *
 * Authoring rows (one cell each): 1. <p><a>blog title</a></p> · 2. <p>search placeholder</p> ·
 * 3. <p>Topics</p> · 4. <h2>panel title</h2>, <p>panel copy</p>, <ul> of tag links.
 * Tier: template-slotted. The Coveo search box is the captured static markup (no search backend on
 * this origin — residual); the authored nodes are MOVED into the slots (EW1), wrappers carry the
 * source classes (EW2); the Topics toggle is a div[role=button] hosting the authored paragraph
 * (EW7).
 * @ew-exempt <p> search placeholder (row 2) — the search input's placeholder (form control)
 * Observed behaviours: Topics toggles the panel (`opened` + `antiflicker`); the close button
 * closes it.
 */

const MAGNIFIER = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true" focusable="false" class="search-box-icon"><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>';

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  return node;
}

export default function decorate(block) {
  const cells = [...block.children].map((row) => row.firstElementChild).filter(Boolean);
  const [linkCell, searchCell, topicsCell, panelCell] = cells;
  const linkP = linkCell ? linkCell.querySelector('p') : null;
  const placeholder = searchCell ? searchCell.textContent.trim() : '';
  const topicsP = topicsCell ? topicsCell.querySelector('p') : null;

  const outer = el('div', 'experiencefragment');
  const xf = el('div', 'cmp-experiencefragment cmp-experiencefragment--blog-sub-navigation');
  const nav = el('div', 'blogsNav');
  const search = el('div', 'search');
  const result = el('div', 'component-search-result');
  const bar = el('div', 'blog-sub-nav-container');
  const container = el('div', 'container');
  const iface = el('div', 'atomic-search-interface hydrated', { id: 'blogSearchboxInterface' });
  const section = el('div', 'atomic-search-section');
  const ext = el('div', 'atomic-external hydrated', { id: 'blogSearchBoxExt' });
  const title = el('div', 'blog-title-cta-link');
  if (linkP) title.append(linkP);
  const topics = el('div', 'search-topics-container');
  const box = el('div', 'atomicSearchbox hydrated', { role: 'search' });
  const submit = el('button', 'search-box-submit', { type: 'button', 'aria-label': 'Search' });
  submit.insertAdjacentHTML('afterbegin', MAGNIFIER);
  const input = el('input', 'search-box-input', {
    type: 'search', placeholder, 'aria-label': placeholder, autocomplete: 'off',
  });
  box.append(submit, input);
  topics.append(box);
  const browse = el('div', 'browse-blog-topics', { 'aria-expanded': 'false' });
  const toggle = el('div', 'blog-topics-btn p-0', { role: 'button', tabindex: '0' });
  if (topicsP) toggle.append(topicsP);
  browse.append(toggle);
  ext.append(title, topics, browse);
  section.append(ext);
  iface.append(section);
  container.append(iface);
  bar.append(container);
  result.append(bar);
  search.append(result);
  nav.append(search);

  const holder = el('div', 'blogsDev browseByTagsHolder', { id: 'browseByTagsHolder' });
  const holderContainer = el('div', 'container');
  const panel = el('section', 'cmp-blogsdev', { 'data-blogsdev-type': 'browseByTags', 'data-analytics-link-region': 'utility' });
  if (panelCell) {
    const heading = panelCell.querySelector('h1, h2, h3');
    const copy = panelCell.querySelector('p');
    const list = panelCell.querySelector('ul');
    if (heading) panel.append(heading);
    if (copy) panel.append(copy);
    if (list) { const tags = el('div', 'cmp-blogsdev__pagetags-container p-0 d-flex'); tags.append(list); panel.append(tags); }
  }
  const close = el('a', 'close-button', { href: '#', rel: 'nofollow', 'aria-label': 'Close' });
  panel.append(close);
  holderContainer.append(panel);
  holder.append(holderContainer);
  nav.append(holder);
  xf.append(nav);
  outer.append(xf);
  block.replaceChildren(outer);

  /* observed: the first open adds `antiflicker` (kept), `opened` toggles on holder + button */
  const setOpen = (open) => {
    holder.classList.add('antiflicker');
    holder.classList.toggle('opened', open);
    toggle.classList.toggle('opened', open);
  };
  const flip = () => setOpen(!holder.classList.contains('opened'));
  toggle.addEventListener('click', flip);
  toggle.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  close.addEventListener('click', (e) => { e.preventDefault(); setOpen(false); });
}
