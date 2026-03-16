// ── PROJECT REGISTRY ──
// Add new projects here in order — the next project link updates automatically
const PROJECTS = [
  { slug: 'itsmejagz',    title: 'ITSME\nJAGZ',       path: '/projects/itsmejagz/itsmejagz.html' },
  { slug: 'xtrovert',     title: 'XTRO\nVERT',         path: '/projects/xtrovert/xtrovert.html' },
  { slug: 'conversations',title: 'CONVER\nSATIONS',    path: '/projects/conversations/conversations.html' },
  { slug: 'conflict',     title: 'CONFLICT\nAR',       path: '/projects/conflict/conflict.html' },
  { slug: 'movemedia',    title: 'MOVE\nMEDIA NZ',     path: '/projects/movemedia/movemedia.html' },
];

// Auto-populate the next project link based on current page
(function() {
  const nextEl = document.querySelector('.next-project');
  if (!nextEl) return;

  const currentPath = window.location.pathname;
  const currentIndex = PROJECTS.findIndex(p => currentPath.includes(p.slug));
  if (currentIndex === -1) return;

  const next = PROJECTS[(currentIndex + 1) % PROJECTS.length];
  nextEl.href = next.path;

  const titleEl = nextEl.querySelector('.next-title');
  if (titleEl) titleEl.innerHTML = next.title.replace('\n', '<br>');
})();

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
  let moved = false;

  // Hide until first mouse movement
  cursor.style.opacity = '0';
  ring.style.opacity = '0';

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    if (!moved) {
      moved = true;
      // Snap ring to mouse position immediately on first move
      rx = mx; ry = my;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      cursor.style.opacity = '1';
      ring.style.opacity = '1';
    }
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
