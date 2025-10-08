import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * Advanced Content & Storytelling System
 * Enhanced story segments, tooltip system, mini-games, achievements, meme gallery
 */

// Enhanced story segments with dynamic content
export function StorySegments({ activeProgress }) {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [achievements, setAchievements] = useState([]);

  const storySegments = [
    {
      id: 'intro',
      title: 'The Great Nap Begins',
      progress: [0, 0.15],
      content: {
        main: 'In the cozy depths of the forest, our hero Dormouse settles in for the most epic nap of all time...',
        subtext: 'Little did he know this nap would change everything.',
        facts: ['Dormice can sleep up to 6 months!', 'They dream in meme format', 'Professional nappers since 1865']
      }
    },
    {
      id: 'stirring',
      title: 'The Stirring',
      progress: [0.15, 0.35],
      content: {
        main: 'Something magical is happening... the Dormouse begins to sense opportunity in the blockchain air.',
        subtext: 'Even in sleep, diamond hands are forming.',
        facts: ['First signs of moon mission detected', 'Whiskers twitching with alpha energy', 'Dreams of 100x gains beginning']
      }
    },
    {
      id: 'awakening',
      title: 'The Great Awakening',
      progress: [0.35, 0.55],
      content: {
        main: 'Eyes flutter open. The forest has changed. Web3 energy flows through every leaf and branch.',
        subtext: 'This is no ordinary wake-up call.',
        facts: ['Blockchain consciousness activated', 'Meme radar fully operational', 'Community building instincts engaged']
      }
    },
    {
      id: 'journey',
      title: 'The Journey to the Moon',
      progress: [0.55, 0.85],
      content: {
        main: 'Our hero embarks on the ultimate roadmap adventure, gathering fellow nappers for the mission ahead.',
        subtext: 'Every great meme coin needs its army.',
        facts: ['Recruiting the #NAPGANG', 'Building unbreakable community bonds', 'Preparing for intergalactic travel']
      }
    },
    {
      id: 'launch',
      title: 'Ready for Launch',
      progress: [0.85, 1],
      content: {
        main: 'Rocket fueled, community united, memes loaded. The Dormouse is ready to lead us all to the moon!',
        subtext: 'This is just the beginning.',
        facts: ['Mission parameters confirmed', 'All systems go for moonshot', 'Destination: Andromeda']
      }
    }
  ];

  // Update current segment based on scroll progress
  useEffect(() => {
    const progress = activeProgress.get();
    const segment = storySegments.findIndex(s => 
      progress >= s.progress[0] && progress <= s.progress[1]
    );
    if (segment !== -1 && segment !== currentSegment) {
      setCurrentSegment(segment);
      
      // Unlock achievement for reaching new segment
      const achievementId = `segment_${segment}`;
      if (!achievements.includes(achievementId)) {
        unlockAchievement(achievementId);
      }
    }
  }, [activeProgress, currentSegment, achievements]);

  const unlockAchievement = (achievementId) => {
    setAchievements(prev => [...prev, achievementId]);
    // Show achievement notification
    showAchievementNotification(achievementId);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentSegment}
        className="fixed bottom-4 left-4 z-40 max-w-sm pointer-events-auto"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-black/90 backdrop-blur-md rounded-2xl p-6 border border-brand/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-sm">
              {currentSegment + 1}
            </div>
            <h3 className="font-bold text-white text-sm">
              {storySegments[currentSegment]?.title}
            </h3>
          </div>
          
          <p className="text-white/90 text-sm leading-relaxed mb-3">
            {storySegments[currentSegment]?.content.main}
          </p>
          
          <p className="text-brand text-xs italic mb-4">
            {storySegments[currentSegment]?.content.subtext}
          </p>

          {/* Fun facts */}
          <div className="space-y-1">
            {storySegments[currentSegment]?.content.facts.map((fact, i) => (
              <motion.div
                key={i}
                className="text-white/60 text-xs flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <span className="text-brand">•</span>
                <span>{fact}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Interactive tooltip system
export function TooltipSystem({ children, content, position = "top" }) {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
  };

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cursor-help"
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{
              left: mousePos.x,
              top: mousePos.y - 40
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-black/95 backdrop-blur-md text-white px-3 py-2 rounded-lg text-sm max-w-xs border border-brand/30">
              {typeof content === 'string' ? (
                <p>{content}</p>
              ) : (
                content
              )}
              
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/95" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Mini-game: Dormouse Catching
export function DormouseCatchingGame({ onScore }) {
  const [gameState, setGameState] = useState('idle'); // idle, playing, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [dormousePosition, setDormousePosition] = useState({ x: 50, y: 50 });

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    moveDormouse();
  };

  const moveDormouse = () => {
    if (gameState !== 'playing') return;
    
    const newX = Math.random() * 80 + 10;
    const newY = Math.random() * 80 + 10;
    setDormousePosition({ x: newX, y: newY });
    
    setTimeout(moveDormouse, 1500 - (score * 50)); // Gets faster as score increases
  };

  const catchDormouse = () => {
    if (gameState === 'playing') {
      setScore(prev => prev + 1);
      moveDormouse();
    }
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState('finished');
      onScore?.(score);
    }
  }, [gameState, timeLeft, score, onScore]);

  return (
    <AnimatePresence>
      {gameState !== 'idle' && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-cave rounded-2xl p-8 max-w-md w-full mx-4 border border-brand/30">
            <h3 className="text-2xl font-bold text-center mb-4 text-white">
              Catch the Dormouse! 🐭
            </h3>
            
            {gameState === 'playing' && (
              <>
                <div className="flex justify-between mb-4 text-white">
                  <span>Score: {score}</span>
                  <span>Time: {timeLeft}s</span>
                </div>
                
                <div className="relative h-64 bg-brand/10 rounded-lg overflow-hidden border border-brand/30">
                  <motion.button
                    className="absolute w-12 h-12 bg-brand rounded-full flex items-center justify-center text-2xl cursor-pointer"
                    style={{
                      left: `${dormousePosition.x}%`,
                      top: `${dormousePosition.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={catchDormouse}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity
                    }}
                  >
                    🐭
                  </motion.button>
                </div>
              </>
            )}
            
            {gameState === 'finished' && (
              <div className="text-center text-white">
                <div className="text-4xl mb-4">🎉</div>
                <p className="text-xl mb-2">Game Over!</p>
                <p className="text-lg mb-4">Final Score: {score}</p>
                <button
                  onClick={startGame}
                  className="bg-brand text-cave px-6 py-2 rounded-lg font-semibold hover:bg-brand/90 transition-colors"
                >
                  Play Again
                </button>
              </div>
            )}
            
            <button
              onClick={() => setGameState('idle')}
              className="mt-4 w-full text-white/60 hover:text-white transition-colors"
            >
              Close Game
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Achievement system
export function AchievementSystem() {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);

  const achievements = {
    first_scroll: { title: "First Scroll", description: "Started the journey", icon: "📜" },
    halfway_point: { title: "Halfway There", description: "Reached 50% progress", icon: "🎯" },
    speed_scroller: { title: "Speed Scroller", description: "Completed in under 2 minutes", icon: "⚡" },
    social_butterfly: { title: "Social Butterfly", description: "Clicked all social links", icon: "🦋" },
    mini_game_master: { title: "Mini Game Master", description: "Scored 20+ in catching game", icon: "🏆" },
    segment_0: { title: "Nap Beginner", description: "Entered the first story segment", icon: "😴" },
    segment_1: { title: "Stirring Sleeper", description: "Reached the stirring phase", icon: "👁️" },
    segment_2: { title: "Awakened Soul", description: "Experienced the great awakening", icon: "✨" },
    segment_3: { title: "Journey Walker", description: "Embarked on the moon journey", icon: "🚶" },
    segment_4: { title: "Launch Ready", description: "Ready for the final launch", icon: "🚀" }
  };

  const unlockAchievement = (achievementId) => {
    if (!unlockedAchievements.includes(achievementId)) {
      setUnlockedAchievements(prev => [...prev, achievementId]);
      setShowAchievement(achievements[achievementId]);
      
      setTimeout(() => setShowAchievement(null), 4000);
    }
  };

  return (
    <>
      {/* Achievement notification */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            className="fixed top-20 right-6 z-50 bg-brand text-cave p-4 rounded-lg shadow-xl max-w-sm"
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{showAchievement.icon}</span>
              <div>
                <h4 className="font-bold">Achievement Unlocked!</h4>
                <p className="text-sm font-semibold">{showAchievement.title}</p>
                <p className="text-xs opacity-80">{showAchievement.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement progress indicator */}
      <div className="fixed bottom-20 right-6 z-40">
        <div className="text-white/60 text-xs text-center">
          <div className="text-brand font-semibold">
            {unlockedAchievements.length}/{Object.keys(achievements).length}
          </div>
          Achievements
        </div>
      </div>
    </>
  );
}

// Meme gallery component
export function MemeGallery({ isOpen, onClose }) {
  const [selectedMeme, setSelectedMeme] = useState(null);

  const memes = [
    { id: 1, src: "/images/memes/dormouse-nap-1.jpg", title: "The Original Napper", likes: 420 },
    { id: 2, src: "/images/memes/dormouse-moon-1.jpg", title: "Moon Mission Initiated", likes: 690 },
    { id: 3, src: "/images/memes/dormouse-community-1.jpg", title: "#NAPGANG Strong", likes: 350 },
    { id: 4, src: "/images/memes/dormouse-diamond-hands.jpg", title: "Diamond Paws", likes: 580 },
    { id: 5, src: "/images/memes/dormouse-rocket.jpg", title: "To The Moon!", likes: 750 },
    { id: 6, src: "/images/memes/dormouse-hodl.jpg", title: "HODL Through The Nap", likes: 420 }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">🖼️ Meme Gallery</h2>
                <button
                  onClick={onClose}
                  className="text-white/60 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memes.map((meme, index) => (
                  <motion.div
                    key={meme.id}
                    className="bg-white/10 rounded-lg overflow-hidden cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedMeme(meme)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="aspect-square bg-brand/20 flex items-center justify-center">
                      <span className="text-4xl">🐭</span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2">{meme.title}</h3>
                      <div className="flex items-center gap-2 text-brand">
                        <span>❤️</span>
                        <span>{meme.likes}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Global function to show achievement notifications
window.showAchievementNotification = function(achievementId) {
  // This would connect to the AchievementSystem component
  console.log(`Achievement unlocked: ${achievementId}`);
};