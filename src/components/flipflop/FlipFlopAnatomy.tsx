import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useCircuitStore } from "../../store/useCircuitStore";
import { BIT_COLORS, CLK_COLOR } from "../../lib/colors";
import { boolToBit } from "../../lib/shiftRegister";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { DFlipFlop } from "./DFlipFlop";
import { Wire } from "../circuit/Wire";

export function FlipFlopAnatomy() {
  const reg = useCircuitStore((s) => s.reg);
  const lastEdge = useCircuitStore((s) => s.lastEdge);
  const lastDin = useCircuitStore((s) => s.lastDin);
  const clock = useCircuitStore((s) => s.clock);
  const reducedMotion = useReducedMotion();

  const q = [
    boolToBit(reg[0]),
    boolToBit(reg[1]),
    boolToBit(reg[2]),
    boolToBit(reg[3]),
  ] as const;

  // D_i = valor de entrada del FF i (antes del flanco). Para la vista
  // "en vivo" mostramos las conexiones logicas: D0 = Din actual (o 0),
  // D1 = Q0, D2 = Q1, D3 = Q2. Esto es la cascada.
  const dins: [0 | 1, 0 | 1, 0 | 1, 0 | 1] = [
    (lastDin ?? 0) as 0 | 1,
    q[0],
    q[1],
    q[2],
  ];

  const [showNote, setShowNote] = useState(false);

  return (
    <section
      id="anatomia"
      className="w-full rounded-3xl glass shadow-panel p-4 sm:p-6"
    >
      <header className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Anatomia del flip-flop D
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Un flip-flop D captura en Q el valor presente en D{" "}
            <span className="text-slate-100">unicamente</span> en el flanco de
            subida del reloj. Cuatro en cascada + CLK comun = un registro de
            corrimiento SISO.
          </p>
        </div>
      </header>

      {/* Vista 1: un FF grande */}
      <div className="rounded-2xl hairline overflow-hidden bg-white/[0.015] mb-6">
        <div className="w-full aspect-[1000/320]">
          <svg viewBox="0 0 1000 320" className="w-full h-full">
            {/* Cable de entrada D */}
            <Wire
              d="M 60 160 L 340 160"
              color="#e2e8f0"
              active={lastEdge !== null}
              pulseKey={
                lastEdge !== null ? `d-in-${clock}` : null
              }
              reducedMotion={reducedMotion}
            />
            {/* Cable CLK */}
            <Wire
              d="M 400 300 L 400 240"
              color={CLK_COLOR}
              active={lastEdge !== null}
              pulseKey={
                lastEdge !== null ? `clk-in-${clock}` : null
              }
              reducedMotion={reducedMotion}
            />
            {/* Cable Q hacia la derecha */}
            <Wire
              d="M 530 160 L 850 160"
              color={BIT_COLORS[0]}
              active={reg[0]}
              reducedMotion={reducedMotion}
              pulseKey={null}
            />

            <DFlipFlop
              x={340}
              y={100}
              width={190}
              height={140}
              label="D FF (74LS74)"
              dValue={(lastDin ?? 0) as 0 | 1}
              qValue={q[0]}
              color={BIT_COLORS[0]}
              clocking={lastEdge !== null}
            />

            {/* etiquetas de puntos */}
            <text
              x={60}
              y={148}
              fontFamily="Inter, sans-serif"
              fontSize={12}
              fill="#94a3b8"
            >
              entrada D
            </text>
            <text
              x={400}
              y={318}
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontSize={12}
              fill={CLK_COLOR}
            >
              CLK (flanco ↑)
            </text>
            <text
              x={850}
              y={148}
              textAnchor="end"
              fontFamily="Inter, sans-serif"
              fontSize={12}
              fill="#94a3b8"
            >
              salida Q
            </text>

            {/* halo del flanco */}
            <AnimatePresence>
              {lastEdge && !reducedMotion && (
                <motion.circle
                  key={`sparkle-${clock}`}
                  cx={400}
                  cy={240}
                  r={16}
                  fill={CLK_COLOR}
                  initial={{ opacity: 0.9, scale: 0.4 }}
                  animate={{ opacity: 0, scale: 1.7 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55 }}
                  style={{
                    filter: `drop-shadow(0 0 12px ${CLK_COLOR})`,
                  }}
                />
              )}
            </AnimatePresence>
          </svg>
        </div>
      </div>

      {/* Vista 2: 4 en cascada */}
      <div className="rounded-2xl hairline overflow-hidden bg-white/[0.015]">
        <div className="w-full aspect-[1000/300]">
          <svg viewBox="0 0 1000 300" className="w-full h-full">
            {/* Cable superior Din a D0 */}
            <Wire
              d="M 20 60 L 20 150 L 120 150"
              color="#e2e8f0"
              active={lastEdge !== null}
              pulseKey={lastEdge !== null ? `casc-din-${clock}` : null}
              reducedMotion={reducedMotion}
            />
            <text
              x={16}
              y={50}
              fontFamily="JetBrains Mono, monospace"
              fontSize={11}
              fill="#e2e8f0"
              fontWeight={700}
            >
              Din = {lastDin ?? "–"}
            </text>

            {/* CLK bus horizontal comun */}
            <line
              x1={80}
              y1={260}
              x2={960}
              y2={260}
              stroke={CLK_COLOR}
              strokeWidth={1.6}
              strokeDasharray="3 3"
              style={{
                filter: lastEdge
                  ? `drop-shadow(0 0 6px ${CLK_COLOR})`
                  : "none",
              }}
              opacity={0.8}
            />
            <text
              x={16}
              y={264}
              fontFamily="JetBrains Mono, monospace"
              fontSize={11}
              fontWeight={700}
              fill={CLK_COLOR}
            >
              CLK
            </text>

            {/* cuatro FF, conectados en cascada Q_i -> D_{i+1} */}
            {[0, 1, 2, 3].map((i) => {
              const bx = 120 + i * 220;
              const by = 100;
              const w = 180;
              const h = 110;
              const color = BIT_COLORS[i];
              const nextX = bx + w;
              const gapX = 220 - w;
              return (
                <g key={`ff-${i}`}>
                  {/* Cable Q_i -> D_{i+1} */}
                  {i < 3 && (
                    <Wire
                      d={`M ${nextX} 150 L ${nextX + gapX / 2} 150 L ${nextX + gapX / 2} 155 L ${nextX + gapX} 155 L ${nextX + gapX} 150`}
                      color={color}
                      active={reg[i]}
                      pulseKey={
                        lastEdge !== null ? `casc-${i}-${clock}` : null
                      }
                      reducedMotion={reducedMotion}
                    />
                  )}
                  {/* CLK vertical */}
                  <line
                    x1={bx + w / 2}
                    y1={by + h}
                    x2={bx + w / 2}
                    y2={260}
                    stroke={CLK_COLOR}
                    strokeWidth={1.4}
                    strokeDasharray="3 3"
                    opacity={0.85}
                  />
                  <DFlipFlop
                    x={bx}
                    y={by}
                    width={w}
                    height={h}
                    label={`FF ${i} (Q${i})`}
                    dValue={dins[i]}
                    qValue={q[i]}
                    color={color}
                    clocking={lastEdge !== null}
                    showQBar={false}
                    compact
                  />
                </g>
              );
            })}

            {/* Salida serie Q3 */}
            <Wire
              d="M 940 150 L 980 150"
              color={BIT_COLORS[3]}
              active={reg[3]}
              reducedMotion={reducedMotion}
              pulseKey={null}
            />
            <text
              x={984}
              y={148}
              fontFamily="JetBrains Mono, monospace"
              fontSize={11}
              fill={BIT_COLORS[3]}
              fontWeight={700}
            >
              Q3
            </text>
            <text
              x={984}
              y={162}
              fontFamily="Inter, sans-serif"
              fontSize={10}
              fill="#94a3b8"
            >
              salida
            </text>
          </svg>
        </div>
      </div>

      {/* Nota colapsable */}
      <button
        onClick={() => setShowNote((v) => !v)}
        className="mt-5 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-slate-100 transition-colors"
      >
        <motion.span
          animate={{ rotate: showNote ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.span>
        ¿Por que flanco y no nivel? ¿Que hace CLR (reset)?
      </button>
      <AnimatePresence>
        {showNote && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-xl hairline p-4 bg-white/[0.02] text-sm text-slate-300 space-y-2">
              <p>
                <span className="text-slate-100 font-semibold">Flanco (edge):</span>{" "}
                el FF captura D en el instante exacto en que CLK pasa de 0 a 1.
                Como todos los FF de la cascada comparten el mismo CLK, todos
                capturan al mismo tiempo el estado{" "}
                <span className="italic">anterior</span> de su vecino. Ese
                "todos a la vez, con el valor viejo" es lo que produce el
                corrimiento — no hay una cadena de copias en serie dentro del
                mismo ciclo.
              </p>
              <p>
                <span className="text-slate-100 font-semibold">Nivel:</span> si
                el latch reaccionara al nivel alto de CLK, un cambio en D
                mientras CLK esta alto se propagaria de inmediato por toda la
                cadena y no habria corrimiento discreto.
              </p>
              <p>
                <span className="text-slate-100 font-semibold">CLR (clear / reset):</span>{" "}
                entrada asincrona que fuerza Q a 0 independientemente de CLK.
                En este simulador equivale a presionar{" "}
                <span className="font-mono text-slate-100">Reset</span>.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
