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

    // Round 10: content below the fold fades and rises in when reached (photos open from the
    // bottom), staggered within each section. Custom parts keep their own motion, except items
    // marked .fb-reveal. Attributes are removed after the entrance so hover transitions are untouched.
    const revealObserver = new IntersectionObserver(entries => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        revealObserver.unobserve(target);
        if (target.hasAttribute('data-rv')) {
          target.setAttribute('data-rv', 'in');
          setTimeout(() => { target.removeAttribute('data-rv'); target.style.removeProperty('--rv-d'); }, 1600);
        } else target.classList.add('is-in');
      }
    }, { rootMargin: '0px 0px -10% 0px' });
    if (!preference.matches) {
      const picks = [];
      for (const section of element.querySelectorAll('.fig-section')) {
        if (section.matches('.fig-header, .fig-footer')) continue;
        let i = 0;
        const items = section.querySelectorAll('.fig-heading, .fig-subheading, .fig-text, .fig-photo, .fig-button, [data-fill-card], [data-related-card], .fb-reveal');
        for (const item of items) {
          if (item.closest('.fig-header, header')) continue;
          if (item.closest('[data-feedback]') && !item.classList.contains('fb-reveal')) continue;
          if (picks.some(p => p.contains(item))) continue;
          if (item.getBoundingClientRect().top < innerHeight) continue;
          picks.push(item);
          item.setAttribute('data-rv', '');
          item.style.setProperty('--rv-d', `${Math.min(i++, 6) * 70}ms`);
          revealObserver.observe(item);
        }
      }
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
      revealObserver.disconnect();
      disconnect?.();
      preference.removeEventListener('change', enhance);
    };
  }, [viewport]);
}
