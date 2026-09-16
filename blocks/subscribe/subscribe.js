/**
 * subscribe — the blog rail's "Subscribe to Our Blog" Marketo form (source XF
 * blog-subscription-form,
 * form mktoForm_8479), rendered in its captured rest state: no Marketo backend on this origin, the
 * submit is inert (third-party widget — residual, see the conversion log).
 *
 * Authoring rows (one cell each): 1. <p>form title</p> (a div in the source, not a heading) ·
 * 3. <p>email label</p> · 4. <p>country label</p> · 5. <p>consent text</p> ·
 * 6. <p>submit label</p> ·
 * 7. <p>thank-you message</p>. Tier: template-slotted; the authored paragraphs are MOVED into the
 * Marketo markup (EW1), wrappers carry the Marketo classes (EW2).
 * @ew-exempt <p> submit label (row 6) — hosted by the <button> (EW7); captured Marketo rest state
 * @ew-exempt <select> country options — Marketo's country list, captured (derived, not editorial)
 * The block gives its form section id="subscribe" (the TOC's "Subscribe" link target).
 */

const COUNTRIES = [
  'Afghanistan', 'Aland Islands', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla',
  'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize',
  'Benin', 'Bermuda', 'Bhutan', 'Bolivia, Plurinational State of',
  'Bonaire, Sint Eustatius and Saba', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island',
  'Brazil', 'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso',
  'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island',
  'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo',
  'Congo, the Democratic Republic of the', 'Cook Islands', 'Costa Rica', 'Cote d\'Ivoire',
  'Croatia', 'Cuba', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica',
  'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea',
  'Estonia', 'Ethiopia', 'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland',
  'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon',
  'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada',
  'Guadeloupe', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti',
  'Heard Island and McDonald Islands', 'Holy See (Vatican City State)', 'Honduras', 'Hong Kong',
  'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran, Islamic Republic of', 'Iraq', 'Ireland',
  'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan',
  'Kenya', 'Kiribati', 'Korea, Democratic People\'s Republic of', 'Korea, Republic of',
  'Kuwait', 'Kyrgyzstan', 'Lao People\'s Democratic Republic', 'Latvia', 'Lebanon', 'Lesotho',
  'Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao',
  'Macedonia, the former Yugoslav Republic of', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives',
  'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte',
  'Mexico', 'Moldova, Republic of', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco',
  'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia',
  'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Norway', 'Oman',
  'Pakistan', 'Palestinian Territory, Occupied', 'Panama', 'Papua New Guinea', 'Paraguay',
  'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion',
  'Romania', 'Russian Federation', 'Rwanda', 'Saint Barthélemy',
  'Saint Helena, Ascension and Tristan da Cunha', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Martin (French part)', 'Saint Pierre and Miquelon', 'Saint Vincent and the Grenadines',
  'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
  'Serbia/Monteneg', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten (Dutch part)',
  'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
  'South Georgia and the South Sandwich Islands', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan',
  'Suriname', 'Svalbard and Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland',
  'Syrian Arab Republic', 'Taiwan', 'Tajikistan', 'Tanzania, United Republic of', 'Thailand',
  'Timor-Leste', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
  'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
  'Venezuela, Bolivarian Republic of', 'Viet Nam', 'Virgin Islands, British',
  'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe',
];
const SELECTED = 'United States';

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  return node;
}

/* one Marketo row: .mktoFormRow > .mktoFormCol > (.mktoOffset, .mktoFieldWrap > …, .mktoClear) */
function formRow(colCls, offsetCls, wrapCls, fill) {
  const row = el('div', 'mktoFormRow');
  const col = el('div', colCls);
  const wrap = el('div', wrapCls);
  fill(wrap);
  wrap.append(el('div', 'mktoClear'));
  col.append(el('div', offsetCls), wrap, el('div', 'mktoClear'));
  row.append(col, el('div', 'mktoClear'));
  return row;
}

function htmlRow(p) {
  return formRow('mktoFormCol', 'mktoOffset mktoHasWidth', 'mktoFieldWrap', (wrap) => {
    const text = el('div', 'mktoHtmlText mktoHasWidth');
    if (p) text.append(p);
    wrap.append(text);
  });
}

