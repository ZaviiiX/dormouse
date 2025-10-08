import { motion, useTransform } from "framer-motion";

/**
 * Enhanced glow effects - visible ambient atmosphere
 */
export function SubtleGlowEffects({ activeProgress }) {
  // Enhanced glow opacity
  const glowOpacity = useTransform(activeProgress, [0, 0.5, 1], [0.4, 0.7, 0.5]);
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none" 
      style={{ 
        zIndex: 9999, 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      {/* Enhanced ambient particles */}
      {Array.from({ length: 18 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-brand/80 rounded-full blur-sm"
          style={{
            left: `${12 + (i * 5)}%`,
            top: `${18 + (i * 4)}%`,
            opacity: glowOpacity
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 2.2, 1],
            y: [0, -50, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Enhanced corner glow */}
      <motion.div
        className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-brand/40 via-brand/20 to-transparent blur-3xl"
        style={{ opacity: glowOpacity }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Enhanced bottom left glow */}
      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-radial from-brand/30 via-brand/15 to-transparent blur-3xl"
        style={{ opacity: glowOpacity }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />
    </div>
  );
}