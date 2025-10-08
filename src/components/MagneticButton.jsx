import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * MagneticButton - Button that attracts cursor with magnetic field effect
 * Creates smooth attraction when cursor is within magnetic field radius
 */
export function MagneticButton({ 
  children, 
  magneticStrength = 0.4,
  magneticRadius = 150,
  className = "",
  onClick,
  disabled = false,
  ...props 
}) {
  const buttonRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [buttonBounds, setButtonBounds] = useState(null);

  // Motion values for smooth magnetic animation
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring animation for smooth magnetic movement
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  // Scale effect when magnetized
  const scale = useTransform(
    [springX, springY],
    ([latestX, latestY]) => {
      const distance = Math.sqrt(latestX * latestX + latestY * latestY);
      return distance > 5 ? 1.05 : 1;
    }
  );

  // Update button bounds when component mounts or resizes
  useEffect(() => {
    const updateBounds = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setButtonBounds({
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
          centerX: rect.left + rect.width / 2 + window.scrollX,
          centerY: rect.top + rect.height / 2 + window.scrollY,
        });
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  // Magnetic field effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!buttonBounds || disabled) return;

      const { centerX, centerY } = buttonBounds;
      const mouseX = e.clientX + window.scrollX;
      const mouseY = e.clientY + window.scrollY;

      // Calculate distance from cursor to button center
      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < magneticRadius) {
        // Within magnetic field - apply attraction
        const strength = Math.min(1, (magneticRadius - distance) / magneticRadius);
        const attractionX = deltaX * magneticStrength * strength;
        const attractionY = deltaY * magneticStrength * strength;
        
        x.set(attractionX);
        y.set(attractionY);
        setIsHovering(true);
      } else {
        // Outside magnetic field - return to center
        x.set(0);
        y.set(0);
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [buttonBounds, x, y, magneticRadius, magneticStrength, disabled]);

  // Reset position when mouse leaves window
  useEffect(() => {
    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
      setIsHovering(false);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [x, y]);

  return (
    <div className="relative inline-block">
      {/* Enhanced magnetic field visualization */}
      {isHovering && (
        <>
          {/* Subtle outer glow */}
          <motion.div
            className="absolute inset-0 rounded-inherit pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(255, 140, 0, 0.1) 0%, rgba(255, 140, 0, 0.05) 40%, transparent 70%)",
              width: magneticRadius * 1.5,
              height: magneticRadius * 1.5,
              left: '50%',
              top: '50%',
              marginLeft: -magneticRadius * 0.75,
              marginTop: -magneticRadius * 0.75,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Magnetic field rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border border-brand/15 rounded-full pointer-events-none"
              style={{
                width: 40 + (i * 15),
                height: 40 + (i * 15),
                left: '50%',
                top: '50%',
                marginLeft: -(20 + (i * 7.5)),
                marginTop: -(20 + (i * 7.5)),
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0, 0.6, 0],
                scale: [0.5, 1.2, 1.5],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}

      {/* Magnetic button */}
      <motion.button
        ref={buttonRef}
        className={`
          relative z-10 transition-all duration-300 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        style={{
          x: springX,
          y: springY,
          scale,
        }}
        onClick={disabled ? undefined : onClick}
        whileHover={{ 
          boxShadow: "0 10px 30px rgba(255, 140, 0, 0.3)",
          borderColor: "rgba(255, 140, 0, 0.8)",
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {children}
        
        {/* Refined magnetic field particles effect */}
        {isHovering && (
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-brand/70 rounded-full"
                style={{
                  left: `${25 + (i * 15)}%`,
                  top: `${40 + (i % 2) * 20}%`,
                }}
                animate={{
                  x: [0, Math.sin(i) * 8, 0],
                  y: [0, Math.cos(i) * 8, 0],
                  opacity: [0.7, 1, 0.7],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5 + (i * 0.2),
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}

/**
 * MagneticLink - Magnetic version of links
 */
export function MagneticLink({ 
  href, 
  children, 
  magneticStrength = 0.3,
  magneticRadius = 100,
  className = "",
  ...props 
}) {
  return (
    <MagneticButton
      as="a"
      href={href}
      magneticStrength={magneticStrength}
      magneticRadius={magneticRadius}
      className={`inline-flex items-center ${className}`}
      {...props}
    >
      {children}
    </MagneticButton>
  );
}