/* ============================================================
   script.js — Portfolio Interactive Features
   Allal Mohammed Ramzi
   ============================================================ */

'use strict';

/* ============================================================
   1. THEME TOGGLE
   ============================================================ */
(function initTheme() {
  const html        = document.documentElement;
  const btn         = document.getElementById('themeToggle');
  const icon        = document.getElementById('themeIcon');
  const STORAGE_KEY = 'portfolio-theme';

  const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
})();


/* ============================================================
   2. STICKY NAVBAR
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ============================================================
   3. ACTIVE NAV LINK ON SCROLL
   ============================================================ */
function updateActiveLink() {
  const scrollY    = window.scrollY + 100;
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav-link');

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        const isMatch = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isMatch);
      });
    }
  });
}


/* ============================================================
   4. HAMBURGER MENU
   ============================================================ */
(function initHamburger() {
  const btn       = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = navLinks.querySelectorAll('.nav-link');

  btn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ============================================================
   5. SMOOTH SCROLLING (native fallback)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id     = this.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 68;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH - 10;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ============================================================
   6. TYPEWRITER EFFECT
   ============================================================ */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Data Scientist',
    'Machine Learning Engineer',
    'Flutter Developer',
    'Spring Boot Developer',
    'IoT Enthusiast',
    'Open Source Contributor',
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let deleting   = false;
  let timeoutId;

  function tick() {
    const word = phrases[phraseIdx];

    if (deleting) {
      charIdx--;
      el.textContent = word.substring(0, charIdx);
    } else {
      charIdx++;
      el.textContent = word.substring(0, charIdx);
    }

    let delay = deleting ? 55 : 95;

    if (!deleting && charIdx === word.length) {
      delay     = 1800;
      deleting  = true;
    } else if (deleting && charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay     = 380;
    }

    timeoutId = setTimeout(tick, delay);
  }

  tick();
})();


/* ============================================================
   7. SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el       = entry.target;
      const siblings = Array.from(el.parentElement.children)
        .filter(c => c.classList.contains('reveal'));
      const idx      = siblings.indexOf(el);

      el.style.transitionDelay = `${idx * 0.08}s`;
      el.classList.add('visible');
      observer.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));

  // Immediately reveal hero elements (visible on load)
  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => {
      el.style.transitionDelay = `${i * 0.14}s`;
      el.classList.add('visible');
    }, 80);
  });
})();


/* ============================================================
   8. SKILL BARS ANIMATION
   ============================================================ */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target;
      fill.style.width = `${fill.dataset.width}%`;
      observer.unobserve(fill);
    });
  }, { threshold: 0.4 });

  fills.forEach(fill => observer.observe(fill));
})();


/* ============================================================
   9. PROJECT FILTER
   ============================================================ */
(function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards   = document.querySelectorAll('.project-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category === filter;

        if (matches) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeSlideIn .4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();


/* ============================================================
   10. CONTACT FORM (demo — no real submission)
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Simple client-side validation
    const name    = form.querySelector('#formName').value.trim();
    const email   = form.querySelector('#formEmail').value.trim();
    const subject = form.querySelector('#formSubject').value.trim();
    const message = form.querySelector('#formMessage').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate async sending
    const btn = form.querySelector('#submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending…';

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Message Sent!';
      btn.style.background = 'var(--success)';
      form.reset();
      showToast('Message sent! I\'ll get back to you soon.', 'success');

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i> Send Message';
        btn.style.background = '';
        btn.disabled = false;
      }, 3200);
    }, 1600);
  });
})();


/* ============================================================
   11. TOAST NOTIFICATION
   ============================================================ */
function showToast(message, type = 'default') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const icons = { success: 'check-circle', error: 'exclamation-circle', default: 'info-circle' };
  const icon  = icons[type] || icons.default;

  toast.innerHTML = `<i class="fas fa-${icon} t-icon" aria-hidden="true"></i>${escapeHtml(message)}`;
  toast.className = `toast ${type}`;
  toast.classList.add('show');

  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 4200);
}

/** Prevent XSS in toast messages */
function escapeHtml(str) {
  const map = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' };
  return String(str).replace(/[&<>"']/g, ch => map[ch]);
}


/* ============================================================
   12. HERO PARTICLE EFFECT
   ============================================================ */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const PARTICLE_COUNT = 22;
  const styleEl        = document.createElement('style');
  let   cssRules       = '';

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const size  = (Math.random() * 4 + 2).toFixed(1);
    const left  = (Math.random() * 100).toFixed(1);
    const top   = (Math.random() * 100).toFixed(1);
    const alpha = (Math.random() * 0.22 + 0.04).toFixed(2);
    const dur   = (Math.random() * 16 + 10).toFixed(1);
    const delay = (Math.random() * -18).toFixed(1);

    const tx1 = rand(-40, 40); const ty1 = rand(-40, 40);
    const tx2 = rand(-60, 60); const ty2 = rand(-60, 60);
    const tx3 = rand(-40, 40); const ty3 = rand(-40, 40);

    cssRules += `
      @keyframes p${i} {
        0%,100% { transform: translate(0,0); }
        25%  { transform: translate(${tx1}px,${ty1}px); }
        50%  { transform: translate(${tx2}px,${ty2}px); }
        75%  { transform: translate(${tx3}px,${ty3}px); }
      }
    `;

    const dot        = document.createElement('div');
    dot.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      background:var(--accent);
      border-radius:50%;
      left:${left}%;top:${top}%;
      opacity:${alpha};
      pointer-events:none;
      animation:p${i} ${dur}s ease-in-out infinite;
      animation-delay:${delay}s;
    `;
    container.appendChild(dot);
  }

  styleEl.textContent = cssRules;
  document.head.appendChild(styleEl);

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
})();


/* ============================================================
   13. FOOTER YEAR
   ============================================================ */
(function setFooterYear() {
  const span = document.getElementById('footerYear');
  if (span) span.textContent = new Date().getFullYear();
})();
