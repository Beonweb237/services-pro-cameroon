import { useEffect } from 'react';

/**
 * Hook qui ajoute la classe 'revealed' aux éléments .reveal
 * quand ils entrent dans le viewport (IntersectionObserver)
 */
export function useReveal(threshold = 0.12) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold]);
}
