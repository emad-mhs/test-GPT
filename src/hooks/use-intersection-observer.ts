// import { useEffect, useRef, useState, useMemo } from 'react';

// export const useIntersectionObserver = (options?: IntersectionObserverInit) => {
//   const [isIntersecting, setIsIntersecting] = useState(false);
//   const targetRef = useRef<HTMLDivElement | null>(null);

//   const observer = useMemo(() => {
//     return new IntersectionObserver(([entry]) => {
//       setIsIntersecting(entry.isIntersecting);
//     }, options);
//   }, [options]); // safe deep compare workaround

//   useEffect(() => {
//     const currentTarget = targetRef.current;

//     if (currentTarget) {
//       observer.observe(currentTarget);
//     }

//     return () => {
//       if (currentTarget) observer.unobserve(currentTarget);
//       observer.disconnect();
//     };
//   }, [observer]);

//   return { targetRef, isIntersecting };
// };
import { useEffect, useRef, useState, useMemo } from 'react';

export const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement | null>(null);

  // ننشئ الـ observer مرة واحدة أو عند تغيّر الخيارات
  const observer = useMemo(
    () =>
      new IntersectionObserver(entries => {
        // نتحقّق أولًا من وجود entry
        const entry = entries[0];
        if (entry) {
          setIsIntersecting(entry.isIntersecting);
        }
      }, options),
    [options]
  );

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    observer.observe(el);
    return () => {
      observer.unobserve(el);
      observer.disconnect();
    };
  }, [observer]);

  return { targetRef, isIntersecting };
};
