/**
 * ask — the "Not sure where to start? Just ask." concierge band the Products and Solutions landing
 * pages carry under
 * their hero (source: the Brand Concierge `abc-hero` embed, an html-text-only component). A
 * DECORATIVE replica of the
 * captured rest state — heading, the prompt bar with its placeholder text, four suggested questions
 * — with no chatbot
 * behind it (same policy as the pilot's floating "Ask a Question" button; D15: the embed's script
 * is code, not content).
 * The source embed also hides the floating concierge button on these pages (ask.css does the same).
 *
 * Authoring rows: 1. <h2>heading</h2> · 2. <p>prompt placeholder</p> · 3. <ul> of suggested
 * questions.
 * Tier: template-slotted; authored nodes are MOVED (EW1): the heading into the title box, the
 * placeholder paragraph into
 * the prompt bar, the list into the cards row (each <li> is styled as a card through the wrapper,
 * EW2).
 */

const SPARK = '<svg xmlns="http://www.w3.org/2000/svg" class="abc-hero__spark" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path class="star star-1" d="M19.5 8.66667L20.85 5.85L23.6667 4.5L20.85 3.15L19.5 0.333333L18.15 3.15L15.3333 4.5L18.15 5.85L19.5 8.66667Z" fill="currentColor"/><path class="star star-2" d="M9.5 6.5L7.4 11.1L2.8 13.2L7.4 15.3L9.5 19.9L11.6 15.3L16.2 13.2L11.6 11.1L9.5 6.5Z" fill="currentColor"/><path class="star star-3" d="M19.5 15.3333L18.15 18.15L15.3333 19.5L18.15 20.85L19.5 23.6667L20.85 20.85L23.6667 19.5L20.85 18.15L19.5 15.3333Z" fill="currentColor"/></svg>';
const SEND = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 11.5L21 3L12.5 21L11 13L3 11.5Z" fill="currentColor"/></svg>';

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

export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const placeholder = [...block.querySelectorAll('p')].find((p) => p.textContent.trim() && !p.querySelector('a'));
  const list = block.querySelector('ul, ol');
  const section = el('section', 'abc-hero', { 'data-bc-variation': 'embed-experience' });
  const title = el('div', 'abc-hero__title');
  if (heading) title.append(heading);
  section.append(title);
  const container = el('div', 'container');
  const bar = el('div', 'abc-hero__inputbar border-gradient-ask sparkleAnim');
  bar.append(svg(SPARK));
  const input = el('div', 'abc-hero__input');
  if (placeholder) input.append(placeholder);
  const send = el('span', 'abc-hero__send', { 'aria-hidden': 'true' });
  send.append(svg(SEND));
  bar.append(input, send);
  container.append(bar);
  section.append(container);
  const cards = el('div', 'abc-hero__cards container');
  if (list) {
    [...list.children].forEach((li) => li.prepend(svg(SPARK), ' ')); // glyph = presentation refinement inside the list item; the card look rides the wrapper (EW2)
    cards.append(list);
  }
  section.append(cards);
  block.replaceChildren(section);
}
