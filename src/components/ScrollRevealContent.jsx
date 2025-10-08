import { motion, useTransform } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { ContentBox } from "./ContentBox";
import { TiltCard } from "./Tilt3DSystem";
import { CONTRACT_ADDRESS, BUY_URL, CONTENT_TIMELINE, ROADMAP_CONFIG } from "../constants";

/**
 * ScrollRevealContent - Reveals ContentBox components only when user scrolls to specific positions
 * This prevents flash issues and ensures content appears only when appropriate
 */
export function ScrollRevealContent({ activeProgress, isLoading }) {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [hasScrolledOnce, setHasScrolledOnce] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  // Track scroll progress changes
  useEffect(() => {
    const unsubscribe = activeProgress.onChange(() => {
      if (!isLoading) {
        const progress = activeProgress.get();
        setCurrentProgress(progress);
        
        // Mark that user has started scrolling - lower threshold
        if (progress > 0.001 && !hasScrolledOnce) {
          setHasScrolledOnce(true);
        }
      }
    });
    
    return unsubscribe;
  }, [activeProgress, isLoading, hasScrolledOnce]);

  // Don't render anything during loading
  if (isLoading) {
    return null;
  }

  // Show content based on scroll progress with proper transitions
  const shouldShowSleep = currentProgress <= 0.25; // Show until 25% scroll (Nap Hard)
  const shouldShowWake = currentProgress >= CONTENT_TIMELINE[1].start && currentProgress <= CONTENT_TIMELINE[1].end + 0.1 && hasScrolledOnce; // Frame 7-10 (Time to Wake Up) 
  const shouldShowRoadmap = currentProgress >= CONTENT_TIMELINE[2].start && currentProgress <= CONTENT_TIMELINE[2].end && hasScrolledOnce; // Frame 11-24 (Existing roadmap) - exact range
  const shouldShowReady = currentProgress >= CONTENT_TIMELINE[3].start && currentProgress > CONTENT_TIMELINE[2].end + 0.02 && hasScrolledOnce; // Ready for Moon - only after roadmap ends + buffer

  // Tap-to-Wake overlay logic: visible early in Sleep phase until user taps 3x or progress passes 0.2
  const tapsRequired = 3;
  const tapProgress = useMemo(() => Math.min(1, tapCount / tapsRequired), [tapCount]);
  const showTapOverlay = shouldShowSleep && currentProgress < 0.2 && tapCount < tapsRequired;

  // Calculate opacity for each text section
  const sleepTextOpacity = useTransform(
    activeProgress, 
    [0, 0.18, 0.25], // Start fading at 18% to overlap with Time to Wake Up
    [1, 1, 0]
  );
  
  const wakeTextOpacity = useTransform(
    activeProgress,
    [
      CONTENT_TIMELINE[1].start,
      CONTENT_TIMELINE[1].start + 0.04,
      CONTENT_TIMELINE[1].end - 0.02,
      CONTENT_TIMELINE[1].end
    ],
    [0, 1, 1, 0]
  );

  const roadmapTextOpacity = useTransform(
    activeProgress,
    [
      CONTENT_TIMELINE[2].start,
      CONTENT_TIMELINE[2].start + 0.04,
      CONTENT_TIMELINE[2].end - 0.02,
      CONTENT_TIMELINE[2].end
    ],
    [0, 1, 1, 0]
  );

  const readyTextOpacity = useTransform(
    activeProgress,
    [CONTENT_TIMELINE[3].start, CONTENT_TIMELINE[3].start + 0.04], // Start at 73% (after roadmap ends), fully visible at 77%
    [0, 1]
  );

  const vibrate = (pattern = 10) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch {}
  };

  const handleTap = () => {
    setTapCount((c) => {
      const next = Math.min(tapsRequired, c + 1);
      vibrate(10);
      return next;
    });
  };

  const shareOnX = () => {
    try {
      const text = encodeURIComponent("I scrolled the Dormouse story to the Moon. #NAPGANG 🚀🐭");
      const url = encodeURIComponent(window.location.href);
      const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
      window.open(shareUrl, '_blank');
    } catch {}
  };

  return (
    <>
      {/* Tap-to-Wake overlay (interactive) */}
      {showTapOverlay && (
        <motion.div
          className="fixed inset-x-0 bottom-[18vh] z-40 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          <motion.button
            onClick={handleTap}
            onTouchStart={handleTap}
            className="pointer-events-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TiltCard intensity="low" className="backdrop-blur-md">
              <div className="px-5 py-3 rounded-xl border border-brand/30 bg-black/40 text-white/90 flex items-center gap-3">
                <motion.div
          				className="w-3 h-3 rounded-full bg-brand"
          				animate={{ opacity: [0.6, 1, 0.6] }}
          				transition={{ duration: 1.2, repeat: Infinity }}
                />
                <span className="text-sm">Tap to wake the Dormouse</span>
                <div className="w-20 h-1 rounded-full bg-white/15 overflow-hidden">
                  <motion.div
                    className="h-full bg-brand"
                    initial={{ width: `${tapProgress * 100}%` }}
                    animate={{ width: `${tapProgress * 100}%` }}
                    transition={{ duration: 0.25 }}
                  />
                </div>
                <span className="text-xs text-white/60">{tapCount}/{tapsRequired}</span>
              </div>
            </TiltCard>
          </motion.button>
        </motion.div>
      )}

      {/* Sleep Phase Content: 0% - 25% - shows immediately after loading */}
      {shouldShowSleep && (
        <motion.div
          className="fixed z-30 left-6 sm:left-16 bottom-[48vh] sm:bottom-[38vh] max-w-xl"
          style={{ opacity: sleepTextOpacity }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <TiltCard intensity="medium" className="backdrop-blur-sm">
            <ContentBox
              title={<>Nap Hard, <span className="text-brand">Pump Harder.</span></>}
              body="While Dormouse naps, your bags moon. Cozy vibes, clean memes, zero stress. Join the #NAPGANG."
              cta
              ca={CONTRACT_ADDRESS}
              buyUrl={BUY_URL}
              progress={activeProgress}
              startAt={0}
              endAt={0.22}
            />
          </TiltCard>
        </motion.div>
      )}

      {/* Wake Phase Content: Frame 7-10 - Time to Wake Up */}
      {shouldShowWake && (
        <motion.div
          className="fixed z-30 left-6 sm:left-16 bottom-[48vh] sm:bottom-[38vh] max-w-xl"
          style={{ opacity: wakeTextOpacity }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <TiltCard intensity="high" className="backdrop-blur-sm">
            <ContentBox
              title={<>Time to <span className="text-brand">Wake Up!</span></>}
              body="The nap is fading. Energy rising. Stay with the scroll."
              progress={activeProgress}
              startAt={CONTENT_TIMELINE[1].start}
              endAt={CONTENT_TIMELINE[1].end}
            />
          </TiltCard>
        </motion.div>
      )}

      {/* Roadmap Phase Content: Frame 11-24 (existing roadmap component will show here automatically) */}

      {/* Ready Phase Content: Frame 25-31 - Ready for Moon */}
      {shouldShowReady && (
        <motion.div
          className="fixed z-30 left-6 sm:left-16 bottom-[48vh] sm:bottom-[38vh] max-w-xl"
          style={{ opacity: readyTextOpacity }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <TiltCard intensity="high" className="backdrop-blur-sm bg-gradient-to-br from-brand/10 to-orange-400/10">
            <ContentBox
              title={<>Ready for <span className="text-gold">Moon!</span></>}
              body="Fully awake. The journey to the Moon awaits!"
              progress={activeProgress}
              startAt={CONTENT_TIMELINE[3].start}
              endAt={CONTENT_TIMELINE[3].end}
            />
          </TiltCard>
        </motion.div>
      )}

      {/* Share Card near the end (95%+) */}
      {currentProgress >= 0.95 && (
        <motion.div
          className="fixed z-40 bottom-24 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <TiltCard intensity="medium" className="backdrop-blur-md">
            <div className="px-5 py-3 rounded-xl border border-brand/30 bg-black/50 text-white/90 flex items-center gap-3">
              <span className="text-sm">Share your nap run</span>
              <motion.button
                onClick={shareOnX}
                className="px-3 py-1.5 rounded-lg bg-brand/20 border border-brand/40 text-sm hover:bg-brand/30"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Share on X
              </motion.button>
            </div>
          </TiltCard>
        </motion.div>
      )}
    </>
  );
}