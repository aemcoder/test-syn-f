/**
 * form — the Marketo (forms2) contact forms of synopsys.com in their CAPTURED rendered state
 * (company/contact-us, contact-sales): a purple gradient band with the page intro on the left (the
 * section's default content — <h1> + description paragraph/list — reabsorbed into the text column,
 * EW8) and the white form card on the right. No live Marketo: nothing is posted; the observed
 * client-side validation (empty required fields → red border + one error message under the first
 * one) is reproduced from stardust/prototypes/js/form.js.
 *
 * Delivery contract — one row per captured field, three cells: label | type [flags] | options/copy
 *   <h2>Form title</h2>                        |            |      a heading in cell 1 = card title
 *   <p>Required Fields <strong>*</strong></p>  | note       |         free text row (mktoHtmlText)
 *   <p><strong>Business Email:</strong></p>    | email      |         <strong> label = required
 *   <p>Phone:</p>                               | tel        |         plain label = optional
 *   <p><strong>Country/Region:</strong></p>    | select     | <ul><li>Select...</li><li>…</li></ul>
 *   <p>Additional Information:</p>             | textarea rows-2 full-width | flags: rows-N,
 *                                                                     full-width (two-column form)
 *                                              | checkbox   | <p>consent copy with <a>links</a></p>
 *   <p>submit</p>                               | submit     |         the button label
 * Types: note, text, email, tel, url, number, date, select, textarea, checkbox, submit. Field ids
 * and names derive from the label. Variant `two-column` = the source's two-column form grid
 * (contact-sales). Marketo's hidden tracking inputs and dependent placeholder rows are runtime
 * state, not content (residual).
 * Tier: template-slotted per field; labels, notes, the title and the consent copy are MOVED
 * (EW1/EW2).
 * @ew-exempt <p> field type and flags (cell 2) — metadata, never displayed
 * @ew-exempt <ul> select options (cell 3) — rendered as <option>s; a <select> cannot host an editor
 * @ew-exempt <p> submit label (type submit) — a <button> cannot host the editor (EW7)
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  return node;
}

const clear = () => el('div', 'mktoClear');
const idOf = (label) => label.replace(/:\s*$/, '').replace(/[^A-Za-z0-9]+/g, '') || 'field';
const text = (node) => (node ? node.textContent.trim() : '');
const TYPE_CLASS = {
  email: 'mktoEmailField', tel: 'mktoTelField', url: 'mktoUrlField', number: 'mktoNumberField', date: 'mktoDateField',
};

function fieldRow(kind, flags, labelP, optionsCell, form) {
  const strong = labelP ? labelP.querySelector('strong') : null;
  const required = !!strong && text(strong) === text(labelP);
  const label = text(labelP);
  const id = idOf(label || kind);
  const req = required ? ' mktoRequired' : '';
  const labelledby = `Lbl${id} Instruct${id}`;
  const row = el('div', `mktoFormRow${flags.includes('full-width') ? ' full-width' : ''}`);
  const col = el('div', 'mktoFieldDescriptor mktoFormCol');
  const wrap = el('div', `mktoFieldWrap${required ? ' mktoRequiredField' : ''}`);
  const lbl = el('label', 'mktoLabel mktoHasWidth', { for: id, id: `Lbl${id}` });
  const asterix = el('div', 'mktoAsterix');
  asterix.textContent = '*';
  lbl.append(asterix);
  if (labelP) {
    // the mark means "required"; Marketo bolds required labels via CSS
    if (required) strong.replaceWith(...strong.childNodes);
    lbl.append(labelP);
  }
  wrap.append(lbl, el('div', 'mktoGutter mktoHasWidth'));
  let field;
  if (kind === 'select') {
    field = el('select', `mktoField mktoHasWidth${req}`, { id, name: id, 'aria-labelledby': labelledby });
    const list = optionsCell ? optionsCell.querySelector('ul, ol') : null;
    if (list) {
      [...list.children].forEach((li) => {
        const t = text(li);
        const o = el('option');
        o.value = /^select\.{3}$/i.test(t) ? '' : t;
        o.textContent = t;
        if (li.querySelector('strong')) o.selected = true;
        field.append(o);
      });
      list.remove();
    }
  } else if (kind === 'textarea') {
    const rows = (flags.find((f) => /^rows-\d+$/.test(f)) || 'rows-2').slice(5);
    field = el('textarea', `mktoField mktoHasWidth${req}`, {
      id, name: id, rows, maxlength: '255', 'aria-labelledby': labelledby,
    });
  } else if (kind === 'checkbox') {
    field = el('div', 'mktoLogicalField mktoCheckboxList mktoHasWidth');
    const boxId = `mktoCheckbox_${id}`;
    const input = el('input', 'mktoField', {
      name: id, id: boxId, type: 'checkbox', value: 'yes', 'aria-labelledby': `Lbl${id} Lbl${boxId} Instruct${id}`,
    });
    const copyLabel = el('label', '', { for: boxId, id: `Lbl${boxId}` });
    if (optionsCell) {
      copyLabel.append(...[...optionsCell.children].filter((n) => n.tagName !== 'P' || text(n)));
    }
    field.append(input, copyLabel);
    lbl.style.width = '0px';
  } else {
    field = el('input', `mktoField ${TYPE_CLASS[kind] || 'mktoTextField'} mktoHasWidth${req}`, {
      id, name: id, maxlength: '255', type: kind, 'aria-labelledby': labelledby,
    });
  }
  if (required && field.tagName !== 'DIV') field.setAttribute('aria-required', 'true');
  wrap.append(field, el('span', 'mktoInstruction', { id: `Instruct${id}`, tabindex: '-1' }), clear());
  col.append(wrap, clear());
  row.append(col, clear());
  form.append(row);
}

function noteRow(copyP, first, form) {
  const row = el('div', 'mktoFormRow');
  const col = el('div', `mktoFormCol${first ? ' requiredFieldLabel' : ''}`);
  const wrap = el('div', 'mktoFieldWrap');
  const html = el('div', 'mktoHtmlText mktoHasWidth');
  if (copyP) html.append(copyP);
  wrap.append(html, clear());
  col.append(el('div', 'mktoOffset mktoHasWidth'), wrap, clear());
  row.append(col, clear());
  form.append(row);
}

/* observed Marketo validation (stardust/prototypes/js/form.js): submit with empty required fields
   → mktoInvalid on each, mktoValid on the others, one .mktoError under the first invalid field;
   nothing is posted */
