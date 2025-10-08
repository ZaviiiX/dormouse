import { motion } from "framer-motion";
import { useState } from "react";

/**
 * LazyImage component with skeleton loading and fade-in animation
 * Provides smooth image loading experience with fallback
 */
export function LazyImage({ 
  src, 
  alt, 
  className = "", 
  skeletonClassName = "",
  showSkeleton = true,
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Skeleton loader */}
      {showSkeleton && !isLoaded && !hasError && (
        <SkeletonBox className={`absolute inset-0 ${skeletonClassName}`} />
      )}
      
      {/* Actual image */}
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
      
      {/* Error state */}
      {hasError && (
        <div className={`bg-white/10 rounded-lg flex items-center justify-center ${className}`}>
          <div className="text-center text-white/50">
            <div className="text-2xl mb-2">🖼️</div>
            <span className="text-sm">Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton loading component with shimmer effect
 */
export function SkeletonBox({ className = "" }) {
  return (
    <div className={`animate-pulse overflow-hidden ${className}`}>
      <div className="bg-white/10 rounded-lg h-full relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

/**
 * Multiple skeleton loading boxes for content areas
 */
export function SkeletonContent({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonBox 
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton for ContentBox component
 */
export function SkeletonContentBox({ className = "" }) {
  return (
    <div className={`rounded-2xl bg-white/5 p-6 ${className}`}>
      {/* Title skeleton */}
      <SkeletonBox className="h-8 w-3/4 mb-4" />
      
      {/* Body text skeleton */}
      <SkeletonContent lines={3} className="mb-6" />
      
      {/* Button skeletons */}
      <div className="flex gap-3">
        <SkeletonBox className="h-10 w-32" />
        <SkeletonBox className="h-10 w-24" />
      </div>
    </div>
  );
}