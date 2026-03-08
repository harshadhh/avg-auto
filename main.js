/* ── HAMBURGER ── */
const ham = document.getElementById('ham');
const mobNav = document.getElementById('mob-nav');
if (ham && mobNav) {
  ham.addEventListener('click', () => {
    const open = ham.classList.toggle('open');
    mobNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    ham.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', e => {
    if (!ham.contains(e.target) && !mobNav.contains(e.target)) {
      ham.classList.remove('open');
      mobNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
  mobNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ham.classList.remove('open');
    mobNav.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* ── ACTIVE NAV ── */
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.desktop-nav a, .mob-nav a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === page || (page === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(el => revealObs.observe(el));

/* ── ADD TO CART ── */
let cartCount = 0;
const cartBtns = document.querySelectorAll('.btn-add');
const cartDisplay = document.querySelectorAll('.cart-count');
cartBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    cartCount++;
    cartDisplay.forEach(el => el.textContent = cartCount);
    const orig = this.textContent;
    this.textContent = '✓ Added!';
    this.style.background = '#0A7A3E';
    setTimeout(() => {
      this.textContent = orig;
      this.style.background = '';
    }, 1500);
  });
});

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
