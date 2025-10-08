import { motion, useTransform, useMotionValue } from "framer-motion";
import { useState, useEffect } from "react";
import caveBg from "/images/hero_coins.png";
import dormouseSleep from "/images/dormouse_sleep.png";
import { Roadmap } from "./components/Roadmap";
import { DormouseAnimation } from "./components/DormouseAnimation";
import { ClockAnimation } from "./components/ClockAnimation";
import { SleepingEffects } from "./components/SleepingEffects";
import { RocketAnimation } from "./components/RocketAnimation";
import { ContentBox } from "./components/ContentBox";
import { SubtleCursorTrail } from "./components/SubtleCursorTrail";
import { ParallaxLayers } from "./components/ParallaxLayers";
import { MorphingShapes } from "./components/MorphingShapes";
import { CursorTrail } from "./components/CursorTrail";
import { SocialSection } from "./components/SocialSection";
import { PremiumLoader } from "./components/PremiumLoader";
import { AnimationController } from "./components/AnimationController";
import { ScrollRevealContent } from "./components/ScrollRevealContent";
import { EasterEggSystem } from "./components/EasterEggSystem";
import { MobileGestureSystem } from "./components/MobileGestureSystem";
import { MouseReactive3D } from "./components/Tilt3DSystem";
import { DynamicLightingSystem } from "./components/DynamicLightingSystem";
import { ScrollProgressBar } from "./components/ScrollProgressBar";
import { TimelineNav } from "./components/TimelineNav";
import { ScrollHint } from "./components/ScrollHint";
import { useBreakpoint, useWindowHeight, useScrollAnimation, useFramePreloader } from "./hooks";
import { CONTRACT_ADDRESS, BUY_URL, ROADMAP_CONFIG, CONTENT_TIMELINE } from "./constants";

