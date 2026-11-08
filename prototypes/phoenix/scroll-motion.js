import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sectionRange = { start: 'top 94%', end: 'clamp(top 58%)', scrub: true };

export function connectScrollMotion(viewport) {
  const media = gsap.matchMedia();
  media.add({
    motion: '(prefers-reduced-motion: no-preference)',
    desktop: '(min-width: 1000px)',
  }, ({ conditions }) => {
    if (!conditions.motion) return;
    const distance = conditions.desktop ? 36 : 14;
    const sections = [...viewport.querySelectorAll('[data-motion-section]')];

    for (const section of sections) {
      const seam = section.querySelector(':scope > .motion-seam');
      const heading = section.querySelector('.fig-heading');
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section, ...sectionRange },
      });
      timeline.fromTo(seam, { scaleX: .08 }, { scaleX: 1 }, 0);
      if (heading) timeline.fromTo(heading, { y: distance, opacity: .78 }, { y: 0, opacity: 1 }, 0);

      if (!conditions.desktop) continue;
      const ctaImage = section.matches('.fig-cta') && section.querySelector(':scope > .paint-group > .image-paint');
      if (ctaImage) {
        gsap.fromTo(ctaImage, { y: -10, scale: 1.06 }, { y: 10, scale: 1.06, ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'clamp(bottom 30%)', scrub: true },
        });
      }
      for (const photo of section.querySelectorAll('.fig-photo')) {
        if (photo.offsetWidth < 210 || photo.offsetHeight < 130 || photo.closest('[data-layer="113:434"]')) continue;
        const paint = photo.querySelector(':scope > .paint-group > .image-paint');
        if (!paint) continue;
        if (photo.dataset.layer === '198:556') {
          gsap.fromTo(paint, { y: 24 }, { y: -24, ease: 'none',
            scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom top', scrub: true },
          });
          continue;
        }
        gsap.fromTo(paint, { clipPath: 'inset(0% 0% 14% 0%)', y: 12 }, {
          clipPath: 'inset(0% 0% 0% 0%)', y: 0, ease: 'none',
          scrollTrigger: { trigger: photo, start: 'top 97%', end: 'clamp(top 60%)', scrub: true },
        });
      }
    }

    const hero = viewport.querySelector('.fig-hero');
    const heroPaint = hero?.querySelector(':scope > .paint-group > .image-paint');
    const heroCopy = hero?.querySelector(':scope > .fig-node:not(.fig-header)');
    if (heroPaint && heroCopy && conditions.desktop) {
      const handoff = gsap.timeline({
        scrollTrigger: { trigger: hero, start: 'bottom 92%', end: 'bottom 20%', scrub: true },
        defaults: { ease: 'none' },
      });
      handoff.to(heroPaint, { y: 38, scale: 1.055 }, 0);
      handoff.to(heroCopy, { y: -38 }, 0);
    }

    const route = viewport.querySelector('[data-layer="62:893"]');
    if (route) {
      const steps = [...route.querySelectorAll(':scope > [data-motion-card]')];
      let active = -1;
      const update = progress => {
        const next = Math.min(steps.length - 1, Math.floor(progress * steps.length));
        if (next === active) return;
        steps[active]?.removeAttribute('data-route-current');
        steps[next]?.setAttribute('data-route-current', '');
        active = next;
      };
      const progress = gsap.fromTo(route.querySelector('.delivery-route-fill'), { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: route, start: 'top 90%', end: 'bottom 28%', scrub: true,
          onUpdate: self => update(self.progress), onRefresh: self => update(self.progress) },
      });
      update(progress.progress());
      return () => steps.forEach(step => step.removeAttribute('data-route-current'));
    }
  }, viewport);

  let alive = true;
  document.fonts?.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
  return () => { alive = false; media.revert(); };
}
