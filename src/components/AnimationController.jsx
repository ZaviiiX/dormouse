import { motion } from "framer-motion";

/**
 * Animation Controller - prevents animations during loading
 * Ensures proper timing of scroll-based animations
 */
export function AnimationController({ 
  children, 
  isLoading, 
  isContentReady, 
  className = "" 
}) {
  // Show content but with disabled scroll animations during loading
  if (isLoading || !isContentReady) {
    return (
      <div className={`${className}`} style={{ opacity: 0, pointerEvents: 'none' }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scroll Animation Wrapper - ensures animations only run when appropriate
 */
export function ScrollAnimationWrapper({ 
  children, 
  activeProgress, 
  startAt = 0, 
  endAt = 1,
  isContentReady = true 
}) {
  // Don't render if content is not ready
  if (!isContentReady) {
    return null;
  }

  return children;
}