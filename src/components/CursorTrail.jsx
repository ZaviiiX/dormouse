import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * Optimized cursor trail - elegant but non-intrusive
 */
export function CursorTrail() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Add new trail point with reduced frequency
      const now = Date.now();
      setTrails(prev => {
        // Only add point if enough time passed (smoother performance)
        const lastTrail = prev[prev.length - 1];
        if (lastTrail && now - lastTrail.timestamp < 80) return prev;
        
        const newTrail = {
          id: now,
          x: e.clientX,
          y: e.clientY,
          timestamp: now
        };
        
        return [...prev.slice(-12), newTrail]; // Keep only 12 points (less intrusive)
      });
    };

    window.addEventListener('mousemove', updateMousePosition);

    // Clean up old trail points
    const interval = setInterval(() => {
      const now = Date.now();
      setTrails(prev => prev.filter(trail => now - trail.timestamp < 800));
    }, 150);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 25 }}>
      {/* Subtle cursor glow */}
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-brand/40 blur-sm"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Trail particles */}
      {trails.map((trail, index) => {
        const age = (Date.now() - trail.timestamp) / 1000;
        const opacity = Math.max(0, 1 - age);
        const scale = Math.max(0.2, 1 - age * 0.5);
        
        return (
          <motion.div
            key={trail.id}
            className="absolute w-2 h-2 rounded-full bg-brand/60"
            style={{
              left: trail.x - 4,
              top: trail.y - 4,
              opacity: opacity * 0.6,
              scale: scale
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: scale, opacity: opacity * 0.6 }}
            exit={{ scale: 0, opacity: 0 }}
          />
        );
      })}

      {/* Sparkle effects on click */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-white/80"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
        initial={{ scale: 0 }}
        whileTap={{
          scale: [0, 3, 0],
          opacity: [0, 1, 0],
          rotate: [0, 180]
        }}
        transition={{ duration: 0.6 }}
      />
    </div>
  );
}