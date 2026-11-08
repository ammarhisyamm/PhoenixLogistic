import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const ease = 'expo.out';
export const isStatic = () => typeof window !== 'undefined' && (matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('static'));

// Smooth scrolling on desktop, driven by the GSAP ticker so pinned scenes stay in sync.
// Touch devices keep native scrolling.
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

export function scrollToEl(el, offset = -110) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + offset, behavior: 'smooth' });
}

// Page curtain: covers the screen before a route change and lifts once the new page is in.
export function coverThen(fn) {
  const el = document.querySelector('.curtain');
  if (!el || isStatic()) { fn(); return; }
  gsap.timeline()
    .set(el, { visibility: 'visible' })
    .fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power3.inOut' })
    .fromTo(el.querySelector('.curtain-mark'), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, 0.3)
    .add(fn);
}
function lift() {
  const el = document.querySelector('.curtain');
  if (!el || getComputedStyle(el).visibility === 'hidden') return 0;
  gsap.timeline()
    .to(el.querySelector('.curtain-mark'), { yPercent: -60, opacity: 0, duration: 0.35, ease: 'power2.in' })
    .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'power3.inOut' }, 0.15)
    .set(el, { visibility: 'hidden' });
  return 0.45;
}

// Runs once per page render. Every effect is opt-in through a data attribute,
// so markup stays readable and content is fully visible without JavaScript
// or with reduced motion.
export function usePageMotion(key) {
  useLayoutEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    if (isStatic()) {
      const c = document.querySelector('.curtain');
      if (c) c.style.visibility = 'hidden';
      return undefined;
    }
    const wait = lift();
    const ctx = gsap.context(() => {
      // Headline lines wipe from dim to full colour while rising a touch.
      gsap.utils.toArray('[data-lines]').forEach(el => {
        const lines = el.querySelectorAll('.ln > span');
        const hero = el.closest('[data-hero]');
        const tl = gsap.timeline({ delay: hero ? wait + 0.1 : 0, scrollTrigger: hero ? undefined : { trigger: el, start: 'top 85%' } });
        tl.fromTo(lines, { '--p': 0 }, { '--p': 100, duration: 1.3, ease: 'power1.inOut', stagger: 0.12 }, 0)
          .from(lines, { yPercent: 40, duration: 1.2, ease, stagger: 0.12 }, 0);
      });

      // Copy and buttons fade up as they arrive.
      gsap.utils.toArray('[data-fade]').forEach(el => {
        const hero = el.closest('[data-hero]');
        gsap.from(el, {
          y: 32, opacity: 0, duration: 1, ease: 'power3.out', delay: (Number(el.dataset.fade) || 0) + (hero ? wait : 0),
          scrollTrigger: hero ? undefined : { trigger: el, start: 'top 88%' },
        });
      });

      // Card groups arrive in batches, one after another.
      gsap.utils.toArray('[data-stagger]').forEach(el => {
        const items = gsap.utils.toArray(el.children);
        gsap.set(items, { y: 80, opacity: 0 });
        ScrollTrigger.batch(items, { start: 'top 90%', once: true, onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.12, overwrite: true }) });
      });

      // Dividers draw in from the left.
      gsap.utils.toArray('[data-line]').forEach(el => {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
      });

      // Photos unveil from the centre, then drift slower than the page.
      gsap.utils.toArray('[data-reveal]').forEach(el => {
        const img = el.querySelector('img');
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%' } });
        tl.fromTo(el, { clipPath: 'inset(14% 14% 14% 14%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease });
        if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 2, ease }, 0);
      });
      gsap.utils.toArray('[data-parallax]').forEach(el => {
        const amount = Number(el.dataset.parallax) || 10;
        gsap.fromTo(el, { yPercent: -amount }, {
          yPercent: amount, ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      // Hero media settles in, then dims and sinks as the reader leaves it.
      gsap.utils.toArray('[data-hero-media]').forEach(el => {
        gsap.fromTo(el, { scale: 1.15 }, { scale: 1, duration: 2.4, ease, delay: wait });
        gsap.to(el, { yPercent: 16, filter: 'brightness(0.35)', ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
      });

      // Numbers count up once.
      gsap.utils.toArray('[data-count]').forEach(el => {
        const target = Number(el.dataset.count);
        const state = { v: 0 };
        gsap.to(state, {
          v: target, duration: 1.8, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => { el.textContent = Math.round(state.v).toLocaleString('en-AU'); },
        });
      });

      const mm = gsap.matchMedia();

      // Truck scene: the Phoenix truck drives across and the headline appears in its wake.
      gsap.utils.toArray('[data-drive]').forEach(section => {
        const truck = section.querySelector('.drive-truck');
        const words = section.querySelector('.drive-words');
        const after = section.querySelectorAll('.drive-after');
        const road = section.querySelector('.drive-road');
        const speed = section.querySelector('.drive-speed b');
        gsap.to(truck.querySelector('img'), { y: -2, duration: 0.18, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        const setSpeed = speed ? gsap.quickTo({ v: 0 }, 'v', { duration: 0.6, ease: 'power2.out', onUpdate() { speed.textContent = String(Math.round(this.targets()[0].v)).padStart(2, '0'); } }) : () => {};
        // The headline is uncovered exactly behind the truck's tail, measured every frame.
        const follow = () => {
          const t = truck.getBoundingClientRect();
          const w = words.getBoundingClientRect();
          const shown = Math.min(100, Math.max(0, ((w.right - t.right) / w.width) * 100));
          words.style.clipPath = `inset(0% 0% 0% ${100 - shown}%)`;
        };
        const build = pin => {
          const tl = gsap.timeline({
            onUpdate: follow,
            scrollTrigger: pin
              ? { trigger: section, start: 'top top', end: '+=180%', scrub: 0.6, pin: true, invalidateOnRefresh: true, onUpdate: self => setSpeed(Math.min(98, Math.abs(self.getVelocity()) / 28)), onLeave: () => setSpeed(0), onLeaveBack: () => setSpeed(0) }
              : { trigger: section, start: 'top 80%', end: 'bottom 20%', scrub: 0.6, invalidateOnRefresh: true },
          });
          tl.fromTo(truck, { x: () => section.clientWidth }, { x: () => -truck.offsetWidth, ease: 'none', duration: 1 }, 0)
            .fromTo(road, { backgroundPositionX: '0px' }, { backgroundPositionX: '-1200px', ease: 'none', duration: 1 }, 0);
          if (after.length) tl.from(after, { y: 40, opacity: 0, stagger: 0.05, duration: 0.15, ease: 'power2.out' }, 0.6);
          follow();
          return () => { words.style.clipPath = ''; };
        };
        mm.add('(min-width: 1000px)', () => build(true));
        mm.add('(max-width: 999px)', () => build(false));
      });

      // Horizontal service track, pinned on wide screens. Photos slide inside their frames.
      mm.add('(min-width: 1000px)', () => {
        gsap.utils.toArray('[data-horizontal]').forEach(section => {
          const track = section.querySelector('.h-track');
          const distance = () => track.scrollWidth - window.innerWidth + 64;
          const tween = gsap.to(track, {
            x: () => -distance(), ease: 'none',
            scrollTrigger: { trigger: section, start: 'top top', end: () => '+=' + distance(), scrub: 0.6, pin: true, invalidateOnRefresh: true },
          });
          track.querySelectorAll('.h-card img').forEach(img => {
            gsap.fromTo(img, { xPercent: 10, scale: 1.2 }, { xPercent: -10, scale: 1.2, ease: 'none', scrollTrigger: { trigger: img.closest('.h-card'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
          });
        });
      });

      // A full-bleed photo grows from a framed card to the whole screen.
      gsap.utils.toArray('[data-expand]').forEach(el => {
        const media = el.querySelector('.expand-media');
        const copy = el.querySelector('.expand-copy');
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: '+=120%', scrub: 0.6, pin: true } });
        tl.fromTo(media, { clipPath: 'inset(18% 30% 18% 30%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' })
          .fromTo(media.querySelector('img'), { scale: 1.35 }, { scale: 1, ease: 'none' }, 0)
          .fromTo(copy, { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: 'none' }, 0.45);
      });

      // Stacked step cards: each card shrinks and dims as the next one slides over it.
      gsap.utils.toArray('[data-stack]').forEach(list => {
        const cards = gsap.utils.toArray(list.children);
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          const inner = card.querySelector('.stack-inner');
          gsap.to(inner, {
            scale: 0.92, '--dim': 0.3, ease: 'none',
            scrollTrigger: { trigger: next, start: 'top 55%', end: 'top 15%', scrub: true },
          });
        });
      });

      // Reading focus: blocks go from dim to full as they pass the centre; the index follows.
      gsap.utils.toArray('[data-focus-list]').forEach(wrap => {
        const blocks = gsap.utils.toArray(wrap.querySelectorAll('[data-block]'));
        const bar = wrap.querySelector('.focus-bar');
        const items = wrap.querySelectorAll('.focus-index li');
        const n = blocks.length;
        blocks.forEach((block, i) => {
          gsap.fromTo(block.querySelectorAll('.focus-fade'), { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.05, scrollTrigger: { trigger: block, start: 'top 85%', end: 'top 45%', scrub: true } });
          ScrollTrigger.create({
            trigger: block, start: 'top 55%', end: 'bottom 55%',
            onToggle: self => {
              if (!self.isActive) return;
              items.forEach((li, k) => li.classList.toggle('is-active', k === i));
              if (bar) gsap.to(bar, { clipPath: `inset(${(i / n) * 100}% 0% ${100 - ((i + 1) / n) * 100}% 0%)`, duration: 0.45, ease: 'power2.inOut' });
            },
          });
        });
      });

      // Live consignment: the rail fills and each stage lights up in turn.
      gsap.utils.toArray('[data-tracker]').forEach(section => {
        const rows = section.querySelectorAll('.tk-row');
        const fill = section.querySelector('.tk-fill');
        const van = section.querySelector('.tk-van');
        const status = section.querySelectorAll('.tk-status span');
        const copy = section.querySelectorAll('.tk-copy > div');
        const n = rows.length;
        const setStage = i => {
          rows.forEach((r, k) => { r.classList.toggle('is-done', k < i); r.classList.toggle('is-now', k === i); });
          status.forEach((s, k) => s.classList.toggle('is-on', k === i));
          copy.forEach((c, k) => c.classList.toggle('is-on', k === i));
        };
        setStage(0);
        const onUpdate = self => setStage(Math.min(n - 1, Math.floor(self.progress * n * 0.999)));
        mm.add('(min-width: 1000px)', () => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top', end: '+=' + n * 70 + '%', scrub: 0.5, pin: true, onUpdate } });
          tl.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0).fromTo(van, { left: '0%' }, { left: '100%', ease: 'none' }, 0);
        });
        mm.add('(max-width: 999px)', () => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: section.querySelector('.tk-card'), start: 'top 70%', end: 'bottom 40%', scrub: 0.5, onUpdate } });
          tl.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0).fromTo(van, { left: '0%' }, { left: '100%', ease: 'none' }, 0);
        });
      });

      // Network routes draw themselves.
      gsap.utils.toArray('[data-routes]').forEach(svg => {
        gsap.fromTo(svg.querySelectorAll('.route-path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', stagger: 0.3, scrollTrigger: { trigger: svg, start: 'top 75%' } });
        gsap.from(svg.querySelectorAll('.pin'), { scale: 0, transformOrigin: '50% 50%', duration: 0.8, ease: 'back.out(2)', stagger: 0.15, scrollTrigger: { trigger: svg, start: 'top 75%' } });
      });

      // Rows in the middle of the screen are the active ones.
      gsap.utils.toArray('[data-focus]').forEach(el => {
        ScrollTrigger.create({ trigger: el, start: 'top 60%', end: 'bottom 40%', toggleClass: 'is-active' });
      });

      // Giant footer wordmark slides in.
      gsap.utils.toArray('[data-wordmark]').forEach(el => {
        gsap.fromTo(el, { yPercent: 40 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true } });
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    const late = setTimeout(refresh, 1200);
    return () => { clearTimeout(late); ctx.revert(); window.removeEventListener('load', refresh); };
  }, [key]);
}

// Header: solid once the hero is behind, hidden while reading down.
export function useHeader(setState) {
  useLayoutEffect(() => {
    let last = scrollY;
    const update = () => {
      const y = scrollY;
      setState({ solid: y > 80, hidden: y > 480 && y > last + 2 ? true : y < last - 2 || y <= 480 ? false : undefined });
      last = y;
    };
    update();
    addEventListener('scroll', update, { passive: true });
    return () => removeEventListener('scroll', update);
  }, [setState]);
}

// Small cursor follower: a red dot that becomes a "View" tag over cards.
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
