// hooks/useActiveSection.js
import { useEffect, useState } from "react";

const useActiveSection = (sectionIds) => {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!sectionIds?.length) return;

    let observer;
    let resizeObserver;
    let animationFrameId;

    const getHeaderHeight = () => {
      return (
        getComputedStyle(document.documentElement)
          .getPropertyValue("--header-h")
          .trim() || "0px"
      );
    };

    const updateActiveSection = () => {
      const headerHeight = parseFloat(getHeaderHeight()) || 0;

      // Point de référence : sous le header + milieu de l'écran.
      const referenceY = headerHeight + (window.innerHeight - headerHeight) / 2;

      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      const currentSection = sections.find((section) => {
        const rect = section.getBoundingClientRect();

        return rect.top <= referenceY && rect.bottom >= referenceY;
      });

      if (currentSection) {
        setActiveId(currentSection.id);
      }
    };

    const initObservers = () => {
      const headerHeight = getHeaderHeight();

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        {
          rootMargin: `-${headerHeight} 0px -50% 0px`,
          threshold: 0,
        },
      );

      resizeObserver = new ResizeObserver(() => {
        updateActiveSection();
      });

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);

        if (!section) {
          console.warn(`Section introuvable : #${id}`);
          return;
        }

        observer.observe(section);
        resizeObserver.observe(section);
      });

      // Réévalue après que le navigateur a calculé la mise en page.
      updateActiveSection();
    };

    animationFrameId = requestAnimationFrame(initObservers);

    window.addEventListener("resize", updateActiveSection);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateActiveSection);
      observer?.disconnect();
      resizeObserver?.disconnect();
    };
  }, [sectionIds]);

  return activeId;
};

export default useActiveSection;
