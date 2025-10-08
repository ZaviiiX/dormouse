import { motion, useTransform } from "framer-motion";

/**
 * Refined morphing shapes - background layer, no content overlap
 */
export function MorphingShapes({ activeProgress }) {
  
  // Subtle morphing paths that stay in background
  const shape1Path = useTransform(
    activeProgress,
    [0, 0.3, 0.6, 1],
    [
      "M 20,60 Q 40,40 60,60 Q 80,80 100,60 L 100,100 L 20,100 Z",
      "M 20,50 Q 40,70 60,50 Q 80,40 100,50 L 100,100 L 20,100 Z", 
      "M 20,70 Q 40,50 60,70 Q 80,90 100,70 L 100,100 L 20,100 Z",
      "M 20,60 Q 40,40 60,60 Q 80,80 100,60 L 100,100 L 20,100 Z"
    ]
  );

  const shape2Path = useTransform(
    activeProgress,
    [0, 0.4, 0.7, 1],
    [
      "M 10,40 Q 30,60 50,40 Q 70,20 90,40 L 90,100 L 10,100 Z",
      "M 10,60 Q 30,30 50,60 Q 70,80 90,60 L 90,100 L 10,100 Z",
      "M 10,30 Q 30,70 50,30 Q 70,10 90,30 L 90,100 L 10,100 Z",
      "M 10,40 Q 30,60 50,40 Q 70,20 90,40 L 90,100 L 10,100 Z"
    ]
  );

  // Much lower opacity to stay in background
  const shape1Opacity = useTransform(activeProgress, [0, 0.2, 0.8, 1], [0.05, 0.15, 0.15, 0.05]);
  const shape2Opacity = useTransform(activeProgress, [0, 0.3, 0.7, 1], [0.03, 0.12, 0.12, 0.03]);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>
      {/* Subtle morphing shape 1 */}
      <svg
        className="absolute top-20 right-10 w-64 h-32"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="morphGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E27E00" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#E27E00" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <motion.path
          d={shape1Path}
          fill="url(#morphGradient1)"
          style={{ opacity: shape1Opacity }}
        />
      </svg>

      {/* Subtle morphing shape 2 */}
      <svg
        className="absolute bottom-32 left-20 w-48 h-24"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="morphGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E27E00" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#E27E00" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        <motion.path
          d={shape2Path}
          fill="url(#morphGradient2)"
          style={{ opacity: shape2Opacity }}
        />
      </svg>

      {/* Subtle rotating elements */}
      {Array.from({ length: 3 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-brand/10"
          style={{
            width: 40 + i * 15,
            height: 40 + i * 15,
            left: `${60 + i * 8}%`,
            top: `${30 + i * 20}%`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.15, 0.05],
            rotate: [0, 360]
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            delay: i * 1
          }}
        />
      ))}
    </div>
  );
}