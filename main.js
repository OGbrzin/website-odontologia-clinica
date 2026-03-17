/* =============================================
   SORRISO URBANO — Main JavaScript
   ============================================= */

// --- Header scroll effect ---
const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

function updateHeader() {
  if (!header) return;
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
    header.classList.remove('transparent');
  } else {
    header.classList.remove('scrolled');
    // Only transparent on hero pages (index)
    if (document.querySelector('.hero')) {
      header.classList.add('transparent');
    } else {
      header.classList.add('scrolled');
    }
  }
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// --- Mobile Menu ---
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// --- Scroll Reveal Animations ---
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

// --- FAQ Accordion ---
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// --- Before / After Slider ---
document.querySelectorAll('.ba-slider').forEach(slider => {
  const afterEl = slider.querySelector('.ba-after');
  const divider = slider.querySelector('.ba-divider');
  let isDragging = false;

  function getPercent(clientX) {
    const rect = slider.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    return Math.max(5, Math.min(95, pct));
  }

  function updateSlider(pct) {
    if (afterEl) afterEl.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    if (divider) divider.style.left = pct + '%';
    const handle = divider ? divider.querySelector('.ba-handle') : null;
    if (handle) handle.style.left = '0';
  }

  // Mouse
  slider.addEventListener('mousedown', (e) => { isDragging = true; updateSlider(getPercent(e.clientX)); e.preventDefault(); });
  window.addEventListener('mousemove', (e) => { if (isDragging) updateSlider(getPercent(e.clientX)); });
  window.addEventListener('mouseup', () => { isDragging = false; });

  // Touch
  slider.addEventListener('touchstart', (e) => { isDragging = true; updateSlider(getPercent(e.touches[0].clientX)); }, { passive: true });
  window.addEventListener('touchmove', (e) => { if (isDragging) updateSlider(getPercent(e.touches[0].clientX)); }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; });

  // Click
  slider.addEventListener('click', (e) => updateSlider(getPercent(e.clientX)));
});

// --- Testimonials Carousel ---
const depTrack = document.querySelector('.dep-track');
if (depTrack) {
  const cards = depTrack.querySelectorAll('.dep-card');
  const dots = document.querySelectorAll('.dep-dot');
  const prevBtn = document.querySelector('.dep-btn.prev');
  const nextBtn = document.querySelector('.dep-btn.next');
  let current = 0;
  const visibleCount = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

  function goTo(idx) {
    const max = Math.max(0, cards.length - visibleCount);
    current = Math.max(0, Math.min(idx, max));
    const cardWidth = depTrack.querySelector('.dep-card').offsetWidth + 28;
    depTrack.style.transform = `translateX(-${current * cardWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto-play
  let autoPlay = setInterval(() => goTo(current + 1 > Math.max(0, cards.length - visibleCount) ? 0 : current + 1), 5000);
  depTrack.closest('.dep-carousel')?.addEventListener('mouseenter', () => clearInterval(autoPlay));
  depTrack.closest('.dep-carousel')?.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => goTo(current + 1 > Math.max(0, cards.length - visibleCount) ? 0 : current + 1), 5000);
  });
}

// --- Animated Counters ---
function animateCounter(el, target, suffix) {
  const duration = 2000;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterEls = document.querySelectorAll('.numero-val[data-target]');
if (counterEls.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.target), el.dataset.suffix || '');
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObserver.observe(el));
}

// --- Contact Form ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const original = btn.textContent;
    btn.textContent = '✓ Mensagem Enviada!';
    btn.style.background = 'linear-gradient(135deg, #25D366, #1aa04e)';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      contactForm.reset();
    }, 3500);
  });
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 90;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// --- Active nav link ---
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});
