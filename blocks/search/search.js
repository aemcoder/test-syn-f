/**
 * search — the Coveo results page of the listing template (newsroom, events, webinars, success
 * stories) rendered in its CAPTURED state. Live, the widget is a third-party shadow-DOM app
 * (Coveo Atomic); here the facets and the result cards are AUTHORED CONTENT (David's Model:
 * one row per repeating unit) so the page renders the gate-time result set without Coveo.
 * Delivery contract: the rows are a snapshot of the live index at capture time; a later index
 * integration replaces the authored rows with fetched ones and keeps this markup/CSS.
 *
 * Authoring rows (classified by shape, not position):
 *   head    (1 cell)  <h3>Search News Release</h3> <p>Search News Releases</p>   (placeholder)
 *   toolbar (4 cells) <p>Results <strong>1</strong>-<strong>10</strong> of <strong>745</strong></p>
 *                     | <p>Sort by:</p><ul><li><strong>Date</strong></li><li>Relevance</li></ul>
 *                     | <ul><li><strong>1</strong></li><li>2</li>…</ul> (pages; <strong> = current)
 *                     | <p>Results per page</p><ul><li><strong>10</strong></li><li>25</li>…</ul>
 *   facet   (3 cells) <h4>Year</h4> | <ul><li>2026</li>…</ul> | <p>Search</p> <p>Show more</p>
 *                     <p>Show less</p> <p>category</p>   (options: a facet search box with that
 *                     placeholder, the more/less controls, drill-down kind without checkboxes)
 *   result  (2 cells) <p><img></p> | <p>News Brief</p> [<p>Jul 27, 2026</p>]
 *                     <h4><a href>title</a></h4> <p>excerpt</p> then field pairs
 *                     <p>Tags:</p><ul><li>Ecosystem Partners</li></ul>
 * Tier: reconstructive. Authored nodes are MOVED (EW1); wrappers carry the classes (EW2).
 * Behaviour observed live and replicated: the list/grid view toggle swaps `.active`. Search box,
 * facets, sort and pager are the captured (inert) state — the search service is third-party.
 * @ew-exempt <p> search-box placeholder (head row) — metadata (input attribute)
 * @ew-exempt <ul> sort options, pager pages, results-per-page options (toolbar) — form controls
 * (EW7)
 * @ew-exempt <p> facet search placeholder, <p>category (facet options cell) — metadata / variant
 * selector
 */

const SEARCH_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m6.4 0c3.5 0 6.4 2.9 6.4 6.4 0 1.4-.4 2.7-1.2 3.7l4 4c.4.4.4 1 .1 1.5l-.1.1c-.2.2-.5.3-.8.3s-.6-.1-.8-.3l-4-4c-1 .7-2.3 1.2-3.7 1.2-3.4-.1-6.3-3-6.3-6.5s2.9-6.4 6.4-6.4zm0 2.1c-2.3 0-4.3 1.9-4.3 4.3s1.9 4.3 4.3 4.3 4.3-1.9 4.3-4.3-1.9-4.3-4.3-4.3z"></path></svg>';
const CARET = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.6 7.2"><path d="m11.3 7.04c-.3 0-.5-.1-.7-.3l-4.6-4.6-4.6 4.6c-.4.4-1 .4-1.4 0s-.4-1 0-1.4l5.2-5.2c.4-.4 1.2-.4 1.6 0l5.2 5.2c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3"></path></svg>';
const SORT_CARET = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.6 7.2"><path transform="matrix(-1 0 0 -1 12.366 7.086)" d="m11.421 7.04c-.3 0-.5-.1-.7-.3l-4.6-4.6-4.6 4.6c-.4.4-1 .4-1.4 0s-.4-1 0-1.4l5.2-5.2c.4-.4 1.2-.4 1.6 0l5.2 5.2c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3"></path></svg>';
const PLUS = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M496 208H304V16h-96v192H16v96h192v192h96V304h192"></path></svg>';
const MINUS = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="m64 208h384v96h-384z"></path></svg>';
const VIEW_LIST = '<svg class="svg-inline--fa fa-list" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="list" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"></path></svg>';
const VIEW_GRID = '<svg class="svg-inline--fa fa-grid" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="grid" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M0 72C0 49.9 17.9 32 40 32H88c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V72zM0 232c0-22.1 17.9-40 40-40H88c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V232zM128 392v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V392c0-22.1 17.9-40 40-40H88c22.1 0 40 17.9 40 40zM160 72c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V72zM288 232v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V232c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40zM160 392c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V392zM448 72v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V72c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40zM320 232c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V232zM448 392v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V392c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40z"></path></svg>';
const PREV = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="m11.5 4.8-4.3 4.5c-.3.4-.3.9 0 1.3l4.3 4.6c.3.4.9.4 1.2 0s.3-.9 0-1.3l-3.7-4 3.7-3.9c.3-.4.3-.9 0-1.3-.3-.3-.9-.3-1.2.1z"></path></svg>';
const NEXT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="m8.5 15.2 4.3-4.6c.3-.4.3-.9 0-1.3l-4.4-4.5c-.3-.4-.9-.4-1.2 0s-.3.9 0 1.3l3.7 4-3.7 3.9c-.3.4-.3.9 0 1.3.4.3 1 .3 1.3-.1z"></path></svg>';

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

