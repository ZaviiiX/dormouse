import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";

/**
 * Dynamic Lighting System
 * Creates responsive lighting effects based on scroll position and user interactions
 */

/**
 * Ambient Light Controller - Changes overall lighting based on scroll progress
 */
export function AmbientLighting({ scrollProgress, className = "" }) {
  // Different lighting phases based on scroll progress
  const lightingPhases = [
    { start: 0, end: 0.2, color: "#1a1a2e", intensity: 0.8, name: "Sleep" },
    { start: 0.2, end: 0.5, color: "#16213e", intensity: 0.6, name: "Awakening" },
    { start: 0.5, end: 0.8, color: "#0f4c75", intensity: 0.4, name: "Journey" },
    { start: 0.8, end: 1, color: "#e27e00", intensity: 0.2, name: "Moon" },
  ];

  // Calculate current lighting based on scroll progress
  const currentLighting = useTransform(scrollProgress, (progress) => {
    for (const phase of lightingPhases) {
      if (progress >= phase.start && progress <= phase.end) {
        const phaseProgress = (progress - phase.start) / (phase.end - phase.start);
        return {
          color: phase.color,
          intensity: phase.intensity * (0.3 + 0.7 * phaseProgress),
          name: phase.name
        };
      }
    }
    return lightingPhases[lightingPhases.length - 1];
  });

  return (
    <motion.div
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{
        background: useTransform(currentLighting, (lighting) => 
          `radial-gradient(ellipse at center, transparent 0%, ${lighting.color} 70%, rgba(0,0,0,${lighting.intensity}) 100%)`
        ),
        zIndex: 5,
        mixBlendMode: "multiply"
      }}
    />
  );
}

/**
 * Mouse Light - Creates a light source that follows the mouse cursor
 */
export function MouseLight({ intensity = 0.3, radius = 400, color = "#ff8c00" }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed pointer-events-none z-10"
      style={{
        left: mouseX,
        top: mouseY,
        width: radius * 2,
        height: radius * 2,
        marginLeft: -radius,
        marginTop: -radius,
        background: `radial-gradient(circle, ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')} 0%, transparent 60%)`,
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    />
  );
}

/**
 * Spotlight Effect - Creates focused light beams on important elements
 */
export function Spotlight({ target, intensity = 0.5, size = 300, color = "#ffffff", className = "" }) {
  const [targetBounds, setTargetBounds] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!target) return;

    const updateBounds = () => {
      if (target.current) {
        const rect = target.current.getBoundingClientRect();
        setTargetBounds({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        });
        setIsVisible(true);
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds);

    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds);
    };
  }, [target]);

  if (!targetBounds || !isVisible) return null;

  return (
    <motion.div
      className={`fixed pointer-events-none z-20 ${className}`}
      style={{
        left: targetBounds.x,
        top: targetBounds.y,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        background: `radial-gradient(circle, ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        mixBlendMode: "screen"
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  );
}

/**
 * Dynamic Shadow System - Creates reactive shadows based on lighting
 */
export function DynamicShadows({ children, scrollProgress, className = "" }) {
  const shadowIntensity = useTransform(scrollProgress, [0, 0.5, 1], [0.8, 0.4, 0.1]);
  const shadowColor = useTransform(scrollProgress, [0, 0.5, 1], ["#000000", "#1a1a2e", "#e27e00"]);

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        filter: useTransform([shadowIntensity, shadowColor], ([intensity, color]) => 
          `drop-shadow(0 10px 20px ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')})`
        )
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Glow Effect - Adds dynamic glow to elements
 */
export function GlowEffect({ 
  children, 
  color = "#ff8c00", 
  intensity = 0.5, 
  pulseSpeed = 2,
  reactive = false,
  className = "" 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const pulseIntensity = useMotionValue(intensity);

  // Pulsing animation
  useEffect(() => {
    const animateGlow = () => {
      pulseIntensity.set(intensity * (0.7 + 0.3 * Math.sin(Date.now() / (1000 / pulseSpeed))));
      requestAnimationFrame(animateGlow);
    };
    
    const rafId = requestAnimationFrame(animateGlow);
    return () => cancelAnimationFrame(rafId);
  }, [intensity, pulseSpeed, pulseIntensity]);

  const glowIntensity = reactive ? (isHovered ? intensity * 1.5 : intensity) : intensity;

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => reactive && setIsHovered(true)}
      onMouseLeave={() => reactive && setIsHovered(false)}
      style={{
        filter: `drop-shadow(0 0 ${10 + glowIntensity * 20}px ${color}) drop-shadow(0 0 ${20 + glowIntensity * 40}px ${color})`
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Light Particle System - Creates floating light particles
 */
export function LightParticles({ count = 20, scrollProgress, className = "" }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 2
  }));

  const particleOpacity = useTransform(scrollProgress, [0, 0.3, 0.7, 1], [0.1, 0.3, 0.6, 0.8]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`} style={{ zIndex: 15 }}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-brand"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            opacity: particleOpacity
          }}
          animate={{
            y: [0, -100, -200],
            x: [0, Math.sin(particle.id) * 50, Math.sin(particle.id + 1) * 100],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

/**
 * Interactive Light Rays - Creates light rays that respond to interactions
 */
export function InteractiveLightRays({ trigger, className = "" }) {
  const [rays, setRays] = useState([]);

  const createRay = (x, y) => {
    const newRay = {
      id: Date.now(),
      x,
      y,
      angle: Math.random() * 360,
      length: 200 + Math.random() * 300
    };

    setRays(prev => [...prev, newRay]);

    // Remove ray after animation
    setTimeout(() => {
      setRays(prev => prev.filter(ray => ray.id !== newRay.id));
    }, 1000);
  };

  useEffect(() => {
    if (!trigger) return;

    const handleClick = (e) => {
      createRay(e.clientX, e.clientY);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trigger]);

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: 25 }}>
      {rays.map((ray) => (
        <motion.div
          key={ray.id}
          className="absolute"
          style={{
            left: ray.x,
            top: ray.y,
            width: 2,
            height: ray.length,
            background: 'linear-gradient(to bottom, #ff8c00, transparent)',
            transformOrigin: 'top center',
            transform: `rotate(${ray.angle}deg)`
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 0] }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/**
 * Main Dynamic Lighting System Component
 */
export function DynamicLightingSystem({ scrollProgress, enableMouseLight = true, enableParticles = true }) {
  return (
    <>
      {/* Ambient lighting that changes with scroll */}
      <AmbientLighting scrollProgress={scrollProgress} />
      
      {/* Mouse-following light */}
      {enableMouseLight && <MouseLight intensity={0.2} radius={300} color="#ff8c00" />}
      
      {/* Floating light particles */}
      {enableParticles && <LightParticles count={15} scrollProgress={scrollProgress} />}
      
      {/* Interactive light rays on click */}
      <InteractiveLightRays trigger={true} />
    </>
  );
}