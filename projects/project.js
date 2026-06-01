/* ════════════════════════════════════════════════════════════════
   DATA-DRIVEN PROJECT PAGE RENDERER
   Reads ?p=<slug> from the URL, loads /projects/<slug>/project.json,
   themes the page and renders the hero + content sections + next
   link. One template (project.html) renders every project.
   See projects/README.md for the config schema.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Pretty URLs in production (Jekyll permalink: pretty) vs raw .html
  // when served locally — link in whichever form the page was loaded.
  var PRETTY = !location.pathname.endsWith('.html');
  function projectUrl(slug) {
    return (PRETTY ? '/projects/project/?p=' : '/projects/project.html?p=') + encodeURIComponent(slug);
  }

  function getSlug() {
    var p = new URLSearchParams(location.search).get('p');
    return p || location.hash.replace('#', '') || null;
  }

  // ── small render helpers ──────────────────────────────────────
  function attr(s) { return String(s == null ? '' : s).replace(/"/g, '&quot;'); }
  function paras(list) {
    return (list || []).map(function (t) { return '<p class="ps-text">' + t + '</p>'; }).join('');
  }
  function grid(g) {
    var cols = g.columns || 1;
    var style = g.maxWidth ? ' style="max-width:' + g.maxWidth + 'px"' : '';
    var imgs = (g.images || []).map(function (im) {
      var cls = im.contain ? ' class="contain"' : '';
      var ist = im.maxHeight ? ' style="max-height:' + im.maxHeight + 'px"' : '';
      var cap = im.caption ? '<p class="img-caption">' + im.caption + '</p>' : '';
      return '<div><img src="' + attr(im.src) + '" alt="' + attr(im.alt || im.caption || '') + '"' + cls + ist + '>' + cap + '</div>';
    }).join('');
    return '<div class="img-grid cols-' + cols + '"' + style + '>' + imgs + '</div>';
  }

  // ── section renderers, keyed by type ──────────────────────────
  var SECTIONS = {
    text: function (s) {
      var row = s.swatchRow
        ? '<div class="swatch-row">' + s.swatchRow.map(function (c) {
            return '<div class="swatch-dot" style="background:' + c + '"></div>';
          }).join('') + '</div>'
        : '';
      return content(s.label, paras(s.paragraphs) + row);
    },
    gallery: function (s) {
      var grids = s.grids || [{ columns: s.columns, maxWidth: s.maxWidth, images: s.images }];
      return content(s.label, paras(s.paragraphs) + grids.map(grid).join(''));
    },
    video: function (s) {
      var v = '<div class="video-container"><iframe src="' + attr(s.embed) +
        '" title="' + attr(s.label || 'Video') + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>' +
        (s.caption ? '<p class="img-caption">' + s.caption + '</p>' : '');
      return content(s.label, v);
    },
    palette: function (s) {
      var sw = (s.swatches || []).map(function (c) {
        var border = c.border ? ';border:1px solid var(--rule)' : '';
        return '<div class="palette-swatch">' +
          '<div class="palette-swatch-color" style="background:' + c.hex + border + '"></div>' +
          '<span class="palette-swatch-name">' + c.name + '</span>' +
          '<span class="palette-swatch-hex">' + c.hex + '</span></div>';
      }).join('');
      return content(s.label, paras(s.paragraphs) + '<div class="palette-swatches">' + sw + '</div>');
    },
    values: function (s) {
      var items = (s.items || []).map(function (v) {
        return '<div class="value-item"><span class="value-name">' + v.name +
          '</span><p class="value-desc">' + v.desc + '</p></div>';
      }).join('');
      return content(s.label, paras(s.paragraphs) + '<div class="values-grid">' + items + '</div>');
    },
    logos: function (s) {
      var cols = s.columns || 2;
      var items = (s.items || []).map(function (it) {
        var img = '<img src="' + attr(it.src) + '" alt="' + attr(it.alt || it.caption || '') + '">';
        var body = it.bg ? '<div class="logo-box ' + it.bg + '">' + img + '</div>' : img;
        var cap = it.caption ? '<p class="logo-item-caption">' + it.caption + '</p>' : '';
        return '<div class="logo-item">' + body + cap + '</div>';
      }).join('');
      return content(s.label, paras(s.paragraphs) + '<div class="logo-grid cols-' + cols + '">' + items + '</div>');
    },
    custom: function (s) { return content(s.label, s.html || ''); }
  };

  function content(label, inner) {
    return '<div class="project-section reveal">' +
      '<span class="ps-label">' + (label || '') + '</span>' +
      '<div class="ps-content">' + inner + '</div></div>';
  }

  // ── hero ──────────────────────────────────────────────────────
  function metaRows(data, parallax) {
    var rows = (data.meta || []).map(function (m) {
      return '<div class="project-meta-row"><span class="project-meta-label">' + m.label +
        '</span><span class="project-meta-value">' + m.value + '</span></div>';
    }).join('');
    if (data.link) {
      rows += '<div class="project-meta-row project-meta-link"><a href="' + attr(data.link.url) +
        '" class="link-arrow" target="_blank" rel="noopener">' + data.link.label + ' <span>→</span></a></div>';
    }
    return '<div class="project-meta reveal ' + (parallax ? 'd3' : 'd2') + '">' + rows + '</div>';
  }

  function renderHero(data) {
    var hero = document.getElementById('project-hero');
    var titleHTML = data.titleHTML || data.title;
    var h = data.hero || {};

    if (h.layout === 'split') {
      hero.className = 'project-hero layout-split';
      hero.innerHTML =
        '<div class="project-hero-left">' +
          '<a class="project-back reveal" href="/work">← Back to Work</a>' +
          '<h1 class="project-title reveal d1">' + titleHTML + '</h1>' +
          metaRows(data, false) +
        '</div>' +
        '<div class="project-hero-right">' +
          '<div class="project-cover reveal"><img src="' + attr(h.cover || h.background) + '" alt="' + attr(data.title) + '"></div>' +
          '<p class="project-desc reveal d2">' + (data.description || '') + '</p>' +
        '</div>';
    } else {
      hero.className = 'project-hero layout-parallax';
      if (h.backgroundFilter) document.documentElement.style.setProperty('--hero-filter', h.backgroundFilter);
      var bgStyle = h.background ? ' style="background-image:url(\'' + h.background + '\')"' : '';
      hero.innerHTML =
        '<div class="project-hero-bg" id="parallaxBg"' + bgStyle + '></div>' +
        '<div class="project-hero-fade"></div>' +
        '<div class="project-hero-content">' +
          '<a class="project-back reveal" href="/work">← Back to Work</a>' +
          '<div><h1 class="project-title reveal d1">' + titleHTML + '</h1>' +
          '<p class="project-desc reveal d2">' + (data.description || '') + '</p></div>' +
          metaRows(data, true) +
        '</div>';
      if (h.background) setupParallax(h.background);
    }
  }

  function setupParallax(src) {
    var bg = document.getElementById('parallaxBg');
    if (!bg || !src) return;
    var img = new Image();
    img.onload = function () { bg.classList.add('loaded'); };
    img.src = src;
    if (img.complete) bg.classList.add('loaded');
    window.addEventListener('scroll', function () {
      bg.style.transform = 'translateY(' + (window.scrollY * 0.35) + 'px)';
    }, { passive: true });
  }

  // ── theme ─────────────────────────────────────────────────────
  function applyTheme(t) {
    if (!t) return;
    var root = document.documentElement.style;
    var map = { bg: '--bg', bgDark: '--bg-dark', ink: '--ink', inkMid: '--ink-mid',
      inkFaint: '--ink-faint', rule: '--rule', accent: '--accent', accent2: '--accent2',
      titleFont: '--title-font', titleWeight: '--title-weight', imageFilter: '--image-filter' };
    Object.keys(map).forEach(function (k) { if (t[k] != null) root.setProperty(map[k], t[k]); });
    if (t.ink) root.setProperty('--white', t.ink);
    if (t.bodyFont) document.body.style.fontFamily = t.bodyFont;
    if (t.googleFonts) {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=' + t.googleFonts + '&display=swap';
      document.head.appendChild(l);
    }
  }

  // ── next project (looped through the manifest order) ──────────
  function renderNext(slug) {
    return fetch('/projects/projects.json', { cache: 'no-cache' })
      .then(function (r) { return r.json(); })
      .then(function (list) {
        var i = list.indexOf(slug);
        if (i === -1 || list.length < 2) return '';
        var nextSlug = list[(i + 1) % list.length];
        return fetch('/projects/' + nextSlug + '/project.json', { cache: 'no-cache' })
          .then(function (r) { return r.json(); })
          .then(function (n) {
            var t = n.nextTitle || n.titleHTML || n.title;
            return '<a class="next-project reveal" href="' + projectUrl(nextSlug) + '">' +
              '<div><p class="next-label">Next Project</p><p class="next-title">' + t + '</p></div>' +
              '<span class="next-arrow">↗</span></a>';
          });
      })
      .catch(function () { return ''; });
  }

  // ── reveal-on-scroll for the freshly injected nodes ───────────
  function activateReveals() {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
      else obs.observe(el);
    });
    // Custom-cursor grow on any new links.
    var ring = document.querySelector('.cursor-ring');
    if (ring) document.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('grow'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('grow'); });
    });
  }

  function notFound() {
    document.getElementById('project-hero').remove();
    document.getElementById('project-content').innerHTML =
      '<div class="project-section reveal visible" style="grid-template-columns:1fr;text-align:center;min-height:60vh;align-content:center">' +
      '<div><h1 class="project-title" style="font-size:clamp(2rem,5vw,4rem)">Project not found</h1>' +
      '<p class="ps-text" style="margin:1.5rem auto 0">That project doesn\'t exist yet.</p>' +
      '<a class="link-arrow" href="/work" style="justify-content:center;margin-top:2rem">Back to Work <span>→</span></a></div></div>';
    document.body.classList.remove('proj-loading');
  }

  // ── boot ──────────────────────────────────────────────────────
  function render() {
    var slug = getSlug();
    if (!slug) { notFound(); return; }

    fetch('/projects/' + slug + '/project.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('404'); return r.json(); })
      .then(function (data) {
        document.title = 'BY BRNDN — ' + (data.title || 'Project');
        applyTheme(data.theme);
        renderHero(data);

        var html = (data.sections || []).map(function (s) {
          return (SECTIONS[s.type] || SECTIONS.custom)(s);
        }).join('');

        return renderNext(slug).then(function (nextHTML) {
          document.getElementById('project-content').innerHTML = html + nextHTML +
            '<footer><span>© 2026 Branden Hall</span><span>Auckland, NZ</span></footer>';
          document.body.classList.remove('proj-loading');
          activateReveals();
        });
      })
      .catch(notFound);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