const text = (node) => (node ? node.textContent.trim() : '');
const kids = (cell, sel) => (cell ? [...cell.querySelectorAll(`:scope > ${sel}`)] : []);

/* ---- row classification (by shape) ---- */
function classify(cells) {
  if (cells.some((c) => c.querySelector('picture, img'))) return 'result';
  if (cells.length >= 2 && cells[0].querySelector('h2, h3, h4, h5, h6') && cells[1].querySelector('ul')) return 'facet';
  if (cells.length >= 3) return 'toolbar';
  return 'head';
}

/* ---- head: title + search box ---- */
function buildHead(cell) {
  const section = el('section', 'atomic-search-section');
  const title = el('div', 'searchBoxTitle');
  const heading = cell ? cell.querySelector('h1, h2, h3, h4, h5, h6') : null;
  if (heading) title.append(heading);
  const placeholder = cell ? text(cell.querySelector('p')) : '';
  const topics = el('div', 'search-topics-container');
  const form = el('form', 'listing-searchbox', { role: 'search', action: '#' });
  form.addEventListener('submit', (e) => e.preventDefault()); // captured state: the search service is third-party
  const wrap = el('div', 'listing-searchbox__wrap');
  const submit = el('button', 'listing-searchbox__submit', { type: 'submit', 'aria-label': 'Search' });
  submit.append(svg(SEARCH_ICON));
  const input = el('input', '', { type: 'text', placeholder, 'aria-label': placeholder || 'Search' });
  wrap.append(submit, input);
  form.append(wrap);
  topics.append(form);
  section.append(title, topics);
  return section;
}

/* ---- toolbar: summary | sort | pages | per page ---- */
function options(cell) {
  // <p>label</p> + <ul><li>[<strong>]value</li>… — <strong> marks the selected entry
  // (EW-exempt form controls)
  const label = cell ? cell.querySelector('p') : null;
  const items = cell ? [...cell.querySelectorAll('li')].map((li) => ({ value: text(li), selected: !!li.querySelector('strong') })) : [];
  return { label, items };
}

