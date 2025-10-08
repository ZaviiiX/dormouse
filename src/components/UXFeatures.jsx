import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * Advanced User Experience Features
 * Settings panel, theme controls, progress indicators, keyboard navigation, accessibility
 */

// Main UX control panel
export function UXControlPanel({ activeProgress }) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'dark',
    reducedMotion: false,
    soundEnabled: true,
    showProgress: true,
    autoScroll: false,
    highContrast: false
  });

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dormouse-settings');
    if (saved) {
      setSettings({ ...settings, ...JSON.parse(saved) });
    }
  }, []);

  // Save settings to localStorage
  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('dormouse-settings', JSON.stringify(newSettings));
    
    // Apply settings immediately
    applySettings(newSettings);
  };

  const applySettings = (settings) => {
    // Theme application
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Reduced motion
    if (settings.reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
    }
    
    // High contrast
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
  };

  return (
    <>
      {/* Settings toggle button */}
      <motion.button
        className="fixed top-6 left-6 z-50 w-12 h-12 bg-black/80 backdrop-blur-md rounded-full border border-brand/30 flex items-center justify-center text-brand hover:bg-brand/20 transition-colors pointer-events-auto"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open settings"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ⚙️
        </motion.div>
      </motion.button>

      {/* Settings panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-20 left-6 z-50 w-80 bg-black/95 backdrop-blur-lg rounded-2xl border border-brand/30 p-6 pointer-events-auto"
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>🎛️</span>
              Experience Settings
            </h3>

            <div className="space-y-4">
              {/* Theme toggle */}
              <SettingToggle
                label="Theme"
                value={settings.theme === 'light'}
                onChange={(value) => updateSetting('theme', value ? 'light' : 'dark')}
                trueLabel="Light"
                falseLabel="Dark"
                icon="🌙"
              />

              {/* Sound toggle */}
              <SettingToggle
                label="Sound Effects"
                value={settings.soundEnabled}
                onChange={(value) => updateSetting('soundEnabled', value)}
                icon="🔊"
              />

              {/* Progress indicator */}
              <SettingToggle
                label="Progress Indicator"
                value={settings.showProgress}
                onChange={(value) => updateSetting('showProgress', value)}
                icon="📊"
              />

              {/* Reduced motion */}
              <SettingToggle
                label="Reduce Animations"
                value={settings.reducedMotion}
                onChange={(value) => updateSetting('reducedMotion', value)}
                icon="⚡"
                description="Helpful for motion sensitivity"
              />

              {/* High contrast */}
              <SettingToggle
                label="High Contrast"
                value={settings.highContrast}
                onChange={(value) => updateSetting('highContrast', value)}
                icon="🔆"
                description="Improves readability"
              />

              {/* Auto scroll */}
              <SettingToggle
                label="Auto Scroll"
                value={settings.autoScroll}
                onChange={(value) => updateSetting('autoScroll', value)}
                icon="📜"
                description="Automatic story progression"
              />
            </div>

            {/* Keyboard shortcuts */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="text-sm font-semibold text-white/80 mb-2">Keyboard Shortcuts</h4>
              <div className="text-xs text-white/60 space-y-1">
                <div className="flex justify-between">
                  <span>Space</span>
                  <span>Pause/Resume</span>
                </div>
                <div className="flex justify-between">
                  <span>↑/↓</span>
                  <span>Navigate sections</span>
                </div>
                <div className="flex justify-between">
                  <span>R</span>
                  <span>Reset to start</span>
                </div>
                <div className="flex justify-between">
                  <span>S</span>
                  <span>Toggle settings</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll progress indicator */}
      {settings.showProgress && (
        <ScrollProgressIndicator activeProgress={activeProgress} />
      )}
    </>
  );
}

