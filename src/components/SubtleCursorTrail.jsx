import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * Enhanced cursor trail - visible and elegant
 */
export function SubtleCursorTrail() {
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
        if (lastTrail && now - lastTrail.timestamp < 50) return prev;
        
        const newTrail = {
          id: now,
          x: e.clientX,
          y: e.clientY,
          timestamp: now
        };
        
        return [...prev.slice(-8), newTrail]; // Keep only 8 points
      });
    };

    window.addEventListener('mousemove', updateMousePosition);

    // Clean up old trail points
    const interval = setInterval(() => {
      const now = Date.now();
      setTrails(prev => prev.filter(trail => now - trail.timestamp < 800));
    }, 200);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none" 
      style={{ 
        zIndex: 9998,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      {/* Enhanced cursor glow */}
      <motion.div
        className="absolute w-12 h-12 rounded-full bg-brand/80 blur-md"
        style={{
          left: mousePosition.x - 24,
          top: mousePosition.y - 24,
        }}
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.7, 0.9, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Enhanced trail particles */}
      {trails.map((trail, index) => {
        const age = (Date.now() - trail.timestamp) / 800;
        const opacity = Math.max(0, (1 - age) * 0.8); 
        const scale = Math.max(0.5, 1 - age * 0.5);   
        
        return (
          <motion.div
            key={trail.id}
            className="absolute w-4 h-4 rounded-full bg-brand/90 blur-sm"
            style={{
              left: trail.x - 8,
              top: trail.y - 8,
              opacity: opacity,
              scale: scale
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: scale, opacity: opacity }}
          />
        );
      })}
    </div>
  );
}