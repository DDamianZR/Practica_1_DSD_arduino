import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCircuitStore } from "../../store/useCircuitStore";
import { BIT_COLORS, CLK_COLOR, DIN_COLOR } from "../../lib/colors";
import { boolToBit } from "../../lib/shiftRegister";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ArduinoBoard } from "./ArduinoBoard";
import { Led } from "./Led";
import { PushButton } from "./PushButton";
import { Wire } from "./Wire";

// coordenadas de la escena (viewBox 1000 x 560)
const LED_Y = 110;
const LED_XS = [250, 430, 610, 790];
const BOARD = { x: 140, y: 350, w: 780, h: 170 };
const LED_PIN_LABELS = ["D2", "D3", "D4", "D5"];
const BTN_0 = { cx: 70, cy: 220 };
const BTN_1 = { cx: 70, cy: 320 };
const BTN_0_PIN = { x: 200, y: BOARD.y + 4 };
const BTN_1_PIN = { x: 200, y: BOARD.y + BOARD.h - 4 };
const GND_PIN = { x: BOARD.x + BOARD.w - 40, y: BOARD.y + BOARD.h - 4 };

function ledWirePath(index: number): string {
  const x = LED_XS[index];
  const yTop = LED_Y + 40; // bajo el LED
  const yBottom = BOARD.y - 2;
  // pequeno bezier para no ser rigido
  return `M ${x} ${yTop} C ${x} ${yTop + 60}, ${x} ${yBottom - 60}, ${x} ${yBottom}`;
}

