import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

/**
 * Mobile Gesture Controls System
 * Adds swipe gestures, pinch interactions, and touch-based animations for mobile devices
 */

/**
 * Hook for detecting mobile device
 */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

/**
 * Swipe Gesture Detector
 */
export function SwipeGestureDetector({ onSwipe, children, className = "" }) {
  const isMobile = useIsMobile();
  const [isActive, setIsActive] = useState(false);

  const handlePanEnd = (event, info) => {
    const { offset, velocity } = info;
    const swipeThreshold = 50;
    const velocityThreshold = 500;

    // Determine swipe direction
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe
      if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
        onSwipe?.('right');
      } else if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
        onSwipe?.('left');
      }
    } else {
      // Vertical swipe  
      if (offset.y > swipeThreshold || velocity.y > velocityThreshold) {
        onSwipe?.('down');
      } else if (offset.y < -swipeThreshold || velocity.y < -velocityThreshold) {
        onSwipe?.('up');
      }
    }

    setIsActive(false);
  };

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={`${className} ${isActive ? 'touch-active' : ''}`}
      onPanStart={() => setIsActive(true)}
      onPanEnd={handlePanEnd}
      style={{
        touchAction: 'pan-x pan-y',
        background: isActive ? 'rgba(255, 140, 0, 0.05)' : 'transparent',
        transition: 'background 0.2s ease'
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Touch Ripple Effect
 */
export function TouchRipple({ children, className = "" }) {
  const [ripples, setRipples] = useState([]);
  const isMobile = useIsMobile();

  const handleTouch = (event) => {
    if (!isMobile) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.touches[0].clientX - rect.left;
    const y = event.touches[0].clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onTouchStart={handleTouch}
    >
      {children}
      
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute pointer-events-none rounded-full bg-brand/20"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          initial={{
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            opacity: 1,
          }}
          animate={{
            width: 200,
            height: 200,
            x: -100,
            y: -100,
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/**
 * Pinch to Zoom Handler
 */
export function PinchZoomHandler({ children, onPinch, maxScale = 2, minScale = 0.5 }) {
  const [scale, setScale] = useState(1);
  const [initialDistance, setInitialDistance] = useState(0);
  const isMobile = useIsMobile();

  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (event) => {
    if (!isMobile || event.touches.length !== 2) return;
    setInitialDistance(getDistance(event.touches));
  };

  const handleTouchMove = (event) => {
    if (!isMobile || event.touches.length !== 2 || initialDistance === 0) return;
    
    event.preventDefault();
    const currentDistance = getDistance(event.touches);
    const scaleChange = currentDistance / initialDistance;
    const newScale = Math.min(maxScale, Math.max(minScale, scaleChange));
    
    setScale(newScale);
    onPinch?.(newScale);
  };

  const handleTouchEnd = () => {
    setInitialDistance(0);
    setScale(1);
    onPinch?.(1);
  };

  if (!isMobile) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      style={{ scale }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Long Press Detector
 */
export function LongPressDetector({ onLongPress, children, duration = 800, className = "" }) {
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef(null);
  const isMobile = useIsMobile();

  const handleTouchStart = () => {
    if (!isMobile) return;
    
    setIsPressed(true);
    timeoutRef.current = setTimeout(() => {
      onLongPress?.();
      setIsPressed(false);
    }, duration);
  };

  const handleTouchEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPressed(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={`${className} ${isPressed ? 'long-pressing' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      animate={{
        scale: isPressed ? 0.95 : 1,
        opacity: isPressed ? 0.8 : 1,
      }}
      transition={{ duration: 0.1 }}
      style={{
        background: isPressed ? 'rgba(255, 140, 0, 0.1)' : 'transparent',
      }}
    >
      {children}
      
      {/* Long press progress indicator */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 border-2 border-brand rounded-inherit pointer-events-none"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, rgba(255, 140, 0, 0.3) 360deg)`,
          }}
        >
          <motion.div
            className="absolute inset-0 bg-brand/20 rounded-inherit"
            initial={{ clipPath: 'polygon(50% 50%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%)' }}
            animate={{ 
              clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)'
            }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * Mobile Navigation Gestures
 */
export function MobileNavigationGestures({ onNavigate }) {
  const isMobile = useIsMobile();

  const handleSwipe = (direction) => {
    // Navigate based on swipe direction
    switch (direction) {
      case 'left':
        // Swipe left to go to next section
        onNavigate?.('next');
        break;
      case 'right':
        // Swipe right to go to previous section  
        onNavigate?.('prev');
        break;
      case 'up':
        // Swipe up to scroll down faster
        window.scrollBy({ top: window.innerHeight * 0.5, behavior: 'smooth' });
        break;
      case 'down':
        // Swipe down to scroll up faster
        window.scrollBy({ top: -window.innerHeight * 0.5, behavior: 'smooth' });
        break;
    }

    // Trigger haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  if (!isMobile) {
    return null;
  }

  return (
    <SwipeGestureDetector
      onSwipe={handleSwipe}
      className="fixed inset-0 z-[60] pointer-events-none"
      style={{ pointerEvents: 'auto' }}
    />
  );
}

/**
 * Touch-Enhanced Button for mobile
 */
export function TouchButton({ children, onClick, className = "", ...props }) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <button onClick={onClick} className={className} {...props}>
        {children}
      </button>
    );
  }

  return (
    <TouchRipple className={className}>
      <LongPressDetector onLongPress={() => console.log('Long press detected!')}>
        <motion.button
          onClick={onClick}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          style={{
            touchAction: 'manipulation', // Prevents double-tap zoom
          }}
          {...props}
        >
          {children}
        </motion.button>
      </LongPressDetector>
    </TouchRipple>
  );
}

/**
 * Main Mobile Gesture System Component
 */
export function MobileGestureSystem() {
  const isMobile = useIsMobile();

  const handleNavigation = (direction) => {
    console.log(`Mobile navigation: ${direction}`);
    
    // Add visual feedback
    if (window.triggerEasterEgg) {
      // Could trigger special mobile gestures easter egg
    }
  };

  if (!isMobile) {
    return null;
  }

  return (
    <>
      <MobileNavigationGestures onNavigate={handleNavigation} />
      
      {/* Mobile gesture hints (show briefly on first visit) */}
      <motion.div
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 
                   bg-black/80 text-white px-4 py-2 rounded-lg text-sm pointer-events-none"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 3 }}
      >
        💫 Swipe to navigate • Long press for interactions
      </motion.div>
    </>
  );
}