import { motion, useTransform } from "framer-motion";

/**
 * Optimized parallax layers - subtle depth without dominating background
 */
export function ParallaxLayers({ scrollProgress }) {
  // Subtle parallax transforms
  const layer1Y = useTransform(scrollProgress, [0, 1], [0, -50]);
  const layer2Y = useTransform(scrollProgress, [0, 1], [0, -30]);
  const layer3Y = useTransform(scrollProgress, [0, 1], [0, -20]);
  
  const layer1Opacity = useTransform(scrollProgress, [0, 0.3, 0.7, 1], [0.3, 0.5, 0.3, 0.1]);
  const layer2Opacity = useTransform(scrollProgress, [0, 0.5, 1], [0.2, 0.4, 0.2]);
  
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {/* Background layer 1 - slowest */}
      <motion.div
        className="absolute inset-0"
        style={{ 
          y: layer1Y,
          opacity: layer1Opacity
        }}
      >
        {/* Subtle geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand/10 rounded-full blur-3xl" />
        <div className="absolute top-60 right-20 w-48 h-48 bg-brand/8 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-brand/12 rounded-full blur-3xl" />
      </motion.div>
      
      {/* Background layer 2 - medium speed */}
      <motion.div
        className="absolute inset-0"
        style={{ 
          y: layer2Y,
          opacity: layer2Opacity
        }}
      >
        {/* Medium parallax elements */}
        <div className="absolute top-40 right-10 w-24 h-24 bg-brand/15 rounded-full blur-2xl" />
        <div className="absolute bottom-60 right-1/3 w-36 h-36 bg-brand/12 rounded-full blur-2xl" />
      </motion.div>
      
      {/* Background layer 3 - fastest */}
      <motion.div
        className="absolute inset-0"
        style={{ 
          y: layer3Y,
          opacity: layer2Opacity
        }}
      >
        {/* Foreground parallax elements */}
        <div className="absolute top-80 left-20 w-20 h-20 bg-brand/20 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-40 w-28 h-28 bg-brand/18 rounded-full blur-xl" />
      </motion.div>
    </div>
  );
}