function buildToolbar(cells, state) {
  const [summaryCell, sortCell, pagesCell, perPageCell] = cells;
  const toolbar = el('div', 'listing-toolbar');
  const summary = el('div', 'listing-summary');
  if (summaryCell) [...summaryCell.children].forEach((n) => summary.append(n));
  const refine = el('button', 'listing-refine', { type: 'button' });
  const refineLabel = el('span');
  refineLabel.textContent = 'Sort & Filter'; // widget chrome (mobile toggle label of the live widget)
  refine.append(refineLabel);
  const tools = el('div', 'listing-tools');
  const sort = el('div', 'listing-sort');
  const s = options(sortCell);
  if (s.label) { const l = el('div', 'listing-sort__label'); l.append(s.label); sort.append(l); }
  const selWrap = el('div', 'listing-sort__select');
  const select = el('select', '', { 'aria-label': 'Sort by' });
  s.items.forEach((o) => { const opt = el('option'); opt.textContent = o.value; if (o.selected) opt.selected = true; select.append(opt); });
  const caret = el('span', 'listing-sort__caret');
  caret.append(svg(SORT_CARET));
  selWrap.append(select, caret);
  sort.append(selWrap);
  const views = el('div', 'search-result__view-btn-contain');
  const list = el('button', 'search-result__view-btn-grid search-result__view-btn active', { type: 'button', 'aria-label': 'List view' });
  list.append(svg(VIEW_LIST));
  const grid = el('button', 'search-result__view-btn-list search-result__view-btn', { type: 'button', 'aria-label': 'Grid view' });
  grid.append(svg(VIEW_GRID));
  [list, grid].forEach((b) => b.addEventListener('click', () => { [list, grid].forEach((o) => o.classList.toggle('active', o === b)); })); // observed: only the class swap
  views.append(list, ' ', grid);
  tools.append(sort, views);
  toolbar.append(summary, refine, tools);

  // pagination row (rendered under the results)
  const pagination = el('div', 'listing-pagination');
  const pager = el('nav', 'listing-pager', { 'aria-label': 'Pagination' });
  const pg = options(pagesCell);
  const current = pg.items.findIndex((o) => o.selected);
  if (current > 0) { const prev = el('button', 'listing-pager__prev', { type: 'button', 'aria-label': 'Previous' }); prev.append(svg(PREV)); pager.append(prev); }
  pg.items.forEach((o) => { const b = el('button', `listing-pager__page${o.selected ? ' is-selected' : ''}`, { type: 'button', 'aria-label': `Page ${o.value}` }); if (o.selected) b.setAttribute('aria-current', 'page'); b.textContent = o.value; pager.append(b); });
  if (pg.items.length && current < pg.items.length - 1) { const next = el('button', 'listing-pager__next', { type: 'button', 'aria-label': 'Next' }); next.append(svg(NEXT)); pager.append(next); }
  const perPage = el('div', 'listing-per-page');
  const pp = options(perPageCell);
  if (pp.label) { const l = el('div', 'listing-per-page__label'); l.append(pp.label); perPage.append(l); }
  const opts = el('div', 'listing-per-page__options');
  pp.items.forEach((o) => { const b = el('button', `listing-per-page__option${o.selected ? ' is-selected' : ''}`, { type: 'button', 'aria-label': o.value }); b.textContent = o.value; opts.append(b); });
  perPage.append(opts);
  pagination.append(pager, perPage);
  state.toolbar = toolbar;
  state.pagination = pagination;
}

/* ---- facet: heading | values | options ---- */
function buildFacet(cells) {
  const [headCell, valuesCell, optCell] = cells;
  const opts = kids(optCell, 'p');
  const isCategory = opts.some((p) => /^category$/i.test(text(p)));
  const searchP = opts.find((p) => /^search/i.test(text(p)) && !/^show/i.test(text(p)));
  const moreP = opts.find((p) => /^show more/i.test(text(p)));
  const lessP = opts.find((p) => /^show less/i.test(text(p)));
  const facet = el('div', `listing-facet${isCategory ? ' listing-facet--category' : ''}`);
  const header = el('div', 'listing-facet__header', { role: 'button', tabindex: '0', 'aria-expanded': 'true' });
  const heading = headCell.querySelector('h2, h3, h4, h5, h6');
  const title = el('div', 'listing-facet__title');
  if (heading) title.append(heading);
  header.append(title, svg(CARET));
  facet.append(header);
  if (searchP) {
    const search = el('div', 'listing-facet__search');
    const ph = text(searchP);
    search.append(el('input', '', { type: 'text', placeholder: ph, 'aria-label': ph }));
    const icon = el('span', 'listing-facet__search-icon');
    icon.append(svg(SEARCH_ICON));
    search.append(icon);
    facet.append(search);
  }
  const values = el('div', 'listing-facet__values');
  const ul = valuesCell.querySelector('ul, ol');
  if (ul) {
    values.append(ul);
    [...ul.children].forEach((li) => { if (!isCategory) { li.setAttribute('role', 'checkbox'); li.setAttribute('aria-checked', 'false'); } li.setAttribute('tabindex', '0'); });
  }
  facet.append(values);
  if (moreP || lessP) {
    const more = el('div', 'listing-facet__more');
    if (moreP) { const b = el('div', 'listing-facet__more-btn', { role: 'button', tabindex: '0' }); b.append(svg(PLUS), moreP); more.append(b); }
    if (lessP) { const b = el('div', 'listing-facet__more-btn listing-facet__less', { role: 'button', tabindex: '0', hidden: '' }); b.append(svg(MINUS), lessP); more.append(b); }
    facet.append(more);
  }
  return facet;
}

