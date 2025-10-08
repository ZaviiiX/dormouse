import { motion, useTransform } from "framer-motion";

export function Roadmap({ progress, start = 0.35, end = 1 }) {
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const t = useTransform(progress, (p) => clamp((p - start) / (end - start)));

  // Faza: fade-in (start -> start+0.02), držanje, pa fade-out (end-0.015 -> end)
  const fadeOutStart = end - 0.015;
  const show = useTransform(
    progress,
    [start - 0.0001, start + 0.02, fadeOutStart, end],
    [0, 1, 1, 0]
  );

  const phases = [
    {
      key: "p1",
      title: "Phase 1: Awakening 😴",
      period: "Q3 2025",
      tag: "Launch",
      bullets: [
        "Launch of $NAP community & socials 🐭",
        "First wave of meme campaigns 🚀",
        "Building the Dormouse army 💪",
        "Foundations for growth (website in dev)"
      ]
    },
    {
      key: "p2",
      title: "Phase 2: Cozy Building 🛠️",
      period: "Q4 2025",
      tag: "Growth",
      bullets: [
        "Official DormouseMeme Website Release 🌐",
        "Scaling Telegram & X community 👥",
        "Strategic meme partnerships 🤝",
        "First CEX & DEX listings 🪙"
      ]
    },
    {
      key: "p3",
      title: "Phase 3: Dream Expansion 🌙",
      period: "2026",
      tag: "Expansion",
      bullets: [
        "Dormouse Tamagotchi-style game 👾",
        "NFT integration — collectible Dormice 🎨",
        "Community events & meme contests 🔥",
        "“Napseason” market cycle campaigns 💤"
      ]
    },
    {
      key: "p4",
      title: "Phase 4: The Great Hibernate 🚀",
      period: "Future",
      tag: "Vision",
      bullets: [
        "Ecosystem expansion (staking / rewards / gamification) 💡",
        "Global meme collaborations 🌍",
        "Dormouse becomes the coziest blue-chip 🐭✨",
        "Mission: Dream it. Meme it. Moon it. 🌙"
      ]
    }
  ];

  const count = phases.length;
  // Fokus index (0..count-1)
  const focus = useTransform(t, (v) => v * (count - 1));

  return (
    <motion.div
      className="fixed inset-0 z-[40] pointer-events-none flex items-center justify-start left-100"
      style={{ opacity: show }}
    >
      <div className="relative h-full flex items-center pr-4 sm:pr-8 md:pr-12">
        {/* Linija */}
        <motion.div
          className="absolute right-[8px] sm:right-[16px] top-[10vh] bottom-[10vh] w-[3px] rounded-full overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(226,126,0,0), rgba(226,126,0,0.55), rgba(226,126,0,0))",
            opacity: show
          }}
        >
          <motion.div
            className="absolute left-0 top-0 w-full bg-brand origin-top"
            style={{
              height: useTransform(t, (v) => `${v * 100}%`),
              boxShadow: "0 0 10px 2px rgba(226,126,0,0.55)"
            }}
          />
        </motion.div>

        <div className="relative w-[300px] sm:w-[330px] md:w-[360px] mr-10 sm:mr-14">
          {phases.map((ph, i) => (
            <StackCard
              key={ph.key}
              index={i}
              data={ph}
              focus={focus}
              total={count}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StackCard({ index, data, focus, total }) {
  const delta = useTransform(focus, (f) => index - f);

  const SPACING = 230;
  const y = useTransform(delta, (d) => d * SPACING);

  const scale = useTransform(delta, (d) => {
    const ad = Math.abs(d);
    return 1 - Math.min(0.4, ad * 0.18);
  });

  const opacity = useTransform(delta, (d) => {
    const ad = Math.abs(d);
    if (ad > 2.2) return 0;
    return 1 - ad * 0.55;
  });

  const blur = useTransform(delta, (d) => {
    const ad = Math.abs(d);
    return ad < 0.4 ? "blur(0px)" : ad < 1.2 ? "blur(2px)" : "blur(5px)";
  });

  const active = useTransform(delta, (d) => {
    const ad = Math.min(1, Math.abs(d));
    return 1 - ad;
  });

  const bulletProgress = useTransform(delta, (d) => {
    const ad = Math.abs(d);
    return 1 - Math.min(1, ad / 0.9);
  });

  return (
    <motion.div
      className="absolute left-0 top-1/2 -translate-y-1/2"
      style={{ y, scale, opacity, filter: blur }}
    >
      <motion.div
        className="rounded-2xl border px-5 py-5 md:px-6 md:py-6 bg-black/40 backdrop-blur-md"
        style={{
          borderColor: useTransform(active, (a) => `rgba(226,126,0,${0.15 + a * 0.55})`),
          boxShadow: useTransform(
            active,
            (a) =>
              a > 0.05
                ? `0 0 0 1px rgba(226,126,0,${0.25 + a * 0.3}), 0 0 34px -6px rgba(226,126,0,${
                    0.35 + a * 0.25
                  })`
                : "0 0 0 0 rgba(0,0,0,0)"
          )
        }}
      >
        <Header data={data} active={active} />
        <Bullets bullets={data.bullets} progress={bulletProgress} />
      </motion.div>
    </motion.div>
  );
}

function Header({ data, active }) {
  const periodOpacity = useTransform(active, (s) => 0.25 + s * 0.75);
  const periodScale = useTransform(active, (s) => 0.9 + s * 0.1);
  const tagOpacity = useTransform(active, (s) => 0.15 + s * 0.85);
  return (
    <>
      <div className="flex items-center gap-3 mb-2">
        <motion.span
          className="text-[11px] tracking-wider uppercase font-semibold px-2 py-1 rounded-md bg-brand/20 text-brand"
          style={{ opacity: periodOpacity, scale: periodScale }}
        >
          {data.period}
        </motion.span>
        <motion.span
          className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-white/70"
          style={{ opacity: tagOpacity }}
        >
          {data.tag}
        </motion.span>
      </div>
      <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
        {data.title}
      </h3>
    </>
  );
}

function Bullets({ bullets, progress }) {
  return (
    <ul className="mt-3 space-y-2 text-[13px] md:text-sm text-white/75">
      {bullets.map((b, i) => (
        <Bullet key={i} text={b} index={i} total={bullets.length} progress={progress} />
      ))}
    </ul>
  );
}

function Bullet({ text, index, total, progress }) {
  return (
    <motion.li
      className="flex gap-2"
      style={{
        opacity: useTransform(progress, (p) => {
          const threshold = (index / total) * 0.75;
          return p >= threshold ? 1 : 0;
        }),
        x: useTransform(progress, (p) => {
          const threshold = (index / total) * 0.75;
          const rel = Math.min(1, Math.max(0, (p - threshold) / 0.25));
          return (1 - rel) * 18;
        })
      }}
    >
      <span className="text-brand mt-[2px]">•</span>
      <span>{text}</span>
    </motion.li>
  );
}