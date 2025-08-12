import { RefObject, useEffect } from "react";

type ScrollOpts = {
  behavior?: ScrollBehavior; // "auto" | "smooth"
  top?: number;              // offset in px (useful for fixed headers)
};



export function useScrollToTop(containerRef?: RefObject<HTMLElement | null>, dep?: any, opts: ScrollOpts = {}) {
  const { behavior = "auto", top = 0 } = opts;

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (containerRef) {
      const el = containerRef.current;
      if (el && typeof el.scrollTo === "function") {
          el.scrollTo({ top, behavior });
        return;
      }
    }

    window.scrollTo({ top, behavior });
  }, [dep]); // run only when dep changes
}
