import { motion, useTransform } from "framer-motion";
import napClock from "/images/nap_clock.png";
import { 
  CLOCK_CONFIG, 
  CLOCK_TIMELINE, 
  CONTENT_TIMELINE 
} from "../constants";

/**
 * ClockAnimation component handles the falling alarm clock animation
 */
export function ClockAnimation({ activeProgress, windowHeight }) {
  const {
    restBottomVH,
    impactVH,
    bouncePeakVH,
    totalFallRotation,
    left
  } = CLOCK_CONFIG;

  const {
    dropOffset,
    impactOffset,
    bounceOffset
  } = CLOCK_TIMELINE;

  // Calculate timeline points using original timeline structure
  const dropStart = CONTENT_TIMELINE[0].start + dropOffset;
  const impactProgress = CONTENT_TIMELINE[0].start + impactOffset;
  const bounceEnd = CONTENT_TIMELINE[0].start + bounceOffset;
  const alarmEnd = CONTENT_TIMELINE[1].end;

  // Calculate positions in pixels
  const impactOffsetPx = ((restBottomVH - impactVH) / 100) * windowHeight;
  const bouncePeakOffsetPx = -((bouncePeakVH - restBottomVH) / 100) * windowHeight;
  const startOffsetPx = -0.8 * windowHeight;

  // Base Y position animation
  const baseY = useTransform(activeProgress, (progress) => {
    if (progress < dropStart) return startOffsetPx;
    
    if (progress <= impactProgress) {
      const t = (progress - dropStart) / (impactProgress - dropStart);
      return startOffsetPx + t * (impactOffsetPx - startOffsetPx);
    }
    
    if (progress <= bounceEnd) {
      const t = (progress - impactProgress) / (bounceEnd - impactProgress);
      if (t < 0.5) {
        const up = t / 0.5;
        const easeUp = 1 - Math.pow(1 - up, 3);
        return impactOffsetPx + (bouncePeakOffsetPx - impactOffsetPx) * easeUp;
      }
      const down = (t - 0.5) / 0.5;
      const easeDown = 1 - Math.pow(1 - down, 2);
      return bouncePeakOffsetPx + (0 - bouncePeakOffsetPx) * easeDown;
    }
    
    return 0;
  });

  // Fall rotation animation
  const fallRotation = useTransform(activeProgress, (progress) => {
    if (progress < dropStart) return 0;
    
    if (progress <= impactProgress) {
      const t = (progress - dropStart) / (impactProgress - dropStart);
      return t * totalFallRotation;
    }
    
    if (progress <= bounceEnd) {
      const bt = (progress - impactProgress) / (bounceEnd - impactProgress);
      const easeBack = 1 - Math.pow(bt, 2);
      return totalFallRotation * easeBack;
    }
    
    return 0;
  });

  // Shake animations
  const shakeRotate = useTransform(activeProgress, (progress) => {
    if (progress < bounceEnd || progress > alarmEnd) return 0;
    const local = (progress - bounceEnd) / (alarmEnd - bounceEnd);
    return Math.sin(local * Math.PI * 22) * 14;
  });

  const shakeY = useTransform(activeProgress, (progress) => {
    if (progress < bounceEnd || progress > alarmEnd) return 0;
    const local = (progress - bounceEnd) / (alarmEnd - bounceEnd);
    return Math.sin(local * Math.PI * 22 + Math.PI / 2) * -6;
  });

  // Combined transformations
  const clockRotate = useTransform([fallRotation, shakeRotate], ([a, b]) => a + b);
  const clockY = useTransform([baseY, shakeY], ([bY, sY]) => bY + sY);

  // Opacity and glow effects
  const clockOpacity = useTransform(activeProgress, (progress) => {
    const start = CONTENT_TIMELINE[0].start + 0.02;
    if (progress < start || progress > alarmEnd) return 0;
    return 1;
  });

  const alarmActive = useTransform(activeProgress, (progress) =>
    progress >= bounceEnd && progress <= alarmEnd ? 1 : 0
  );
  
  const glowOpacity = useTransform([clockOpacity, alarmActive], ([o, a]) => o * 0.3 + a * 0.4);
  const glowScale = useTransform(alarmActive, (a) => (a ? 1.25 : 1));

  return (
    <>
      {/* Clock image */}
      <motion.img
        src={napClock}
        alt="Alarm clock"
        style={{
          opacity: clockOpacity,
          left,
          bottom: `${restBottomVH}vh`,
          y: clockY,
          rotate: clockRotate
        }}
        className="fixed -translate-x-1/2 w-[90px] sm:w-[110px] md:w-[130px] lg:w-[120px] select-none drop-shadow-[0_0_6px_rgba(255,255,255,0.65)] z-10 pointer-events-none animate-clock"
      />
      
      {/* Glow effect */}
      <motion.div
        style={{
          opacity: glowOpacity,
          left,
          bottom: `${restBottomVH}vh`,
          y: clockY,
          scale: glowScale
        }}
        className="fixed -translate-x-1/2 -translate-y-1/2 w-[170px] h-[170px] rounded-full pointer-events-none bg-gradient-radial from-brand/30 to-transparent blur-sm z-10"
      />
    </>
  );
}