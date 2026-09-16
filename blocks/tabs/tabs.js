/**
 * tabs — the "AI For Every Function" vertical floating tabs (source: component-floating-tabs):
 * a left rail of tab names, the active tab's content on the right; below 730 the tabs form a
 * single-open accordion (+ / −).
 *
 * Authoring rows: one per tab, one cell — <p><a href="/<page>/tabs/<tab>">Tab name</a></p>: the
 * link text is the tab name, its target the tab's content fragment (sections with text and
 * box-links), loaded here and moved into the tab body. Tier: template-slotted; the authored
 * paragraph is MOVED into the rail item (EW1, display: contents), the accordion header repeats it
 * as a stripped clone (EW4).
 * Behaviours (observed): rail click activates + sets the hash; header click toggles (mobile).
 */
import { loadFragment } from '../fragment/fragment.js';

const CHEVRON = '<svg class="svg-inline--fa fa-chevron-right" aria-hidden="true" focusable="false" data-prefix="far" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M305 239c9.4 9.4 9.4 24.6 0 33.9L113 465c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l175-175L79 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L305 239z"></path></svg>';

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

const slugify = (s) => s.toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default async function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children])
    .filter((cells) => cells.length && cells[cells.length - 1].querySelector('a'));
  const container = el('div', 'container component-floating-tabs-container');
  const section = el('section', 'component-floating-tabs vertical-tabs', { 'data-analytics-link-region': 'expandable' });
  const rail = el('div', 'tabs-nav');
  const content = el('div', 'tabs-content');
  const tabs = rows.map((cells, i) => {
    const linkCell = cells[cells.length - 1];
    const nameP = linkCell.querySelector('p') || linkCell;
    const anchor = nameP.querySelector('a');
    const name = anchor.textContent.trim();
    const id = slugify(name);
    const fragmentPath = new URL(anchor.href, window.location.href).pathname;
    anchor.className = `tab-nav-item-anchor${i === 0 ? ' active' : ''}`;
    anchor.setAttribute('href', `#${id}`);
    anchor.append(' ', svg(CHEVRON));
    const item = el('div', 'tab-nav-item');
    item.append(nameP); // authored paragraph moved (display: contents via tabs.css)
    rail.append(item);
    const tab = el('section', `floating-tab${i === 0 ? ' active' : ''}`, { id });
    const header = el('div', 'tab-header');
    const title = el('a', 'tab-header-title', { href: `#${id}` });
    title.append(` ${name} `);
    const open = el('span', `tab-open${i === 0 ? ' hide' : ''}`);
    open.textContent = '+';
    const close = el('span', `tab-close${i === 0 ? '' : ' hide'}`);
    close.textContent = '-';
    header.append(title, open, close);
    const body = el('div', `tab-body${i === 0 ? ' active' : ''}`);
    const grid = el('div', 'aem-Grid');
    body.append(grid);
    tab.append(header, body);
    content.append(tab);
    return {
      tab, anchor, grid, path: fragmentPath,
    };
  });
  section.append(rail, content);
  container.append(section);
  block.replaceChildren(container);

  await Promise.all(tabs.map(async (t) => {
    if (!t.path) return;
    const fragment = await loadFragment(t.path);
    if (fragment) t.grid.append(...fragment.querySelectorAll(':scope > .section, :scope > div'));
  }));

  /* ---- behaviours ---- */
  const mq = window.matchMedia('(min-width: 730px)');
  function activate(id, allowClose) {
    tabs.forEach((t) => {
      let on = t.tab.id === id;
      if (allowClose && on && t.tab.classList.contains('active')) on = false;
      t.tab.classList.toggle('active', on);
      t.tab.querySelector('.tab-body').classList.toggle('active', on);
      t.tab.querySelector('.tab-open').classList.toggle('hide', on);
      t.tab.querySelector('.tab-close').classList.toggle('hide', !on);
      t.anchor.classList.toggle('active', on);
    });
  }
  tabs.forEach((t) => {
    t.anchor.addEventListener('click', (e) => {
      e.preventDefault();
      activate(t.tab.id, false);
      if (window.history.replaceState) window.history.replaceState(null, '', `#${t.tab.id}`);
    });
    t.tab.querySelector('.tab-header').addEventListener('click', (e) => { e.preventDefault(); activate(t.tab.id, !mq.matches); });
  });
  const hash = window.location.hash.replace(/^#/, '');
  if (hash && tabs.some((t) => t.tab.id === hash)) activate(hash, false);
}
