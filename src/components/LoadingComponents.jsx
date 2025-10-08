import { motion } from "framer-motion";

/**
 * Enhanced ContentBox with loading states and skeleton support
 * Provides smooth loading experience for content sections
 */
export function EnhancedContentBox({ 
  title, 
  body, 
  cta, 
  ca, 
  buyUrl, 
  progress, 
  startAt, 
  endAt,
  isLoading = false
}) {
  // If loading, show skeleton version
  if (isLoading) {
    return <ContentBoxSkeleton />;
  }

  // Original ContentBox logic would go here
  // For now, we'll import and use the existing ContentBox
  return null; // Placeholder
}

/**
 * Skeleton version of ContentBox for loading states
 */
function ContentBoxSkeleton() {
  return (
    <motion.div 
      className="relative rounded-2xl left-0 mr-6 sm:mr-0 w-full max-w-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Skeleton glow background */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-radial from-brand/20 via-brand/10 to-transparent blur-xl"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Skeleton border */}
      <div className="relative border border-brand/20 rounded-2xl bg-black/20 backdrop-blur-sm">
        {/* Content skeleton */}
        <div className="relative p-6 sm:p-6">
          {/* Title skeleton */}
          <div className="mb-3">
            <motion.div
              className="h-8 bg-white/10 rounded-lg"
              animate={{
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ width: '75%' }}
            />
          </div>
          
          {/* Body skeleton */}
          <div className="space-y-2 mb-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-4 bg-white/10 rounded"
                animate={{
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
                style={{ 
                  width: i === 2 ? '60%' : '100%' 
                }}
              />
            ))}
          </div>

          {/* Button skeletons */}
          <div className="flex items-center gap-3">
            <motion.div
              className="h-10 bg-brand/30 rounded-lg"
              animate={{
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ width: '140px' }}
            />
            <motion.div
              className="h-10 bg-white/10 rounded-lg border border-white/20"
              animate={{
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3
              }}
              style={{ width: '100px' }}
            />
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <motion.div
        className="absolute -top-2 -right-2 w-6 h-6 bg-brand rounded-full flex items-center justify-center"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </motion.div>
    </motion.div>
  );
}

/**
 * Loading transition wrapper for any component
 */
export function LoadingTransition({ 
  isLoading, 
  skeleton, 
  children, 
  className = "" 
}) {
  return (
    <div className={`relative ${className}`}>
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {skeleton}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

/**
 * Progressive reveal for sections as they load
 */
export function ProgressiveReveal({ 
  children, 
  delay = 0, 
  className = "" 
}) {
  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        y: 50,
        filter: "blur(10px)"
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
        filter: "blur(0px)"
      }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
}