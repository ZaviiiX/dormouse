import { useState, useEffect } from "react";

/**
 * Hook for tracking window height
 * Useful for viewport-based calculations
 */
export function useWindowHeight() {
  const [height, setHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 1000
  );

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight);
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return height;
}