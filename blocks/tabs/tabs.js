export default function decorate(block) {
  const items = [...block.children].filter((row) => row.textContent.trim() || row.querySelector('picture'));
  block.textContent = '';
  block.classList.add('sei-tabs');

  const tabBar = document.createElement('div');
  tabBar.className = 'tabs-bar';

  const panelContainer = document.createElement('div');
  panelContainer.className = 'tabs-panels';

  items.forEach((row, idx) => {
    const cols = [...row.children];
    const img = cols[0]?.querySelector('img');
    const content = cols[1];

    const tab = document.createElement('button');
    tab.className = 'tabs-tab';
    if (idx === 0) tab.classList.add('tabs-tab-active');
    if (img) {
      const tabImg = document.createElement('img');
      tabImg.src = img.src;
      tabImg.alt = img.alt || '';
      tabImg.className = 'tabs-tab-img';
      tab.append(tabImg);
    } else {
      tab.textContent = content?.querySelector('h3')?.textContent || `Tab ${idx + 1}`;
    }

    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    if (idx === 0) panel.classList.add('tabs-panel-active');

    if (content) {
      const panelInner = document.createElement('div');
      panelInner.className = 'tabs-panel-inner';

      const mainContent = document.createElement('div');
      mainContent.className = 'tabs-panel-main';

      const statsContent = document.createElement('div');
      statsContent.className = 'tabs-panel-stats';

      const children = [...content.children];
      let statsMode = false;
      children.forEach((el) => {
        const text = el.textContent.trim();
        const strong = el.querySelector('strong');
        if (strong && !el.querySelector('a') && !el.querySelector('h3')) {
          const val = strong.textContent.trim();
          const rest = text.replace(val, '').trim();
          if (rest && (val.includes('$') || val.includes('+') || /^\d/.test(val) || val.length < 20)) {
            statsMode = true;
            const stat = document.createElement('div');
            stat.className = 'tabs-stat';
            const statVal = document.createElement('div');
            statVal.className = 'tabs-stat-val';
            statVal.textContent = val;
            const statLabel = document.createElement('div');
            statLabel.className = 'tabs-stat-label';
            statLabel.textContent = rest;
            stat.append(statVal, statLabel);
            statsContent.append(stat);
            return;
          }
        }
        if (!statsMode) {
          mainContent.append(el.cloneNode(true));
        }
      });

      panelInner.append(mainContent);
      if (statsContent.children.length > 0) panelInner.append(statsContent);
      panel.append(panelInner);
    }

    tab.addEventListener('click', () => {
      block.querySelectorAll('.tabs-tab').forEach((t) => t.classList.remove('tabs-tab-active'));
      block.querySelectorAll('.tabs-panel').forEach((p) => p.classList.remove('tabs-panel-active'));
      tab.classList.add('tabs-tab-active');
      panel.classList.add('tabs-panel-active');
    });

    tabBar.append(tab);
    panelContainer.append(panel);
  });

  block.append(tabBar, panelContainer);
}
