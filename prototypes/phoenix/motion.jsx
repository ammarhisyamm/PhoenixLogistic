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

    // Industry cards carry a soft light that follows a mouse pointer.
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const onPointer = e => {
      const card = e.target.closest?.('[data-name^="Sector / "]:not(.fig-text), [data-name="Type-Card"]');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    };
    if (fine) element.addEventListener('pointermove', onPointer, { passive: true });

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
      element.removeEventListener('pointermove', onPointer);
      disconnect?.();
      preference.removeEventListener('change', enhance);
    };
  }, [viewport]);
}
