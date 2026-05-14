function buildPlayButton() {
  const btn = document.createElement('button');
  btn.className = 'spotlight-card-play';
  btn.setAttribute('aria-label', 'Play video');
  btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true"><polygon points="5,3 19,12 5,21"></polygon></svg>';
  return btn;
}

function initCarousel(track) {
  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.classList.add('spotlight-grabbing');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.classList.remove('spotlight-grabbing');
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('spotlight-grabbing');
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
}

function initReveal(block) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          block.classList.add('sei-revealed');
          observer.disconnect();
        }
      });
    },
    { threshold: 0.1 },
  );
  observer.observe(block);
}

export default function decorate(block) {
  const rows = [...block.children];

  block.textContent = '';
  block.classList.add('sei-reveal');

  let eyebrowText = '';
  let headlineEl = null;
  let descText = '';
  const cardData = [];

  rows.forEach((row) => {
    const cols = [...row.children];
    const firstCol = cols[0];
    const picture = firstCol?.querySelector('picture');
    const h2 = firstCol?.querySelector('h2');
    const h1 = firstCol?.querySelector('h1');

    if (picture) {
      const label = cols[1]?.textContent?.trim() || '';
      cardData.push({ picture, label });
    } else if (h2 || h1) {
      headlineEl = h2 || h1;
    } else {
      const text = firstCol?.textContent?.trim();
      if (!text) return;
      if (!eyebrowText && !headlineEl && text.length < 60) {
        eyebrowText = text;
      } else {
        descText = text;
      }
    }
  });

  const eyebrow = document.createElement('div');
  eyebrow.className = 'spotlight-eyebrow';
  eyebrow.textContent = eyebrowText;
  block.append(eyebrow);

  if (headlineEl) {
    headlineEl.className = 'spotlight-headline';
    block.append(headlineEl);
  }

  if (descText) {
    const desc = document.createElement('p');
    desc.className = 'spotlight-body';
    desc.textContent = descText;
    block.append(desc);
  }

  if (cardData.length > 0) {
    const outer = document.createElement('div');
    outer.className = 'spotlight-carousel-outer';
    const track = document.createElement('div');
    track.className = 'spotlight-carousel-track';

    cardData.forEach((card, i) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'spotlight-card';
      if (i === 0) cardEl.classList.add('spotlight-card--active');

      const img = card.picture.querySelector('img');
      if (img) {
        img.className = 'spotlight-card-img';
        img.setAttribute('loading', 'lazy');
      }
      cardEl.append(card.picture);

      const overlay = document.createElement('div');
      overlay.className = 'spotlight-card-overlay';
      cardEl.append(overlay);

      cardEl.append(buildPlayButton());

      if (card.label) {
        const label = document.createElement('span');
        label.className = 'spotlight-card-label';
        label.textContent = card.label;
        cardEl.append(label);
      }

      track.append(cardEl);
    });

    outer.append(track);
    block.append(outer);
    initCarousel(track);
  }

  initReveal(block);
}
