export default async function decorate(block) {
  block.textContent = '';

  const loading = document.createElement('div');
  loading.className = 'countries-loading';
  loading.textContent = 'Loading countries...';
  block.append(loading);

  try {
    const resp = await fetch('https://restcountries.com/v3.1/all?fields=name');
    const data = await resp.json();

    const sorted = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
    const countries = sorted.slice(0, 10);

    loading.remove();

    const grid = document.createElement('div');
    grid.className = 'countries-grid';

    countries.forEach((country, index) => {
      const card = document.createElement('div');
      card.className = 'countries-card';

      const number = document.createElement('span');
      number.className = 'countries-number';
      number.textContent = `${index + 1}`;

      const name = document.createElement('span');
      name.className = 'countries-name';
      name.textContent = country.name.common;

      const official = document.createElement('span');
      official.className = 'countries-official';
      official.textContent = country.name.official;

      card.append(number);
      card.append(name);
      card.append(official);
      grid.append(card);
    });

    block.append(grid);
  } catch (error) {
    loading.textContent = 'Failed to load countries.';
  }
}
