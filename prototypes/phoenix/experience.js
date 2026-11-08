/* Site behaviour layered over the rendered Figma page and the GSAP scroll
   system in motion.jsx / scroll-motion.js: loader hand-off, the floating
   header, the truck route line, role-aware button hovers and the pointer
   light on cards. Reduced motion keeps everything static. */

const html = document.documentElement;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function finishLoader() {
  const loader = document.getElementById('route-loader');
  const minimum = Number(html.dataset.loaderMin || 0);
  const elapsed = performance.now();
  const hero = document.querySelector('.fig-hero .image-paint img, .fig-hero img');
  const heroReady = new Promise(resolve => {
    if (!hero || hero.complete) return resolve();
    hero.addEventListener('load', resolve, { once: true });
    hero.addEventListener('error', resolve, { once: true });
    setTimeout(resolve, 2600);
  });
  heroReady.then(() => {
    const wait = Math.max(0, minimum - elapsed);
    setTimeout(() => {
      if (loader) {
        loader.classList.add('is-done');
        loader.setAttribute('aria-busy', 'false');
        const remove = () => loader.remove();
        loader.addEventListener('transitionend', remove, { once: true });
        setTimeout(remove, 1200);
      }
      html.classList.remove('pgl-loading');
      try { sessionStorage.setItem('pgl-arrived', '1'); } catch (e) { /* private mode */ }
      // One frame later so the hero animations start as the curtain lifts.
      requestAnimationFrame(() => html.classList.add('is-ready'));
    }, wait);
  });
}

function headerBehaviour() {
  let last = window.scrollY, ticking = false;
  const update = () => {
    const y = window.scrollY;
    html.classList.toggle('is-scrolled', y > 24);
    // Hide while reading down, return as soon as the visitor scrolls back up.
    if (y > 420 && y > last + 4) html.classList.add('header-hidden');
    else if (y < last - 4 || y <= 420) html.classList.remove('header-hidden');
    last = y; ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

function routeProgress() {
  const bar = document.createElement('div');
  bar.className = 'route-progress';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<span class="route-progress__line"></span><span class="route-progress__truck"><svg viewBox="0 0 32 20" fill="none"><path d="M1 4h17v11H1zM18 8h7l5 5v2H18z" fill="#e31b24"/><circle cx="7" cy="16" r="2.6" fill="#232022" stroke="#fff" stroke-width="1.2"/><circle cx="24" cy="16" r="2.6" fill="#232022" stroke="#fff" stroke-width="1.2"/></svg></span>';
  document.body.append(bar);
  const line = bar.firstChild, truck = bar.lastChild;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    line.style.transform = `scaleX(${p})`;
    truck.style.transform = `translateX(calc(${p} * (100vw - 30px)))`;
    bar.classList.toggle('is-moving', p > 0.002);
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function pointerGlow(root) {
  // Cards lean toward the pointer a little; skipped on touch screens.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  root.addEventListener('pointermove', e => {
    const card = e.target.closest?.('[data-motion-card]');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  }, { passive: true });
}

// Buttons come from Figma as plain layers; read each one's fill so hovers match its role.
function classifyButtons(root) {
  root.querySelectorAll('.fig-button:is(a,button)').forEach(btn => {
    if (btn.getAttribute('role') === 'tab') { btn.classList.add('btn-tab'); return; }
    const paint = btn.querySelector(':scope > .paint-group > .paint:not(.fig-stroke)');
    const outlined = !!btn.querySelector(':scope > .paint-group > .fig-stroke');
    const m = paint && getComputedStyle(paint).backgroundColor.match(/[\d.]+/g);
    let kind = outlined ? 'outline' : 'text';
    if (m && (m[3] === undefined || Number(m[3]) > 0.5)) {
      const [r, g, b] = m.map(Number), lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      kind = r > 170 && g < 90 && b < 90 ? 'primary' : lum < 0.3 ? 'dark' : 'light';
    }
    btn.classList.add('btn-' + kind);
    if (btn.closest('.fig-hero, .fig-cta, .fig-footer')) btn.classList.add('btn-on-dark');
  });
}

export function startExperience() {
  const root = document.getElementById('phoenix-design');
  finishLoader();
  headerBehaviour();
  if (!root) return;
  classifyButtons(root);
  if (reduced() || !('IntersectionObserver' in window)) { html.classList.add('motion-off'); return; }
  html.classList.add('motion-on');
  routeProgress();
  pointerGlow(root);
}
