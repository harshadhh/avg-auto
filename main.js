/* ═══════════════════════════════════════════
   AVG AUTO — main.js
   Cart, Nav, Reveal, Toast
═══════════════════════════════════════════ */

/* ── CART STORAGE ── */
const CART_KEY = 'avgauto_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id, name, brand, price, emoji) {
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty += 1; }
  else { cart.push({ id, name, brand, price, emoji, qty: 1 }); }
  saveCart(cart);
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) { item.qty = Math.max(1, parseInt(qty) || 1); saveCart(cart); }
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartUI();
}

function getCartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function updateCartUI() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* ── ADD TO CART BUTTONS ── */
function initAddToCartButtons() {
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', function () {
      const card = this.closest('.p-card');
      if (!card) return;
      const id = card.dataset.id || card.querySelector('.p-name')?.textContent?.trim().replace(/\s+/g,'-').toLowerCase() || Date.now().toString();
      const name  = card.querySelector('.p-name')?.textContent?.trim()  || 'Product';
      const brand = card.querySelector('.p-brand')?.textContent?.trim() || '';
      const price = parseInt(card.dataset.price || card.querySelector('.p-price')?.textContent?.replace(/[₹,]/g,'') || 0);
      const emoji = card.querySelector('.p-img')?.textContent?.trim()   || '📦';
      addToCart(id, name, brand, price, emoji);
      const orig = this.textContent;
      this.textContent = '✓ Added!';
      this.style.background = '#0A7A3E';
      setTimeout(() => { this.textContent = orig; this.style.background = ''; }, 1500);
      showToast(name + ' added to cart!');
    });
  });
}

/* ── TOAST ── */
function showToast(msg) {
  let t = document.getElementById('avg-toast');
  if (!t) {
    t = document.createElement('div'); t.id = 'avg-toast';
    t.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(16px);background:#0A7A3E;color:#fff;padding:11px 22px;font-family:Barlow Condensed,sans-serif;font-size:14px;letter-spacing:1px;text-transform:uppercase;font-weight:700;z-index:9999;opacity:0;transition:all .3s;white-space:nowrap;pointer-events:none;box-shadow:0 4px 20px rgba(0,0,0,.4)';
    document.body.appendChild(t);
  }
  t.textContent = '✓  ' + msg;
  t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._t);
  t._t = setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(16px)'; }, 2500);
}

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
      ham.classList.remove('open'); mobNav.classList.remove('open'); document.body.style.overflow = '';
    }
  });
  mobNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ham.classList.remove('open'); mobNav.classList.remove('open'); document.body.style.overflow = '';
  }));
}

/* ── ACTIVE NAV ── */
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.desktop-nav a, .mob-nav a').forEach(a => {
  if (a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html')) a.classList.add('active');
});

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 70); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(el => revealObs.observe(el));

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ── INIT ── */
window.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  initAddToCartButtons();
});
