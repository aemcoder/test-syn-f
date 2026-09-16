/**
 * marketo-form — the gated-asset hero of campaign/webinar landing pages (source:
    component-marketo-form-container):
 * a text column (title + description) beside a white form card. The Marketo form keeps its
    captured rendered
 * state — no live Marketo; the observed client-side validation is replicated (empty required
    fields → mktoInvalid,
 * one error message under the first).
 *
 * Authoring rows (one cell unless noted):
 *   1. <h1>title</h1> + description (<p>, <ul>)
 *   2. <h2>form title</h2>
 * 3..N field rows, three cells: <p>label</p> (<strong> = required) | <p>type</p> (text, email,
    tel, select,
 *      textarea) | <ul> options for a select (an <em> item is the placeholder option)
 *   note rows: <p>…</p> (the "Required Fields *" note, the consent text)
 *   last: <p><strong>submit label</strong></p>
 * Variant `purple` = the purple-gradient ground (white title/description).
 * Tier: template-slotted; labels, notes, title and description are MOVED (EW1/EW2).
 * @ew-exempt <p> type cell (cell 2 of a field row) — configuration, never displayed
 * @ew-exempt <ul> select options (cell 3 of a field row) — rendered as <option> elements (form
    control)
 * @ew-exempt <p> submit label — rendered inside the submit <button> (form control, EW7)
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  return node;
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const TYPES = /^(text|email|tel|select|textarea|checkbox|number|url)$/i;

function fieldRow(cells, index) {
  const [labelCell, typeCell, optCell] = cells;
  const labelP = labelCell.querySelector('p') || labelCell;
  const required = !!labelP.querySelector('strong');
  const type = typeCell.textContent.trim().toLowerCase();
  const id = `mkto-${slug(labelP.textContent) || index}`;
  const row = el('div', 'mktoFormRow');
  const col = el('div', 'mktoFieldDescriptor mktoFormCol');
  const wrap = el('div', `mktoFieldWrap${required ? ' mktoRequiredField' : ''}`);
  const label = el('label', 'mktoLabel mktoHasWidth', { for: id, id: `Lbl${id}` });
  const asterix = el('div', 'mktoAsterix');
  asterix.textContent = '*';
  label.append(asterix, labelP);
  let field;
  if (type === 'select') {
    field = el('select', 'mktoField mktoHasWidth', { id, name: id });
    const opts = optCell ? [...optCell.querySelectorAll('li')] : [];
    opts.forEach((li) => {
      const placeholder = !!li.querySelector('em');
      const opt = el('option', '', { value: placeholder ? '' : li.textContent.trim() });
      opt.textContent = li.textContent.trim();
      field.append(opt);
    });
  } else if (type === 'textarea') {
    field = el('textarea', 'mktoField mktoHasWidth', { id, name: id, rows: '3' });
  } else {
    const typeClass = { email: 'mktoEmailField', tel: 'mktoTelField' }[type] || 'mktoTextField';
    field = el('input', `mktoField ${typeClass} mktoHasWidth`, {
      id, name: id, type, maxlength: '255',
    });
  }
  if (required) { field.classList.add('mktoRequired'); field.setAttribute('aria-required', 'true'); }
  field.setAttribute('aria-labelledby', `Lbl${id}`);
  wrap.append(label, field, el('div', 'mktoClear'));
  col.append(wrap, el('div', 'mktoClear'));
  row.append(col, el('div', 'mktoClear'));
  return row;
}

function noteRow(cell, first) {
  const row = el('div', 'mktoFormRow');
  const col = el('div', `mktoFormCol${first ? ' requiredFieldLabel' : ''}`);
  const wrap = el('div', 'mktoFieldWrap');
  const html = el('div', 'mktoHtmlText mktoHasWidth');
  html.append(...cell.childNodes);
  wrap.append(html, el('div', 'mktoClear'));
  col.append(wrap, el('div', 'mktoClear'));
  row.append(col, el('div', 'mktoClear'));
  return row;
}

/* observed form behaviour (stardust/replica/motion/contact.json): submit marks empty required
   fields, one message */
