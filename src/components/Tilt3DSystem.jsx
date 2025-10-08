import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";

/**
 * 3D Tilt Effects System
 * Creates depth perception illusions that respond to mouse movement
 */

/**
 * 3D Tilt Container - Main component for 3D tilt effects
 */
export function TiltContainer({ 
  children, 
  className = "",
  tiltStrength = 15,
  perspective = 1000,
  glareIntensity = 0.2,
  shadowIntensity = 0.3,
  scaleOnHover = 1.02,
  enableGlare = true,
  enableShadow = true,
  resetOnLeave = true,
  ...props 
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [bounds, setBounds] = useState(null);
  const containerRef = useRef(null);

  // Motion values for smooth tilt animation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring animation for smooth movement
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [tiltStrength, -tiltStrength]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-tiltStrength, tiltStrength]), springConfig);
  
  // Scale effect
  const scale = useSpring(isHovering ? scaleOnHover : 1, springConfig);
  
  // Glare effect positioning
  const glareX = useTransform(mouseX, [0, 1], [0, 100]);
  const glareY = useTransform(mouseY, [0, 1], [0, 100]);
  const glareOpacity = useTransform([mouseX, mouseY], ([x, y]) => {
    const distance = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);
    return isHovering ? Math.max(0, glareIntensity - distance * glareIntensity) : 0;
  });

  // Shadow positioning
  const shadowX = useTransform(mouseX, [0, 1], [-20, 20]);
  const shadowY = useTransform(mouseY, [0, 1], [-20, 20]);
  const shadowBlur = useTransform([mouseX, mouseY], ([x, y]) => {
    const distance = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);
    return 10 + distance * 20;
  });

  // Update bounds when component mounts or resizes
  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setBounds(rect);
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  // Mouse move handler
  const handleMouseMove = (event) => {
    if (!bounds) return;

    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    mouseX.set(x);
    mouseY.set(y);
  };

  // Mouse enter handler
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  // Mouse leave handler
  const handleMouseLeave = () => {
    setIsHovering(false);
    if (resetOnLeave) {
      mouseX.set(0.5);
      mouseY.set(0.5);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative transform-gpu ${className}`}
      style={{
        perspective,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Main tilt container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full"
      >
        {children}
        
        {/* Glare effect */}
        {enableGlare && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-inherit overflow-hidden"
            style={{
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, ${glareOpacity}) 0%, transparent 50%)`,
              opacity: glareOpacity,
            }}
          />
        )}
      </motion.div>

      {/* Dynamic shadow */}
      {enableShadow && (
        <motion.div
          className="absolute inset-0 -z-10 rounded-inherit"
          style={{
            background: `rgba(0, 0, 0, ${shadowIntensity})`,
            filter: `blur(${shadowBlur}px)`,
            transform: `translate(${shadowX}px, ${shadowY}px) translateZ(-50px)`,
          }}
        />
      )}
    </motion.div>
  );
}

/**
 * 3D Card Component - Pre-configured tilt container for cards
 */
export function TiltCard({ children, className = "", intensity = "medium", ...props }) {
  const intensitySettings = {
    low: { tiltStrength: 8, glareIntensity: 0.1, shadowIntensity: 0.2 },
    medium: { tiltStrength: 15, glareIntensity: 0.2, shadowIntensity: 0.3 },
    high: { tiltStrength: 25, glareIntensity: 0.3, shadowIntensity: 0.4 },
  };

  const settings = intensitySettings[intensity] || intensitySettings.medium;

  return (
    <TiltContainer
      className={`bg-cave2/80 backdrop-blur-sm border border-white/10 rounded-xl ${className}`}
      {...settings}
      {...props}
    >
      {children}
    </TiltContainer>
  );
}

/**
 * Layered 3D Effect - Creates depth with multiple layers
 */
export function Layered3D({ layers, className = "", baseDepth = 50 }) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ perspective: 1000 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
    >
      {layers.map((layer, index) => {
        const depth = baseDepth + (index * 20);
        const translateX = useTransform(mouseX, [0, 1], [-depth/4, depth/4]);
        const translateY = useTransform(mouseY, [0, 1], [-depth/4, depth/4]);
        const rotateX = useTransform(mouseY, [0, 1], [5, -5]);
        const rotateY = useTransform(mouseX, [0, 1], [-5, 5]);

        return (
          <motion.div
            key={index}
            className="absolute inset-0"
            style={{
              translateX,
              translateY,
              rotateX,
              rotateY,
              translateZ: depth,
              transformStyle: "preserve-3d",
            }}
          >
            {layer}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/**
 * Floating 3D Element - Element that floats and tilts in 3D space
 */
export function Floating3D({ 
  children, 
  className = "",
  floatStrength = 10,
  rotationStrength = 5,
  speed = 2,
  ...props 
}) {
  return (
    <motion.div
      className={`transform-gpu ${className}`}
      animate={{
        y: [-floatStrength, floatStrength, -floatStrength],
        rotateX: [-rotationStrength, rotationStrength, -rotationStrength],
        rotateY: [-rotationStrength/2, rotationStrength/2, -rotationStrength/2],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parallax 3D Layers - Creates parallax effect with 3D depth
 */
export function Parallax3D({ children, layers = [], intensity = 1, className = "" }) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{ perspective: 1200 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
      }}
      onMouseLeave={() => {
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
    >
      {/* Background layers */}
      {layers.map((layer, index) => {
        const depth = (index + 1) * 100 * intensity;
        const translateX = useTransform(mouseX, [0, 1], [-depth/10, depth/10]);
        const translateY = useTransform(mouseY, [0, 1], [-depth/15, depth/15]);

        return (
          <motion.div
            key={index}
            className="absolute inset-0"
            style={{
              translateX,
              translateY,
              translateZ: -depth,
              transformStyle: "preserve-3d",
            }}
          >
            {layer}
          </motion.div>
        );
      })}
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * Mouse-Reactive 3D Scene
 */
export function MouseReactive3D({ children, className = "" }) {
  const sceneRef = useRef(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Global scene rotation based on mouse position
  const sceneRotateX = useTransform(mouseY, [0, 1], [3, -3]);
  const sceneRotateY = useTransform(mouseX, [0, 1], [-3, 3]);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={sceneRef}
      className={`transform-gpu ${className}`}
      style={{
        perspective: 1500,
        rotateX: sceneRotateX,
        rotateY: sceneRotateY,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * 3D Enhanced ContentBox - Adds 3D effects to ContentBox
 */
export function TiltContentBox({ children, ...props }) {
  return (
    <TiltCard intensity="medium" className="backdrop-blur-md">
      {children}
    </TiltCard>
  );
}