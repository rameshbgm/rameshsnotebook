// Typing effect on hero subtitle
(function typeHero() {
  const target = document.getElementById('typed-target');
  if (!target) return;
  const segments = [
    { text: 'Senior ', cls: '' },
    { text: 'AI Engineer', cls: 'tw' },
    { text: ' & Solution Architect. Building production-grade ', cls: '' },
    { text: 'agentic systems', cls: 'ta' },
    { text: ', ', cls: '' },
    { text: 'RAG pipelines', cls: 't2' },
    { text: ', and ', cls: '' },
    { text: 'multi-agent orchestration', cls: 't4' },
    { text: ' platforms.', cls: '' }
  ];

  const flat = [];
  segments.forEach(s => {
    for (const ch of s.text) flat.push({ ch, cls: s.cls });
  });

  let i = 0;
  let currentSpan = null;
  let currentCls = null;
  const speed = 18; // ms per char

  function tick() {
    if (i >= flat.length) {
      const caret = document.querySelector('.type-caret');
      if (caret) caret.classList.add('done');
      return;
    }
    const { ch, cls } = flat[i];
    if (cls !== currentCls || !currentSpan) {
      currentSpan = document.createElement('span');
      if (cls) currentSpan.className = cls;
      target.appendChild(currentSpan);
      currentCls = cls;
    }
    currentSpan.textContent += ch;
    i++;
    // pause longer on punctuation for natural feel
    const delay = (ch === '.' || ch === ',') ? speed * 6 : speed;
    setTimeout(tick, delay);
  }

  // small initial delay so it feels intentional
  setTimeout(tick, 600);
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


// Type effect on hero subtitle (light)
const subtitle = document.querySelector('.hero-subtitle');
if (subtitle) {
  subtitle.style.opacity = '0';
  setTimeout(() => {
    subtitle.style.transition = 'opacity 1.2s';
    subtitle.style.opacity = '1';
  }, 600);
}

(function () {
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebar-overlay');

  function open() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation');
    hamburger.setAttribute('title', 'Close navigation');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation');
    hamburger.setAttribute('title', 'Open navigation');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    sidebar.classList.contains('open') ? close() : open();
  });
  overlay.addEventListener('click', close);

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
    themeLink.setAttribute('href', THEMES[nextTheme]);
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
