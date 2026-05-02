// Hero reveal: smooth word-by-word stagger reveal with blur-defocus —
// modern motion language inspired by Linear / Vercel / Apple intro pages.
(function heroReveal() {
  const title = document.getElementById('hero-name');
  const target = document.getElementById('typed-target');
  const subtitle = document.getElementById('typed-subtitle');
  if (!title || !target || !subtitle) return;

  const nameText = title.getAttribute('data-text') || 'Ramesh Maharaddi';

  // Plain, human sentence. Tech keywords stay coloured for visual hierarchy.
  const segments = [
    { text: '> ',                                              cls: 'h'  },
    { text: 'Senior ',                                         cls: ''   },
    { text: 'Software Engineer',                               cls: 'tw' },
    { text: ' & ',                                             cls: ''   },
    { text: 'Solution Designer',                               cls: 'ta' },
    { text: '. I build enterprise apps across ',               cls: ''   },
    { text: 'UI',                                              cls: 't2' },
    { text: ', ',                                              cls: ''   },
    { text: 'backend',                                         cls: 'ta' },
    { text: ', ',                                              cls: ''   },
    { text: 'database',                                        cls: 't4' },
    { text: ' and ',                                           cls: ''   },
    { text: 'AI',                                              cls: 'ta' },
    { text: '. Focused on ',                                   cls: ''   },
    { text: 'Agentic AI',                                      cls: 'ta' },
    { text: ', ',                                              cls: ''   },
    { text: 'Multi-Agent Systems',                             cls: 't4' },
    { text: ', ',                                              cls: ''   },
    { text: 'Knowledge-based RAG',                             cls: 't2' },
    { text: ' and ',                                           cls: ''   },
    { text: 'MCP',                                             cls: 'ta' },
    { text: '. Shipping production systems across ',           cls: ''   },
    { text: 'Telecom',                                         cls: 't2' },
    { text: ', ',                                              cls: ''   },
    { text: 'Banking',                                         cls: 'ta' },
    { text: ', ',                                              cls: ''   },
    { text: 'Insurance',                                       cls: 't4' },
    { text: ', ',                                              cls: ''   },
    { text: 'Retail',                                          cls: 'ta' },
    { text: ' and ',                                           cls: ''   },
    { text: 'Fintech',                                         cls: 't2' },
    { text: '.',                                               cls: ''   }
  ];

  // Linux-style fast char-by-char typing. Builds spans per coloured segment,
  // appending a character every `speed` ms. Trailing whitespace lives
  // inside the per-segment span so spaces render correctly between segments.
  function typeSegments(el, parts, speed, onDone) {
    el.innerHTML = '';
    // Flatten segments into a stream of {ch, cls} so we can switch span
    // whenever the colour class changes.
    const flat = [];
    parts.forEach(p => {
      for (const ch of p.text) flat.push({ ch, cls: p.cls || '' });
    });

    let i = 0;
    let currentSpan = null;
    let currentCls = null;
    function tick() {
      if (i >= flat.length) { if (onDone) onDone(); return; }
      const { ch, cls } = flat[i];
      if (cls !== currentCls || !currentSpan) {
        currentSpan = document.createElement('span');
        if (cls) currentSpan.className = cls;
        el.appendChild(currentSpan);
        currentCls = cls;
      }
      currentSpan.appendChild(document.createTextNode(ch));
      i++;
      setTimeout(tick, speed);
    }
    tick();
  }

  // Pre-fill the full sentence to measure final height, then reset, so
  // typing doesn't push the meta + social rows down line-by-line.
  target.textContent = segments.map(s => s.text).join('');
  const reservedH = subtitle.getBoundingClientRect().height;
  subtitle.style.minHeight = reservedH + 'px';

  // Reset both name and subtitle to empty before sequencing.
  title.textContent = '';
  target.textContent = '';

  // Smooth character-by-character typing for the name with a blinking caret.
  function revealName(text, onDone) {
    title.textContent = '';
    title.classList.add('go');     // makes title visible
    const caret = document.createElement('span');
    caret.className = 'name-caret';
    title.appendChild(caret);

    const speed = 65;              // ms per char — calm, deliberate
    let i = 0;
    function tick() {
      if (i >= text.length) {
        // Hold caret briefly then remove.
        setTimeout(() => caret.remove(), 320);
        if (onDone) onDone();
        return;
      }
      title.insertBefore(document.createTextNode(text[i]), caret);
      i++;
      setTimeout(tick, speed);
    }
    tick();
  }

  setTimeout(() => {
    revealName(nameText, () => {
      const returnIcon = document.createElement('span');
      returnIcon.className = 'hero-return';
      returnIcon.textContent = ' ↵';
      title.appendChild(returnIcon);
      // Kick off Linux-style fast typing after a short pause.
      setTimeout(() => {
        typeSegments(target, segments, 14, () => {
          const caret = document.querySelector('.type-caret');
          if (caret) caret.classList.add('done');
        });
      }, 200);
    });
  }, 280);
})();

