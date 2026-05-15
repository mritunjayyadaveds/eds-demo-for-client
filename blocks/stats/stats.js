export default function decorate(block) {
  const items = [...block.children];
  block.textContent = '';
  block.classList.add('sei-stats');

  const grid = document.createElement('div');
  grid.className = 'stats-grid';

  items.forEach((row) => {
    const cols = [...row.children];
    const value = cols[0]?.textContent?.trim() || '';
    const label = cols[1]?.textContent?.trim() || '';

    const stat = document.createElement('div');
    stat.className = 'stats-item';

    const valEl = document.createElement('div');
    valEl.className = 'stats-value';
    valEl.textContent = value;

    const labelEl = document.createElement('div');
    labelEl.className = 'stats-label';
    labelEl.textContent = label;

    stat.append(valEl, labelEl);
    grid.append(stat);
  });

  block.append(grid);
}
