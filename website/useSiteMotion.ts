import { useEffect } from 'react';

/** Animate sections once on entry; content remains visible without animation support. */
export function useSiteMotion() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !Element.prototype.animate) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const active = new Set<Animation>();
    const stop = () => {
      if (preference.matches) {
        active.forEach(animation => animation.cancel());
        active.clear();
      }
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches) continue;
        const animation = entry.target.animate(
          [{ opacity: 0.35, translate: '0 18px' }, { opacity: 1, translate: '0 0' }],
          { duration: 550, easing: 'cubic-bezier(.22,1,.36,1)' },
        );
        active.add(animation);
        animation.onfinish = () => active.delete(animation);
      }
    }, { threshold: 0.12 });
    document.querySelectorAll('.method-heading, .steps article, .extension-grid > div, .faq > *, footer > div')
      .forEach(element => observer.observe(element));
    preference.addEventListener('change', stop);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', stop);
      active.forEach(animation => animation.cancel());
    };
  }, []);
}
