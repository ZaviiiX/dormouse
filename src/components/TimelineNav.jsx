import { motion, useTransform } from "framer-motion";
import { CONTENT_TIMELINE } from "../constants";

const LABELS = ["Sleep", "Wake", "Roadmap", "Moon"];

function TimelineDot({ label, start, end, progress, onClick }) {
  const isActive = useTransform(progress, (v) => v >= start && v < end);
  const scale = useTransform(progress, (v) => (v >= start && v < end ? 1.1 : 1));
  const glow = useTransform(progress, (v) => (v >= start && v < end ? 0.55 : 0.25));
  const boxShadow = useTransform(glow, (g) => `0 0 10px rgba(226,126,0,${g})`);
  const opacity = useTransform(progress, (v) => (v > 0.01 ? 1 : 0));
  const bg = useTransform(isActive, (a) => (a ? "rgba(226,126,0,0.9)" : "rgba(226,126,0,0.5)"));
  const filter = useTransform(isActive, (a) => (a ? "blur(0.5px)" : "none"));

  return (
    <motion.button
      aria-label={`Go to ${label}`}
      title={label}
      onClick={onClick}
      className="relative w-4 h-4 rounded-full border border-brand/50 bg-black/40 backdrop-blur-sm"
      style={{ opacity, scale, boxShadow }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: bg, filter }}
      />
    </motion.button>
  );
}

export function TimelineNav({ progress }) {
  const chapters = CONTENT_TIMELINE;

  const scrollToProgress = (p) => {
    try {
      const doc = document.documentElement;
      const maxScroll = (doc.scrollHeight || document.body.scrollHeight) - window.innerHeight;
      const y = Math.max(0, Math.min(maxScroll, p * maxScroll));
      window.scrollTo({ top: y, behavior: "smooth" });
    } catch (e) {
      // no-op
    }
  };

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 pointer-events-none select-none">
      <div className="flex flex-col gap-3 items-center pointer-events-auto">
        {chapters.map((ch, i) => (
          <TimelineDot
            key={i}
            label={LABELS[i] || `Chapter ${i + 1}`}
            start={ch.start}
            end={ch.end}
            progress={progress}
            onClick={() => scrollToProgress(ch.start)}
          />
        ))}
      </div>
    </div>
  );
}
