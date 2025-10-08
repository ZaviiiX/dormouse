import { motion, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * Advanced Particle System for magical effects
 */
export function ParticleSystem({ activeProgress, triggerAt = 0.5, duration = 0.2 }) {
  const [particles, setParticles] = useState([]);

  // Generate particles when triggered
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        angle: Math.random() * Math.PI * 2,
        velocity: Math.random() * 100 + 50,
        color: Math.random() > 0.5 ? 'brand' : 'white'
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Control particle opacity based on scroll
  const particleOpacity = useTransform(
    activeProgress,
    [triggerAt - 0.05, triggerAt, triggerAt + duration, triggerAt + duration + 0.05],
    [0, 1, 1, 0]
  );

  return (
    <motion.div 
      className="fixed inset-0 pointer-events-none z-30"
      style={{ opacity: particleOpacity }}
    >
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${
            particle.color === 'brand' ? 'bg-brand' : 'bg-white'
          }`}
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
            filter: 'blur(1px)',
            boxShadow: `0 0 ${particle.size * 2}px ${
              particle.color === 'brand' ? '#E27E00' : '#ffffff'
            }`
          }}
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: 0,
            y: 0
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1.5, 0],
            x: Math.cos(particle.angle) * particle.velocity,
            y: Math.sin(particle.angle) * particle.velocity - 100,
            rotate: [0, 360]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </motion.div>
  );
}