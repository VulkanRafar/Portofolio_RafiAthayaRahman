/* ═══════════════════════════════════════════════════════
   PORTFOLIO — script.js
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── NAVBAR: Scroll Effect ── */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // run on load


/* ── NAVBAR: Active Link on Scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollY = window.scrollY + window.innerHeight * 0.35;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();


/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinksContainer.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinksContainer.classList.contains('open')) {
    navLinksContainer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});


/* ── SCROLL REVEAL ── */
const revealTargets = [
  // About section
  { selector: '.about-text', delay: 0 },
  { selector: '.about-visual', delay: 1 },
  // Stack categories
  { selector: '.stack-category:nth-child(1)', delay: 0 },
  { selector: '.stack-category:nth-child(2)', delay: 1 },
  { selector: '.stack-category:nth-child(3)', delay: 2 },
  // Project cards
  { selector: '.project-card:nth-child(1)', delay: 0 },
  { selector: '.project-card:nth-child(2)', delay: 1 },
  { selector: '.project-card:nth-child(3)', delay: 2 },
  { selector: '.project-card:nth-child(4)', delay: 3 },
  // Contact
  { selector: '.contact-left', delay: 0 },
  { selector: '.contact-right', delay: 1 },
  // Section labels & titles
  { selector: '.about .section-label', delay: 0 },
  { selector: '.stack .section-label', delay: 0 },
  { selector: '.projects .section-label', delay: 0 },
  { selector: '.contact .section-label', delay: 0 },
  { selector: '.stack .section-title', delay: 0 },
  { selector: '.projects .section-title', delay: 0 },
  { selector: '.about-stats', delay: 2 },
];

function addRevealClass() {
  revealTargets.forEach(({ selector, delay }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.add('reveal');
    if (delay > 0) {
      el.classList.add(`reveal-delay-${delay}`);
    }
  });
}

function observeReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

addRevealClass();
observeReveal();


/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Simple validation
    if (!name || !email || !message) {
      shakeForm();
      return;
    }

    if (!isValidEmail(email)) {
      document.getElementById('email').focus();
      document.getElementById('email').style.borderColor = '#EF4444';
      setTimeout(() => {
        document.getElementById('email').style.borderColor = '';
      }, 2000);
      return;
    }

    // Simulate send (swap with actual fetch/API call)
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
      formSuccess.classList.add('visible');

      setTimeout(() => {
        formSuccess.classList.remove('visible');
      }, 5000);
    }, 1200);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeForm() {
  contactForm.style.animation = 'shake .4s ease';
  contactForm.addEventListener('animationend', () => {
    contactForm.style.animation = '';
  }, { once: true });
}

// Inject shake keyframe
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);


/* ── PROJECT CARDS: Ripple Effect on Click ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: rgba(59,130,246,.08);
      transform: scale(0);
      animation: rippleAnim .5s ease-out forwards;
      pointer-events: none;
      z-index: 0;
    `;

    card.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// Inject ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);


/* ── SMOOTH ANCHOR SCROLL (fallback for older browsers) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── PILL HOVER: Micro-interaction ── */
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('mouseenter', () => {
    pill.style.transition = 'background 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease';
  });
});


/* ── TYPED CURSOR BLINK on hero (optional flair) ── */
const heroSub = document.querySelector('.hero-sub');
if (heroSub) {
  const cursor = document.createElement('span');
  cursor.style.cssText = `
    display: inline-block;
    width: 2px;
    height: 1em;
    background: var(--blue-500);
    margin-left: 4px;
    vertical-align: text-bottom;
    animation: cursorBlink 1.1s step-end infinite;
  `;
  heroSub.appendChild(cursor);

  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `
    @keyframes cursorBlink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `;
  document.head.appendChild(cursorStyle);
}


/* ── PERFORMANCE: throttle scroll events ── */
function throttle(fn, delay) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    }
  };
}

// Re-attach scrolled listeners with throttle
window.removeEventListener('scroll', handleNavbarScroll);
window.removeEventListener('scroll', updateActiveNav);
window.addEventListener('scroll', throttle(handleNavbarScroll, 60), { passive: true });
window.addEventListener('scroll', throttle(updateActiveNav, 80), { passive: true });


console.log('%c isdev portfolio ', 'background:#2563EB;color:#fff;padding:4px 12px;border-radius:4px;font-family:serif;font-style:italic;font-size:14px');
console.log('%c Built with ♥ — Vanilla HTML, CSS & JS ', 'color:#6B7280;font-size:12px');