import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, LayoutGrid, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/tools';

// ── Curated Unsplash images per module ───────────────────────────────────────
const CARD_IMAGES: Record<string, string> = {
  "01": "1518770660439-4636190af475", // screenshot tools → glowing monitor
  "02": "1483729600746-1c2ff895b4ab", // Brazil → aerial beach city
  "03": "1501854140801-50d01698950b", // USA Gov → US flag stars
  "04": "1528360983277-13d401cdc186", // China → neon city skyline
  "05": "1499750310107-5ce358b36a0a", // OSINT collections → surveillance eye
  "06": "1509087859087-a384654eca4c", // Identity OSINT → fingerprint scan
  "07": "1507842217343-583bb2515660", // Web Archives → library shelves
  "08": "1558494949-ef010cbdcc31",    // Domain / DNS → server room
  "09": "1550745165-9bc0b252726f",    // Threat Intel → deep blue cyber
  "10": "1446776811953-b23d57bd21aa", // GEOINT → satellite earth
  "11": "1518546305927-5a555bb7020d", // Blockchain → bitcoin glow
  "12": "1526374965328-7f61d4dc18c5", // Rev Eng → green matrix code
  "13": "1512941937669-90a1b58e7e9c", // Mobile/Firmware → phone in dark
  "14": "1558618666-fcd25c85cd64",    // Network → ethernet cables
  "15": "1550751827-4bd374c3f58b",    // DFIR Blue Team → dark forensics
  "16": "1498050108023-c5249f4df085", // Security OS → dark hacker desk
  "17": "1677756119021-68e24d31e4d4", // AI / Chat → neural circuit board
  "18": "1555949963-ff9fe0c870eb",    // AI Coding → code on screen night
  "19": "1544197150-b99a580bb7a8",    // AI Local → rack servers blue
  "20": "1485827404703-89b55fcc595e", // AI Automation → robot arm
  "21": "1531297484001-80022131f5a1", // China AI → space city concept
  "22": "1563986768609-322da13575f3", // AI Security → dark shield glow
  "23": "1620712943543-bcc4688e7485", // China Cyber → cyber dark
  "24": "1460925895917-afdab827c52f", // SEO / Content → analytics dash
  "25": "1451187580459-43490279c0fa", // GEO / LLMO → glowing globe
};

// Short, punchy subtitles per module
const CARD_SUBTITLES: Record<string, string> = {
  "01": "Tools, references & foundational resources",
  "02": "Brazilian databases & open data",
  "03": "Federal, state & public-record lookups",
  "04": "Chinese registries & social platforms",
  "05": "Frameworks, maps & OSINT mega-lists",
  "06": "Track identities across the internet",
  "07": "Search engines, Wayback & deep-web archives",
  "08": "Shodan, DNS lookups & IP intelligence",
  "09": "IOC feeds, sandboxes & phishing trackers",
  "10": "Satellite imagery, ADS-B & vessel tracking",
  "11": "Blockchain explorers & crypto analytics",
  "12": "Ghidra, angr, disassemblers & debuggers",
  "13": "APK analysis, iOS forensics & firmware tools",
  "14": "Burp, Nmap, Wireshark & wireless auditing",
  "15": "Memory analysis, SIEM, IDS & incident response",
  "16": "Kali, Parrot, Tails & isolated lab builds",
  "17": "GPT-4, Claude, Gemini & frontier AI",
  "18": "Cursor, Copilot, Devin & AI pair programmers",
  "19": "Ollama, LM Studio & on-device LLMs",
  "20": "AutoGen, LangGraph & autonomous workflows",
  "21": "DeepSeek, Qwen, Baidu & Chinese AI models",
  "22": "Red-team LLMs, jailbreak testing & prompt injection",
  "23": "Chinese cyber-asset & vulnerability scanners",
  "24": "Keyword research, backlinks & content strategy",
  "25": "Geo-targeting, answer engines & AI search visibility",
};

function getImgUrl(id: string) {
  const photoId = CARD_IMAGES[id] ?? CARD_IMAGES["01"];
  return `https://images.unsplash.com/photo-${photoId}?w=700&h=1000&auto=format&fit=crop&q=80`;
}

