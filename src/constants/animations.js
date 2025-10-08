export const FRAME_SOURCES = [
  "/images/frames/dm0.png", "/images/frames/dm1.png", "/images/frames/dm2.png",
  "/images/frames/dm3.png", "/images/frames/dm4.png", "/images/frames/dm5.png",
  "/images/frames/dm6.png", "/images/frames/dm7.png", "/images/frames/dm8.png",
  "/images/frames/dm9.png", "/images/frames/dm10.png", "/images/frames/dm11.png",
  "/images/frames/dm12.png", "/images/frames/dm13.png", "/images/frames/dm14.png",
  "/images/frames/dm15.png", "/images/frames/dm16.png", "/images/frames/dm17.png",
  "/images/frames/dm18.png", "/images/frames/dm19.png", "/images/frames/dm20.png",
  "/images/frames/dm21.png", "/images/frames/dm22.png", "/images/frames/dm23.png",
  "/images/frames/dm24.png", "/images/frames/dm25.png", "/images/frames/dm26.png",
  "/images/frames/dm27.png", "/images/frames/dm28.png", "/images/frames/dm29.png",
  "/images/frames/dm30.png", "/images/frames/dm31.png"
];

export const TOTAL_FRAMES = 32;

export const FRAME_POSITIONS = {};
export const FRAME_ADJUSTMENTS = {};
export const FRAME_TIMELINE = [];

// Individual frame configurations - customize each frame's size and position
const FRAME_CONFIGS = {
  // Frame 0 (dm0.png)
  0: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "20vh" } },
    scale: { xs: 0.6, sm: 0.8, md: 0.7, lg: 1.0 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  // Frame 1 (dm1.png)
  1: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "20vh" } },
    scale: { xs: 0.6, sm: 0.8, md: 0.7, lg: 1.0 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  // Frame 2 (dm2.png)
  2: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "20vh" } },
    scale: { xs: 0.6, sm: 0.8, md: 0.7, lg: 1.0 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  // Frame 3 (dm3.png)
  3: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "20vh" } },
    scale: { xs: 0.6, sm: 0.8, md: 0.7, lg: 1.0 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  // Frame 4 (dm4.png)
  4: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "20vh" } },
    scale: { xs: 0.6, sm: 0.8, md: 0.7, lg: 1.0 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  // Frame 5 (dm5.png)
  5: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "20vh" } },
    scale: { xs: 0.6, sm: 0.8, md: 0.7, lg: 1.0 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  // Frame 6 (dm6.png)
  6: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "25vh" } },
    scale: { xs: 0.6, sm: 0.8, md: 0.7, lg: 1.1 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  // Frame 7 (dm7.png)
  7: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "25vh" } },
    scale: { xs: 0.6, sm: 0.8, md: 0.7, lg: 1.1 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  // Frame 8 (dm8.png) - Larger from this frame onwards
  8: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "28vh" } },
    scale: { xs: 0.75, sm: 0.95, md: 0.85, lg: 1.25 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  9: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "28vh" } },
    scale: { xs: 0.75, sm: 0.95, md: 0.85, lg: 1.25 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  10: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "28vh" } },
    scale: { xs: 0.75, sm: 0.95, md: 0.85, lg: 1.25 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  11: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "28vh" } },
    scale: { xs: 0.75, sm: 0.95, md: 0.85, lg: 1.25 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  12: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "28vh" } },
    scale: { xs: 0.75, sm: 0.95, md: 0.85, lg: 1.25 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  13: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "28vh" } },
    scale: { xs: 0.75, sm: 0.95, md: 0.85, lg: 1.25 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  14: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "28vh" } },
    scale: { xs: 0.75, sm: 0.95, md: 0.85, lg: 1.25 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  15: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "28vh" } },
    scale: { xs: 0.75, sm: 0.95, md: 0.85, lg: 1.25 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  16: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "28vh" } },
    scale: { xs: 0.75, sm: 0.95, md: 0.85, lg: 1.25 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  17: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "28vh" } },
    scale: { xs: 0.75, sm: 0.95, md: 0.85, lg: 1.25 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  18: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "28vh" } },
    scale: { xs: 0.75, sm: 0.95, md: 0.85, lg: 1.25 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  19: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "28vh" } },
    scale: { xs: 0.75, sm: 0.95, md: 0.85, lg: 1.25 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  },
  20: {
    position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "28vh" } },
    scale: { xs: 0.75, sm: 0.95, md: 0.85, lg: 1.25 },
    offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
    offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
  }
};

