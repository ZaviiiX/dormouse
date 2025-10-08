import { motion, useTransform } from "framer-motion";

/**
 * Cinematic Text Reveal with typewriter and glow effects
 */
export function CinematicText({ children, progress, startAt = 0, endAt = 1, className = "" }) {
  
  // Smooth reveal animation
  const opacity = useTransform(progress, [startAt - 0.05, startAt + 0.1, endAt - 0.1, endAt], [0, 1, 1, 0]);
  const y = useTransform(progress, [startAt - 0.05, startAt + 0.1], [30, 0]);
  const scale = useTransform(progress, [startAt - 0.05, startAt + 0.1], [0.95, 1]);
  
  // Glow intensity based on progress
  const glowIntensity = useTransform(
    progress,
    [startAt, startAt + 0.05, startAt + 0.15, endAt - 0.1, endAt],
    [0, 1, 0.8, 0.8, 0]
  );

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={`relative ${className}`}
    >
      {/* Background glow */}
      <motion.div
        style={{ 
          opacity: glowIntensity,
          filter: "blur(20px)"
        }}
        className="absolute inset-0 bg-brand/30 rounded-lg"
      />
      
      {/* Text with typewriter reveal */}
      <motion.div
        className="relative z-10"
        initial={{ width: 0 }}
        animate={{ 
          width: "auto",
        }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
          delay: 0.2
        }}
        style={{ overflow: "hidden" }}
      >
        {children}
      </motion.div>

      {/* Cinematic bars (top and bottom) */}
      <motion.div
        style={{ opacity: glowIntensity }}
        className="absolute -top-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent"
      />
      <motion.div
        style={{ opacity: glowIntensity }}
        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent"
      />
    </motion.div>
  );
}