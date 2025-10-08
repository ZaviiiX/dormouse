import { motion, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";

/**
 * Advanced Visual Enhancement System
 * 3D effects, dynamic lighting, enhanced particles, and immersive visuals
 */

// 3D Tilt effect component
export function TiltCard({ children, className = "", intensity = 15 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]));
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]));

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`transform-gpu ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ transform: "translateZ(50px)" }}>
        {children}
      </div>
    </motion.div>
  );
}

// Dynamic lighting system
export function DynamicLighting({ activeProgress, mousePosition }) {
  // Main light that follows scroll progress
  const lightIntensity = useTransform(activeProgress, [0, 0.5, 1], [0.3, 0.8, 0.5]);
  const lightX = useTransform(activeProgress, [0, 1], ["20%", "80%"]);
  const lightY = useTransform(activeProgress, [0, 1], ["30%", "70%"]);

  // Mouse-following spotlight
  const [mouseLight, setMouseLight] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (mousePosition) {
      setMouseLight({
        x: (mousePosition.x / window.innerWidth) * 100,
        y: (mousePosition.y / window.innerHeight) * 100
      });
    }
  }, [mousePosition]);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {/* Main progressive light */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-40"
        style={{
          left: lightX,
          top: lightY,
          background: `radial-gradient(circle, 
            rgba(226, 126, 0, 0.6) 0%, 
            rgba(226, 126, 0, 0.3) 30%, 
            rgba(226, 126, 0, 0.1) 60%, 
            transparent 80%
          )`,
          filter: 'blur(40px)',
          opacity: lightIntensity,
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      {/* Mouse spotlight */}
      <motion.div
        className="absolute w-64 h-64 rounded-full pointer-events-none"
        style={{
          left: `${mouseLight.x}%`,
          top: `${mouseLight.y}%`,
          background: `radial-gradient(circle, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(226, 126, 0, 0.05) 50%, 
            transparent 80%
          )`,
          filter: 'blur(30px)',
          transform: 'translate(-50%, -50%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Ambient rim lighting */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent" />
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-brand to-transparent" />
        <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-brand to-transparent" />
      </div>
    </div>
  );
}

// Enhanced particle system with multiple layers
export function EnhancedParticleSystem({ activeProgress, density = "medium" }) {
  const particleCount = {
    low: 15,
    medium: 25,
    high: 40
  }[density];

  // Particle movement based on scroll
  const baseY = useTransform(activeProgress, [0, 1], [0, -200]);
  const rotation = useTransform(activeProgress, [0, 1], [0, 360]);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 3 }}>
      {/* Floating particles */}
      {Array.from({ length: particleCount }, (_, i) => {
        const delay = (i / particleCount) * 2;
        const x = (i / particleCount) * 100;
        const y = 20 + (i % 5) * 15;
        
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              background: `radial-gradient(circle, 
                rgba(226, 126, 0, 0.8) 0%, 
                rgba(226, 126, 0, 0.3) 70%, 
                transparent 100%
              )`,
              y: baseY,
              filter: 'blur(1px)'
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.5, 1],
              x: [0, Math.sin(i) * 30, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut"
            }}
          />
        );
      })}

      {/* Energy waves */}
      {Array.from({ length: 3 }, (_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from ${i * 120}deg, 
              transparent 0%, 
              rgba(226, 126, 0, 0.1) 50%, 
              transparent 100%
            )`,
            rotate: rotation
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Scroll-triggered particle bursts */}
      <ScrollTriggeredBurst activeProgress={activeProgress} at={0.25} />
      <ScrollTriggeredBurst activeProgress={activeProgress} at={0.5} />
      <ScrollTriggeredBurst activeProgress={activeProgress} at={0.75} />
    </div>
  );
}

// Scroll-triggered particle burst
function ScrollTriggeredBurst({ activeProgress, at = 0.5 }) {
  const [triggered, setTriggered] = useState(false);
  
  useEffect(() => {
    const unsubscribe = activeProgress.onChange((progress) => {
      if (progress >= at && progress <= at + 0.02 && !triggered) {
        setTriggered(true);
        setTimeout(() => setTriggered(false), 2000);
      }
    });
    
    return unsubscribe;
  }, [activeProgress, at, triggered]);

  if (!triggered) return null;

  return (
    <div className="fixed inset-0 pointer-events-none">
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const distance = 150 + Math.random() * 100;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        
        return (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-brand rounded-full"
            style={{
              left: '50%',
              top: '50%',
              filter: 'blur(2px)',
              boxShadow: '0 0 10px rgba(226, 126, 0, 0.5)'
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              opacity: 1
            }}
            animate={{
              x: endX,
              y: endY,
              scale: [0, 1.5, 0],
              opacity: [1, 0.8, 0]
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
              delay: i * 0.05
            }}
          />
        );
      })}
    </div>
  );
}

// Depth-based layered backgrounds
export function DepthLayers({ activeProgress }) {
  return (
    <div className="fixed inset-0" style={{ zIndex: 1 }}>
      {/* Far background layer */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          y: useTransform(activeProgress, [0, 1], [0, -50]),
          background: `radial-gradient(ellipse at center, 
            rgba(226, 126, 0, 0.1) 0%, 
            transparent 60%
          )`
        }}
      />
      
      {/* Mid background layer */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          y: useTransform(activeProgress, [0, 1], [0, -100]),
          background: `linear-gradient(45deg, 
            transparent 0%, 
            rgba(226, 126, 0, 0.05) 50%, 
            transparent 100%
          )`
        }}
      />
      
      {/* Near background layer */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          y: useTransform(activeProgress, [0, 1], [0, -150]),
          background: `conic-gradient(from 180deg at 50% 50%, 
            transparent 0%, 
            rgba(226, 126, 0, 0.03) 25%, 
            transparent 50%, 
            rgba(226, 126, 0, 0.03) 75%, 
            transparent 100%
          )`
        }}
      />
    </div>
  );
}

// Ambient shadows that follow elements
export function AmbientShadows({ children, className = "" }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const shadowX = (mousePos.x - window.innerWidth / 2) / 50;
  const shadowY = (mousePos.y - window.innerHeight / 2) / 50;

  return (
    <div 
      className={`relative ${className}`}
      style={{
        filter: `drop-shadow(${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.3))`
      }}
    >
      {children}
    </div>
  );
}