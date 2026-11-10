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
  if (matchMedia('(pointer: fine) and (min-width: 1000px)').matches) {
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

// Page curtain: a dark panel rises with the logo and the next page's name,
// a red bar runs along the bottom, and the panel lifts once the new page is in.
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
    .add(() => {
      fn();
      // If the route does not change (same page), never leave the curtain down.
      safety = setTimeout(lift, 700);
    });
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

// Runs once per page render. Every effect is opt-in through a data attribute,
// so markup stays readable and content is fully visible without JavaScript
// or with reduced motion.
export function usePageMotion(key) {
  useLayoutEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    if (isStatic()) {
      const c = document.querySelector('.curtain');
      if (c) { c.style.visibility = 'hidden'; c.classList.remove('is-on'); }
      return undefined;
    }
    const wait = lift();
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(min-width: 1000px)', () => {
        // Headline lines wipe from dim to full colour while rising a touch.
        gsap.utils.toArray('[data-lines]').forEach(el => {
          const lines = el.querySelectorAll('.ln > span');
          const hero = el.closest('[data-hero]');
          const tl = gsap.timeline({ delay: hero ? wait + 0.1 : 0, scrollTrigger: hero ? undefined : { trigger: el, start: 'top 85%' } });
          tl.fromTo(lines, { '--p': 0 }, { '--p': 100, duration: 1.3, ease: 'power1.inOut', stagger: 0.12 }, 0)
            .from(lines, { yPercent: 40, duration: 1.2, ease, stagger: 0.12 }, 0);
        });

        // Copy and buttons fade up as they arrive.
        // On the very first load the hero copy is already painted from the prerendered HTML, so it
        // only rises into place (never hidden again): the largest paint does not wait for scripts.
        gsap.utils.toArray('[data-fade]').forEach(el => {
          const hero = el.closest('[data-hero]');
          gsap.from(el, {
            y: 32, opacity: hero && !wait ? 1 : 0, duration: 1, ease: 'power3.out', delay: (Number(el.dataset.fade) || 0) + (hero ? wait : 0),
            scrollTrigger: hero ? undefined : { trigger: el, start: 'top 88%' },
          });
        });

        // Card groups arrive in batches, one after another.
        gsap.utils.toArray('[data-stagger]').forEach(el => {
          const items = gsap.utils.toArray(el.children);
          gsap.set(items, { y: 80, opacity: 0 });
          ScrollTrigger.batch(items, { start: 'top 90%', once: true, onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.12, overwrite: true }) });
        });
      });

      // A short entrance on mobile leaves text readable during a fast swipe.
      mm.add('(max-width: 999px)', () => {
        const targets = gsap.utils.toArray('[data-fade], [data-stagger] > *, .forge-grid');
        targets.forEach(el => {
          if (el.closest('[data-hero]')) return;
          gsap.from(el, {
            y: 12, opacity: 0.85, duration: 0.36, ease: 'power2.out', clearProps: 'transform,opacity',
            scrollTrigger: { trigger: el, start: 'top 94%', once: true },
          });
        });
      });

      // Dividers draw in from the left.
      gsap.utils.toArray('[data-line]').forEach(el => {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
      });

      mm.add('(min-width: 1000px)', () => {
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
          gsap.to(el, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
        });
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

      // Truck scene: the Phoenix truck drives across and the headline appears in its wake.
      mm.add('(min-width: 1000px)', () => {
        gsap.utils.toArray('[data-drive]').forEach(section => {
          const truck = section.querySelector('.drive-truck');
          const words = section.querySelector('.drive-words');
          const after = section.querySelectorAll('.drive-after');
          const road = section.querySelector('.drive-road');
          const speed = section.querySelector('.drive-speed b');
          gsap.to(truck.querySelector('img'), { y: -2, duration: 0.18, ease: 'sine.inOut', yoyo: true, repeat: -1 });
          const setSpeed = gsap.quickTo({ v: 0 }, 'v', {
            duration: 0.6, ease: 'power2.out',
            onUpdate() { speed.textContent = String(Math.round(this.targets()[0].v)).padStart(2, '0'); },
          });
          const follow = () => {
            const truckRight = truck.getBoundingClientRect().right;
            const heading = words.getBoundingClientRect();
            const shown = Math.min(100, Math.max(0, (heading.right - truckRight) / heading.width * 100));
            words.style.clipPath = `inset(0% 0% 0% ${100 - shown}%)`;
          };
          const tl = gsap.timeline({
            onUpdate: follow,
            scrollTrigger: {
              trigger: section, start: 'top top', end: '+=180%', scrub: 0.6, pin: true,
              invalidateOnRefresh: true,
              onUpdate: self => setSpeed(Math.min(98, Math.abs(self.getVelocity()) / 28)),
              onLeave: () => setSpeed(0), onLeaveBack: () => setSpeed(0),
            },
          });
          tl.fromTo(truck, { x: () => section.clientWidth }, { x: () => -truck.offsetWidth, ease: 'none', duration: 1 }, 0)
            .fromTo(road, { backgroundPositionX: '0px' }, { backgroundPositionX: '-1200px', ease: 'none', duration: 1 }, 0);
          if (after.length) tl.from(after, { y: 40, opacity: 0, stagger: 0.05, duration: 0.15, ease: 'power2.out' }, 0.6);
          follow();
        });
        return () => {
          document.querySelectorAll('.drive-words').forEach(words => { words.style.clipPath = ''; });
        };
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
      mm.add('(min-width: 1000px)', () => {
        gsap.utils.toArray('[data-expand]').forEach(el => {
          const media = el.querySelector('.expand-media');
          const copy = el.querySelector('.expand-copy');
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: '+=120%', scrub: 0.6, pin: true } });
          tl.fromTo(media, { clipPath: 'inset(18% 30% 18% 30%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' })
            .fromTo(media.querySelector('img'), { scale: 1.35 }, { scale: 1, ease: 'none' }, 0)
            .fromTo(copy, { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: 'none' }, 0.45);
        });
      });

      // Stacked step cards: each card shrinks and dims as the next one slides over it.
      mm.add('(min-width: 1000px)', () => {
        gsap.utils.toArray('[data-stack]').forEach(list => {
          const cards = gsap.utils.toArray(list.children);
          cards.forEach((card, i) => {
            const next = cards[i + 1];
            if (!next) return;
            const inner = card.querySelector('.stack-inner');
            gsap.to(inner, {
              '--dim': 0.12, ease: 'none',
              scrollTrigger: { trigger: next, start: 'top 55%', end: 'top 15%', scrub: true },
            });
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

      // Tracking page: a top-down truck drives down the road as you scroll; the red line
      // follows it and each milestone switches on as the truck reaches its pin.
      gsap.utils.toArray('[data-road]').forEach(section => {
        const body = section.querySelector('.road-body');
        const done = section.querySelector('.road-done');
        // The truck itself is sticky (pure CSS) and rides at the middle of the screen,
        // so the red line only has to grow to the same point.
        gsap.fromTo(done, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: body, start: 'top center', end: 'bottom center', scrub: true } });
        section.querySelectorAll('[data-stop]').forEach(stop => {
          ScrollTrigger.create({
            trigger: stop.querySelector('.road-pin'), start: 'center 54%',
            onEnter: () => stop.classList.add('is-on'), onLeaveBack: () => stop.classList.remove('is-on'),
          });
        });
      });

      // Story road: the truck drives left, the giant word slides, and the chapters scroll
      // sideways inside their own window so they never run under the heading.
      gsap.utils.toArray('[data-sroad]').forEach(section => {
        const truck = section.querySelector('.sroad-truck');
        const lane = section.querySelector('.sroad-lane:not(.sroad-lane-far)');
        const view = section.querySelector('.sroad-view');
        const track = section.querySelector('.sroad-track');
        // One dash + gap is 30% of the truck width; wrapping the offset keeps the line endless.
        const period = () => truck.offsetWidth * 0.3;
        const wrapLane = { x: gsap.utils.unitize(v => ((parseFloat(v) % period()) + period()) % period() - period()) };
        // The truck rumbles only while it is actually moving (the scrub is still catching up).
        let idle;
        const driving = () => { section.classList.add('is-driving'); clearTimeout(idle); idle = setTimeout(() => section.classList.remove('is-driving'), 140); };
        mm.add('(min-width: 1000px)', () => {
          const distance = () => Math.max(0, track.scrollWidth - view.clientWidth);
          const tl = gsap.timeline({ onUpdate: driving, scrollTrigger: { trigger: section, start: 'top top', end: () => '+=' + (distance() + window.innerHeight * 0.8), scrub: 1, pin: true, invalidateOnRefresh: true } });
          // The camera pans slower than the truck: it creeps left on screen while the road streams right.
          tl.fromTo(truck, { x: () => window.innerWidth * 0.04 }, { x: () => -window.innerWidth * 0.4, ease: 'none', duration: 1 }, 0)
            .fromTo(lane, { x: 0 }, { x: () => window.innerWidth * 7, ease: 'none', duration: 1, modifiers: wrapLane }, 0)
            .fromTo(track, { x: 0 }, { x: () => -distance(), ease: 'none', duration: 1 }, 0);
          return () => clearTimeout(idle);
        });
        mm.add('(max-width: 999px)', () => {
          const tl = gsap.timeline({ onUpdate: driving, scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 10%', scrub: 1 } });
          tl.fromTo(truck, { x: () => window.innerWidth * 0.16 }, { x: () => -window.innerWidth * 0.12, ease: 'none', duration: 1 }, 0)
            .fromTo(lane, { x: 0 }, { x: () => window.innerWidth * 3, ease: 'none', duration: 1, modifiers: wrapLane }, 0);
          return () => clearTimeout(idle);
        });
      });

      // Forge stepper: pinned; each step swaps the blurred backdrop, wipes the square photo
      // up into place and replaces the counter, title and text. Steps hold between changes.
      gsap.utils.toArray('[data-forge]').forEach(section => {
        mm.add('(min-width: 1000px)', () => {
          const steps = gsap.utils.toArray(section.querySelectorAll('.forge-step'));
          const n = steps.length;
          const bar = section.querySelector('.forge-progress span');
          const parts = steps.map(st => ({ bg: st.querySelector('.forge-bg'), photo: st.querySelector('.forge-photo'), img: st.querySelector('.forge-photo img'), copy: st.querySelectorAll('.forge-copy > *') }));
          parts.forEach((p, i) => {
            if (i === 0) return;
            gsap.set(p.bg, { opacity: 0 });
            gsap.set(p.photo, { clipPath: 'inset(100% 0% 0% 0%)' });
            gsap.set(p.copy, { opacity: 0, y: 40 });
          });
          steps.forEach((st, i) => { st.style.pointerEvents = i === 0 ? 'auto' : 'none'; });
          const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: {
            trigger: section, start: 'top top', end: '+=' + (n - 1) * 90 + '%', scrub: 0.8, pin: true,
            onUpdate: self => { const k = Math.min(n - 1, Math.round(self.progress * (n - 1))); steps.forEach((st, i) => { st.style.pointerEvents = i === k ? 'auto' : 'none'; }); },
          } });
          tl.set({}, {}, 0);
          for (let i = 1; i < n; i++) {
            const at = i - 1 + 0.25;
            const prev = parts[i - 1];
            const next = parts[i];
            tl.to(prev.copy, { opacity: 0, y: -40, duration: 0.3, stagger: 0.03, ease: 'power2.in' }, at)
              .to(prev.img, { scale: 0.92, duration: 0.5 }, at)
              .to(next.bg, { opacity: 1, duration: 0.5, ease: 'none' }, at)
              .to(next.photo, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5 }, at)
              .fromTo(next.img, { scale: 1.25 }, { scale: 1, duration: 0.6, ease: 'power2.out' }, at)
              .to(next.copy, { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out' }, at + 0.25);
          }
          tl.to({}, { duration: 0.25 });
          if (bar) tl.fromTo(bar, { scaleX: 1 / n }, { scaleX: 1, ease: 'none', duration: tl.duration() }, 0);
          return () => steps.forEach(st => { st.style.pointerEvents = ''; });
        });
      });

      // Network routes draw themselves.
      gsap.utils.toArray('.net-map svg').forEach(svg => {
        gsap.from(svg.querySelectorAll('.net-pin'), { opacity: 0, duration: 0.8, ease: 'power2.out', stagger: 0.12, scrollTrigger: { trigger: svg, start: 'top 75%' } });
      });
      gsap.utils.toArray('[data-routes]').forEach(svg => {
        gsap.fromTo(svg.querySelectorAll('.route-path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', stagger: 0.3, scrollTrigger: { trigger: svg, start: 'top 75%' } });
        gsap.from(svg.querySelectorAll('.pin'), { scale: 0, transformOrigin: '50% 50%', duration: 0.8, ease: 'back.out(2)', stagger: 0.15, scrollTrigger: { trigger: svg, start: 'top 75%' } });
      });

      // Rows in the middle of the screen are the active ones.
      gsap.utils.toArray('[data-focus]').forEach(el => {
        ScrollTrigger.create({ trigger: el, start: 'top 60%', end: 'bottom 40%', toggleClass: 'is-active' });
      });

    });
    // Pinned scenes add space below them, so every trigger has to be measured in page
    // order. Sort by document position before the first refresh.
    ScrollTrigger.sort((a, b) => {
      const x = a.pin || a.trigger; const y = b.pin || b.trigger;
      if (!x || !y || x === y) return 0;
      return x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    const late = setTimeout(refresh, 1200);
    return () => { clearTimeout(late); mm.revert(); ctx.revert(); window.removeEventListener('load', refresh); };
  }, [key]);
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