// Measure titlebar height and set CSS var so tabs stick exactly below it
function syncTitlebarHeight() {
  const tb = document.querySelector('.titlebar');
  if (!tb) return;
  const h = Math.round(tb.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--titlebar-h', h + 'px');
}
syncTitlebarHeight();
window.addEventListener('resize', syncTitlebarHeight);
window.addEventListener('load', syncTitlebarHeight);

// Reveal on scroll
const reveal = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
reveal.forEach(r => io.observe(r));


(function () {
  const hamburger   = document.getElementById('hamburger');
  const sidebar     = document.getElementById('sidebar');
  const overlay     = document.getElementById('sidebar-overlay');
  const closeBtn    = document.getElementById('sidebar-close');

  function open() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }
  function close() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', function () {
    sidebar.classList.contains('open') ? close() : open();
  });
  overlay.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);

  // Close when any sidebar link is tapped
  sidebar.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', close);
  });
}());

// Scroll to top functionality
(function () {
  const scrollBtn = document.getElementById('scroll-to-top');

  function toggleScrollBtn() {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  scrollBtn.addEventListener('click', scrollToTop);
  scrollBtn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  });

  window.addEventListener('scroll', toggleScrollBtn);
  toggleScrollBtn(); // Initial check
}());

// Scroll progress: thin top bar + linux-style percentage badge
(function () {
  const fill  = document.getElementById('spb-fill');
  const badge = document.getElementById('spb-badge');
  if (!fill || !badge) return;

  const BAR_WIDTH = 10; // chars in the [████░░] visual

  // TODO(you): write this function — see the comment block below the IIFE
  function formatProgress(percent) {
    const filled = Math.round((percent / 100) * BAR_WIDTH);
    const empty  = BAR_WIDTH - filled;
    return '[' + '█'.repeat(filled) + '░'.repeat(empty) + '] ' + Math.round(percent) + '%';
  }

  let ticking = false;
  function update() {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const percent  = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;

    fill.style.transform = 'scaleX(' + (percent / 100) + ')';
    badge.textContent    = formatProgress(percent);
    badge.classList.toggle('visible', scrolled > 80);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}());

// Theme toggle (dark <-> light) using stylesheet swap
(function () {
  const themeLink = document.getElementById('theme-style');
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeLink || !themeToggle) return;

  const STORAGE_KEY = 'site-theme';
  const THEMES = {
    dark: 'css/dark.css',
    light: 'css/light.css'
  };

  function setTheme(theme) {
    const nextTheme = theme === 'light' ? 'light' : 'dark';
    themeLink.setAttribute('href', THEMES[nextTheme] + '?v=' + Date.now());
    themeToggle.setAttribute(
      'aria-label',
      nextTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
    );
    themeToggle.setAttribute(
      'title',
      nextTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
    );
    themeToggle.setAttribute('data-theme', nextTheme);
    themeToggle.textContent = nextTheme === 'dark' ? '🐧' : '☀';
    localStorage.setItem(STORAGE_KEY, nextTheme);
  }

  const savedTheme = localStorage.getItem(STORAGE_KEY);
  setTheme(savedTheme || 'dark');

  themeToggle.addEventListener('click', function () {
    const current = themeToggle.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}());
