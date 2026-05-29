/*
 * Fragment Block
 * Include content on a page as a fragment.
 * https://www.aem.live/developer/block-collection/fragment
 */

// eslint-disable-next-line import/no-cycle
import {
  decorateMain,
} from '../../scripts/scripts.js';

import {
  loadSections,
} from '../../scripts/aem.js';

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
export async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    // eslint-disable-next-line no-param-reassign
    path = path.replace(/(\.plain)?\.html/, '');
    const resp = await fetch(`${path}.plain.html`);
    if (resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();

      // reset base path for media to fragment base
      const resetAttributeBase = (tag, attr) => {
        main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
          elem[attr] = new URL(elem.getAttribute(attr), new URL(path, window.location)).href;
        });
      };
      resetAttributeBase('img', 'src');
      resetAttributeBase('source', 'srcset');

      decorateMain(main);
      await loadSections(main);
      return main;
    }
  }
  return null;
}

function getVideoId(url) {
  if (!url) return '';
  if (url.includes('youtu.be/')) {
    const [id] = url.split('youtu.be/')[1].split(/[?&]/);
    return id;
  }
  if (url.includes('youtube.com/watch')) {
    try { return new URL(url).searchParams.get('v') || ''; } catch (e) { return ''; }
  }
  if (url.includes('youtube.com/embed/')) {
    const [id] = url.split('youtube.com/embed/')[1].split(/[?&]/);
    return id;
  }
  return '';
}

async function loadContentFragment(cfPath) {
  const cleanPath = cfPath.replace(/\.html$/, '');
  const apiPath = `${cleanPath}/jcr:content/data/master.json`;
  const resp = await fetch(apiPath);
  if (resp.ok) {
    const json = await resp.json();
    return json?.url || '';
  }
  return '';
}

function renderYouTube(block, url) {
  const videoId = getVideoId(url);
  if (!videoId) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'youtube-player';
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  iframe.setAttribute('title', 'YouTube video');
  iframe.loading = 'lazy';
  wrapper.append(iframe);
  block.textContent = '';
  block.append(wrapper);
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();

  if (path && path.includes('/content/dam/')) {
    const url = await loadContentFragment(path);
    if (url) {
      renderYouTube(block, url);
      return;
    }
  }

  const fragment = await loadFragment(path);
  if (fragment) {
    const fragmentSection = fragment.querySelector(':scope .section');
    if (fragmentSection) {
      block.classList.add(...fragmentSection.classList);
      block.classList.remove('section');
      block.replaceChildren(...fragmentSection.childNodes);
    }
  }
}
