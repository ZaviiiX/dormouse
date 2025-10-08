import { motion, useTransform } from "framer-motion";
import rocket from "/images/rocket.png";
import { ROCKET_CONFIG, ROADMAP_CONFIG } from "../constants";

/**
 * RocketAnimation component handles the rocket animation
 */
export function RocketAnimation({ activeProgress }) {
  const { left, bottom, appearOffset, visibleOffset } = ROCKET_CONFIG;
  const { end: roadmapEnd } = ROADMAP_CONFIG;

  const rocketAppearStart = roadmapEnd + appearOffset;
  const rocketVisibleAt = roadmapEnd + visibleOffset;
  const rocketHoldUntil = 1.0;
  const rocketEndFade = 1.0;

  // Check current progress
  const currentProgress = activeProgress.get();
  
  const rocketOpacity = useTransform(
    activeProgress,
    [rocketAppearStart, rocketVisibleAt, rocketHoldUntil, rocketEndFade],
    [0, 1, 1, 1]
  );

  // Don't render if progress is invalid or too early
  if (currentProgress < rocketAppearStart) {
    return null;
  }

  return (
    <motion.img
      src={rocket}
      alt="Rocket"
      style={{ opacity: rocketOpacity, left, bottom }}
      className="fixed -translate-x-1/2 w-[80px] sm:w-[100px] md:w-[120px] lg:w-[110px] select-none drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] z-20 pointer-events-none"
      animate={{ 
        y: [0, -15, 0], 
        rotate: [0, 5, -5, 0], 
        scale: [1, 1.1, 1] 
      }}
      transition={{ 
        duration: 1.2, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    />
  );
}