function btnWirePath(btnCx: number, btnCy: number, pinX: number, pinY: number): string {
  const startX = btnCx + 28; // borde derecho del boton
  const startY = btnCy;
  const midX = (startX + pinX) / 2 + 30;
  return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${pinY}, ${pinX} ${pinY}`;
}

function gndWirePath(fromX: number, fromY: number): string {
  return `M ${fromX} ${fromY} L ${fromX + 30} ${fromY} L ${fromX + 30} ${fromY + 20} L ${GND_PIN.x} ${GND_PIN.y + 20} L ${GND_PIN.x} ${GND_PIN.y}`;
}

export function CircuitView() {
  const reg = useCircuitStore((s) => s.reg);
  const lastEdge = useCircuitStore((s) => s.lastEdge);
  const clock = useCircuitStore((s) => s.clock);
  const lastDin = useCircuitStore((s) => s.lastDin);
  const pushBit = useCircuitStore((s) => s.pushBit);
  const reducedMotion = useReducedMotion();

  // Track cambios de reg para "flash" del LED que cambio
  const [flashIdx, setFlashIdx] = useState<number | null>(null);
  const [prevReg, setPrevReg] = useState(reg);
  useEffect(() => {
    let changed: number | null = null;
    for (let i = 0; i < 4; i++) {
      if (reg[i] !== prevReg[i]) {
        // preferimos avisar del que se enciende
        if (reg[i] && !prevReg[i]) {
          changed = i;
          break;
        }
        if (changed === null) changed = i;
      }
    }
    if (changed !== null) {
      setFlashIdx(changed);
      const t = setTimeout(() => setFlashIdx(null), 400);
      setPrevReg(reg);
      return () => clearTimeout(t);
    }
    setPrevReg(reg);
  }, [reg]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pulso de reloj: cambia cuando el clock aumenta
  const pulseKey = clock > 0 ? clock : null;

  const q3 = boolToBit(reg[3]);
  const regBits = `${boolToBit(reg[3])}${boolToBit(reg[2])}${boolToBit(reg[1])}${boolToBit(reg[0])}`;

  return (
    <section
      id="circuito"
      className="relative w-full rounded-3xl glass shadow-panel p-4 sm:p-6"
    >
      <header className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            <span className="text-slate-100">Circuito</span>{" "}
            <span className="text-slate-400 font-medium">
              — Arduino UNO + 4 LEDs + 2 botones
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Cada boton genera un pulso de reloj e inyecta un bit en Q0. El bit se
            propaga a la derecha (Q0 → Q1 → Q2 → Q3).
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <RegBadge label="Din" value={lastDin ?? "–"} color={DIN_COLOR} />
          <RegBadge label="Registro" value={regBits} color="#e2e8f0" mono />
          <RegBadge label="Salida serie (Q3)" value={q3} color={BIT_COLORS[3]} />
        </div>
      </header>

      <div className="relative w-full aspect-[1000/560] rounded-2xl overflow-hidden hairline">
        {/* fondo estilo tabla */}
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 bg-grid-fade" />
        <svg
          viewBox="0 0 1000 560"
          className="relative w-full h-full"
          role="img"
          aria-label="Diagrama esquematico del registro SISO en Arduino"
        >
          {/* Definiciones globales */}
          <defs>
            <linearGradient id="railGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(148,163,184,0.35)" />
              <stop offset="1" stopColor="rgba(148,163,184,0)" />
            </linearGradient>
          </defs>

          {/* Cables botones -> pines */}
          <Wire
            d={btnWirePath(BTN_0.cx, BTN_0.cy, BTN_0_PIN.x, BTN_0_PIN.y)}
            color="#94a3b8"
            active={lastEdge !== null && lastDin === 0}
            pulseKey={lastEdge !== null && lastDin === 0 ? `b0-${clock}` : null}
            reducedMotion={reducedMotion}
          />
          <Wire
            d={btnWirePath(BTN_1.cx, BTN_1.cy, BTN_1_PIN.x, BTN_1_PIN.y)}
            color={BIT_COLORS[1]}
            active={lastEdge !== null && lastDin === 1}
            pulseKey={lastEdge !== null && lastDin === 1 ? `b1-${clock}` : null}
            reducedMotion={reducedMotion}
          />

          {/* Cables GND (siempre pasivos) */}
          <Wire
            d={gndWirePath(BTN_0.cx + 28, BTN_0.cy + 18)}
            color="#64748b"
            strokeWidth={1.6}
            dashed
          />
          <Wire
            d={gndWirePath(BTN_1.cx + 28, BTN_1.cy + 18)}
            color="#64748b"
            strokeWidth={1.6}
            dashed
          />

          {/* Cables Arduino -> LEDs (4) */}
          {LED_XS.map((_, i) => (
            <Wire
              key={`ledw-${i}`}
              d={ledWirePath(i)}
              color={BIT_COLORS[i]}
              active={reg[i]}
              pulseKey={pulseKey !== null ? `led-${i}-${pulseKey}` : null}
              reducedMotion={reducedMotion}
            />
          ))}

          {/* Arduino */}
          <ArduinoBoard
            x={BOARD.x}
            y={BOARD.y}
            width={BOARD.w}
            height={BOARD.h}
            ledPins={LED_XS.map((x, i) => ({
              x,
              y: BOARD.y - 2,
              label: LED_PIN_LABELS[i],
            }))}
            buttonPins={[
              { x: BTN_0_PIN.x, y: BTN_0_PIN.y, label: "D6" },
              { x: BTN_1_PIN.x, y: BTN_1_PIN.y, label: "D7" },
            ]}
            gndPin={GND_PIN}
          />

          {/* Barra colectora conceptual (CLK) — indicador visual */}
          <ClockRail
            active={lastEdge !== null}
            clock={clock}
            reducedMotion={reducedMotion}
          />

          {/* LEDs */}
          {LED_XS.map((x, i) => (
            <Led
              key={`led-${i}`}
              cx={x}
              cy={LED_Y}
              color={BIT_COLORS[i]}
              on={reg[i]}
              label={`Q${i}`}
              pinLabel={LED_PIN_LABELS[i]}
              flash={flashIdx === i}
            />
          ))}

          {/* Botones */}
          <PushButton
            cx={BTN_0.cx}
            cy={BTN_0.cy}
            color="#94a3b8"
            label="0"
            pinLabel="→ D6"
            onPress={() => pushBit(0)}
          />
          <PushButton
            cx={BTN_1.cx}
            cy={BTN_1.cy}
            color={BIT_COLORS[1]}
            label="1"
            pinLabel="→ D7"
            onPress={() => pushBit(1)}
          />

          {/* Flecha conceptual de corrimiento */}
          <ShiftDirection reducedMotion={reducedMotion} />
        </svg>

        {/* Overlay de leyenda */}
        <div className="pointer-events-none absolute left-4 bottom-4 flex flex-wrap gap-3 text-[11px] font-mono">
          {LED_XS.map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 bg-white/5 hairline"
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{
                  background: BIT_COLORS[i],
                  boxShadow: `0 0 8px ${BIT_COLORS[i]}`,
                }}
              />
              <span className="text-slate-300">
                Q{i} = {boolToBit(reg[i])}
              </span>
            </span>
          ))}
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 bg-white/5 hairline"
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{
                background: CLK_COLOR,
                boxShadow: `0 0 8px ${CLK_COLOR}`,
              }}
            />
            <span className="text-slate-300">CLK</span>
          </span>
        </div>
      </div>
    </section>
  );
}

function RegBadge({
  label,
  value,
  color,
  mono = false,
}: {
  label: string;
  value: string | number;
  color: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl px-3 py-1.5 bg-white/5 hairline flex items-center gap-2">
      <span className="text-slate-400 uppercase tracking-wider text-[10px]">
        {label}
      </span>
      <span
        className={`${mono ? "font-mono" : "font-mono"} text-base font-bold`}
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
}

/** Riel conceptual que "reparte" CLK a los 4 FF simultaneamente. */
function ClockRail({
  active,
  clock,
  reducedMotion,
}: {
  active: boolean;
  clock: number;
  reducedMotion: boolean;
}) {
  const y = 60;
  return (
    <g>
      <motion.line
        x1={LED_XS[0]}
        y1={y}
        x2={LED_XS[3]}
        y2={y}
        stroke={CLK_COLOR}
        strokeWidth={1.4}
        strokeDasharray="4 4"
        opacity={0.6}
        initial={false}
        animate={{
          opacity: active ? 0.95 : 0.4,
          filter: active ? `drop-shadow(0 0 6px ${CLK_COLOR})` : "none",
        }}
      />
      {LED_XS.map((x) => (
        <line
          key={`clkd-${x}`}
          x1={x}
          y1={y}
          x2={x}
          y2={LED_Y - 30}
          stroke={CLK_COLOR}
          strokeWidth={1.2}
          strokeDasharray="2 3"
          opacity={0.6}
        />
      ))}
      <text
        x={LED_XS[0] - 12}
        y={y + 4}
        textAnchor="end"
        fontFamily="JetBrains Mono, monospace"
        fontSize={11}
        fill={CLK_COLOR}
      >
        CLK
      </text>
      {/* pulso a lo largo del riel */}
      <AnimatePresence>
        {active && !reducedMotion && (
          <motion.circle
            key={`clkpulse-${clock}`}
            cy={y}
            r={5}
            fill={CLK_COLOR}
            style={{ filter: `drop-shadow(0 0 8px ${CLK_COLOR})` }}
            initial={{ cx: LED_XS[0] - 40, opacity: 0 }}
            animate={{ cx: LED_XS[3] + 40, opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, times: [0, 0.15, 0.85, 1] }}
          />
        )}
      </AnimatePresence>
    </g>
  );
}

function ShiftDirection({ reducedMotion }: { reducedMotion: boolean }) {
  const y = LED_Y - 60;
  return (
    <g opacity={0.85}>
      <text
        x={LED_XS[0] - 60}
        y={y}
        fontFamily="Inter, sans-serif"
        fontSize={11}
        fill="#94a3b8"
      >
        entrada
      </text>
      <text
        x={LED_XS[3] + 60}
        y={y}
        fontFamily="Inter, sans-serif"
        fontSize={11}
        fill="#94a3b8"
      >
        salida
      </text>
      <motion.path
        d={`M ${LED_XS[0]} ${y - 4} L ${LED_XS[3]} ${y - 4}`}
        stroke="rgba(148,163,184,0.5)"
        strokeWidth={1.2}
        strokeDasharray="2 4"
        fill="none"
        animate={
          reducedMotion
            ? undefined
            : { strokeDashoffset: [0, -12] }
        }
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <polygon
        points={`${LED_XS[3] + 6},${y - 4} ${LED_XS[3] - 4},${y - 8} ${LED_XS[3] - 4},${y}`}
        fill="rgba(148,163,184,0.7)"
      />
    </g>
  );
}
