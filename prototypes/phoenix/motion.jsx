import { useEffect, useRef } from 'react';

export const isMetric = value => /^\d[\d,.]*k?\+$/i.test(value?.trim() || '');
const reduceMotion = '(prefers-reduced-motion: reduce)';

export function Metric({ value }) {
  const display = useRef(null);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const element = display.current;
    const preference = matchMedia(reduceMotion);
    const [, digits, suffix] = value.trim().match(/^([\d,.]+)(k?\+)$/i);
    const target = Number(digits.replaceAll(',', ''));
    const decimalPlaces = digits.split('.')[1]?.length || 0;
    const factor = 10 ** decimalPlaces;
    const format = new Intl.NumberFormat('en-AU', { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces, useGrouping: digits.includes(',') });
    let frame = 0;
    const finish = () => { cancelAnimationFrame(frame); element.textContent = value; };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || preference.matches) return;
      observer.disconnect();
      const start = performance.now();
      function draw(now) {
        const progress = Math.min(1, (now - start) / 950);
        if (progress === 1 || preference.matches) { finish(); return; }
        const count = Math.floor(target * (1 - (1 - progress) ** 3) * factor) / factor;
        element.textContent = format.format(count) + suffix;
        frame = requestAnimationFrame(draw);
      }
      frame = requestAnimationFrame(draw);
    }, { threshold: .55 });
    observer.observe(element);
    preference.addEventListener('change', finish);
    return () => { observer.disconnect(); finish(); preference.removeEventListener('change', finish); };
  }, [value]);

  return <><span className="sr-only">{value}</span><span ref={display} aria-hidden="true" className="motion-metric">{value}</span></>;
}

export function usePageMotion(viewport) {
  useEffect(() => {
    const element = viewport.current;
    let active = true;
    let disconnect;
    const preference = matchMedia(reduceMotion);
    const targets = element.querySelectorAll('[data-motion-section], [data-motion-card]');
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        target.setAttribute('data-arrived', '');
        observer.unobserve(target);
      }
    }, { rootMargin: '0px 0px -8% 0px' }) : null;

    // Stagger siblings so each section's content arrives in reading order.
    for (const section of element.querySelectorAll('[data-motion-section]')) {
      [...section.children].filter(child => child.classList.contains('fig-node')).forEach((child, i) => child.style.setProperty('--i', Math.min(i, 6)));
    }
    const groups = new Map();
    for (const card of element.querySelectorAll('[data-motion-card]')) {
      const siblings = groups.get(card.parentElement) ?? [];
      siblings.push(card);
      groups.set(card.parentElement, siblings);
    }
    for (const siblings of groups.values()) siblings.forEach((card, i) => card.style.setProperty('--i', Math.min(i, 6)));

    targets.forEach(target => observer?.observe(target));
    if (observer) element.classList.add('motion-ready');

    const root = document.documentElement;
    const onScroll = () => root.toggleAttribute('data-scrolled', scrollY > 24);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });

    async function enhance() {
      if (preference.matches || disconnect) return;
      try {
        const { connectScrollMotion } = await import('./scroll-motion');
        if (active && !preference.matches && !disconnect) disconnect = connectScrollMotion(element);
      } catch {
        // Section and card entrances also work without the scroll enhancement.
      }
    }
    enhance();
    preference.addEventListener('change', enhance);
    return () => {
      active = false;
      observer?.disconnect();
      removeEventListener('scroll', onScroll);
      element.classList.remove('motion-ready');
      disconnect?.();
      preference.removeEventListener('change', enhance);
    };
  }, [viewport]);
}