function fieldRow(name, labelP, field) {
  return formRow('mktoFieldDescriptor mktoFormCol', 'mktoOffset', 'mktoFieldWrap mktoRequiredField', (wrap) => {
    const label = el('label', 'mktoLabel mktoHasWidth', { for: name, id: `Lbl${name}`, style: 'width: 150px;' });
    const asterix = el('div', 'mktoAsterix');
    asterix.textContent = '*';
    label.append(asterix);
    if (labelP) label.append(labelP);
    wrap.append(label, el('div', 'mktoGutter mktoHasWidth'), field, el('span', 'mktoInstruction', { id: `Instruct${name}`, tabindex: '-1' }));
  });
}

export default function decorate(block) {
  const cells = [...block.children].map((row) => row.firstElementChild).filter(Boolean);
  const [titleCell, requiredCell, emailCell, countryCell, consentCell, submitCell,
    thanksCell] = cells;
  const pick = (cell, sel) => (cell ? cell.querySelector(sel) : null);
  const heading = pick(titleCell, 'h1, h2, h3, h4, p');

  const outer = el('div', 'experiencefragment');
  const xf = el('div', 'cmp-experiencefragment cmp-experiencefragment--blog-subscription-form');
  const grid = el('div', 'aem-Grid');
  const host = el('div', 'subscriptionForm');
  const section = el('section', 'cmp-subscription-form', { id: 'subscribe' });
  const container = el('div', 'subscription-form-container');
  const title = el('div', 'form-title');
  if (heading) title.append(heading);
  const form = el('form', 'mktoForm mktoHasWidth mktoLayoutAbove', {
    id: 'mktoForm_8479', novalidate: 'novalidate', style: 'font-family: Helvetica, Arial, sans-serif; font-size: 13px; color: rgb(51, 51, 51); width: 311px;',
  });
  form.append(htmlRow(pick(requiredCell, 'p')));
  const email = el('input', 'mktoField mktoEmailField mktoHasWidth mktoRequired', {
    id: 'Email', name: 'Email', maxlength: '255', 'aria-labelledby': 'LblEmail InstructEmail', type: 'email', 'aria-required': 'true', style: 'width: 300px;',
  });
  form.append(fieldRow('Email', pick(emailCell, 'p'), email));
  const select = el('select', 'mktoField mktoHasWidth mktoRequired', {
    id: 'Country', name: 'Country', 'aria-labelledby': 'LblCountry InstructCountry', 'aria-required': 'true', style: 'width: 300px;', autocomplete: 'country',
  });
  COUNTRIES.forEach((c) => {
    const o = el('option', '', { value: c });
    o.textContent = c;
    if (c === SELECTED) o.selected = true;
    select.append(o);
  });
  form.append(fieldRow('Country', pick(countryCell, 'p'), select));
  const placeholder = el('div', 'mktoFormRow');
  placeholder.append(el('div', 'mktoPlaceholder mktoPlaceholderEmail_Consent_Trigger_Optin'), el('div', 'mktoClear'));
  form.append(placeholder);
  form.append(htmlRow(pick(consentCell, 'p')));
  const buttonRow = el('div', 'mktoButtonRow');
  const buttonWrap = el('span', 'mktoButtonWrap mktoSimple');
  const button = el('button', 'mktoButton', { type: 'submit' });
  const submitP = pick(submitCell, 'p');
  if (submitP) button.append(submitP); // EW7: a button cannot host the editor — exempt above
  buttonWrap.append(button);
  buttonRow.append(buttonWrap);
  form.append(buttonRow);
  form.addEventListener('submit', (e) => e.preventDefault()); // no Marketo on this origin (rest state)
  const thanks = el('div', 'mkto-thankyou-message');
  const thanksP = pick(thanksCell, 'p');
  if (thanksP) thanks.append(thanksP);
  container.append(title, form, thanks);
  section.append(container);
  host.append(section);
  grid.append(host);
  xf.append(grid);
  outer.append(xf);
  block.replaceChildren(outer);
}