// Individual setting toggle component
function SettingToggle({ 
  label, 
  value, 
  onChange, 
  icon, 
  description, 
  trueLabel = "On", 
  falseLabel = "Off" 
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <div>
          <span className="text-white text-sm font-medium">{label}</span>
          {description && (
            <p className="text-white/60 text-xs">{description}</p>
          )}
        </div>
      </div>
      
      <motion.button
        className={`relative w-12 h-6 rounded-full transition-colors ${
          value ? 'bg-brand' : 'bg-white/20'
        }`}
        onClick={() => onChange(!value)}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
          animate={{
            x: value ? 26 : 2
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>
    </div>
  );
}

// Scroll progress indicator
function ScrollProgressIndicator({ activeProgress }) {
  const [sections] = useState([
    { name: "Sleep", icon: "😴" },
    { name: "Wake", icon: "⏰" },
    { name: "Journey", icon: "🗺️" },
    { name: "Ready", icon: "🚀" }
  ]);

  return (
    <motion.div
      className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 pointer-events-auto"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div className="bg-black/80 backdrop-blur-md rounded-full px-3 py-4 border border-brand/30">
        {/* Progress bar */}
        <div className="w-1 h-32 bg-white/20 rounded-full relative mb-4">
          <motion.div
            className="absolute top-0 left-0 w-full bg-brand rounded-full"
            style={{
              height: useTransform(activeProgress, [0, 1], ["0%", "100%"])
            }}
          />
          
          {/* Current position indicator */}
          <motion.div
            className="absolute w-3 h-3 bg-brand rounded-full transform -translate-x-1/2"
            style={{
              top: useTransform(activeProgress, [0, 1], ["0%", "100%"]),
              left: "50%"
            }}
          />
        </div>

        {/* Section indicators */}
        <div className="space-y-2">
          {sections.map((section, index) => {
            const sectionProgress = index / (sections.length - 1);
            const isActive = useTransform(
              activeProgress,
              (progress) => progress >= sectionProgress - 0.1 && progress <= sectionProgress + 0.1
            );
            
            return (
              <motion.div
                key={section.name}
                className="text-center"
                animate={{
                  scale: isActive.get() ? 1.2 : 1,
                  opacity: isActive.get() ? 1 : 0.6
                }}
              >
                <div className="text-sm mb-1">{section.icon}</div>
                <div className="text-xs text-white/80 font-medium">{section.name}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// Keyboard navigation hook
export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case ' ': // Space - pause/resume auto-scroll
          e.preventDefault();
          // Toggle auto-scroll functionality
          break;
        
        case 'ArrowUp':
          e.preventDefault();
          // Scroll to previous section
          window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
          break;
        
        case 'ArrowDown':
          e.preventDefault();
          // Scroll to next section
          window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
          break;
        
        case 'r':
        case 'R':
          // Reset to start
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        
        case 's':
        case 'S':
          // Toggle settings panel
          // This would need to be connected to the settings state
          break;
        
        case 'Escape':
          // Close any open panels
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
}

// Accessibility announcements
export function AccessibilityAnnouncer({ activeProgress }) {
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const unsubscribe = activeProgress.onChange((progress) => {
      if (progress < 0.25) {
        setAnnouncement("Currently in sleep phase. Dormouse is resting peacefully.");
      } else if (progress < 0.5) {
        setAnnouncement("Wake phase beginning. Dormouse is starting to stir.");
      } else if (progress < 0.9) {
        setAnnouncement("Journey phase. Following the roadmap to success.");
      } else {
        setAnnouncement("Ready phase. Dormouse is prepared for takeoff!");
      }
    });

    return unsubscribe;
  }, [activeProgress]);

  return (
    <div 
      className="sr-only" 
      aria-live="polite" 
      aria-atomic="true"
    >
      {announcement}
    </div>
  );
}

// Focus management for better keyboard navigation
export function useFocusManagement() {
  useEffect(() => {
    // Ensure interactive elements are focusable
    const interactiveElements = document.querySelectorAll(
      'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    interactiveElements.forEach((element, index) => {
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
    });

    // Add focus indicators
    const style = document.createElement('style');
    style.textContent = `
      *:focus {
        outline: 2px solid #E27E00;
        outline-offset: 2px;
      }
      
      .focus-visible {
        outline: 2px solid #E27E00;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
}