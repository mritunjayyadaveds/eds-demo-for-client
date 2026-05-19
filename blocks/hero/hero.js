function animateHero(block) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          block.classList.add('hero-visible');
          observer.disconnect();
        }
      });
    },
    { threshold: 0.15 },
  );
  observer.observe(block);
}

function wrapHeadlineWords(h1) {
  if (!h1) return;
  const text = h1.textContent.trim();
  const words = text.split(/\s+/);
  h1.textContent = '';
  words.forEach((word, i) => {
    const outer = document.createElement('span');
    outer.className = 'hero-word-wrap';
    const inner = document.createElement('span');
    inner.className = 'hero-word';
    inner.textContent = word;
    inner.style.animationDelay = `${280 + i * 68}ms`;
    outer.append(inner);
    h1.append(outer);
    if (i < words.length - 1) h1.append(' ');
  });
}

function buildGridOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'hero-grid-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  return overlay;
}

export default function decorate(block) {
  const rows = [...block.children];
  const hasImage = rows[0]?.querySelector('picture');
  const videoLink = rows[0]?.querySelector('a[href$=".mp4"]');

  let picture = null;
  let video = null;
  let contentRow = rows[0];

  if (videoLink) {
    video = document.createElement('video');
    video.className = 'hero-bg-video';
    video.src = videoLink.href;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('aria-hidden', 'true');
    contentRow = rows[1] || rows[0];
  } else if (hasImage) {
    picture = rows[0].querySelector('picture');
    contentRow = rows[1] || rows[0];
  }

  const eyebrow = contentRow?.querySelector('p:first-child');
  const h1 = contentRow?.querySelector('h1') || block.querySelector('h1');
  const allContent = [...(contentRow?.querySelectorAll('p, h1, h2, h3') || [])];

  block.textContent = '';

  if (video || picture) {
    const mediaWrapper = document.createElement('div');
    mediaWrapper.className = 'hero-media';
    mediaWrapper.setAttribute('aria-hidden', 'true');
    mediaWrapper.append(video || picture);
    block.append(mediaWrapper);
  }

  block.append(buildGridOverlay());

  const content = document.createElement('div');
  content.className = 'hero-content';

  if (eyebrow && eyebrow !== h1 && !eyebrow.querySelector('a')) {
    const eyebrowEl = document.createElement('div');
    eyebrowEl.className = 'hero-eyebrow hero-fade-up';
    eyebrowEl.style.animationDelay = '80ms';
    eyebrowEl.textContent = eyebrow.textContent;
    content.append(eyebrowEl);
  }

  if (h1) {
    h1.className = 'hero-headline';
    wrapHeadlineWords(h1);
    content.append(h1);
  }

  const ctaItems = allContent.filter(
    (el) => el !== eyebrow && el !== h1 && el.querySelector('a'),
  );
  const descItems = allContent.filter(
    (el) => el !== eyebrow && el !== h1 && !el.querySelector('a'),
  );
  descItems.forEach((desc, i) => {
    desc.className = 'hero-description hero-fade-up';
    desc.style.animationDelay = `${836 + i * 100}ms`;
    content.append(desc);
  });

  if (ctaItems.length > 0) {
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'hero-cta-group hero-fade-up';
    ctaContainer.style.animationDelay = '976ms';
    ctaItems.forEach((item) => {
      const link = item.querySelector('a');
      if (link) {
        link.className = 'hero-cta hero-cta-primary';
        ctaContainer.append(link);
      }
    });
    content.append(ctaContainer);
  }

  block.append(content);
  animateHero(block);
}
