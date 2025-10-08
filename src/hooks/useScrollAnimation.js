import { useScroll, useTransform, useMotionValue } from "framer-motion";
import { useEffect } from "react";

/**
 * Hook for scroll-based animations
 * Returns both raw scroll progress and transformed active progress
 */
export function useScrollAnimation(isLoading = false, componentsLoaded = {}) {
  const { scrollYProgress } = useScroll();
  const staticProgress = useMotionValue(0);
  
  // Force static progress to 0 during loading and brief period after
  useEffect(() => {
    if (isLoading || !componentsLoaded.content) {
      staticProgress.set(0);
    } else {
      // Add a delay before allowing real scroll progress
      const timer = setTimeout(() => {
        // Scroll to top to ensure we start from 0
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isLoading, componentsLoaded.content, staticProgress]);

  // Always use static 0 progress during loading, with extra delay after loading
  const shouldUseStatic = isLoading || !componentsLoaded.content;
  const currentProgress = shouldUseStatic ? staticProgress : scrollYProgress;
  const activeProgress = useTransform(currentProgress, [0, 0.8], [0, 1]);

  // Debug logging - removed for production
  useEffect(() => {
    const unsubscribe = activeProgress.onChange((value) => {
      // Production ready - no debug logs
    });
    return unsubscribe;
  }, [activeProgress, isLoading, componentsLoaded.content]);

  return {
    scrollYProgress: currentProgress,
    activeProgress
  };
}