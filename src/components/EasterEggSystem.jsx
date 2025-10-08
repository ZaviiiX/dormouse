import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";

/**
 * Easter Egg Discovery System
 * Hidden interactive elements that reward users with special animations and effects
 */

// Easter egg locations and configurations
const EASTER_EGGS = [
  {
    id: 'dormouse-click',
    type: 'click',
    target: 'dormouse',
    reward: 'coin-shower',
    message: 'You found sleeping beauty! 💤',
    achievement: 'Dormouse Whisperer'
  },
  {
    id: 'konami-code',
    type: 'sequence',
    sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'],
    reward: 'matrix-rain',
    message: 'Konami Code activated! 🎮',
    achievement: 'Code Master'
  },
  {
    id: 'triple-click-logo',
    type: 'multiclick',
    target: 'logo',
    clickCount: 3,
    timeWindow: 1000,
    reward: 'disco-mode',
    message: 'Party mode activated! 🕺',
    achievement: 'Party Animal'
  },
  {
    id: 'scroll-speed',
    type: 'scroll',
    condition: 'fast-scroll',
    reward: 'speed-lines',
    message: 'Gotta go fast! 💨',
    achievement: 'Speed Demon'
  }
];

/**
 * Achievement notification component
 */
function AchievementNotification({ achievement, message, onClose }) {
  return (
    <motion.div
      className="fixed top-4 right-4 z-[200] bg-gradient-to-r from-brand to-orange-400 text-white p-4 rounded-lg shadow-xl max-w-sm"
      initial={{ x: 300, opacity: 0, scale: 0.8 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 300, opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="flex items-center gap-3"
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="text-2xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
        >
          🏆
        </motion.div>
        <div>
          <h3 className="font-bold text-sm">Achievement Unlocked!</h3>
          <p className="text-xs opacity-90">{achievement}</p>
          <p className="text-xs mt-1 opacity-75">{message}</p>
        </div>
      </motion.div>
      
      {/* Auto-close timer */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 5, ease: "linear" }}
        onAnimationComplete={onClose}
      />
    </motion.div>
  );
}

/**
 * Coin shower effect
 */
function CoinShower() {
  // Generate fixed random values to prevent flickering
  const coins = useMemo(() => 
    [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 4 + Math.random() * 3,
      delay: i * 0.15,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[150]">
      {coins.map((coin) => (
        <motion.div
          key={coin.id}
          className="absolute text-2xl"
          style={{
            left: `${coin.left}%`,
            top: "-50px",
          }}
          initial={{ y: -50, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 50,
            rotate: 360 * 3,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: coin.duration,
            delay: coin.delay,
            ease: "easeIn",
          }}
        >
          🪙
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Matrix rain effect
 */
function MatrixRain() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[150] bg-black/80">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-green-400 font-mono text-sm opacity-60"
          style={{
            left: `${(i * 2) % 100}%`,
            top: "-20px",
          }}
          initial={{ y: -20 }}
          animate={{ y: window.innerHeight + 20 }}
          transition={{
            duration: 1 + Math.random() * 2,
            delay: i * 0.05,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {String.fromCharCode(0x30A0 + Math.random() * 96)}
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Disco mode effect
 */
function DiscoMode() {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[150]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-20 h-20 rounded-full"
          style={{
            background: `hsl(${Math.random() * 360}, 70%, 50%)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  );
}

/**
 * Speed lines effect
 */
function SpeedLines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[150]">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-0.5 bg-white"
          style={{
            width: `${50 + Math.random() * 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            rotate: `${Math.random() * 360}deg`,
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 1] }}
          transition={{
            duration: 0.5,
            delay: i * 0.02,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Main Easter Egg System
 */
export function EasterEggSystem() {
  const [achievements, setAchievements] = useState([]);
  const [activeEffects, setActiveEffects] = useState([]);
  const [discoveredEggs, setDiscoveredEggs] = useState(new Set());
  
  // Tracking states
  const [keySequence, setKeySequence] = useState([]);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [lastScrollTime, setLastScrollTime] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(0);

  // Konami code detection
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeySequence(prev => {
        const newSequence = [...prev, e.code].slice(-10);
        const konamiCode = EASTER_EGGS.find(egg => egg.id === 'konami-code');
        
        if (newSequence.join(',') === konamiCode.sequence.join(',')) {
          triggerEasterEgg('konami-code');
          return [];
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll speed detection
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      const timeDiff = now - lastScrollTime;
      
      if (timeDiff > 0) {
        const currentSpeed = Math.abs(window.scrollY - (window.lastScrollY || 0)) / timeDiff;
        setScrollSpeed(currentSpeed);
        
        if (currentSpeed > 2) { // Fast scroll threshold
          triggerEasterEgg('scroll-speed');
        }
      }
      
      window.lastScrollY = window.scrollY;
      setLastScrollTime(now);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTime]);

  const triggerEasterEgg = (eggId, data = {}) => {
    if (discoveredEggs.has(eggId)) return;
    
    const egg = EASTER_EGGS.find(e => e.id === eggId);
    if (!egg) return;
    
    setDiscoveredEggs(prev => new Set([...prev, eggId]));
    
    // Show achievement
    const achievementId = Date.now();
    setAchievements(prev => [...prev, { 
      id: achievementId, 
      achievement: egg.achievement, 
      message: egg.message 
    }]);
    
    // Trigger effect
    const effectId = Date.now() + 1;
    setActiveEffects(prev => [...prev, { 
      id: effectId, 
      type: egg.reward, 
      data 
    }]);
    
    // Remove effect after duration
    setTimeout(() => {
      setActiveEffects(prev => prev.filter(effect => effect.id !== effectId));
    }, 3000);
  };

  const removeAchievement = (id) => {
    setAchievements(prev => prev.filter(achievement => achievement.id !== id));
  };

  // Expose trigger functions for external components
  useEffect(() => {
    window.triggerEasterEgg = triggerEasterEgg;
    return () => {
      delete window.triggerEasterEgg;
    };
  }, []);

  return (
    <>
      {/* Achievement notifications */}
      <AnimatePresence>
        {achievements.map((achievement) => (
          <AchievementNotification
            key={achievement.id}
            achievement={achievement.achievement}
            message={achievement.message}
            onClose={() => removeAchievement(achievement.id)}
          />
        ))}
      </AnimatePresence>

      {/* Active effects */}
      <AnimatePresence>
        {activeEffects.map((effect) => {
          switch (effect.type) {
            case 'coin-shower':
              return <CoinShower key={effect.id} />;
            case 'matrix-rain':
              return <MatrixRain key={effect.id} />;
            case 'disco-mode':
              return <DiscoMode key={effect.id} />;
            case 'speed-lines':
              return <SpeedLines key={effect.id} />;
            default:
              return null;
          }
        })}
      </AnimatePresence>
    </>
  );
}