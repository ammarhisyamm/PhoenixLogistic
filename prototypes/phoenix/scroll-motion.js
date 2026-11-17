import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function connectScrollMotion(viewport) {
  const media = gsap.matchMedia();
  media.add({
    motion: '(prefers-reduced-motion: no-preference)',
    desktop: '(min-width: 1000px)',
  }, ({ conditions }) => {
    if (!conditions.motion) return;
    const distance = conditions.desktop ? 36 : 14;
    for (const row of viewport.querySelectorAll('[data-work-row]')) {
      const photo = row.querySelector(':scope > .fig-photo');
      const copy = row.querySelector(':scope > .fig-node:not(.fig-photo)');
      if (!photo || !copy) continue;
      const entrance = gsap.timeline({
        defaults: { duration: .55, ease: 'power2.out', immediateRender: false, clearProps: 'transform,opacity' },
        scrollTrigger: { trigger: row, start: 'top 87%', once: true },
      });
      entrance.from(photo, { y: distance * .65, opacity: .72 }, 0);
      entrance.from(copy, { y: distance, opacity: .72 }, .1);
    }

    // Round 10: the first section's photo or video drifts slower than the page and its copy fades
    // out on the way up (reference: aerial shot with text that lifts away).
    const hero = [...viewport.querySelectorAll('.fig-section')].find(el => !el.matches('.fig-header') && !el.closest('.fig-header'));
    const media = hero?.querySelector('video, .image-paint');
    if (hero && media) {
      gsap.fromTo(media, { yPercent: 0, scale: 1 }, { yPercent: conditions.desktop ? 14 : 8, scale: 1.08, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      const copy = [...hero.querySelectorAll('.fig-heading, .fig-text, .fig-button')].filter(el => !el.closest('[data-feedback], form, .fig-header'));
      if (copy.length && conditions.desktop) gsap.to(copy, { y: conditions.desktop ? -70 : -30, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 20%', scrub: true } });
    }
    // About photos drift inside their frame.
    for (const img of viewport.querySelectorAll('.fb-ha-photo img')) {
      gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    const truck = viewport.querySelector('[data-layer="198:556"]');
    const truckImage = truck?.querySelector('.image-paint');
    if (truckImage) {
      const travel = conditions.desktop ? 36 : 12;
      gsap.fromTo(truckImage, { y: -travel, x: conditions.desktop ? -48 : 0 }, {
        y: travel, x: conditions.desktop ? 12 : 0, ease: 'none',
        scrollTrigger: { trigger: truck, start: 'top bottom', end: 'bottom top', scrub: .45 },
      });
    }

  }, viewport);

  let alive = true;
  document.fonts?.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
  return () => { alive = false; media.revert(); };
}
