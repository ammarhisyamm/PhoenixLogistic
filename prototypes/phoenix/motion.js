import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Same motion system as Option 2: Lenis smooth scrolling on desktop, GSAP reveals that are
// opted into with data attributes, and a curtain between pages. Content is fully visible
// without JavaScript and with reduced motion.
gsap.registerPlugin(ScrollTrigger);

const ease = 'expo.out';
export const isStatic = () => typeof window !== 'undefined' && (matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('static'));

export let lenis = null;
if (typeof window !== 'undefined' && !isStatic()) {
  document.documentElement.classList.add('motion');
  if (matchMedia('(pointer: fine) and (min-width: 768px)').matches) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}

export function scrollToEl(el, offset = -96) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + offset, behavior: isStatic() ? 'auto' : 'smooth' });
}

let curtainTl = null;
let safety = 0;
export function coverThen(fn, label = '') {
  const el = document.querySelector('.curtain');
  if (!el || isStatic()) { fn(); return; }
  const text = el.querySelector('.curtain-label');
  if (text) text.textContent = label;
  curtainTl?.kill();
  clearTimeout(safety);
  el.classList.add('is-on');
  curtainTl = gsap.timeline()
    .set(el, { visibility: 'visible' })
    .fromTo(el.querySelector('.curtain-panel'), { yPercent: 100 }, { yPercent: 0, duration: 0.55, ease: 'power3.inOut' })
    .fromTo(el.querySelectorAll('.curtain-inner > *'), { yPercent: 80, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out', stagger: 0.06 }, 0.25)
    .fromTo(el.querySelector('.curtain-bar'), { scaleX: 0 }, { scaleX: 0.7, duration: 0.6, ease: 'power2.out' }, 0.1)
    .add(() => { fn(); safety = setTimeout(lift, 700); });
}
function lift() {
  const el = document.querySelector('.curtain');
  clearTimeout(safety);
  if (!el || !el.classList.contains('is-on')) return 0;
  el.classList.remove('is-on');
  curtainTl?.kill();
  curtainTl = gsap.timeline()
    .to(el.querySelector('.curtain-bar'), { scaleX: 1, duration: 0.25, ease: 'power2.out' })
    .to(el.querySelectorAll('.curtain-inner > *'), { yPercent: -80, opacity: 0, duration: 0.3, ease: 'power2.in', stagger: 0.04 }, 0.1)
    .to(el.querySelector('.curtain-panel'), { yPercent: -100, duration: 0.7, ease: 'power3.inOut' }, 0.2)
    .to(el.querySelector('.curtain-bar'), { opacity: 0, duration: 0.3 }, 0.3)
    .set(el, { visibility: 'hidden' })
    .set(el.querySelector('.curtain-bar'), { opacity: 1, scaleX: 0 });
  return 0.5;
}

export function usePageMotion(key) {
  useLayoutEffect(() => {
    if (!location.hash) {
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    if (isStatic()) {
      const c = document.querySelector('.curtain');
      if (c) { c.style.visibility = 'hidden'; c.classList.remove('is-on'); }
      return undefined;
    }
    const wait = lift();
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-lines]').forEach(el => {
        const lines = el.querySelectorAll('.ln > span');
        const hero = el.closest('[data-hero]');
        const tl = gsap.timeline({ delay: hero ? wait + 0.1 : 0, scrollTrigger: hero ? undefined : { trigger: el, start: 'top 85%' } });
        tl.fromTo(lines, { '--p': 0 }, { '--p': 100, duration: 1.3, ease: 'power1.inOut', stagger: 0.12 }, 0)
          .from(lines, { yPercent: 40, duration: 1.2, ease, stagger: 0.12 }, 0);
      });

      // On first load the hero copy is already painted from the prerendered HTML, so it only
      // rises into place and is never hidden again.
      gsap.utils.toArray('[data-fade]').forEach(el => {
        const hero = el.closest('[data-hero]');
        gsap.from(el, {
          y: 28, opacity: hero && !wait ? 1 : 0, duration: 1, ease: 'power3.out', delay: (Number(el.dataset.fade) || 0) + (hero ? wait : 0),
          scrollTrigger: hero ? undefined : { trigger: el, start: 'top 90%' },
        });
      });

      gsap.utils.toArray('[data-stagger]').forEach(el => {
        const items = gsap.utils.toArray(el.children);
        gsap.set(items, { y: 60, opacity: 0 });
        ScrollTrigger.batch(items, { start: 'top 92%', once: true, onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.1, overwrite: true }) });
      });

      gsap.utils.toArray('[data-line]').forEach(el => {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
      });

      gsap.utils.toArray('[data-reveal]').forEach(el => {
        const img = el.querySelector('img');
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%' } });
        tl.fromTo(el, { clipPath: 'inset(12% 12% 12% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease });
        if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.9, ease }, 0);
      });

      gsap.utils.toArray('[data-parallax]').forEach(el => {
        const amount = Number(el.dataset.parallax) || 8;
        gsap.fromTo(el, { yPercent: -amount }, { yPercent: amount, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      gsap.utils.toArray('[data-hero-media]').forEach(el => {
        gsap.fromTo(el, { scale: 1.12 }, { scale: 1, duration: 2.4, ease, delay: wait });
        gsap.to(el, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
      });

      gsap.utils.toArray('[data-count]').forEach(el => {
        const target = Number(el.dataset.count);
        const state = { v: 0 };
        el.textContent = '0';
        gsap.to(state, {
          v: target, duration: 1.8, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%' },
          onUpdate: () => { el.textContent = Math.round(state.v).toLocaleString('en-AU'); },
        });
      });

      // The fleet truck drives in from the right as the story section scrolls by.
      gsap.utils.toArray('[data-drive]').forEach(el => {
        gsap.fromTo(el, { xPercent: 45 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom 45%', scrub: 0.8 } });
      });

      // The fleet truck rises and settles as the story section scrolls past (parallax).
      gsap.utils.toArray('[data-truck]').forEach(el => {
        const img = el.querySelector('img');
        gsap.fromTo(img, { yPercent: 18, xPercent: 6, scale: 0.94 }, { yPercent: -8, xPercent: -4, scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
      });

      // Rows near the middle of the screen are the active ones.
      gsap.utils.toArray('[data-focus]').forEach(el => {
        ScrollTrigger.create({ trigger: el, start: 'top 62%', end: 'bottom 38%', toggleClass: 'is-active' });
      });

      // Tracking stages light up one after another.
      gsap.utils.toArray('[data-sequence]').forEach(list => {
        const items = gsap.utils.toArray(list.children);
        ScrollTrigger.create({
          trigger: list, start: 'top 70%', once: true,
          onEnter: () => items.forEach((item, i) => setTimeout(() => item.classList.add('is-lit'), 260 * i)),
        });
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    const late = setTimeout(refresh, 1200);
    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      setTimeout(() => scrollToEl(target), 60);
    }
    return () => { clearTimeout(late); ctx.revert(); window.removeEventListener('load', refresh); };
  }, [key]);
}

// The header tucks away while reading down and returns on the way up.
export function useHeaderScroll(ref) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      el.classList.toggle('is-scrolled', y > 24);
      if (!el.classList.contains('is-open')) el.classList.toggle('is-hidden', y > 320 && y > last + 2);
      if (y < last - 2) el.classList.remove('is-hidden');
      last = y;
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, [ref]);
}

export function useCursor() {
  useLayoutEffect(() => {
    if (isStatic() || !matchMedia('(pointer: fine)').matches) return undefined;
    const el = document.querySelector('.cursor');
    if (!el) return undefined;
    const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });
    const move = e => {
      x(e.clientX); y(e.clientY);
      const t = e.target.closest?.('[data-cursor], a, button, summary, input, select, textarea, label');
      el.classList.toggle('is-view', !!t?.matches('[data-cursor]'));
      el.classList.toggle('is-link', !!t && !t.matches('[data-cursor]'));
      el.dataset.label = t?.dataset.cursor || '';
      el.classList.add('is-on');
    };
    const leave = () => el.classList.remove('is-on');
    addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => { removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); };
  }, []);
}
