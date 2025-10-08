import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Performance & Technical Enhancement System
 * Web vitals optimization, PWA features, analytics, error boundaries
 */

// Service Worker registration for PWA features
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered: ', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, show update notification
              showUpdateNotification();
            }
          });
        });
      } catch (error) {
        console.log('SW registration failed: ', error);
      }
    });
  }
}

// PWA Update notification
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 z-50 bg-brand text-white px-4 py-2 rounded-lg shadow-lg';
  notification.innerHTML = `
    <div class="flex items-center gap-2">
      <span>New version available!</span>
      <button onclick="window.location.reload()" class="bg-white text-brand px-2 py-1 rounded text-sm">
        Update
      </button>
    </div>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 10000);
}

// Web Vitals monitoring
export function useWebVitals() {
  const [vitals, setVitals] = useState({
    CLS: null,
    FID: null,
    FCP: null,
    LCP: null,
    TTFB: null
  });

  useEffect(() => {
    // Dynamic import to avoid bundle size increase
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => {
        setVitals(prev => ({ ...prev, CLS: metric.value }));
        // Send to analytics
        sendToAnalytics('CLS', metric.value);
      });

      getFID((metric) => {
        setVitals(prev => ({ ...prev, FID: metric.value }));
        sendToAnalytics('FID', metric.value);
      });

      getFCP((metric) => {
        setVitals(prev => ({ ...prev, FCP: metric.value }));
        sendToAnalytics('FCP', metric.value);
      });

      getLCP((metric) => {
        setVitals(prev => ({ ...prev, LCP: metric.value }));
        sendToAnalytics('LCP', metric.value);
      });

      getTTFB((metric) => {
        setVitals(prev => ({ ...prev, TTFB: metric.value }));
        sendToAnalytics('TTFB', metric.value);
      });
    }).catch(() => {
      console.log('Web Vitals not available');
    });
  }, []);

  return vitals;
}

// Analytics tracking
function sendToAnalytics(metricName, value) {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', metricName, {
      event_category: 'Web Vitals',
      value: Math.round(value),
      non_interaction: true,
    });
  }

  // Custom analytics endpoint
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metric: metricName,
        value: value,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(() => {
      // Fail silently
    });
  }
}

// Error Boundary Component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService(error, errorInfo) {
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: error.toString(),
          errorInfo: errorInfo.componentStack,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(() => {
        // Fail silently
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cave text-white flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="text-6xl mb-4">😴</div>
              <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
              <p className="text-white/70 mb-6">
                Dormouse encountered an unexpected error and is taking a quick nap.
              </p>
            </motion.div>

            <motion.button
              onClick={() => window.location.reload()}
              className="bg-brand text-cave px-6 py-3 rounded-lg font-semibold hover:bg-brand/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Wake up Dormouse
            </motion.button>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left text-sm">
                <summary className="cursor-pointer text-brand">Error Details</summary>
                <pre className="mt-2 p-4 bg-black/50 rounded overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Offline support hook
export function useOfflineSupport() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
      setTimeout(() => setShowOfflineMessage(false), 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, showOfflineMessage };
}

// Offline notification component
export function OfflineNotification({ show }) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      <div className="flex items-center gap-2">
        <span>📡</span>
        <span>You're offline. Some features may be limited.</span>
      </div>
    </motion.div>
  );
}

// Performance monitoring component
export function PerformanceMonitor() {
  const [showMetrics, setShowMetrics] = useState(false);
  const vitals = useWebVitals();

  // Only show in development or when explicitly enabled
  useEffect(() => {
    const shouldShow = process.env.NODE_ENV === 'development' || 
                     localStorage.getItem('show-performance') === 'true';
    setShowMetrics(shouldShow);
  }, []);

  if (!showMetrics) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-4 left-4 z-50 bg-black/90 text-white p-3 rounded-lg text-xs font-mono"
    >
      <div className="mb-2 font-bold">Performance Metrics</div>
      <div className="space-y-1">
        <div>CLS: {vitals.CLS?.toFixed(3) || 'Loading...'}</div>
        <div>FID: {vitals.FID ? `${vitals.FID.toFixed(1)}ms` : 'Loading...'}</div>
        <div>FCP: {vitals.FCP ? `${vitals.FCP.toFixed(1)}ms` : 'Loading...'}</div>
        <div>LCP: {vitals.LCP ? `${vitals.LCP.toFixed(1)}ms` : 'Loading...'}</div>
        <div>TTFB: {vitals.TTFB ? `${vitals.TTFB.toFixed(1)}ms` : 'Loading...'}</div>
      </div>
    </motion.div>
  );
}

// Resource preloading optimization
export function useResourcePreloading() {
  useEffect(() => {
    // Preload critical images
    const criticalImages = [
      '/images/frames/dm0.png',
      '/images/frames/dm1.png',
      '/images/frames/dm2.png',
      '/images/hero_coins.png',
      '/images/nap_clock.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload fonts
    const criticalFonts = [
      '/fonts/custom-font.woff2' // If you have custom fonts
    ];

    criticalFonts.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = src;
      link.crossOrigin = '';
      document.head.appendChild(link);
    });

    // DNS prefetch for external resources
    const externalDomains = [
      'https://dexscreener.com',
      'https://t.me',
      'https://twitter.com'
    ];

    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }, []);
}

// Memory usage monitoring
export function useMemoryMonitoring() {
  const [memoryInfo, setMemoryInfo] = useState(null);

  useEffect(() => {
    if ('memory' in performance) {
      const updateMemoryInfo = () => {
        setMemoryInfo({
          used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
        });
      };

      updateMemoryInfo();
      const interval = setInterval(updateMemoryInfo, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  return memoryInfo;
}