// ── Perspective card offsets ──────────────────────────────────────────────────
type OffsetConfig = { x: number; z: number; rotateY: number; scale: number; opacity: number; zIndex: number };

function getOffset(delta: number): OffsetConfig {
  const abs = Math.abs(delta);
  if (abs > 3) return { x: delta > 0 ? 440 : -440, z: -400, rotateY: delta > 0 ? 40 : -40, scale: 0.3, opacity: 0, zIndex: 0 };
  const configs: OffsetConfig[] = [
    { x: 0,    z: 0,    rotateY: 0,    scale: 1.0,  opacity: 1.0,  zIndex: 10 }, // 0  center
    { x: 280,  z: -160, rotateY: 30,   scale: 0.82, opacity: 0.7,  zIndex: 8  }, // ±1
    { x: 460,  z: -280, rotateY: 48,   scale: 0.62, opacity: 0.4,  zIndex: 6  }, // ±2
    { x: 580,  z: -370, rotateY: 58,   scale: 0.46, opacity: 0.18, zIndex: 4  }, // ±3
  ];
  const cfg = configs[abs] ?? configs[3];
  return delta < 0
    ? { ...cfg, x: -cfg.x, rotateY: -cfg.rotateY }
    : cfg;
}

// ── Individual card ───────────────────────────────────────────────────────────
function TopicCard({
  cat,
  delta,
  onClick,
}: {
  cat: typeof CATEGORIES[number];
  delta: number;
  onClick: () => void;
}) {
  const off = getOffset(delta);
  const isCenter = delta === 0;

  return (
    <motion.div
      onClick={onClick}
      animate={{
        x: off.x,
        z: off.z,
        rotateY: off.rotateY,
        scale: off.scale,
        opacity: off.opacity,
      }}
      transition={{ type: "spring", stiffness: 220, damping: 28, mass: 0.8 }}
      style={{
        position: "absolute",
        zIndex: off.zIndex,
        width: 260,
        height: 380,
        transformStyle: "preserve-3d",
        cursor: isCenter ? "default" : "pointer",
      }}
      className="select-none"
    >
      {/* Card face */}
      <div
        className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl"
        style={{
          border: isCenter ? "1.5px solid rgba(255,255,255,0.25)" : "1.5px solid rgba(255,255,255,0.06)",
          boxShadow: isCenter
            ? "0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        {/* Image */}
        <img
          src={getImgUrl(cat.id)}
          alt={cat.label}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: isCenter ? "brightness(0.72)" : "brightness(0.45) saturate(0.6)" }}
          loading="lazy"
          draggable={false}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.92) 100%)",
          }}
        />

        {/* Module badge top-left */}
        <div className="absolute top-4 left-4">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Module {cat.id}
          </span>
        </div>

        {/* Tool count top-right */}
        {isCenter && (
          <div className="absolute top-4 right-4">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{
                background: "rgba(99,102,241,0.3)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(99,102,241,0.5)",
                color: "#a5b4fc",
              }}
            >
              <Sparkles className="w-2.5 h-2.5" />
              {cat.links.length} tools
            </span>
          </div>
        )}

        {/* Bottom text */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-white font-extrabold text-base leading-tight mb-1.5 line-clamp-2">
            {cat.label}
          </h3>
          {isCenter && (
            <p className="text-white/55 text-[11px] leading-relaxed line-clamp-2">
              {CARD_SUBTITLES[cat.id]}
            </p>
          )}
        </div>

        {/* Center card: glowing bottom border */}
        {isCenter && (
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.9), transparent)",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface TopicPickerProps {
  onSelectTopic: (categoryId: string) => void;
  onBrowseAll: () => void;
}

