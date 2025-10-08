import { motion, useTransform } from "framer-motion";

// Thin top progress bar indicating global scroll storytelling progress
export function ScrollProgressBar({ progress, height = 3 }) {
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(progress, [0, 0.005], [0, 1]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      style={{ height }}
      aria-hidden
    >
      <motion.div
        className="h-full"
        style={{ width, opacity, boxShadow: "0 0 12px rgba(226,126,0,0.45)" }}
      >
        <div className="h-full w-full bg-gradient-to-r from-brand via-orange-400 to-brand" />
      </motion.div>
    </div>
  );
}
