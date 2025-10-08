/**
 * Enhanced Content Loading System with premium UX
 * Provides smooth loading experience with progress indicators and actual resource loading
 */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { AdaptiveLoader } from "./LoadingNotifications";

export function PremiumLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState("assets");
  const [isComplete, setIsComplete] = useState(false);
  const [useAdaptiveLoading, setUseAdaptiveLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      try {
        // Stage 1: Critical images
        setLoadingStage("assets");
        await loadCriticalImages();
        setProgress(35);

        // Stage 2: Animation frames
        setLoadingStage("animations");
        await loadAnimationFrames();
        setProgress(70);

        // Stage 3: Experience preparation
        setLoadingStage("experience");
        await prepareExperience();
        setProgress(100);

        // Complete loading
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(() => onComplete?.(), 800);
        }, 500);

      } catch (error) {
        console.warn('Loading error:', error);
        // Still complete loading even if some resources fail
        setTimeout(() => {
          setIsComplete(true);
          onComplete?.();
        }, 1000);
      }
    };

    loadResources();
  }, [onComplete]);

  // Load critical images
  const loadCriticalImages = () => {
    return new Promise((resolve) => {
      const images = [
        '/images/hero_coins.png',
        '/images/dormouse_sleep.png',
        '/images/nap_clock.png',
        '/images/logo.png'
      ];

      let loaded = 0;
      const total = images.length;

      const onLoad = () => {
        loaded++;
        const imageProgress = (loaded / total) * 35;
        setProgress(imageProgress);
        
        if (loaded === total) {
          resolve();
        }
      };

      images.forEach(src => {
        const img = new Image();
        img.onload = onLoad;
        img.onerror = onLoad; // Continue even if image fails
        img.src = src;
      });

      // Fallback timeout
      setTimeout(resolve, 2000);
    });
  };

  // Load animation frames
  const loadAnimationFrames = () => {
    return new Promise((resolve) => {
      const frames = Array.from({ length: 32 }, (_, i) => `/images/frames/dm${i}.png`);

      let loaded = 0;
      const total = frames.length;

      const onLoad = () => {
        loaded++;
        const frameProgress = 35 + (loaded / total) * 35;
        setProgress(frameProgress);
        
        if (loaded === total) {
          resolve();
        }
      };

      frames.forEach(src => {
        const img = new Image();
        img.onload = onLoad;
        img.onerror = onLoad;
        img.src = src;
      });

      setTimeout(resolve, 1500);
    });
  };

  // Prepare experience
  const prepareExperience = () => {
    return new Promise((resolve) => {
      // Simulate final preparations
      let currentProgress = 70;
      const interval = setInterval(() => {
        currentProgress += 3;
        setProgress(Math.min(100, currentProgress));
        
        if (currentProgress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  };

  const stageText = {
    assets: "Loading dormouse magic...",
    animations: "Preparing animations...",
    experience: "Almost ready to nap..."
  };

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[100] bg-gradient-to-br from-cave2 via-cave to-black flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-brand/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                  y: [0, -50, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Main loader content */}
          <div className="relative z-10 text-center max-w-md px-8">
            {/* Logo/Icon */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-brand to-brand/60 flex items-center justify-center text-4xl">
                🐭
              </div>
            </motion.div>

            {/* Loading text */}
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Dormouse Web
            </motion.h2>

            <motion.p
              className="text-white/70 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              key={loadingStage}
            >
              {stageText[loadingStage]}
            </motion.p>

            {/* Adaptive Loading or Standard Progress */}
            {useAdaptiveLoading ? (
              <div className="mb-6">
                <AdaptiveLoader onComplete={() => setProgress(100)} />
              </div>
            ) : (
              <>
                {/* Progress bar */}
                <div className="relative">
                  <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
                    <motion.div
                      className="h-full bg-gradient-to-r from-brand to-brand/80 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                  
                  {/* Progress percentage */}
                  <motion.div
                    className="absolute -top-8 text-brand font-mono text-sm"
                    style={{ left: `calc(${progress}% - 16px)` }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {Math.round(progress)}%
                  </motion.div>
                </div>
              </>
            )}

            {/* Loading dots */}
            <div className="flex justify-center mt-6 gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-brand/60 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </div>

          {/* Glowing edge effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
            <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-brand/50 to-transparent" />
            <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-brand/50 to-transparent" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Skeleton loading components for content that loads progressively
export function SkeletonBox({ className = "" }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-white/10 rounded-lg h-full">
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

// Image loading with fade-in
export function LazyImage({ src, alt, className = "", ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative">
      {!isLoaded && !hasError && (
        <SkeletonBox className={`absolute inset-0 ${className}`} />
      )}
      
      <motion.img
        src={src}
        alt={alt}
        className={className}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 0.95
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...props}
      />
      
      {hasError && (
        <div className={`bg-white/10 rounded-lg flex items-center justify-center ${className}`}>
          <span className="text-white/50 text-sm">Failed to load</span>
        </div>
      )}
    </div>
  );
}