/* ---- result: picture | badge, [date], heading, excerpt, field pairs ---- */
function buildResult(cells) {
  const mediaCell = cells.find((c) => c.querySelector('picture, img'));
  const textCell = cells.find((c) => c !== mediaCell) || mediaCell;
  const article = el('article', 'listing-result');
  const head = el('div', 'listing-result__head');
  const body = el('div', 'listing-result__body');
  const textWrap = el('div', 'listing-result__text');
  const heading = textCell.querySelector('h1, h2, h3, h4, h5, h6');
  const children = [...textCell.children];
  const hIdx = heading ? children.indexOf(heading) : -1;
  const before = children.slice(0, hIdx < 0 ? 0 : hIdx).filter((n) => n.matches('p'));
  const after = children.slice(hIdx + 1);
  const [badgeP, dateP] = before;
  const badge = el('div', 'listing-result__badge');
  if (badgeP) badge.append(badgeP); else badge.classList.add('listing-result__badge--empty');
  const date = el('div', 'listing-result__date');
  if (dateP) date.append(dateP);
  head.append(badge, date);
  const title = el('div', 'listing-result__title');
  if (heading) title.append(heading);
  textWrap.append(title);
  const fields = el('div', 'listing-result__fields');
  let excerptDone = false;
  for (let i = 0; i < after.length; i += 1) {
    const n = after[i];
    const next = after[i + 1];
    if (n.matches('p') && next && next.matches('ul, ol')) {
      const field = el('div', 'listing-result__field');
      const label = el('div', 'listing-result__field-label');
      label.append(n);
      const values = el('div', 'listing-result__field-values');
      values.append(next);
      field.append(label, ' ', values);
      fields.append(field);
      i += 1;
    } else if (n.matches('p') && !excerptDone) {
      const ex = el('div', 'listing-result__excerpt');
      ex.append(n);
      textWrap.append(ex);
      excerptDone = true;
    } else {
      textWrap.append(n); // leftovers pass: any other authored element stays visible
    }
  }
  textWrap.append(fields);
  body.append(textWrap);
  if (mediaCell) {
    const media = el('div', 'listing-result__media');
    const pic = mediaCell.querySelector('picture') || mediaCell.querySelector('img');
    if (pic) { const img = pic.querySelector('img') || pic; img.setAttribute('loading', 'lazy'); media.append(pic); }
    body.append(media);
  }
  article.append(head, body);
  return article;
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children]).filter((cells) => cells.length);
  const state = {};
  const facets = el('aside', 'listing-facets');
  const results = el('div', 'listing-results__list');
  let head = null;
  rows.forEach((cells) => {
    const kind = classify(cells);
    if (kind === 'head') head = buildHead(cells[0]);
    else if (kind === 'toolbar') buildToolbar(cells, state);
    else if (kind === 'facet') facets.append(buildFacet(cells));
    else results.append(buildResult(cells));
  });
  // a section head authored as default content before the block (D1) is reabsorbed into the
  // widget title (EW8)
  if (!head) head = buildHead(null);
  const prev = block.parentElement ? block.parentElement.previousElementSibling : null;
  if (prev && prev.classList.contains('default-content-wrapper') && !head.querySelector('.searchBoxTitle > *')) {
    const h = prev.querySelector('h1, h2, h3, h4, h5, h6');
    if (h) head.querySelector('.searchBoxTitle').append(h);
    if (!prev.children.length) prev.remove();
  }

  const wrapper = el('div', 'component-search-result', { 'data-analytics-link-region': 'body' });
  const container = el('div', 'press-release-container');
  const layout = el('div', 'listing-layout');
  const main = el('section', 'listing-main');
  if (state.toolbar) main.append(state.toolbar);
  const resultsWrap = el('div', 'listing-results');
  resultsWrap.append(results);
  main.append(resultsWrap);
  if (state.pagination) main.append(state.pagination);
  layout.append(facets, main);
  container.append(head, layout);
  wrapper.append(container);
  block.replaceChildren(wrapper);
}
