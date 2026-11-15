import { useEffect } from 'react';

const reduceMotion = '(prefers-reduced-motion: reduce)';

export function usePageMotion(viewport) {
  useEffect(() => {
    const element = viewport.current;
    let active = true;
    let disconnect;
    const preference = matchMedia(reduceMotion);
    const root = document.documentElement;
    // The header steps aside while reading down and returns on any scroll up.
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      root.toggleAttribute('data-scrolled', y > 24);
      if (y > 420 && y > last + 4) root.setAttribute('data-header-hidden', '');
      else if (y <= 420 || y < last - 4) root.removeAttribute('data-header-hidden');
      last = y;
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });

    // A section enters once. Content stays visible before JavaScript and on fast scrolls.
    const sectionObserver = new IntersectionObserver(entries => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        sectionObserver.unobserve(target);
        if (!preference.matches) target.setAttribute('data-section-arrived', '');
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    for (const section of element.querySelectorAll('[data-motion-section]')) {
      const lead = section.querySelector('.fig-heading, [data-name="Operations / Heading"], [data-name="Brand / Phoenix home link"]')
        ?? section.querySelector('.fig-text');
      // First-paint content is already on screen; only reveal content reached by scrolling.
      if (lead && lead.getBoundingClientRect().top >= innerHeight) sectionObserver.observe(lead);
    }

    async function enhance() {
      if (preference.matches || disconnect) return;
      try {
        const { connectScrollMotion } = await import('./scroll-motion');
        if (active && !preference.matches && !disconnect) disconnect = connectScrollMotion(element);
      } catch {
        // Content remains visible if the scroll module fails to load.
      }
    }
    enhance();
    preference.addEventListener('change', enhance);
    return () => {
      active = false;
      removeEventListener('scroll', onScroll);
      root.removeAttribute('data-header-hidden');
      sectionObserver.disconnect();
      disconnect?.();
      preference.removeEventListener('change', enhance);
    };
  }, [viewport]);
}
