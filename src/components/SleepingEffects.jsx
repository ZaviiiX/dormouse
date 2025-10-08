import { motion, useTransform } from "framer-motion";
import { SLEEP_EFFECTS, CONTENT_TIMELINE } from "../constants";

/**
 * SleepingEffects component handles the "ZZZ" sleeping animations
 */
export function SleepingEffects({ activeProgress }) {
  const { zPosition, zCount, earlyDuration, earlyDelay, lateDuration, lateDelay } = SLEEP_EFFECTS;

  // Early ZZZ opacity (during initial sleep)
  const zzzOpacity = useTransform(activeProgress, (progress) => {
    if (progress < CONTENT_TIMELINE[0].start) return 0;
    if (progress <= CONTENT_TIMELINE[0].start + 0.14) return 1; // impactProgress - 0.01
    return 0;
  });

  // Late ZZZ opacity (during later sleep phases)
  const zzzLateOpacity = useTransform(
    activeProgress,
    [CONTENT_TIMELINE[0].end, CONTENT_TIMELINE[1].end - 0.1, CONTENT_TIMELINE[1].end],
    [0, 1, 0]
  );

  /**
   * Renders a set of animated Z characters
   */
  const renderZZZ = (opacity, duration, delay, keyPrefix) => (
    <motion.div
      className="fixed z-20 pointer-events-none"
      style={{ left: zPosition.left, bottom: zPosition.bottom, opacity }}
    >
      {Array.from({ length: zCount }, (_, index) => (
        <motion.div key={`${keyPrefix}-${index}`} className="relative">
          <motion.div
            className="absolute bg-white/25 rounded-full w-8 h-8 sm:w-10 sm:h-10 blur-md"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0, 1, 0], 
              y: [-10, -30], 
              scale: [0.7, 1.1, 0.7] 
            }}
            transition={{ 
              duration, 
              delay: index * delay, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          <motion.span
            className="text-3xl sm:text-4xl font-bold text-brand block"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              y: [-10, -30] 
            }}
            transition={{ 
              duration, 
              delay: index * delay, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            Z
          </motion.span>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <>
      {renderZZZ(zzzOpacity, earlyDuration, earlyDelay, "early")}
      {renderZZZ(zzzLateOpacity, lateDuration, lateDelay, "late")}
    </>
  );
}