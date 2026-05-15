export default function decorate(block) {
  const row = block.children[0];
  const cols = [...(row?.children || [])];
  const label = cols[0]?.textContent?.trim() || 'Email';
  const btnText = cols[1]?.textContent?.trim() || 'Subscribe';

  block.textContent = '';

  const form = document.createElement('div');
  form.className = 'subscribe-form';

  const labelEl = document.createElement('label');
  labelEl.className = 'subscribe-label';
  labelEl.textContent = label;
  labelEl.setAttribute('for', 'subscribe-email');

  const input = document.createElement('input');
  input.className = 'subscribe-input';
  input.type = 'email';
  input.id = 'subscribe-email';
  input.placeholder = 'yourname@company.com';

  const btn = document.createElement('button');
  btn.className = 'subscribe-btn';
  btn.innerHTML = `${btnText} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>`;

  const legal = document.createElement('p');
  legal.className = 'subscribe-legal';
  legal.textContent = 'By subscribing, you agree to receive marketing emails from SEI. Unsubscribe at any time.';

  form.append(labelEl, input, btn, legal);
  block.append(form);
}
