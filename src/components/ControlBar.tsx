import { AnimatePresence, motion } from "framer-motion";
import {
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Zap,
  Shuffle,
} from "lucide-react";
import { useCircuitStore } from "../store/useCircuitStore";
import { BIT_COLORS } from "../lib/colors";
import { audio } from "../lib/audio";

export function ControlBar() {
  const clock = useCircuitStore((s) => s.clock);
  const autoClock = useCircuitStore((s) => s.autoClock);
  const speedHz = useCircuitStore((s) => s.speedHz);
  const muted = useCircuitStore((s) => s.muted);
  const autoPattern = useCircuitStore((s) => s.autoPattern);

  const pushBit = useCircuitStore((s) => s.pushBit);
  const reset = useCircuitStore((s) => s.reset);
  const toggleAutoClock = useCircuitStore((s) => s.toggleAutoClock);
  const setSpeed = useCircuitStore((s) => s.setSpeed);
  const toggleMute = useCircuitStore((s) => s.toggleMute);
  const setAutoPattern = useCircuitStore((s) => s.setAutoPattern);

  const handlePrime = () => audio.primeOnFirstInteraction();

  return (
    <div
      className="fixed left-0 right-0 bottom-3 z-40 flex justify-center pointer-events-none px-3"
      onPointerDown={handlePrime}
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="pointer-events-auto glass shadow-panel rounded-2xl px-3 py-3 flex flex-wrap items-center gap-2 sm:gap-3 max-w-[min(96vw,1080px)]"
      >
        {/* Botones 0 / 1 */}
        <BigButton
          label="Cargar 0"
          shortcut="0"
          color="#94a3b8"
          onClick={() => pushBit(0)}
        />
        <BigButton
          label="Cargar 1"
          shortcut="1"
          color={BIT_COLORS[1]}
          accent
          onClick={() => pushBit(1)}
        />

        <Divider />

        {/* Reset */}
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors hairline"
        >
          <RotateCcw size={15} />
          <span>Reset</span>
        </button>

        <Divider />

        {/* Auto clock */}
        <button
          onClick={toggleAutoClock}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm transition-colors hairline ${
            autoClock
              ? "bg-cyan-400/15 text-cyan-200 border-cyan-400/40"
              : "text-slate-300 hover:text-white hover:bg-white/10"
          }`}
        >
          {autoClock ? <Pause size={15} /> : <Play size={15} />}
          <span>Reloj auto</span>
        </button>

        {/* Slider */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <Zap
            size={14}
            className="text-slate-400"
            style={{
              filter: autoClock
                ? "drop-shadow(0 0 6px rgba(34,211,238,0.7))"
                : "none",
              color: autoClock ? "#22d3ee" : undefined,
            }}
          />
          <input
            type="range"
            min={0.5}
            max={4}
            step={0.1}
            value={speedHz}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="accent-cyan-400 flex-1"
            aria-label="Velocidad del reloj"
          />
          <span className="text-xs font-mono text-slate-300 min-w-[40px] text-right">
            {speedHz.toFixed(1)} Hz
          </span>
        </div>

        {/* Patron */}
        <div className="hidden sm:flex items-center gap-1 rounded-xl bg-white/5 hairline px-1 py-1">
          {(
            [
              { id: "alternate", label: "1010" },
              { id: "ones", label: "1s" },
              { id: "zeros", label: "0s" },
              { id: "random", label: "rand" },
            ] as const
          ).map((opt) => {
            const isActive = autoPattern === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setAutoPattern(opt.id)}
                className={`relative px-2 py-1 text-[11px] rounded-lg transition-colors ${
                  isActive ? "text-white" : "text-slate-400 hover:text-slate-100"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="pattern-pill"
                    className="absolute inset-0 rounded-lg bg-white/10 hairline"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative font-mono flex items-center gap-1">
                  {opt.id === "random" && <Shuffle size={10} />}
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        <Divider />

        {/* Contador de ciclos */}
        <div className="hidden md:flex items-center gap-2 text-xs px-2 text-slate-400">
          <span className="uppercase tracking-wider">CLK</span>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={clock}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="font-mono font-bold text-base text-slate-100 min-w-[24px] text-center"
            >
              {clock}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Mute */}
        <button
          onClick={toggleMute}
          className="inline-flex items-center justify-center rounded-xl px-2 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors hairline"
          aria-label={muted ? "Activar sonido" : "Silenciar"}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </motion.div>
    </div>
  );
}

function Divider() {
  return <span className="hidden sm:block w-px h-8 bg-white/10" />;
}

function BigButton({
  label,
  shortcut,
  color,
  onClick,
  accent = false,
}: {
  label: string;
  shortcut: string;
  color: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      className="relative inline-flex items-center gap-2 rounded-xl px-3.5 py-2 font-semibold text-sm text-white transition-shadow"
      style={{
        background: accent
          ? `linear-gradient(180deg, ${color}66, ${color}22)`
          : "rgba(255,255,255,0.04)",
        border: `1px solid ${color}55`,
        boxShadow: accent
          ? `0 0 0 1px ${color}44 inset, 0 8px 24px ${color}30`
          : "0 8px 24px rgba(0,0,0,0.2)",
      }}
    >
      <span
        className="inline-flex items-center justify-center w-6 h-6 rounded-md font-mono text-xs"
        style={{
          background: `${color}22`,
          border: `1px solid ${color}55`,
          color,
          boxShadow: `0 0 6px ${color}55`,
        }}
      >
        {shortcut}
      </span>
      <span>{label}</span>
    </motion.button>
  );
}
