import { motion, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  FRAME_SOURCES, 
  TOTAL_FRAMES,
  FRAME_POSITION, 
  FRAME_SCALES
} from "../constants";

/**
 * Simplified DormouseAnimation that always shows frames
 */
export function DormouseAnimation({ activeProgress, breakpoint }) {
  const [debugInfo, setDebugInfo] = useState({ frame: 0, progress: 0 });
  
  // Get position based on breakpoint
  const position = FRAME_POSITION[breakpoint] || FRAME_POSITION.lg;

  // Update debug info
  useEffect(() => {
    const unsubscribe = activeProgress.onChange((progress) => {
      const frame = Math.floor(progress * (TOTAL_FRAMES - 1));
      setDebugInfo({ frame, progress });
    });
    return unsubscribe;
  }, [activeProgress]);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      {/* Debug info */}
      <div className="fixed top-4 left-4 text-white text-sm font-mono bg-black/70 p-2 rounded z-50 pointer-events-auto">
        Frame: {debugInfo.frame}/{TOTAL_FRAMES - 1} | Progress: {(debugInfo.progress * 100).toFixed(1)}%
      </div>
      
      {FRAME_SOURCES.map((src, index) => {
        // Calculate opacity for each frame
        const opacity = useTransform(activeProgress, (progress) => {
          const currentFrame = Math.floor(progress * (TOTAL_FRAMES - 1));
          const roundedCurrent = Math.max(0, Math.min(TOTAL_FRAMES - 1, currentFrame));
          
          // Show current frame with full opacity
          if (index === roundedCurrent) return 1;
          
          // Show adjacent frames with slight opacity for smoothness
          const distance = Math.abs(index - roundedCurrent);
          if (distance === 1) return 0.3;
          
          return 0;
        });

        return (
          <motion.img
            key={index}
            src={src}
            alt={`Dormouse frame ${index + 1}`}
            style={{
              opacity,
              left: position.left,
              bottom: position.bottom,
              scale: FRAME_SCALES[breakpoint]
            }}
            className="absolute -translate-x-1/2 w-[380px] md:w-[420px] lg:w-[380px] select-none animate-dormouse"
            draggable={false}
            loading="lazy"
          />
        );
      })}
    </div>
  );
}