export default function App() {
  // Simplified loading state
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  
  const { activeProgress } = useScrollAnimation(isLoading, { content: !isLoading }); // Force 0 during loading
  const breakpoint = useBreakpoint();
  const windowHeight = useWindowHeight();
  
  // Mouse tracking for inline cursor effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Preload animation frames for better performance
  useFramePreloader();

  // Simple loading completion with animated progress
  useEffect(() => {
    // Animate loading progress from 0 to 100
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Simulate realistic loading with varying speeds
        const increment = Math.random() * 8 + 2; // Random between 2-10
        return Math.min(prev + increment, 100);
      });
    }, 150); // Update every 150ms

    const timer = setTimeout(() => {
      setLoadingProgress(100); // Ensure it reaches 100%
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        setIsLoading(false);
      }, 500); // Small delay after reaching 100%
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  // Text opacity animations - using motion values for better control
  const sleepTextOpacity = useMotionValue(0);
  const wakeTextOpacity = useMotionValue(0);
  const readyTextOpacity = useMotionValue(0);

  // Control text opacity based on loading state and scroll progress
  useEffect(() => {
    if (isLoading) {
      // Force all to 0 during loading
      sleepTextOpacity.set(0);
      wakeTextOpacity.set(0);
      readyTextOpacity.set(0);
      console.log('🔒 All text opacity forced to 0 (loading)');
    } else {
      // Add a small delay to ensure activeProgress is stable
      const timer = setTimeout(() => {
        const progress = activeProgress.get();
        
        // Only calculate if progress seems reasonable (not 1 immediately after loading)
        if (progress < 0.1) {
          sleepTextOpacity.set(1); // Only sleep text should be visible at start
          wakeTextOpacity.set(0);
          readyTextOpacity.set(0);
        } else {
          // Suspicious high progress right after loading - keep all at 0
          sleepTextOpacity.set(0);
          wakeTextOpacity.set(0);
          readyTextOpacity.set(0);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, activeProgress, sleepTextOpacity, wakeTextOpacity, readyTextOpacity]);

  // Subscribe to activeProgress changes to update text opacity
  useEffect(() => {
    const unsubscribe = activeProgress.onChange(() => {
      if (!isLoading) {
        const progress = activeProgress.get();
        setCurrentProgress(progress); // Update state for reactive rendering
        
        // Sleep text: visible at start (0-0.22), fades out
        if (progress <= 0.15) {
          sleepTextOpacity.set(1);
        } else if (progress <= 0.22) {
          const fadeOut = 1 - ((progress - 0.15) / (0.22 - 0.15));
          sleepTextOpacity.set(Math.max(0, Math.min(1, fadeOut)));
        } else {
          sleepTextOpacity.set(0);
        }
        
        // Wake text: only during specific range
        const wakeStart = CONTENT_TIMELINE[1].start;
        const wakeEnd = CONTENT_TIMELINE[1].end;
        if (progress >= wakeStart && progress <= wakeEnd) {
          if (progress <= wakeStart + 0.04) {
            const fadeIn = (progress - wakeStart) / 0.04;
            wakeTextOpacity.set(Math.max(0, Math.min(1, fadeIn)));
          } else if (progress >= wakeEnd - 0.02) {
            const fadeOut = 1 - ((progress - (wakeEnd - 0.02)) / 0.02);
            wakeTextOpacity.set(Math.max(0, Math.min(1, fadeOut)));
          } else {
            wakeTextOpacity.set(1);
          }
        } else {
          wakeTextOpacity.set(0);
        }
        
        // Ready text: only at the very end (98%+) with strict check
        const readyStart = 0.98; // Much stricter threshold
        if (progress >= readyStart && progress >= 0.98) { // Double safety check
          const fadeIn = (progress - readyStart) / (1 - readyStart);
          readyTextOpacity.set(Math.max(0, Math.min(1, fadeIn)));
        } else {
          readyTextOpacity.set(0);
        }
      }
    });
    
    return unsubscribe;
  }, [isLoading, activeProgress, sleepTextOpacity, wakeTextOpacity, readyTextOpacity]);

  // Debug logging
  useEffect(() => {
    console.log('App rendered with isLoading:', isLoading);
    console.log('Active progress value:', activeProgress.get());
    console.log('Ready text opacity:', readyTextOpacity.get());
  });

  // Additional debug for ready text opacity
  useEffect(() => {
    const unsubscribe = readyTextOpacity.onChange((value) => {
      // Production ready - no debug logs
    });
    return unsubscribe;
  }, [readyTextOpacity, isLoading]);

  return (
    <div className="relative">
      {/* Enhanced Loading Screen with Progress Bar */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-cave2 via-cave to-black flex items-center justify-center">
          <div className="text-center max-w-md w-full px-8">
            {/* Dormouse Sleep Image */}
            <motion.div 
              className="mb-6 flex justify-center"
              animate={{ 
                scale: [1, 1.05, 1],
                y: [0, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img 
                src={dormouseSleep} 
                alt="Sleeping Dormouse" 
                className="w-24 h-24 object-contain filter drop-shadow-lg"
              />
            </motion.div>
            
            {/* Title */}
            <motion.h2 
              className="text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Dormouse Web
            </motion.h2>
            
            {/* Subtitle */}
            <motion.p 
              className="text-white/70 mb-8 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Preparing your cozy crypto den...
            </motion.p>
            
            {/* Progress Bar Container */}
            <motion.div 
              className="w-full mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Progress Bar Background */}
              <div className="w-full bg-black/30 rounded-full h-3 mb-3 border border-brand/20">
                {/* Progress Bar Fill */}
                <motion.div 
                  className="bg-gradient-to-r from-brand via-orange-400 to-brand h-full rounded-full relative overflow-hidden"
                  style={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              </div>
              
              {/* Progress Percentage */}
              <motion.div 
                className="flex justify-between items-center text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <span className="text-white/60">Loading assets...</span>
                <span className="text-brand font-bold text-lg">
                  {Math.round(loadingProgress)}%
                </span>
              </motion.div>
            </motion.div>
            
            {/* Loading Status Messages */}
            <motion.div 
              className="text-white/50 text-sm h-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {loadingProgress < 30 && "Waking up the dormouse..."}
              {loadingProgress >= 30 && loadingProgress < 60 && "Loading crypto coins..."}
              {loadingProgress >= 60 && loadingProgress < 90 && "Preparing the cave..."}
              {loadingProgress >= 90 && loadingProgress < 100 && "Almost ready..."}
              {loadingProgress >= 100 && "Ready to nap! 🌙"}
            </motion.div>
          </div>
        </div>
      )}

      {/* Main Application Content */}
      {!isLoading && (
        <>
          {/* Top progress indicator */}
          <ScrollProgressBar progress={activeProgress} />
          {/* Chapter navigation dots (right side) */}
          <TimelineNav progress={activeProgress} />
          {/* Scroll onboarding hint */}
          <ScrollHint progress={activeProgress} />
          {/* Clean background */}
          <div
            className="fixed inset-0 z-0"
            style={{
              backgroundImage: `url(${caveBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/40" />
          </div>

      {/* Premium effect layers */}
      <ParallaxLayers scrollProgress={activeProgress} />
      <MorphingShapes activeProgress={activeProgress} />
      
      {/* Premium cursor trail */}
      <div 
        className="fixed pointer-events-none"
        style={{
          left: mousePos.x - 16,
          top: mousePos.y - 16,
          zIndex: 9999,
          width: 32,
          height: 32,
          background: 'radial-gradient(circle, #E27E00 0%, rgba(226, 126, 0, 0.4) 60%, transparent 90%)',
          borderRadius: '50%',
          filter: 'blur(6px)',
          opacity: 0.8
        }}
      />

      {/* Premium floating particles */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none w-4 h-4 bg-brand/80 rounded-full"
          style={{
            left: `${25 + i * 15}%`,
            top: `${35 + i * 10}%`,
            zIndex: 9998,
            filter: 'blur(1px)',
            boxShadow: '0 0 8px rgba(226, 126, 0, 0.3)'
          }}
          animate={{
            y: [0, -35, 0],
            opacity: [0.5, 0.9, 0.5],
            scale: [1, 1.4, 1]
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Enhanced cursor trail component */}
      <CursorTrail />
      <SubtleCursorTrail />

      {/* Core animations */}
      <DormouseAnimation 
        activeProgress={activeProgress} 
        breakpoint={breakpoint} 
      />
      
      <ClockAnimation 
        activeProgress={activeProgress} 
        windowHeight={windowHeight} 
      />
      
      <SleepingEffects activeProgress={activeProgress} />
      
      <RocketAnimation activeProgress={activeProgress} />

      {/* Scroll-based content reveal system */}
      <ScrollRevealContent 
        activeProgress={activeProgress} 
        isLoading={isLoading} 
      />

      {/* Social Section - bottom bar style */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
      >
        <SocialSection 
          scrollProgress={activeProgress}
          startAt={0.9}
          endAt={1}
        />
      </motion.div>
        </>
      )}

      
      {/* ContentBox components removed - will be handled by scroll-based reveal system */}

      <Roadmap 
        progress={activeProgress} 
        start={ROADMAP_CONFIG.start} 
        end={ROADMAP_CONFIG.end} 
      />

      {/* Ready to Moon ContentBox removed - will be handled by scroll-based reveal system */}

      {/* Scroll height */}
      <div className="h-[400vh]" />

      {/* Easter Egg Discovery System */}
      <EasterEggSystem></EasterEggSystem>

      {/* Mobile Gesture System */}
      <MobileGestureSystem></MobileGestureSystem>

      {/* Dynamic Lighting System */}
      <DynamicLightingSystem scrollProgress={activeProgress} />
    </div>
  );
}