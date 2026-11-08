import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const targets = [
  '[data-reveal]', '.service-catalog-card',
  '.pgl-section-heading', '.pgl-service-row', '.pgl-about-home-intro', '.pgl-about-home > .container > img',
  '.pgl-home-steps > div', '.pgl-fba-home .pgl-two-column > *', '.pgl-difference-layout > *',
  '.pgl-network-layout > *', '.pgl-faq-layout > *', '.pgl-sector-grid > div', '.pgl-cta-layout > *',
  '.pgl-fleet-grid > div', '.pgl-process-list > li', '.pgl-service-sections > section', '.pgl-detail-block',
  '.pgl-wide-photo', '.pgl-service-aside', '.pgl-two-column > :not(.pgl-inset)',
];

/** Reveal only content below the viewport. The document stays readable without JS. */
export function ScrollMotion() {
  const { pathname } = useLocation();
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || !('IntersectionObserver' in window)) return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(targets.join(',')));
    const reveal = (element: HTMLElement) => {
      element.classList.remove('motion-pending');
      element.classList.add('motion-visible');
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { reveal(entry.target as HTMLElement); observer.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    const frame = requestAnimationFrame(() => {
      elements.forEach(element => {
        const bounds = element.getBoundingClientRect();
        if (bounds.top > window.innerHeight - 48) {
          element.classList.add('motion-pending');
          observer.observe(element);
        }
      });
    });
    const onPreferenceChange = () => {
      if (preference.matches) { elements.forEach(reveal); observer.disconnect(); }
    };
    preference.addEventListener('change', onPreferenceChange);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      preference.removeEventListener('change', onPreferenceChange);
      elements.forEach(element => element.classList.remove('motion-pending', 'motion-visible'));
    };
  }, [pathname]);
  return null;
}
