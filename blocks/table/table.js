/**
 * table — the source's data tables (cmp-table): the DAC session schedules. Block Collection model
    — one block
 * row per table row, the first row is the header. Group-level cells (Date, Time, Type, Session,
    Presentation,
 * Location) are authored on the group's first row and left EMPTY on the continuation rows; the
    block renders
 * them as rowspans (the pipeline strips authored colspan/rowspan — probed). A group starts at a
    row whose first
 * cell has content; an empty header cell merges into the previous header cell (colspan). A
    trailing key-value
 * row `widths | 111 117 …` carries the source cells' width attributes (auto-layout hints: the
    source table rule
 * `width: calc(200px * var(--column-count))` is invalid on the page, so the table lays out
    automatically at
 * min-width 100%).
 * Tier: reconstructive; every cell's authored nodes are MOVED into its <td> (EW1).
 * @ew-exempt <p> widths row (key `widths`) — configuration, never displayed
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  return node;
}

const filled = (cell) => !!(cell && (cell.textContent.trim() || cell.querySelector('picture, img')));

export default function decorate(block) {
  const rows = [...block.children].map((r) => [...r.children]);
  let widths = [];
  const last = rows[rows.length - 1];
  if (last && last[0] && /^widths$/i.test(last[0].textContent.trim())) {
    widths = (last[1] ? last[1].textContent.trim() : '').split(/\s+/).map(Number);
    rows.pop();
  }
  const wrap = el('div', 'cmp-text cmp-table', { 'data-analytics-link-region': 'table' });
  const table = el('table');
  const tbody = el('tbody');
  const cellWidth = (td, col) => { if (widths[col] > 0 && td.colSpan === 1) td.style.width = `${widths[col]}px`; };
  if (!block.classList.contains('no-header') && rows.length) {
    const header = rows.shift();
    const thead = el('thead');
    const tr = el('tr');
    let prev = null;
    const starts = new Map();
    header.forEach((cell, col) => {
      if (!filled(cell) && prev) { prev.colSpan += 1; return; }
      const td = el('td');
      td.append(...cell.childNodes);
      tr.append(td);
      starts.set(td, col);
      prev = td;
    });
    // width hints as the source: a spanning header cell carries the sum of its columns' widths
    starts.forEach((col, td) => {
      const sum = widths.slice(col, col + td.colSpan).reduce((n, w) => n + (w > 0 ? w : 0), 0);
      if (sum > 0) td.style.width = `${sum}px`;
    });
    thead.append(tr);
    table.append(thead);
  }
  const ncols = rows.reduce((n, r) => Math.max(n, r.length), 0);
  const groups = [];
  rows.forEach((cells) => {
    if (filled(cells[0]) || !groups.length) groups.push([]);
    groups[groups.length - 1].push(cells);
  });
  groups.forEach((grp, gi) => {
    // rules: within a group between its rows (cont), below a single-row group (single), none
    // between a multi-row group and the next one — the source's per-row border pattern
    const stripe = gi % 2 ? 'even' : 'odd';
    const single = grp.length === 1 ? ' single' : '';
    const trs = grp.map((c, r) => el('tr', `${stripe}${r > 0 ? ' cont' : ''}${single}`));
    for (let col = 0; col < ncols; col += 1) {
      for (let r = 0; r < grp.length; r += 1) {
        const cell = grp[r][col];
        const continuation = r > 0 && !filled(cell);
        if (cell && !continuation) {
          let span = 1;
          while (r + span < grp.length && grp[r + span][col] && !filled(grp[r + span][col])) {
            span += 1;
          }
          const td = el('td');
          if (span > 1) td.rowSpan = span;
          td.append(...cell.childNodes);
          cellWidth(td, col);
          trs[r].append(td);
        }
      }
    }
    trs.forEach((tr) => tbody.append(tr));
  });
  table.append(tbody);
  wrap.append(table);
  block.replaceChildren(wrap);
}
