import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * Debug overlay for monitoring scroll progress and component states
 * Helps identify issues with loading and scroll behavior
 */
export function DebugOverlay({ 
  activeProgress, 
  isLoading, 
  componentsLoaded,
  visible = process.env.NODE_ENV === 'development' 
}) {
  const [scrollInfo, setScrollInfo] = useState({
    scrollY: 0,
    progress: 0,
    activeProgress: 0
  });

  useEffect(() => {
    const updateScrollInfo = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      
      setScrollInfo({
        scrollY,
        progress: progress,
        activeProgress: activeProgress.get()
      });
    };

    const unsubscribe = activeProgress.onChange(updateScrollInfo);
    window.addEventListener('scroll', updateScrollInfo);
    
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', updateScrollInfo);
    };
  }, [activeProgress]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed top-4 left-4 z-[999] bg-black/90 text-white p-4 rounded-lg text-xs font-mono backdrop-blur-md border border-white/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <div className="space-y-2">
        <div className="text-brand font-bold mb-2">🐛 Debug Info</div>
        
        <div>
          <span className="text-white/60">Loading:</span>{' '}
          <span className={isLoading ? 'text-red-400' : 'text-green-400'}>
            {isLoading ? 'TRUE' : 'FALSE'}
          </span>
        </div>
        
        <div>
          <span className="text-white/60">Scroll Y:</span>{' '}
          <span className="text-blue-400">{Math.round(scrollInfo.scrollY)}px</span>
        </div>
        
        <div>
          <span className="text-white/60">Raw Progress:</span>{' '}
          <span className="text-blue-400">{(scrollInfo.progress * 100).toFixed(1)}%</span>
        </div>
        
        <div>
          <span className="text-white/60">Active Progress:</span>{' '}
          <span className="text-brand">{(scrollInfo.activeProgress * 100).toFixed(1)}%</span>
        </div>
        
        <div className="border-t border-white/20 pt-2 mt-2">
          <div className="text-white/60 text-xs mb-1">Components:</div>
          {Object.entries(componentsLoaded).map(([key, loaded]) => (
            <div key={key}>
              <span className="text-white/60">{key}:</span>{' '}
              <span className={loaded ? 'text-green-400' : 'text-red-400'}>
                {loaded ? '✓' : '✗'}
              </span>
            </div>
          ))}
        </div>

        {/* Current frame indicator */}
        <div className="border-t border-white/20 pt-2 mt-2">
          <div className="text-white/60 text-xs mb-1">Expected Frame:</div>
          <div className="text-yellow-400">
            Frame {Math.floor(scrollInfo.activeProgress * 8)} 
            {scrollInfo.activeProgress < 0.25 && ' (Sleep)'}
            {scrollInfo.activeProgress >= 0.25 && scrollInfo.activeProgress < 0.35 && ' (Wake)'}
            {scrollInfo.activeProgress >= 0.9 && ' (Ready)'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Quick debug button to reset scroll position
 */
export function DebugControls({ onResetScroll }) {
  return (
    <motion.div
      className="fixed bottom-4 left-4 z-[999] flex gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          onResetScroll?.();
        }}
        className="bg-brand text-cave px-3 py-1 rounded text-xs font-semibold hover:bg-brand/80 transition-colors"
      >
        Reset Scroll
      </button>
      
      <button
        onClick={() => {
          const target = document.body.scrollHeight * 0.5;
          window.scrollTo({ top: target, behavior: 'smooth' });
        }}
        className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-500 transition-colors"
      >
        50% Scroll
      </button>
      
      <button
        onClick={() => {
          const target = document.body.scrollHeight * 0.9;
          window.scrollTo({ top: target, behavior: 'smooth' });
        }}
        className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-purple-500 transition-colors"
      >
        90% Scroll
      </button>
    </motion.div>
  );
}