function validate(form) {
  const messages = { email: 'Please enter valid Email Address.', required: 'This field is required.' };
  form.querySelectorAll('.mktoError').forEach((e) => e.remove());
  let first = null;
  form.querySelectorAll('.mktoFieldWrap').forEach((w) => {
    const f = w.querySelector('.mktoField');
    if (!f) return;
    const required = w.classList.contains('mktoRequiredField');
    const empty = !String(f.value || '').trim();
    const bad = required && empty;
    f.classList.toggle('mktoInvalid', bad);
    f.classList.toggle('mktoValid', !bad);
    if (bad && !first) first = f;
  });
  if (first) {
    const err = el('div', 'mktoError');
    const arrow = el('div', 'mktoErrorArrowWrap');
    arrow.append(el('div', 'mktoErrorArrow'));
    const msg = el('div', 'mktoErrorMsg', { role: 'alert', tabindex: '-1' });
    msg.textContent = first.classList.contains('mktoEmailField') ? messages.email : messages.required;
    err.append(arrow, msg);
    first.after(err);
    first.focus();
  }
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children]);
  const textRow = rows.find((r) => r[0] && r[0].querySelector('h1'));
  const titleRow = rows.find((r) => r[0] && r[0].querySelector('h2') && !r[0].querySelector('h1'));
  const rest = rows.filter((r) => r !== textRow && r !== titleRow)
    .filter((r) => r.some((c) => c.textContent.trim()));

  const outer = el('div', 'marketoFormsContainer');
  const section = el('section', `component-marketo-form-container${block.classList.contains('purple') ? ' purpleGradientBackground' : ' whiteBackground'}`, { 'data-analytics-link-region': 'body' });
  const container = el('div', 'container');
  const row = el('div', 'row');
  const textCol = el('div', 'col-xs-12 col-sm-7 text-col');
  const textInner = el('div');
  if (textRow) {
    const cell = textRow[0];
    const h1 = cell.querySelector('h1');
    const title = el('div', 'title');
    if (h1) title.append(h1);
    const desc = el('div', 'description component-text');
    desc.append(...cell.childNodes);
    textInner.append(title, desc);
  }
  textCol.append(textInner);
  const gap = el('div', 'col-sm-1');
  gap.innerHTML = '&nbsp;';
  const formCol = el('div', 'col-xs-12 col-sm-4 mktoForm-col');
  const formInner = el('div');
  const formSection = el('section', 'snps-aem-mktoForm', { 'data-analytics-link-region': 'body' });
  const formContainer = el('div', 'container');
  const formRow = el('div', 'row');
  const titleCol = el('div', 'col-xs-12');
  if (titleRow) {
    const textcomp = el('div', 'component-textcomp text-align-center');
    const ct = el('div', 'component-text');
    const title = el('div', 'title');
    title.append(titleRow[0].querySelector('h2'));
    ct.append(title);
    textcomp.append(ct);
    titleCol.append(textcomp);
  }
  const fieldsCol = el('div', 'col-xs-12');
  const form = el('form', 'mktoForm mktoHasWidth mktoLayoutAbove', { novalidate: 'novalidate' });
  let notes = 0;
  let submit = null;
  rest.forEach((cells, i) => {
    const type = cells[1] ? cells[1].textContent.trim() : '';
    if (cells.length >= 2 && TYPES.test(type)) { form.append(fieldRow(cells, i)); return; }
    const p = cells[0].querySelector('p');
    const strong = p ? p.querySelector('strong') : null;
    if (p && strong && strong.textContent.trim() === p.textContent.trim()) { submit = p; return; }
    form.append(noteRow(cells[0], notes === 0));
    notes += 1;
  });
  const buttonRow = el('div', 'mktoButtonRow');
  const buttonWrap = el('span', 'mktoButtonWrap mktoSimple');
  const button = el('button', 'mktoButton', { type: 'submit' });
  if (submit) button.append(submit); else button.textContent = 'Submit';
  buttonWrap.append(button);
  buttonRow.append(buttonWrap);
  form.append(buttonRow);
  form.addEventListener('submit', (e) => { e.preventDefault(); validate(form); });
  fieldsCol.append(form);
  formRow.append(titleCol, fieldsCol);
  formContainer.append(formRow);
  formSection.append(formContainer);
  formInner.append(formSection);
  formCol.append(formInner);
  row.append(textCol, gap, formCol);
  container.append(row);
  section.append(container);
  outer.append(section);
  block.replaceChildren(outer);
}
