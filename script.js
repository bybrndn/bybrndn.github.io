// ── MODULAR NAV ──
function injectNav() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  nav.innerHTML = `
    <div class="nav-inner">
      <a class="nav-logo" href="/index.html">
        <span class="by">By</span>
        <img src="/images/BRNDN light.png" alt="BRNDN" style="height:28px; width:auto;" />
      </a>
      <ul class="nav-links">
        <li><a href="/index.html">Home</a></li>
        <li><a href="/work.html">Work</a></li>
      </ul>
      <button class="hamburger" onclick="toggleMenu()">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;
  const path = window.location.pathname;
  nav.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (path === href || path.endsWith(href) || (href === '/work.html' && path.includes('/projects/'))) {
      link.classList.add('active');
    }
  });
}
injectNav();

// ── PROJECT REGISTRY ──
const PROJECTS = [
  { slug: 'itsmejagz',     title: 'ITSME<br>JAGZ',       path: '/projects/itsmejagz/itsmejagz.html' },
  { slug: 'xtrovert',      title: 'XTRO<br>VERT',         path: '/projects/xtrovert/xtrovert.html' },
  { slug: 'conversations', title: 'CONVER<br>SATIONS',    path: '/projects/conversations/conversations.html' },
  { slug: 'conflict',      title: 'CONFLICT<br>AR',       path: '/projects/conflict/conflict.html' },
  { slug: 'movemedia',     title: 'MOVE<br>MEDIA NZ',     path: '/projects/movemedia/movemedia.html' },
];

(function() {
  const nextEl = document.querySelector('.next-project');
  if (!nextEl) return;
  const currentPath = window.location.pathname;
  const currentIndex = PROJECTS.findIndex(p => currentPath.includes(p.slug));
  if (currentIndex === -1) return;
  const next = PROJECTS[(currentIndex + 1) % PROJECTS.length];
  nextEl.href = next.path;
  const titleEl = nextEl.querySelector('.next-title');
  if (titleEl) titleEl.innerHTML = next.title;
})();

// ── CUSTOM CURSOR ──
const cursor = document.querySelector('.cursor');
const ring = document.querySelector('.cursor-ring');

if (cursor && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  let moved = false;

  cursor.style.opacity = '0';
  ring.style.opacity = '0';

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    if (!moved) {
      moved = true;
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
  if (!links) return;
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
    backdropFilter: 'blur(8px)',
    zIndex: '99'
  });
}
