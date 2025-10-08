import { motion, useTransform } from "framer-motion";
import { useState } from "react";

/**
 * Social Links Section - bottom bar design with brand colors
 */
export function SocialSection({ scrollProgress, startAt = 0.9, endAt = 1 }) {
  const [hoveredSocial, setHoveredSocial] = useState(null);

  // Scroll-based animations for bottom bar
  const opacity = useTransform(scrollProgress, [startAt - 0.05, startAt], [0, 1]);
  const y = useTransform(scrollProgress, [startAt - 0.05, startAt], [60, 0]);

  const socials = [
    {
      name: "X",
      icon: "/images/twitter.svg",
      url: "https://x.com/DormouseMeme",
      description: "Follow for updates",
      size: { className: "w-9 h-9", width: "36px", height: "36px" }
    },
    {
      name: "Telegram",
      icon: "/images/telegram.svg",
      url: "https://t.me/DormouseMeme", 
      description: "Join community",
      size: { className: "w-12 h-12", width: "52px", height: "52px" }
    }
  ];

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none z-20"
      style={{ opacity }}
    >
      {/* Bottom social bar - glass morphism with brand colors */}
      <motion.div
        className="pointer-events-auto"
        style={{ y }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: scrollProgress.get() > startAt ? 1 : 0,
          scale: scrollProgress.get() > startAt ? 1 : 0.8
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Glass morphism container - narrower height, wider width */}
        <div className="flex items-center gap-8 bg-cave2/90 backdrop-blur-md border border-brand/30 rounded-full px-12 py-2.5 shadow-xl shadow-brand/20">
          {/* Left text */}
          <motion.span 
            className="text-sm text-white/80 font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: scrollProgress.get() > startAt + 0.02 ? 1 : 0,
              x: scrollProgress.get() > startAt + 0.02 ? 0 : -20
            }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Join the #NAPGANG:
          </motion.span>

          {/* Social icons with wave entrance */}
          <div className="flex items-center gap-4">
            {socials.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-10 h-10 flex items-center justify-center rounded-full border border-brand/30 hover:border-brand/60 bg-brand/10 hover:bg-brand/20 text-lg transition-all duration-300"
                onHoverStart={() => setHoveredSocial(social.name)}
                onHoverEnd={() => setHoveredSocial(null)}
                initial={{ opacity: 0, y: 30, scale: 0.5 }}
                animate={{ 
                  opacity: scrollProgress.get() > startAt + 0.04 + (index * 0.02) ? 1 : 0,
                  y: scrollProgress.get() > startAt + 0.04 + (index * 0.02) ? 0 : 30,
                  scale: scrollProgress.get() > startAt + 0.04 + (index * 0.02) ? 1 : 0.5
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.5 + (index * 0.15),
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.1,
                  y: -2,
                  boxShadow: "0 8px 25px rgba(226, 126, 0, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* SVG Icon - individual sizing per platform */}
                <motion.img
                  src={social.icon}
                  alt={social.name}
                  className={social.size.className}
                  style={{ 
                    width: social.size.width,
                    height: social.size.height,
                    objectFit: social.name === "Telegram" ? 'cover' : 'contain',
                    transform: social.name === "Telegram" ? 'scale(1.5)' : 'scale(0.5)',
                    overflow: 'visible'
                  }}
                  animate={{
                    scale: hoveredSocial === social.name ? 1.2 : 1
                  }}
                  transition={{ duration: 0.2 }}
                />

                {/* Hover tooltip */}
                {hoveredSocial === social.name && (
                  <motion.div
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-cave2/95 border border-brand/30 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap backdrop-blur-sm"
                    initial={{ opacity: 0, y: 5, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {social.description}
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-brand/30"></div>
                  </motion.div>
                )}

                {/* Click ripple effect */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-brand/30"
                  initial={{ opacity: 0, scale: 0 }}
                  whileTap={{ opacity: 0.6, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}