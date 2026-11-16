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
