// ── PAGE TRANSITION OVERLAY ──
const overlay = document.createElement('div');
overlay.className = 'page-transition enter';
document.body.appendChild(overlay);

// Fade in on load
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    overlay.classList.remove('enter');
  });
});

// Intercept internal links — fade out then navigate
document.addEventListener('click', e => {
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || link.target === '_blank') return;

  e.preventDefault();
  overlay.classList.add('enter');
  setTimeout(() => { window.location.href = href; }, 380);
});

// ── CUSTOM CURSOR ──
const cursor = document.querySelector('.cursor');
const ring = document.querySelector('.cursor-ring');

if (cursor && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  (function animRing() {
    rx = lerp(rx, mx, 0.1);
    ry = lerp(ry, my, 0.1);
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('grow'));
    el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
  });
}

// ── NAV SCROLL ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () =>
    navbar.classList.toggle('scrolled', window.scrollY > 20)
  );
}

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries =>
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.08 }
);
reveals.forEach(el => obs.observe(el));
window.addEventListener('load', () =>
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
  })
);

// ── MOBILE MENU ──
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  const open = links.style.display === 'flex';
  links.style.display = open ? 'none' : 'flex';
  if (!open) Object.assign(links.style, {
    flexDirection: 'column',
    position: 'fixed',
    top: '72px',
    right: '3.5vw',
    background: 'rgba(21,24,30,0.97)',
    padding: '1.5rem 2rem',
    gap: '1.4rem',
    border: '1px solid rgba(236,244,249,0.08)',
    backdropFilter: 'blur(8px)'
  });
}