export function TopicPicker({ onSelectTopic, onBrowseAll }: TopicPickerProps) {
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-80, 0, 80], [0.6, 1, 0.6]);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = CATEGORIES.length;
  const activeCat = CATEGORIES[active];

  const prev = useCallback(() => setActive(i => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setActive(i => (i + 1) % total), [total]);

  // Auto-advance every 4s
  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(next, 4000);
  }, [next]);

  useEffect(() => {
    resetAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [resetAuto]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { prev(); resetAuto(); }
      if (e.key === "ArrowRight") { next(); resetAuto(); }
      if (e.key === "Enter") onSelectTopic(activeCat.id);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, resetAuto, activeCat, onSelectTopic]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    setDragging(false);
    dragX.set(0);
    if (info.offset.x < -60) { next(); resetAuto(); }
    else if (info.offset.x > 60) { prev(); resetAuto(); }
  };

  // Which indices to render (center ±3)
  const visibleIndices = [-3, -2, -1, 0, 1, 2, 3].map(d => ({
    delta: d,
    realIdx: ((active + d) % total + total) % total,
  }));

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 120% 80% at 50% 10%, #0e1a3a 0%, #060b18 60%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative z-10 text-center mb-10 px-4"
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
          style={{ color: "rgba(165,180,252,0.8)" }}
        >
          Duck Master · 842 tools · 25 modules
        </p>
        <h1
          className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none"
          style={{
            background: "linear-gradient(135deg, #ffffff 30%, #a5b4fc 70%, #818cf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          What do you want<br />to learn today?
        </h1>
      </motion.div>

      {/* Carousel stage */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: "100%", height: 420, perspective: "1000px" }}
      >
        {/* Drag layer over center card */}
        <motion.div
          className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          style={{ x: dragX, opacity: dragOpacity }}
          onDragStart={() => setDragging(true)}
          onDragEnd={handleDragEnd}
        />

        {/* Cards */}
        <div style={{ position: "relative", transformStyle: "preserve-3d" }}>
          {visibleIndices.map(({ delta, realIdx }) => (
            <TopicCard
              key={CATEGORIES[realIdx].id}
              cat={CATEGORIES[realIdx]}
              delta={delta}
              onClick={() => {
                if (!dragging) {
                  if (delta === 0) {
                    onSelectTopic(CATEGORIES[realIdx].id);
                  } else {
                    setActive(realIdx);
                    resetAuto();
                  }
                }
              }}
            />
          ))}
        </div>

        {/* Left / Right arrows */}
        <button
          onClick={() => { prev(); resetAuto(); }}
          className="absolute left-2 md:left-8 z-30 w-10 h-10 flex items-center justify-center rounded-full transition-all"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            color: "rgba(255,255,255,0.7)",
          }}
          aria-label="Previous topic"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => { next(); resetAuto(); }}
          className="absolute right-2 md:right-8 z-30 w-10 h-10 flex items-center justify-center rounded-full transition-all"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            color: "rgba(255,255,255,0.7)",
          }}
          aria-label="Next topic"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* CTA below carousel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative z-10 flex flex-col items-center gap-4 mt-8 px-4"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="text-center"
          >
            <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5 font-medium">
              Module {activeCat.id} · {activeCat.links.length} tools
            </p>
            <p className="text-white/75 text-sm font-medium max-w-xs leading-relaxed">
              {CARD_SUBTITLES[activeCat.id]}
            </p>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => onSelectTopic(activeCat.id)}
          className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm transition-all"
          style={{
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            color: "#fff",
            boxShadow: "0 0 32px rgba(99,102,241,0.45), 0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          Explore this module
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>

      {/* Dot navigation */}
      <div className="relative z-10 flex items-center gap-1.5 mt-6">
        {CATEGORIES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); resetAuto(); }}
            className="rounded-full transition-all"
            style={{
              width: i === active ? 20 : 5,
              height: 5,
              background: i === active ? "#818cf8" : "rgba(255,255,255,0.2)",
            }}
            aria-label={`Go to module ${i + 1}`}
          />
        ))}
      </div>

      {/* Browse all link */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onBrowseAll}
        className="relative z-10 mt-5 flex items-center gap-1.5 text-xs font-medium transition-colors"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        Browse all 25 modules
      </motion.button>
    </div>
  );
}
