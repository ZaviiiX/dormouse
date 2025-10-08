import { useState, useEffect } from "react";
import { motion, useTransform } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import { TouchButton } from "./MobileGestureSystem";

/**
 * Enhanced ContentBox with elegant animations - no complex particles
 */
export function ContentBox({ title, body, cta, ca, buyUrl, progress, startAt, endAt }) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Subtle reveal animations if progress is provided
  const containerScale = progress ? useTransform(
    progress, 
    [startAt - 0.1, startAt, endAt, endAt + 0.1], 
    [0.95, 1, 1, 0.95]
  ) : 1;

  /**
   * Copy contract address to clipboard
   */
  const copyCA = async () => {
    if (!ca) return;
    
    try {
      await navigator.clipboard.writeText(ca);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = ca;
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  /**
   * Open buy URL in new tab
   */
  const handleBuy = () => {
    if (buyUrl) {
      window.open(buyUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div 
      className="relative rounded-2xl left-0 mr-6 sm:mr-0 w-full max-w-sm"
      style={{ scale: containerScale }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Fixed-size glow background */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-radial from-brand/30 via-brand/15 to-transparent blur-xl"
          initial={{ opacity: 0.4 }}
          animate={{ 
            opacity: isHovered ? 0.8 : 0.5,
            scale: isHovered ? 1.02 : 1
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      
      {/* Pulsing corner accents - repositioned */}
      <motion.div
        className="absolute -top-3 -right-3 w-4 h-4 bg-brand rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute -bottom-3 -left-3 w-3 h-3 bg-brand/80 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Enhanced animated border SVG - maximum coverage */}
      <motion.svg
        className="absolute -inset-6 rounded-3xl w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ 
          overflow: "visible",
          width: "calc(100% + 48px)",
          height: "calc(100% + 48px)"
        }}
      >
        <defs>
          <filter id="cb-glow-enhanced" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b" />
            <feColorMatrix
              in="b"
              type="matrix"
              values="
                1 0 0 0 0
                0 0.55 0 0 0
                0 0 0 0 0
                0 0 0 8 -2"
              result="g"
            />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="cb-trail-enhanced" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E27E00" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFB000" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E27E00" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base border - more visible */}
        <rect
          x="2" 
          y="2" 
          width="96" 
          height="96" 
          rx="16" 
          ry="16"
          fill="none"
          stroke="#E27E00"
          strokeOpacity="0.4"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Enhanced animated border trail */}
        <motion.rect
          x="2" 
          y="2" 
          width="96" 
          height="96" 
          rx="16" 
          ry="16"
          pathLength={1}
          fill="none"
          stroke="url(#cb-trail-enhanced)"
          strokeWidth={isHovered ? "3" : "2"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0.2 0.8"
          strokeDashoffset={0}
          filter="url(#cb-glow-enhanced)"
          vectorEffect="non-scaling-stroke"
          animate={{ 
            strokeDashoffset: [0, -1],
            strokeOpacity: isHovered ? [0.7, 0.9, 0.7] : [0.5, 0.7, 0.5]
          }}
          transition={{ 
            strokeDashoffset: { duration: 4, repeat: Infinity, ease: "linear" },
            strokeOpacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      </motion.svg>

      {/* Compact content that fits within glow */}
      <div className="relative p-6 sm:p-6 pointer-events-auto">
        {/* Compact title with typing effect (no blinking cursor) */}
        <motion.h1 
          className="text-2xl sm:text-3xl font-extrabold text-white leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: "auto" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ display: "inline-block", overflow: "hidden", whiteSpace: "nowrap" }}
          >
            {title}
          </motion.span>
        </motion.h1>
        
        {/* Body text with word stagger effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.p 
            className="mt-3 text-sm sm:text-base text-white/85 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            {typeof body === 'string' ? (
              body.split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 1.2 + (index * 0.05),
                    duration: 0.3
                  }}
                  className="inline-block mr-1"
                >
                  {word}
                </motion.span>
              ))
            ) : body}
          </motion.p>
        </motion.div>

        {/* Compact buttons */}
        {cta && (
          <motion.div 
            className="mt-4 flex items-center gap-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
          >
            {/* Magnetic Buy Button */}
            <MagneticButton
              onClick={handleBuy}
              magneticStrength={0.5}
              magneticRadius={120}
              className="relative px-4 py-2 text-sm rounded-lg bg-brand text-cave2 font-bold shadow-lg overflow-hidden group"
            >
              {/* Multi-layer shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-brand/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8, delay: 0.1 }}
              />
              <span className="relative z-10">Get Dormouse</span>
            </MagneticButton>

            {/* Magnetic Copy CA Button */}
            <MagneticButton
              onClick={copyCA}
              magneticStrength={0.3}
              magneticRadius={100}
              className="px-4 py-2 text-sm rounded-lg border border-white/30 text-white font-medium transition-all duration-200 relative overflow-hidden group"
              title={ca || ""}
            >
              {/* Copy success ripple effect */}
              {copied && (
                <motion.div
                  className="absolute inset-0 bg-brand/20 rounded-xl"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              )}
              <motion.span 
                className="relative z-10"
                animate={copied ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {copied ? "✓ Copied!" : "Copy CA"}
              </motion.span>
            </MagneticButton>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}