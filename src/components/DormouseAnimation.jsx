import { motion, useTransform } from "framer-motion";
import { 
  FRAME_SOURCES, 
  FRAME_POSITIONS, 
  FRAME_ADJUSTMENTS,
  FRAME_TIMELINE 
} from "../constants";

/**
 * Utility function to clamp values between 0 and 1
 */
const clamp01 = (value) => Math.min(1, Math.max(0, value));

/**
 * DormouseAnimation component handles the animated dormouse frames
 * Back to original working version with 9 frames
 */
export function DormouseAnimation({ activeProgress, breakpoint }) {
  const fade = 0.008; // Increased fade for much smoother transitions between frames

  /**
   * Get frame position based on breakpoint
   */
  const getFramePosition = (frameIndex) => {
    const config = FRAME_POSITIONS[frameIndex] || {};
    return config[breakpoint] || config.lg || { left: "50vw", bottom: "15vh" };
  };

  /**
   * Get frame adjustments (scale, position offsets) based on breakpoint
   */
  const getFrameAdjustments = (frameIndex) => {
    const adjustments = FRAME_ADJUSTMENTS[frameIndex] || FRAME_ADJUSTMENTS[0];
    return {
      scale: adjustments.scale[breakpoint] || adjustments.scale.lg,
      offsetX: adjustments.offsetX[breakpoint] || adjustments.offsetX.lg,
      offsetY: adjustments.offsetY[breakpoint] || adjustments.offsetY.lg
    };
  };

  /**
   * Calculate opacity for each frame based on timeline with smooth easing
   */
  const getFrameOpacity = (frameIndex) =>
    useTransform(activeProgress, (progress) => {
      const { start, end } = FRAME_TIMELINE[frameIndex];
      const fadeIn = clamp01(start - fade);
      const fadeOut = clamp01(end + fade);
      
      if (progress < fadeIn || progress > fadeOut) return 0;
      if (progress >= start && progress <= end) return 1;
      
      // Smooth easing for fade in
      if (progress >= fadeIn && progress < start) {
        const t = (progress - fadeIn) / (start - fadeIn);
        // Use easeInOut for smoother transition
        const smoothT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        return smoothT;
      }
      
      // Smooth easing for fade out
      if (progress > end && progress <= fadeOut) {
        const t = (progress - end) / (fadeOut - end);
        // Use easeInOut for smoother transition
        const smoothT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        return 1 - smoothT;
      }
      
      return 0;
    });

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      {FRAME_SOURCES.map((src, index) => {
        const position = getFramePosition(index);
        const adjustments = getFrameAdjustments(index);
        const opacity = getFrameOpacity(index);
        
        return (
          <motion.img
            key={index}
            src={src}
            alt={`Dormouse frame ${index + 1}`}
            style={{
              opacity,
              left: position.left,
              bottom: position.bottom,
              scale: adjustments.scale,
              x: adjustments.offsetX,
              y: adjustments.offsetY
            }}
            transition={{
              opacity: { duration: 0.3, ease: "easeInOut" },
              scale: { duration: 0.2, ease: "easeOut" },
              x: { duration: 0.3, ease: "easeInOut" },
              y: { duration: 0.3, ease: "easeInOut" }
            }}
            className="absolute -translate-x-1/2 w-[380px] md:w-[420px] lg:w-[380px] select-none animate-dormouse cursor-pointer pointer-events-auto"
            draggable={false}
            onClick={() => {
              // Trigger dormouse click easter egg
              if (window.triggerEasterEgg) {
                window.triggerEasterEgg('dormouse-click');
              }
            }}
            whileHover={{ scale: adjustments.scale * 1.05 }}
            whileTap={{ scale: adjustments.scale * 0.95 }}
          />
        );
      })}
    </div>
  );
}