// Default configuration for frames not explicitly defined
const DEFAULT_CONFIG = {
  position: { xs: { left: "60vw", bottom: "7vh" }, sm: { left: "54vw", bottom: "14vh" }, md: { left: "62vw", bottom: "18vh" }, lg: { left: "70vw", bottom: "20vh" } },
  scale: { xs: 0.75, sm: 0.95, md: 0.85, lg: 1.25 }, // Larger scale for frames 9-31
  offsetX: { xs: 40, sm: 100, md: 80, lg: 0 },
  offsetY: { xs: 4, sm: 110, md: 140, lg: 0 }
};

// Generate positions, adjustments and timeline for all 32 frames
for (let i = 0; i < 32; i++) {
  const config = FRAME_CONFIGS[i] || DEFAULT_CONFIG;
  
  FRAME_POSITIONS[i] = config.position;
  FRAME_ADJUSTMENTS[i] = {
    scale: config.scale,
    offsetX: config.offsetX,
    offsetY: config.offsetY
  };
  
  // Custom timeline - properly distributed across full scroll (0%-100%)
  if (i < 5) {
    // Frames 0-4: Each takes 5% of scroll (25% total) - "Nap Hard" phase
    FRAME_TIMELINE.push({
      start: i * 0.05,
      end: (i + 1) * 0.05
    });
  } else if (i < 7) {
    // Frames 5-6: Each takes 2.5% of scroll (5% total) - transition
    const frameIndex = i - 5;
    FRAME_TIMELINE.push({
      start: 0.25 + (frameIndex * 0.025),
      end: 0.25 + ((frameIndex + 1) * 0.025)
    });
  } else if (i < 11) {
    // Frames 7-10: Each takes 2.5% of scroll (10% total) - "Time to Wake Up" phase
    const frameIndex = i - 7;
    FRAME_TIMELINE.push({
      start: 0.30 + (frameIndex * 0.025),
      end: 0.30 + ((frameIndex + 1) * 0.025)
    });
  } else if (i < 25) {
    // Frames 11-24: Each takes 2.14% of scroll (30% total) - Roadmap phase  
    const frameIndex = i - 11;
    FRAME_TIMELINE.push({
      start: 0.40 + (frameIndex * 0.0214),
      end: 0.40 + ((frameIndex + 1) * 0.0214)
    });
  } else {
    // Frames 25-31: Each takes 4.29% of scroll (30% total) - "Ready for Moon" phase  
    const frameIndex = i - 25;
    FRAME_TIMELINE.push({
      start: 0.70 + (frameIndex * 0.0429),
      end: 0.70 + ((frameIndex + 1) * 0.0429)
    });
  }
}

// Custom frame timeline with content phases - covers full 100% scroll
// Frame 0-4: Each takes 5% scroll (0%-25%) - "Nap Hard" phase
// Frame 5-6: Each takes 2.5% scroll (25%-30%) - Transition phase  
// Frame 7-10: Each takes 2.5% scroll (30%-40%) - "Time to Wake Up" phase
// Frame 11-24: Each takes 2.14% scroll (40%-70%) - Roadmap phase
// Frame 25-31: Each takes 4.29% scroll (70%-100%) - "Ready for Moon" phase

// Content phase timeline for text cards (separate from frame animation)
export const CONTENT_TIMELINE = [
  { start: 0.0, end: 0.25 },     // Sleep phase - frames 0-4 (Nap Hard card)
  { start: 0.23, end: 0.37 },    // Wake phase - frames 7-10 (Time to Wake Up card) - ends before roadmap  
  { start: 0.40, end: 0.70 },    // Roadmap phase - frames 11-24 (existing roadmap component)
  { start: 0.73, end: 1.0 }      // Ready phase - frames 25-31 (Ready for Moon card) - starts after roadmap ends
];

export const CLOCK_CONFIG = { restBottomVH: 55, impactVH: 40, bouncePeakVH: 50, totalFallRotation: 540, left: "64vw", fade: 0.02 };
export const CLOCK_TIMELINE = { dropOffset: 0.08, impactOffset: 0.15, bounceOffset: 0.22 };
export const SLEEP_EFFECTS = { zPosition: { left: "64vw", bottom: "52vh" }, zCount: 3, earlyDuration: 2.2, earlyDelay: 0.55, lateDuration: 1.8, lateDelay: 0.4 };
export const ROCKET_CONFIG = { left: "64vw", bottom: "78vh", appearOffset: 0.005, visibleOffset: 0.015 };