function validation(form, button) {
  const messages = { email: 'Please enter valid Email Address.', required: 'This field is required.' };
  const fieldOf = (w) => w.querySelector('.mktoField, .mktoLogicalField');
  const isEmpty = (f) => {
    if (!f) return true;
    if (f.classList.contains('mktoLogicalField')) return !f.querySelector('input:checked');
    if (f.tagName === 'SELECT') return !f.value;
    return !String(f.value || '').trim();
  };
  const showError = (f, msg) => {
    const err = el('div', 'mktoError');
    const arrowWrap = el('div', 'mktoErrorArrowWrap');
    arrowWrap.append(el('div', 'mktoErrorArrow'));
    const m = el('div', 'mktoErrorMsg', { id: `ValidMsg${f.name || f.id || ''}`, tabindex: '-1', role: 'alert' });
    m.textContent = msg;
    err.append(arrowWrap, m);
    f.parentNode.insertBefore(err, f.nextSibling);
  };
  button.addEventListener('click', (e) => {
    e.preventDefault();
    form.querySelectorAll('.mktoError').forEach((x) => x.remove());
    let first = null;
    form.querySelectorAll('.mktoFieldWrap').forEach((w) => {
      const f = fieldOf(w);
      if (!f || f.type === 'hidden') return;
      const required = w.classList.contains('mktoRequiredField') || f.classList.contains('mktoRequired');
      const bad = required && isEmpty(f);
      f.classList.toggle('mktoInvalid', bad);
      f.classList.toggle('mktoValid', !bad);
      if (bad && !first) first = f;
    });
    if (first) {
      const email = first.classList.contains('mktoEmailField');
      showError(first, email ? messages.email : messages.required);
      if (first.focus) first.focus();
    }
  });
}

/* the section's default content (intro heading + description) becomes the text column — nodes are
   MOVED and the emptied wrapper removed (EW8); the heading text gets the source's presentation
   <span> (white, text-size-larger) */
