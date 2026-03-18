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
