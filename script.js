// ── MODULAR NAV ──
function injectNav() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  nav.innerHTML = `
    <div class="nav-inner">
      <a class="nav-logo" href="/">
        <span class="by">By</span>
        <img src="/images/BRNDN light.png" alt="BRNDN" style="height:28px; width:auto;" />
      </a>
      <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/work">Work</a></li>
      </ul>
      <button class="hamburger" onclick="toggleMenu()">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;
  const path = window.location.pathname;
  nav.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (path === href || path === href + '/' || (href === '/work' && path.includes('/projects/'))) {
      link.classList.add('active');
    }
  });
}

// ── PROJECT REGISTRY ──
const PROJECTS = [
  { slug: 'itsmejagz',     title: 'ITSME<br>JAGZ',       path: '/projects/itsmejagz/itsmejagz' },
  { slug: 'xtrovert',      title: 'XTRO<br>VERT',         path: '/projects/xtrovert/xtrovert' },
  { slug: 'conversations', title: 'CONVER<br>SATIONS',    path: '/projects/conversations/conversations' },
  { slug: 'conflict',      title: 'CONFLICT<br>AR',       path: '/projects/conflict/conflict' },
  { slug: 'movemedia',     title: 'MOVE<br>MEDIA NZ',     path: '/projects/movemedia/movemedia' },
];

// ── MOBILE MENU ──
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  if (!links) return;
  links.classList.toggle('open');
}

// ── PAGE TRANSITIONS ──
function initTransitions() {
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);

  // Fade in on arrival
  requestAnimationFrame(() => {
    overlay.classList.add('enter');
    requestAnimationFrame(() => {
      overlay.classList.remove('enter');
      overlay.classList.add('exit');
    });
  });

  // Intercept all internal link clicks
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Skip external links, anchors, and mailto/tel
    if (href.startsWith('http') || href.startsWith('#') ||
        href.startsWith('mailto') || href.startsWith('tel')) return;

    e.preventDefault();

    overlay.classList.remove('exit');
    overlay.classList.add('enter');

    setTimeout(() => {
      window.location.href = href;
    }, 400);
  });
}

// ── ALL DOM-DEPENDENT LOGIC ──
document.addEventListener('DOMContentLoaded', () => {

  injectNav();
  initTransitions();

  // Next project
  const nextEl = document.querySelector('.next-project');
  if (nextEl) {
    const currentPath = window.location.pathname;
    const currentIndex = PROJECTS.findIndex(p => currentPath.includes(p.slug));
    if (currentIndex !== -1) {
      const next = PROJECTS[(currentIndex + 1) % PROJECTS.length];
      nextEl.href = next.path;
      const titleEl = nextEl.querySelector('.next-title');
      if (titleEl) titleEl.innerHTML = next.title;
    }
  }

  // Custom cursor
  const cursor = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-ring');
  if (cursor && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0, moved = false;
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

  // Nav scroll
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () =>
      navbar.classList.toggle('scrolled', window.scrollY > 20)
    );
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries =>
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.08 }
  );
  reveals.forEach(el => obs.observe(el));
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
  });

});
