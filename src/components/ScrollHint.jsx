import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ScrollHint({ progress }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      if (v > 0.001) setVisible(false);
    });
    return () => unsub?.();
  }, [progress]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 text-white/80"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
    >
      <div className="flex flex-col items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
        <span className="text-xs">Scroll to wake</span>
        <motion.div
          className="w-4 h-4 border-b-2 border-r-2 border-brand rotate-45"
          animate={{ y: [0, 4, 0], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
