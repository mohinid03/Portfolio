/* ═══════════════════════════════════════════════════════════
   EMAILJS CONFIGURATION
   ─────────────────────────────────────────────────────────
   Steps (free, takes ~2 minutes):
   1. Go to https://www.emailjs.com/ → Sign up free
   2. Add Email Service → connect your Gmail (mohinidhanure1234@gmail.com)
      → Copy the Service ID → paste below as YOUR_SERVICE_ID
   3. Email Templates → Create Template
      Use these variables in the template body:
        From: {{from_name}} ({{from_email}})
        Subject: {{subject}}
        Message: {{message}}
      → Copy Template ID → paste below as YOUR_TEMPLATE_ID
   4. Account → API Keys → copy Public Key → paste below as YOUR_PUBLIC_KEY
   5. Delete or hide the setup-note div in index.html once done
═══════════════════════════════════════════════════════════ */

const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'aBcDeFgH_iJkLmNoP'

// Init EmailJS
(function () {
  try { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch(e) {}
})();

/* ═══════════════════════════════════════════
   TAB SWITCHING
═══════════════════════════════════════════ */
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(target).classList.add('active');

    if (target === 'resume') setTimeout(animateSkillBars, 80);

    // Close sidebar on mobile when tab changes
    closeSidebar();
  });
});

/* ═══════════════════════════════════════════
   SKILL BAR ANIMATION
═══════════════════════════════════════════ */
let skillsAnimated = false;

function animateSkillBars() {
  if (skillsAnimated) return;
  document.querySelectorAll('.skill-fill').forEach(fill => {
    const w = fill.getAttribute('data-width') || '0';
    fill.style.width = w + '%';
  });
  skillsAnimated = true;
}

/* ═══════════════════════════════════════════
   PORTFOLIO FILTER
═══════════════════════════════════════════ */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

/* ═══════════════════════════════════════════
   EXPANDABLE PROJECT CARDS
═══════════════════════════════════════════ */
function toggleCard(thumbEl) {
  const card = thumbEl.closest('.project-card');
  const body = card.querySelector('.project-body');

  const isOpen = card.classList.contains('expanded');

  // Close all others
  document.querySelectorAll('.project-card.expanded').forEach(c => {
    c.classList.remove('expanded');
    c.querySelector('.project-body').classList.remove('open');
  });

  // Toggle clicked
  if (!isOpen) {
    card.classList.add('expanded');
    body.classList.add('open');
  }
}

/* ═══════════════════════════════════════════
   MOBILE SIDEBAR
═══════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const sidebar   = document.getElementById('sidebar');
const overlay   = document.getElementById('sidebarOverlay');
const closeBtn  = document.getElementById('sidebarClose');

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openSidebar);
closeBtn?.addEventListener('click', closeSidebar);
overlay?.addEventListener('click', closeSidebar);

/* ═══════════════════════════════════════════
   CONTACT FORM — EmailJS
═══════════════════════════════════════════ */
async function sendEmail(e) {
  e.preventDefault();

  const btn        = document.getElementById('sendBtn');
  const successMsg = document.getElementById('form-success');
  const errorMsg   = document.getElementById('form-error');
  const form       = document.getElementById('contactForm');

  // Hide previous toasts
  successMsg.classList.add('hidden');
  errorMsg.classList.add('hidden');

  // Loading state
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> <span>Sending…</span>';

  const templateParams = {
    from_name:  document.getElementById('from_name').value.trim(),
    from_email: document.getElementById('from_email').value.trim(),
    subject:    document.getElementById('subject').value.trim(),
    message:    document.getElementById('message').value.trim(),
    to_email:   'mohinidhanure1234@gmail.com'
  };

  // Fallback: open default mail client if EmailJS not configured
  if (
    EMAILJS_SERVICE_ID  === 'YOUR_SERVICE_ID'  ||
    EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
    EMAILJS_PUBLIC_KEY  === 'YOUR_PUBLIC_KEY'
  ) {
    const mailtoLink =
      `mailto:mohinidhanure1234@gmail.com` +
      `?subject=${encodeURIComponent(templateParams.subject)}` +
      `&body=${encodeURIComponent(
        `Name: ${templateParams.from_name}\nEmail: ${templateParams.from_email}\n\n${templateParams.message}`
      )}`;
    window.location.href = mailtoLink;

    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-paper-plane"></i> <span>Send Message</span>';
    return;
  }

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    form.reset();
    successMsg.classList.remove('hidden');
    setTimeout(() => successMsg.classList.add('hidden'), 6000);
  } catch (err) {
    console.error('EmailJS error:', err);
    errorMsg.classList.remove('hidden');
    setTimeout(() => errorMsg.classList.add('hidden'), 6000);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-paper-plane"></i> <span>Send Message</span>';
  }
}
