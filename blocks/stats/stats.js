import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = [...block.children].filter((row) => row.textContent.trim());

  const grid = document.createElement('div');
  grid.className = 'stats-grid';

  items.forEach((row) => {
    const cols = [...row.children];
    const value = cols[0]?.textContent?.trim() || '';
    const label = cols[1]?.textContent?.trim() || '';

    const stat = document.createElement('div');
    stat.className = 'stats-item';
    moveInstrumentation(row, stat);

    const valEl = document.createElement('div');
    valEl.className = 'stats-value';
    valEl.textContent = value;
    if (cols[0]) moveInstrumentation(cols[0], valEl);

    const labelEl = document.createElement('div');
    labelEl.className = 'stats-label';
    labelEl.textContent = label;
    if (cols[1]) moveInstrumentation(cols[1], labelEl);

    stat.append(valEl, labelEl);
    grid.append(stat);
  });

  block.textContent = '';
  block.append(grid);
}
