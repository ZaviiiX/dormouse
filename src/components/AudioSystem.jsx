import { useEffect, useState, useRef } from "react";
import { motion, useTransform } from "framer-motion";

/**
 * Comprehensive Audio System for immersive scrollytelling
 * Adds ambient sounds, scroll-based audio, and interactive feedback
 */
export function AudioSystem({ activeProgress, isVisible }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioContext = useRef(null);
  const gainNode = useRef(null);
  const sounds = useRef({
    ambient: null,
    wake: null,
    click: null,
    hover: null,
    whoosh: null,
    rocket: null
  });

  // Initialize audio system
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      gainNode.current = audioContext.current.createGain();
      gainNode.current.connect(audioContext.current.destination);
      
      // Load audio files
      loadAudioFiles();
    }

    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  // Audio loading function
  const loadAudioFiles = async () => {
    const audioFiles = {
      ambient: '/audio/ambient-forest.mp3',     // Soft nature sounds
      wake: '/audio/wake-chime.mp3',           // Gentle bell for wake phase
      click: '/audio/click-soft.mp3',          // Button click sound
      hover: '/audio/hover-subtle.mp3',        // Hover feedback
      whoosh: '/audio/scroll-whoosh.mp3',      // Scroll transition
      rocket: '/audio/rocket-launch.mp3'       // Rocket animation
    };

    // Load each audio file
    for (const [key, url] of Object.entries(audioFiles)) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);
        sounds.current[key] = audioBuffer;
      } catch (error) {
        console.warn(`Failed to load audio: ${url}`, error);
      }
    }
  };

  // Play sound function
  const playSound = (soundKey, volume = 1, loop = false) => {
    if (!isEnabled || !audioContext.current || !sounds.current[soundKey]) return;

    const source = audioContext.current.createBufferSource();
    const gainNode = audioContext.current.createGain();
    
    source.buffer = sounds.current[soundKey];
    source.loop = loop;
    
    gainNode.gain.setValueAtTime(volume * this.volume, audioContext.current.currentTime);
    
    source.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    source.start(0);
    return source;
  };

  // Ambient audio control based on scroll progress
  useEffect(() => {
    if (!isEnabled) return;

    const progress = activeProgress.get();
    
    // Ambient forest sounds during sleep phase (0-0.3)
    if (progress < 0.3) {
      if (!sounds.current.ambientSource) {
        sounds.current.ambientSource = playSound('ambient', 0.2, true);
      }
    } else {
      if (sounds.current.ambientSource) {
        sounds.current.ambientSource.stop();
        sounds.current.ambientSource = null;
      }
    }

    // Wake chime at wake phase (0.25-0.35)
    if (progress >= 0.25 && progress <= 0.27) {
      playSound('wake', 0.4);
    }

    // Rocket sound at rocket phase (0.97+)
    if (progress >= 0.97 && progress <= 0.975) {
      playSound('rocket', 0.5);
    }

  }, [activeProgress, isEnabled]);

  // Enable audio on first user interaction
  const enableAudio = async () => {
    if (audioContext.current?.state === 'suspended') {
      await audioContext.current.resume();
    }
    setIsEnabled(true);
  };

  // Scroll-based volume control
  const ambientVolume = useTransform(
    activeProgress,
    [0, 0.15, 0.25, 0.35],
    [0.1, 0.3, 0.2, 0]
  );

  return (
    <>
      {/* Audio control panel */}
      <motion.div
        className="fixed top-6 right-6 z-50 pointer-events-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <div className="bg-black/80 backdrop-blur-md rounded-full px-4 py-2 border border-brand/30">
          {!isEnabled ? (
            <button
              onClick={enableAudio}
              className="flex items-center gap-2 text-white/80 hover:text-brand transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.824L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.824a1 1 0 011.617.824z"/>
                <path d="M11.646 5.646a.5.5 0 01.708.708A3.5 3.5 0 0114 9.5a3.5 3.5 0 01-1.646 2.646.5.5 0 01-.708-.708A2.5 2.5 0 0013 9.5a2.5 2.5 0 00-1.354-1.854.5.5 0 01-.708-.708z"/>
              </svg>
              Enable Audio
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEnabled(!isEnabled)}
                className={`w-6 h-6 rounded-full ${isEnabled ? 'text-brand' : 'text-white/40'} transition-colors`}
              >
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.824L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.824a1 1 0 011.617.824z"/>
                  {isEnabled && <path d="M11.646 5.646a.5.5 0 01.708.708A3.5 3.5 0 0114 9.5a3.5 3.5 0 01-1.646 2.646.5.5 0 01-.708-.708A2.5 2.5 0 0013 9.5a2.5 2.5 0 00-1.354-1.854.5.5 0 01-.708-.708z"/>}
                </svg>
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #E27E00 0%, #E27E00 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Global audio event handlers */}
      <div
        className="fixed inset-0 pointer-events-none"
        onMouseEnter={() => isEnabled && playSound('hover', 0.1)}
      />
    </>
  );
}

// Hook for playing sounds from components
export function useAudioFeedback() {
  const playClickSound = () => {
    // Implementation for click sound
    // Can be called from buttons: onClick={playClickSound}
  };

  const playHoverSound = () => {
    // Implementation for hover sound
    // Can be called on hover: onMouseEnter={playHoverSound}
  };

  return { playClickSound, playHoverSound };
}