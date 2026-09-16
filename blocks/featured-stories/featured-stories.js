/**
 * featured-stories — the blog-family "featured" composition of the success-stories / webinars
 * listing
 * pages (source: blogBanner[data-blog-banner-variant=landing] + rows of cmp-featured-blogbanner):
 * one lead story (wide picture with its title below) and a 4-up grid of story cards
 * (picture + title).
 *
 * Authoring rows, one per story:
 *   1. lead:  <p><img desktop></p> [<p><img mobile></p>] | [<p>date</p>]
 *             <p><a href>Story title</a></p>
 *             [<p>Feat. <a>Author</a>, <a>Author</a></p>]
 *   2..n:     <p><img></p> | [<p>date</p>] <h3><a href>Story title</a></h3> [<p>Feat. …</p>]
 * The optional date line precedes the title, the optional authors line follows it (webinars); the
 * source's author headshot circles are display:none on live and are not authored.
 * Tier: reconstructive; pictures, date, title and authors are MOVED (EW1), the picture link repeats
 * the title href. Cards are grouped 4 per row as the source does.
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  return node;
}

const pictures = (cell) => [...cell.querySelectorAll('picture, img')].filter((m) => !(m.tagName === 'IMG' && m.closest('picture')));
const hrefOf = (cell) => { const a = cell.querySelector('a'); return a ? a.getAttribute('href') : '#'; };
// title = the heading, else the first paragraph holding a link; date = paragraphs before it;
// authors = paragraphs after it
const fields = (cell) => {
  const kids = [...cell.children];
  const title = cell.querySelector('h1, h2, h3, h4, h5, h6')
    || kids.find((k) => k.matches('p') && k.querySelector('a')) || kids.find((k) => k.matches('p'));
  const idx = kids.indexOf(title);
  return { title, before: kids.slice(0, Math.max(idx, 0)).filter((k) => k.matches('p')), after: kids.slice(idx + 1).filter((k) => k.matches('p')) };
};

function lead(cells) {
  const [mediaCell, textCell] = cells;
  const host = el('div', 'blogBanner image');
  const container = el('div', 'container component-blog-banner-container');
  const section = el('section', 'cmp-blogbanner', { 'data-blog-banner-variant': 'landing', 'data-analytics-link-region': 'hero' });
  const inner = el('div', 'blog-banner');
  const bannerImg = el('div', 'banner-img');
  const [desk, mob] = pictures(mediaCell);
  [[desk, 'dm-desktop'], [mob, 'dm-mobile']].forEach(([pic, cls]) => {
    if (!pic) return;
    const img = pic.querySelector('img') || pic;
    if (cls === 'dm-desktop') { img.setAttribute('loading', 'eager'); img.setAttribute('fetchpriority', 'high'); }
    const link = el('a', 'banner-link', { href: hrefOf(textCell) });
    link.append(pic);
    const wrap = el('div', `${cls} component-image cmp-image`);
    wrap.append(link);
    bannerImg.append(wrap);
  });
  const overlay = el('div', 'text-overlay landing');
  const info = el('div', 'info-holder');
  const f = fields(textCell);
  if (f.before.length) { const d = el('div', 'date-time'); f.before.forEach((p) => d.append(p)); info.append(d); }
  const title = el('div', 'title');
  if (f.title) title.append(f.title);
  const authors = el('div', 'authors author-info');
  const links = el('div', 'authors-links');
  f.after.forEach((p) => links.append(p));
  authors.append(links);
  info.append(title, authors);
  overlay.append(info);
  inner.append(bannerImg, overlay);
  section.append(inner);
  container.append(section);
  host.append(container);
  return host;
}

function card(cells) {
  const [mediaCell, textCell] = cells;
  const col = el('div', 'col-xs-12 col-sm-3 four col-sm-6 col-md-3');
  const grid = el('div', 'aem-Grid');
  const host = el('div', 'blogBanner image');
  const container = el('div', 'container component-featured-blog-banner-container');
  const article = el('article', 'cmp-featured-blogbanner', { 'data-analytics-link-region': 'hero' });
  const [pic] = pictures(mediaCell);
  const picLink = el('a', 'pic-link', { href: hrefOf(textCell) });
  if (pic) picLink.append(pic);
  const f = fields(textCell);
  const heading = el('div', 'story-title');
  if (f.title) heading.append(f.title);
  const authors = el('div', 'authors blog-author-info');
  const links = el('div', 'authors-links');
  f.after.forEach((p) => links.append(p));
  authors.append(links);
  article.append(picLink);
  if (f.before.length) { const d = el('div', 'date-time'); f.before.forEach((p) => d.append(p)); article.append(d); }
  article.append(heading, authors);
  container.append(article);
  host.append(container);
  grid.append(host);
  col.append(grid);
  return col;
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children])
    .filter((cells) => cells.length >= 2);
  if (!rows.length) return;
  const column = el('div', 'column');
  const container = el('div', 'container');
  const row = el('section', 'component-column row');
  const col = el('div', 'col-xs-12');
  const grid = el('div', 'aem-Grid');
  grid.append(lead(rows[0]));
  // the source separates the lead from the grid with an empty text component (30px)
  const spacer = el('div', 'text');
  const spacerBg = el('div', 'background-component vert-pad-top-sm');
  spacerBg.append(el('div', 'container'));
  spacer.append(spacerBg);
  grid.append(spacer);
  const cards = rows.slice(1);
  for (let i = 0; i < cards.length; i += 4) {
    const rowHost = el('div', 'column');
    const rowContainer = el('div', 'container');
    const rowSection = el('section', 'component-column row row-cmp-featured-blogbanner');
    cards.slice(i, i + 4).forEach((cells) => rowSection.append(card(cells)));
    rowContainer.append(rowSection);
    rowHost.append(rowContainer);
    grid.append(rowHost);
  }
  col.append(grid);
  row.append(col);
  container.append(row);
  column.append(container);
  block.replaceChildren(column);
}
