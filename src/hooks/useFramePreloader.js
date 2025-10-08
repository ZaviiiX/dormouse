import { useEffect } from "react";
import { FRAME_SOURCES } from "../constants";

/**
 * Hook for preloading animation frames
 * Intelligently loads frames based on priority
 */
export function useFramePreloader() {
  useEffect(() => {
    // Preload strategy: Load critical frames first, then progressive loading
    const preloadFrames = async () => {
      // Priority 1: First 10 frames (immediate display)
      const priorityFrames = FRAME_SOURCES.slice(0, 10);
      
      // Priority 2: Key transition frames (adjusted for 32 frames)
      const keyFrames = [
        ...FRAME_SOURCES.slice(10, 16),  // Wake transition frames 10-15
        ...FRAME_SOURCES.slice(20, 26),  // Active transition frames 20-25
        ...FRAME_SOURCES.slice(26, 32)   // Ready transition frames 26-31
      ];

      // Priority 3: Remaining frames
      const remainingFrames = FRAME_SOURCES.filter((_, index) => 
        index >= 10 && 
        !keyFrames.includes(FRAME_SOURCES[index])
      );

      // Sequential loading with small delays to prevent blocking
      const loadBatch = async (frames, delay = 50) => {
        for (const src of frames) {
          const img = new Image();
          img.src = src;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      };

      // Load in priority order
      await loadBatch(priorityFrames, 0);
      await loadBatch(keyFrames, 20);
      await loadBatch(remainingFrames, 100);
    };

    // Start preloading after component mount
    const timeoutId = setTimeout(preloadFrames, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);
}