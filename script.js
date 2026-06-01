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
    link.addEventListener('click', closeMenu);
  });
}

// ── PROJECT REGISTRY ──
const PROJECTS = [
  { slug: 'itsmejagz',     title: 'ITSME<br>JAGZ',       path: '/projects/itsmejagz/itsmejagz' },
  { slug: 'conversations', title: 'CONVER<br>SATIONS',    path: '/projects/conversations/conversations' },
  { slug: 'movemedia',     title: 'MOVE<br>MEDIA NZ',     path: '/projects/movemedia/movemedia' },
  { slug: 'conflict',      title: 'CONFLICT<br>AR',       path: '/projects/conflict/conflict' },
  { slug: 'xtrovert',      title: 'XTRO<br>VERT',         path: '/projects/xtrovert/xtrovert' },
];

// ── MOBILE MENU ──
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  const burger = document.querySelector('.hamburger');
  if (!links) return;
  const open = links.classList.toggle('open');
  if (burger) burger.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
}

function closeMenu() {
  document.querySelector('.nav-links')?.classList.remove('open');
  document.querySelector('.hamburger')?.classList.remove('open');
  document.body.classList.remove('menu-open');
}

// ── PAGE TRANSITIONS ──
function initTransitions() {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add('enter');
    requestAnimationFrame(() => {
      overlay.classList.remove('enter');
      overlay.classList.add('exit');
    });
  });

  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

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

// ── ANIMATED LOGO ──
function initAnimatedLogo() {
  const logoImg = document.querySelector('.nav-logo img');
  if (logoImg) {
    logoImg.style.animation = 'logoFadeIn 0.8s ease-out forwards';
  }
}

// ── PREFETCH PAGES ──
function initPrefetch() {
  document.querySelectorAll('a[href^="/"]').forEach(link => {
    link.addEventListener('mouseenter', () => {
      const linkEl = document.createElement('link');
      linkEl.rel = 'prefetch';
      linkEl.href = link.getAttribute('href');
      document.head.appendChild(linkEl);
    });
  });
}

// ── KEYBOARD NAVIGATION ──
function initKeyboardNav() {
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      const nextLink = document.querySelector('.next-project');
      if (nextLink) nextLink.click();
    }
  });
}

// ── SCROLL-TO-TOP ──
function initScrollToTop() {
  const navLogo = document.querySelector('.nav-logo');
  if (navLogo) {
    navLogo.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ── PROGRESS BAR ──
function initProgressBar() {
  const progress = document.createElement('div');
  progress.className = 'progress-bar';
  document.body.appendChild(progress);

  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progress.style.width = scrolled + '%';
  });
}

// ── ACTIVE SECTION TRACKING ──
function initActiveSectionTracking() {
  const sections = document.querySelectorAll('[data-section]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (sections.length === 0) return;

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (s.offsetTop <= window.scrollY) current = s.getAttribute('data-section');
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href').includes(current));
    });
  });
}

// ── SMOOTH ANCHOR SCROLLING ──
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ── GOOGLE ANALYTICS EVENT TRACKING ──
function initAnalyticsTracking() {
  document.querySelectorAll('a[href*=".pdf"]').forEach(link => {
    link.addEventListener('click', () => {
      const fileName = link.href.split('/').pop() || 'PDF';
      const buttonText = link.textContent.trim();
      if (window.gtag) {
        gtag('event', 'file_download', {
          'file_name': fileName,
          'button_text': buttonText,
          'file_type': 'pdf'
        });
      }
    });
  });

  document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', () => {
      const url = link.href;
      const linkText = link.textContent.trim();
      if (window.gtag) {
        gtag('event', 'external_link_click', {
          'url': url,
          'link_text': linkText
        });
      }
    });
  });

  document.querySelectorAll('.work-item, a[href*="/projects/"]').forEach(link => {
    link.addEventListener('click', () => {
      const projectName = link.textContent.trim() || link.href;
      if (window.gtag) {
        gtag('event', 'project_viewed', {
          'project_name': projectName
        });
      }
    });
  });
}

// ── INITIALIZE CUSTOM CURSOR ──
function initCustomCursor() {
  const cursor = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-ring');

  if (!cursor || !ring) return;

  document.documentElement.style.cursor = 'none';
  document.body.style.cursor = 'none';

  let mx, my, rx, ry;
  let started = false;

  function lerp(a, b, t) { return a + (b - a) * t; }

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;

    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';

    if (!started) {
      started = true;
      rx = mx;
      ry = my;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      cursor.style.opacity = '1';
      ring.style.opacity = '1';

      setInterval(() => {
        rx = lerp(rx, mx, 0.15);
        ry = lerp(ry, my, 0.15);
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
      }, 16);
    }
  });

  document.querySelectorAll('a, button').forEach(el => {
    el.style.cursor = 'none';
    el.addEventListener('mouseenter', () => ring.classList.add('grow'));
    el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (started) {
      cursor.style.opacity = '1';
      ring.style.opacity = '1';
    }
  });
}

// ── ALL DOM-DEPENDENT LOGIC ──
document.addEventListener('DOMContentLoaded', () => {

  injectNav();
  initTransitions();
  initAnimatedLogo();
  initPrefetch();
  initKeyboardNav();
  initScrollToTop();
  initProgressBar();
  initActiveSectionTracking();
  initSmoothAnchors();
  initAnalyticsTracking();
  initCustomCursor();

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
