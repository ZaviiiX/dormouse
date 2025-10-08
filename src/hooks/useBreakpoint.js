import { useState, useEffect } from "react";

/**
 * Hook for responsive breakpoints
 * Returns current breakpoint: xs, sm, md, lg
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState("lg");

  useEffect(() => {
    const calculateBreakpoint = () => {
      const width = window.innerWidth;
      setBreakpoint(
        width < 640 ? "xs" : 
        width < 768 ? "sm" : 
        width < 1024 ? "md" : 
        "lg"
      );
    };

    calculateBreakpoint();
    window.addEventListener("resize", calculateBreakpoint);
    
    return () => window.removeEventListener("resize", calculateBreakpoint);
  }, []);

  return breakpoint;
}