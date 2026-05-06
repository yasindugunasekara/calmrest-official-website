import { useEffect, useRef } from 'react';
import { trackEvent } from '../utils/analytics';
import { useLocation } from 'react-router-dom';

/**
 * A hook that tracks when a section becomes visible in the viewport using IntersectionObserver.
 * Fires the 'section_view' event exactly once per session for the given section.
 */
export const useSectionTracking = (sectionName: string) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const location = useLocation();
  const hasTracked = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTracked.current) {
          trackEvent('section_view', {
            section_name: sectionName,
            page_path: location.pathname,
          });
          hasTracked.current = true;
          // We can unobserve after tracking once
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      {
        threshold: 0.1, // 10% visibility to handle large sections
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [sectionName, location.pathname]);

  return sectionRef;
};
