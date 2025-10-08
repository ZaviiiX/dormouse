import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";

/**
 * Advanced Interactive Elements for premium scrollytelling UX
 * Includes magnetic buttons, hover effects, easter eggs, and gesture controls
 */

// Magnetic button that attracts cursor
export function MagneticButton({ children, className = "", onClick, ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });
  const springScale = useSpring(scale, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Magnetic effect within 100px radius
    if (distance < 100) {
      const force = Math.max(0, 1 - distance / 100);
      x.set(deltaX * force * 0.3);
      y.set(deltaY * force * 0.3);
      scale.set(1 + force * 0.1);
    } else {
      x.set(0);
      y.set(0);
      scale.set(1);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  return (
    <motion.button
      ref={ref}
      className={`relative overflow-hidden transition-shadow duration-300 ${className}`}
      style={{
        x: springX,
        y: springY,
        scale: springScale
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-brand/20 rounded-full scale-0"
        whileTap={{
          scale: [0, 2, 0],
          opacity: [0.5, 0.8, 0]
        }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-brand/30 via-transparent to-transparent opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// Interactive hover zones with Easter eggs
export function EasterEggZone({ children, onTrigger, hint = "" }) {
  const [isDiscovered, setIsDiscovered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const hoverCount = useRef(0);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    hoverCount.current++;
    
    // Show hint after 3 hovers
    if (hoverCount.current === 3 && !isDiscovered) {
      setShowHint(true);
      timeoutRef.current = setTimeout(() => setShowHint(false), 3000);
    }
    
    // Trigger easter egg after 5 hovers
    if (hoverCount.current === 5 && !isDiscovered) {
      setIsDiscovered(true);
      onTrigger?.();
      setShowHint(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative">
      <motion.div
        onMouseEnter={handleMouseEnter}
        whileHover={!isDiscovered ? { scale: 1.02 } : {}}
        className="cursor-pointer"
      >
        {children}
      </motion.div>
      
      {/* Hint tooltip */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap"
        >
          {hint}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90" />
        </motion.div>
      )}
      
      {/* Discovery effect */}
      {isDiscovered && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-brand rounded-full flex items-center justify-center text-white text-xs"
        >
          ✨
        </motion.div>
      )}
    </div>
  );
}

// Scroll snap system for smooth section navigation
export function useScrollSnap(sections = []) {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    if (sections.length === 0) return;

    const handleScroll = () => {
      const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const sectionIndex = Math.round(scrollProgress * (sections.length - 1));
      setCurrentSection(Math.max(0, Math.min(sections.length - 1, sectionIndex)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections.length]);

  const scrollToSection = (index) => {
    if (index < 0 || index >= sections.length) return;
    
    const targetProgress = index / (sections.length - 1);
    const targetScroll = targetProgress * (document.body.scrollHeight - window.innerHeight);
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  return { currentSection, scrollToSection, totalSections: sections.length };
}

// Mobile gesture controls
export function useGestureControls() {
  const [gestureState, setGestureState] = useState({
    isSwipeLeft: false,
    isSwipeRight: false,
    isPinching: false
  });

  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let initialDistance = 0;

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialDistance = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && initialDistance > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);
        
        setGestureState(prev => ({
          ...prev,
          isPinching: Math.abs(currentDistance - initialDistance) > 50
        }));
      }
    };

    const handleTouchEnd = (e) => {
      if (e.changedTouches.length === 1) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Detect horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
          if (deltaX > 0) {
            setGestureState(prev => ({ ...prev, isSwipeRight: true }));
            setTimeout(() => setGestureState(prev => ({ ...prev, isSwipeRight: false })), 300);
          } else {
            setGestureState(prev => ({ ...prev, isSwipeLeft: true }));
            setTimeout(() => setGestureState(prev => ({ ...prev, isSwipeLeft: false })), 300);
          }
        }
      }
      
      setGestureState(prev => ({ ...prev, isPinching: false }));
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return gestureState;
}

// Enhanced hover effects for any element
export function HoverGlow({ children, className = "", glowColor = "#E27E00" }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor}40 0%, transparent 70%)`,
          filter: 'blur(10px)',
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.1 : 0.95
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Content */}
      <motion.div
        className="relative z-10"
        animate={{
          y: isHovered ? -2 : 0
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Interactive floating action button
export function FloatingActionButton({ 
  icon, 
  onClick, 
  className = "",
  position = { bottom: 24, right: 24 }
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="fixed z-50 pointer-events-auto"
      style={position}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.button
        className={`w-14 h-14 bg-brand rounded-full shadow-xl flex items-center justify-center text-white ${className}`}
        onClick={() => {
          setIsExpanded(!isExpanded);
          onClick?.();
        }}
        animate={{
          rotate: isExpanded ? 45 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {icon || '⚡'}
      </motion.button>
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-brand"
        animate={{
          scale: [1, 2],
          opacity: [0.8, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
    </motion.div>
  );
}