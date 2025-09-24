import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialize with the correct value immediately if window is available
    if (typeof window !== "undefined") {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false; // Default fallback
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    // Only update if the initial value was wrong
    const currentMobile = window.innerWidth < MOBILE_BREAKPOINT;
    if (currentMobile !== isMobile) {
      setIsMobile(currentMobile);
    }
    return () => mql.removeEventListener("change", onChange);
  }, [isMobile]);

  return isMobile;
}
