import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * Loading notifications and feedback system
 * Provides user feedback during resource loading
 */

export function LoadingNotification({ message, isVisible, type = "info" }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  const getIcon = () => {
    switch (type) {
      case "success": return "✅";
      case "error": return "❌";
      case "warning": return "⚠️";
      default: return "⏳";
    }
  };

  const getColors = () => {
    switch (type) {
      case "success": return "bg-green-600/90 border-green-400/30";
      case "error": return "bg-red-600/90 border-red-400/30";
      case "warning": return "bg-yellow-600/90 border-yellow-400/30";
      default: return "bg-brand/90 border-brand/30";
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`fixed bottom-6 right-6 z-50 ${getColors()} backdrop-blur-md rounded-lg px-4 py-3 border shadow-lg max-w-sm`}
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 text-white">
            <span className="text-xl">{getIcon()}</span>
            <span className="text-sm font-medium">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Progressive loading indicator for specific resources
 */
export function ResourceLoader({ resources, onComplete }) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [currentResource, setCurrentResource] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    loadResources();
  }, [resources]);

  const loadResources = async () => {
    let loaded = 0;
    
    for (const resource of resources) {
      setCurrentResource(resource.name);
      
      try {
        await loadResource(resource);
        loaded++;
        setLoadedCount(loaded);
        
        // Small delay for user feedback
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(`Failed to load ${resource.name}:`, error);
        loaded++;
        setLoadedCount(loaded);
      }
    }
    
    setIsComplete(true);
    onComplete?.();
  };

  const loadResource = (resource) => {
    return new Promise((resolve, reject) => {
      if (resource.type === 'image') {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = resource.url;
      } else if (resource.type === 'script') {
        const script = document.createElement('script');
        script.onload = resolve;
        script.onerror = reject;
        script.src = resource.url;
        document.head.appendChild(script);
      } else {
        // Generic resource loading
        fetch(resource.url)
          .then(resolve)
          .catch(reject);
      }
    });
  };

  const progress = (loadedCount / resources.length) * 100;

  return (
    <div className="text-center text-white">
      <div className="mb-4">
        <div className="text-sm text-white/80 mb-2">
          Loading {currentResource}...
        </div>
        <div className="text-xs text-white/60">
          {loadedCount} of {resources.length} resources loaded
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
        <motion.div
          className="h-full bg-brand rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

/**
 * Smart preloader that adapts to connection speed
 */
export function AdaptiveLoader({ onComplete }) {
  const [connectionSpeed, setConnectionSpeed] = useState('unknown');
  const [loadingStrategy, setLoadingStrategy] = useState('standard');

  useEffect(() => {
    detectConnectionSpeed();
  }, []);

  const detectConnectionSpeed = () => {
    // Use Network Information API if available
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const effectiveType = connection.effectiveType;
      
      setConnectionSpeed(effectiveType);
      
      // Adapt loading strategy based on connection
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        setLoadingStrategy('minimal');
      } else if (effectiveType === '3g') {
        setLoadingStrategy('standard');
      } else {
        setLoadingStrategy('full');
      }
    } else {
      // Fallback: measure loading speed of a small image
      measureLoadingSpeed();
    }
  };

  const measureLoadingSpeed = () => {
    const startTime = Date.now();
    const testImage = new Image();
    
    testImage.onload = () => {
      const loadTime = Date.now() - startTime;
      
      if (loadTime < 100) {
        setLoadingStrategy('full');
        setConnectionSpeed('fast');
      } else if (loadTime < 500) {
        setLoadingStrategy('standard');
        setConnectionSpeed('medium');
      } else {
        setLoadingStrategy('minimal');
        setConnectionSpeed('slow');
      }
    };
    
    testImage.src = '/images/logo.png?' + Math.random(); // Cache busting
  };

  const getResourcesByStrategy = () => {
    const baseResources = [
      { name: 'Core Images', type: 'image', url: '/images/hero_coins.png' },
      { name: 'Dormouse', type: 'image', url: '/images/dormouse_sleep.png' }
    ];

    const standardResources = [
      ...baseResources,
      { name: 'Clock', type: 'image', url: '/images/nap_clock.png' },
      { name: 'Frame 0', type: 'image', url: '/images/frames/dm0.png' }
    ];

    const fullResources = [
      ...standardResources,
      ...Array.from({ length: 31 }, (_, i) => ({
        name: `Frame ${i + 1}`,
        type: 'image',
        url: `/images/frames/dm${i + 1}.png`
      }))
    ];

    switch (loadingStrategy) {
      case 'minimal': return baseResources;
      case 'standard': return standardResources;
      case 'full': return fullResources;
      default: return standardResources;
    }
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="text-white/60 text-sm mb-2">
          Connection: {connectionSpeed} | Strategy: {loadingStrategy}
        </div>
      </div>
      
      <ResourceLoader 
        resources={getResourcesByStrategy()} 
        onComplete={onComplete}
      />
    </div>
  );
}