function textColumn(block, textCol) {
  const head = block.parentElement && block.parentElement.previousElementSibling;
  if (!head || !head.classList.contains('default-content-wrapper')) return;
  const inner = el('div');
  const heading = head.querySelector('h1, h2, h3');
  if (heading) {
    const span = document.createElement('span');
    span.className = 'text-size-larger';
    span.style.color = '#FFF';
    span.append(...heading.childNodes);
    heading.append(span);
    inner.append(heading);
  }
  const description = el('div', 'description component-text');
  description.append(...head.childNodes);
  inner.append(description, el('div', 'component-image', { 'data-analytics-link-region': 'body' }));
  textCol.append(inner);
  head.remove();
}

export default function decorate(block) {
  const twoColumn = block.classList.contains('two-column');
  const rows = [...block.children].map((row) => [...row.children]).filter((cells) => cells.length);

  const host = el('div', `marketoFormsContainer image${twoColumn ? ' two-column' : ''}`);
  const section = el('section', 'component-marketo-form-container purpleGradientBackground', {
    'data-analytics-link-region': 'body',
  });
  const container = el('div', 'container');
  const row = el('div', 'row');
  const textColClass = twoColumn ? 'col-xs-12 text-col left-section col-sm-6 col-12' : 'col-xs-12 col-sm-7 text-col';
  const textCol = el('div', textColClass);
  const gutter = el('div', 'col-sm-1');
  gutter.innerHTML = '&nbsp;';
  const formColClass = twoColumn ? 'mktoForm-col right-section col-sm-5 col-12' : 'col-xs-12 col-sm-4 mktoForm-col';
  const formCol = el('div', formColClass);
  textColumn(block, textCol);

  // form card
  const card = el('div');
  const mkto = el('section', 'snps-aem-mktoForm', { 'data-analytics-link-region': 'body' });
  const mktoContainer = el('div', 'container');
  const mktoRow = el('div', 'row');
  mktoRow.style.display = 'block';
  const titleRow = rows.find((cells) => cells[0] && cells[0].querySelector('h1, h2, h3, h4'));
  if (titleRow) {
    const col = el('div', 'col-xs-12');
    const textcomp = el('div', 'component-textcomp text-align-center');
    const ct = el('div', 'component-text');
    const heading = titleRow[0].querySelector('h1, h2, h3, h4');
    const span = document.createElement('span');
    span.className = 'text-size-normal';
    span.style.color = '#5A2A82';
    span.append(...heading.childNodes);
    heading.append(span);
    const t = el('div', 'title');
    t.append(heading);
    ct.append(t);
    textcomp.append(ct);
    col.append(textcomp);
    mktoRow.append(col);
  }
  const formHost = el('div', 'col-xs-12');
  const form = el('form', `${twoColumn ? 'two-column ' : ''}mktoForm mktoHasWidth mktoLayoutAbove`, {
    novalidate: 'novalidate',
  });
  let button = null;
  let sawField = false;
  rows.forEach((cells) => {
    if (cells === titleRow) return;
    const [labelCell, typeCell, optionsCell] = cells;
    const tokens = text(typeCell).toLowerCase().split(/\s+/).filter(Boolean);
    const hasList = optionsCell && optionsCell.querySelector('ul, ol');
    const kind = tokens[0] || (hasList ? 'select' : 'text');
    const flags = tokens.slice(1);
    const labelP = labelCell ? labelCell.querySelector('p') : null;
    if (kind === 'submit') {
      const br = el('div', 'mktoButtonRow');
      const wrap = el('span', 'mktoButtonWrap mktoSimple');
      button = el('button', 'mktoButton', { type: 'submit' });
      button.textContent = text(labelP) || 'Submit'; // @ew-exempt: a <button> cannot host the editor
      wrap.append(button);
      br.append(wrap);
      form.append(br);
      return;
    }
    if (kind === 'note') {
      noteRow(labelP || (optionsCell && optionsCell.querySelector('p')), !sawField, form);
      return;
    }
    fieldRow(kind, flags, labelP, optionsCell, form);
    sawField = true;
  });
  if (button) validation(form, button);
  formHost.append(form);
  mktoRow.append(formHost);
  mktoContainer.append(mktoRow);
  mkto.append(mktoContainer);
  card.append(mkto);
  formCol.append(card);

  row.append(textCol, gutter, formCol);
  container.append(row);
  section.append(container);
  host.append(section);
  block.replaceChildren(host);
}
