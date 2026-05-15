export default function decorate(block) {
  const items = [...block.children];
  block.textContent = '';

  const grid = document.createElement('div');
  grid.className = 'accordion-grid';

  items.forEach((row) => {
    const cols = [...row.children];
    const title = cols[0]?.textContent?.trim() || '';
    const body = cols[1]?.textContent?.trim() || '';

    const pillar = document.createElement('div');
    pillar.className = 'accordion-pillar';

    const head = document.createElement('div');
    head.className = 'accordion-pillar-head';
    head.textContent = title;

    const reveal = document.createElement('div');
    reveal.className = 'accordion-pillar-reveal';
    const bodyP = document.createElement('p');
    bodyP.className = 'accordion-pillar-body';
    bodyP.textContent = body;
    reveal.append(bodyP);

    pillar.append(head, reveal);
    grid.append(pillar);
  });

  block.append(grid);
}
