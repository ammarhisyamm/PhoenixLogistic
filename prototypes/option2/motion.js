import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ease = 'expo.out';

// Runs once per page render. Every effect is opt-in through a data attribute,
// so markup stays readable and content is fully visible without JavaScript
// or with reduced motion.
export function usePageMotion(key) {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    const ctx = gsap.context(() => {
      // Headline lines rise out of a mask.
      gsap.utils.toArray('[data-lines]').forEach(el => {
        const lines = el.querySelectorAll('.ln > span');
        const hero = el.closest('[data-hero]');
        gsap.from(lines, {
          yPercent: 115, rotate: 2, duration: 1.3, ease, stagger: 0.09, delay: hero ? 0.15 : 0,
          scrollTrigger: hero ? undefined : { trigger: el, start: 'top 85%' },
        });
      });

      // Copy, buttons and cards fade up as they arrive.
      gsap.utils.toArray('[data-fade]').forEach(el => {
        gsap.from(el, {
          y: 36, opacity: 0, duration: 1.1, ease, delay: Number(el.dataset.fade) || 0,
          scrollTrigger: el.closest('[data-hero]') ? undefined : { trigger: el, start: 'top 88%' },
        });
      });

      // Groups stagger their children.
      gsap.utils.toArray('[data-stagger]').forEach(el => {
        gsap.from(el.children, {
          y: 48, opacity: 0, duration: 1.1, ease, stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });

      // Photos open like a roller door, then drift slower than the page.
      gsap.utils.toArray('[data-reveal]').forEach(el => {
        gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });
      gsap.utils.toArray('[data-parallax]').forEach(el => {
        const amount = Number(el.dataset.parallax) || 10;
        gsap.fromTo(el, { yPercent: -amount }, {
          yPercent: amount, ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      // Hero photo settles and darkens as the reader leaves it.
      gsap.utils.toArray('[data-hero-media]').forEach(el => {
        gsap.fromTo(el, { scale: 1.18 }, { scale: 1, duration: 2.2, ease });
        gsap.to(el, { yPercent: 18, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top top', end: 'bottom top', scrub: true } });
      });

      // Numbers count up once.
      gsap.utils.toArray('[data-count]').forEach(el => {
        const target = Number(el.dataset.count);
        const state = { v: 0 };
        gsap.to(state, {
          v: target, duration: 2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => { el.textContent = Math.round(state.v).toLocaleString('en-AU'); },
        });
      });

      // Horizontal track, pinned on wide screens.
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1000px)', () => {
        gsap.utils.toArray('[data-horizontal]').forEach(section => {
          const track = section.querySelector('.h-track');
          const distance = () => track.scrollWidth - window.innerWidth + 64;
          gsap.to(track, {
            x: () => -distance(), ease: 'none',
            scrollTrigger: { trigger: section, start: 'top top', end: () => '+=' + distance(), scrub: 0.6, pin: true, invalidateOnRefresh: true },
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

      // Red route lines draw with the scroll.
      gsap.utils.toArray('[data-route]').forEach(el => {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top 75%', end: 'bottom 45%', scrub: true } });
      });

      // The row in the middle of the screen is the active one.
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
    return () => { ctx.revert(); window.removeEventListener('load', refresh); };
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
