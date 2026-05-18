export default function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  const url = link.href;
  let videoId = '';

  if (url.includes('youtu.be/')) {
    [videoId] = url.split('youtu.be/')[1].split(/[?&]/);
  } else if (url.includes('youtube.com/watch')) {
    const params = new URL(url).searchParams;
    videoId = params.get('v');
  } else if (url.includes('youtube.com/embed/')) {
    [videoId] = url.split('youtube.com/embed/')[1].split(/[?&]/);
  }

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
