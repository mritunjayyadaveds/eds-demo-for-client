export default function decorate(block) {
  const items = [...block.children];
  block.textContent = '';
  block.classList.add('sei-accordion');

  const grid = document.createElement('div');
  grid.className = 'accordion-grid';

  items.forEach((row) => {
    const cols = [...row.children];
    const title = cols[0]?.textContent?.trim() || '';
    const body = cols[1]?.textContent?.trim() || '';

    const pillar = document.createElement('div');
    pillar.className = 'accordion-pillar';

    const head = document.createElement('button');
    head.className = 'accordion-pillar-head';
    head.textContent = title;
    head.setAttribute('aria-expanded', 'false');

    const reveal = document.createElement('div');
    reveal.className = 'accordion-pillar-reveal';
    const bodyP = document.createElement('p');
    bodyP.className = 'accordion-pillar-body';
    bodyP.textContent = body;
    reveal.append(bodyP);

    head.addEventListener('click', () => {
      const expanded = head.getAttribute('aria-expanded') === 'true';
      block.querySelectorAll('.accordion-pillar-head').forEach((h) => h.setAttribute('aria-expanded', 'false'));
      block.querySelectorAll('.accordion-pillar').forEach((p) => p.classList.remove('accordion-pillar--open'));
      if (!expanded) {
        head.setAttribute('aria-expanded', 'true');
        pillar.classList.add('accordion-pillar--open');
      }
    });

    pillar.append(head, reveal);
    grid.append(pillar);
  });

  block.append(grid);
}
