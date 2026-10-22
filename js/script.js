function toggleMenu() {
  const h = document.getElementById('hbg');
  const d = document.getElementById('drawer');
  if (!h || !d) return;
  h.classList.toggle('open');
  d.classList.toggle('open');
  document.body.style.overflow = d.classList.contains('open') ? 'hidden' : '';
}

function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const form = e.target;
  if (!btn || !form) return;

  const formData = new FormData(form);
  const name = (formData.get('name') || '').toString().trim();
  const phone = (formData.get('phone') || '').toString().trim();
  const email = (formData.get('email') || '').toString().trim();
  const project = (formData.get('project') || '').toString().trim();
  const details = (formData.get('details') || '').toString().trim();

  const message = [
    '🔥 MR. H DIGITAL — NEW PROJECT ENQUIRY',
    '━━━━━━━━━━━━━━━━━━━━',
    `👤 Name: ${name || 'Not provided'}`,
    `📱 Phone: ${phone || 'Not provided'}`,
    `✉️ Email: ${email || 'Not provided'}`,
    `🛠️ Project Type: ${project || 'Not specified'}`,
    '━━━━━━━━━━━━━━━━━━━━',
    '📝 Project Brief:',
    details || 'No additional details provided.',
    '━━━━━━━━━━━━━━━━━━━━',
    'Sent from mrhdigital.co.za'
  ].join('\n');

  const whatsappNumber = '27766871671';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  btn.textContent = 'Opening WhatsApp...';
  btn.disabled = true;

  const popup = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  if (!popup) {
    window.location.href = whatsappUrl;
  }

  btn.textContent = '✓ WhatsApp Ready!';
  btn.style.background = '#4CAF50';
  form.reset();

  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.style.background = '';
    btn.disabled = false;
  }, 2200);
}

window.toggleMenu = toggleMenu;
window.handleSubmit = handleSubmit;

function setupHeroVideo() {
  const video = document.getElementById('hero-video');
  const toggle = document.getElementById('hero-video-toggle');
  const status = document.getElementById('hero-video-status');
  if (!video || !toggle || !status) return;

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let userChoice = null;
  let inView = video.getBoundingClientRect().bottom > 0;
  let failureMessage = '';
  let playbackRequest = 0;

  function playbackEnabled() {
    return userChoice === null
      ? !motionPreference.matches && !(connection && connection.saveData)
      : userChoice;
  }

  function shouldPlay() {
    return playbackEnabled() && inView && !document.hidden;
  }

  function showPlaybackFailure(message, error) {
    userChoice = false;
    failureMessage = message;
    video.pause();
    toggle.textContent = 'Retry background video';
    status.textContent = message;
    console.warn(message, error);
  }

  function updatePlayback() {
    const enabled = playbackEnabled();
    toggle.textContent = failureMessage
      ? 'Retry background video'
      : enabled ? 'Pause background video' : 'Play background video';
    status.textContent = failureMessage || (userChoice === null && !enabled
      ? 'Background video is off to respect your motion or data-saving preference.'
      : '');

    if (!shouldPlay()) {
      playbackRequest += 1;
      video.pause();
      return;
    }
    if (!video.paused) return;
    if (!video.getAttribute('src') || video.error) {
      video.src = window.matchMedia('(max-width: 900px)').matches
        ? video.dataset.mobileSrc
        : video.dataset.src;
      video.load();
    }
    const request = ++playbackRequest;
    video.play().catch((error) => {
      if (error.name === 'AbortError' && (!shouldPlay() || request !== playbackRequest)) return;
      showPlaybackFailure('Background video could not play. You can retry; all website content remains available.', error);
    });
  }

  video.addEventListener('error', () => {
    showPlaybackFailure('Background video could not load. You can retry; all website content remains available.', video.error);
  });
  toggle.addEventListener('click', () => {
    userChoice = !playbackEnabled();
    failureMessage = '';
    updatePlayback();
  });
  function preferenceChanged() {
    userChoice = null;
    updatePlayback();
  }
  motionPreference.addEventListener('change', preferenceChanged);
  if (connection && connection.addEventListener) {
    connection.addEventListener('change', preferenceChanged);
  }
  document.addEventListener('visibilitychange', updatePlayback);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    }).observe(video);
  }
  toggle.hidden = false;
  updatePlayback();
}

setupHeroVideo();
