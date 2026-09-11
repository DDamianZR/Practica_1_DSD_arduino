import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useCircuitStore } from "../../store/useCircuitStore";
import { BIT_COLORS, CLK_COLOR, DIN_COLOR } from "../../lib/colors";
import { boolToBit } from "../../lib/shiftRegister";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const COL_W = 64;
const ROW_H = 46;
const LABEL_W = 76;
const PAD_TOP = 34;
const PAD_BOTTOM = 24;
const SIGNALS = ["CLK", "Din", "Q0", "Q1", "Q2", "Q3"] as const;
type SignalName = (typeof SIGNALS)[number];

interface ColData {
  cycle: number;
  din: 0 | 1 | null;
  q: [0, 0, 0, 0] | [number, number, number, number];
}

export function TimingDiagram() {
  const history = useCircuitStore((s) => s.history);
  const clock = useCircuitStore((s) => s.clock);
  const reducedMotion = useReducedMotion();

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const cols: ColData[] = useMemo(() => {
    const arr: ColData[] = [{ cycle: 0, din: null, q: [0, 0, 0, 0] }];
    history.forEach((h) => {
      arr.push({
        cycle: h.cycle,
        din: h.din,
        q: [
          boolToBit(h.q[0]),
          boolToBit(h.q[1]),
          boolToBit(h.q[2]),
          boolToBit(h.q[3]),
        ],
      });
    });
    return arr;
  }, [history]);

  const totalCols = Math.max(cols.length, 6);
  const width = LABEL_W + totalCols * COL_W + 24;
  const height = PAD_TOP + SIGNALS.length * ROW_H + PAD_BOTTOM;

  const rowY = (i: number) => PAD_TOP + i * ROW_H + ROW_H / 2;
  const HI = (i: number) => rowY(i) - 14;
  const LO = (i: number) => rowY(i) + 14;
  const colX = (i: number) => LABEL_W + i * COL_W;

  const currentCol = clock; // ultimo pulso = cols[clock]

  return (
    <section
      id="tiempos"
      className="w-full rounded-3xl glass shadow-panel p-4 sm:p-6"
    >
      <header className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Carta de tiempos
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Cada columna es un ciclo de reloj. Fijate en la escalera diagonal:
            el bit que entra por Din tarda 4 flancos en llegar a Q3.
          </p>
        </div>
        <div className="text-xs sm:text-sm text-slate-400">
          Total de ciclos: <span className="text-slate-100 font-mono font-bold">{clock}</span>
        </div>
      </header>

      <div className="rounded-2xl hairline overflow-hidden">
        <div className="overflow-x-auto">
          <svg
            width={width}
            height={height}
            className="block"
            role="img"
            aria-label="Diagrama de tiempos"
          >
            <defs>
              <linearGradient id="rowFade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="rgba(148,163,184,0.05)" />
                <stop offset="1" stopColor="rgba(148,163,184,0)" />
              </linearGradient>
            </defs>

            {/* Fondos de fila */}
            {SIGNALS.map((_, i) => (
              <rect
                key={`row-bg-${i}`}
                x={0}
                y={PAD_TOP + i * ROW_H}
                width={width}
                height={ROW_H}
                fill={i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent"}
              />
            ))}

            {/* Columnas de fondo (para hover) */}
            {cols.map((_, i) => (
              <g key={`col-${i}`}>
                <rect
                  x={colX(i)}
                  y={PAD_TOP}
                  width={COL_W}
                  height={SIGNALS.length * ROW_H}
                  fill={hoverIdx === i ? "rgba(34,211,238,0.06)" : "transparent"}
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() =>
                    setHoverIdx((v) => (v === i ? null : v))
                  }
                  style={{ cursor: "pointer" }}
                />
                {/* rejilla vertical */}
                <line
                  x1={colX(i)}
                  y1={PAD_TOP}
                  x2={colX(i)}
                  y2={PAD_TOP + SIGNALS.length * ROW_H}
                  stroke="rgba(148,163,184,0.08)"
                  strokeWidth={1}
                />
              </g>
            ))}

            {/* Etiquetas de senales (izquierda) */}
            {SIGNALS.map((name, i) => (
              <SignalLabel key={name} name={name} y={rowY(i)} />
            ))}

            {/* Numeros de ciclo (arriba) */}
            {cols.map((c, i) => (
              <text
                key={`cyclab-${i}`}
                x={colX(i) + COL_W / 2}
                y={PAD_TOP - 8}
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
                fontSize={11}
                fontWeight={600}
                fill={i === currentCol ? "#e2e8f0" : "#64748b"}
              >
                {c.cycle}
              </text>
            ))}

            {/* Ondas */}
            <ClockWave
              cols={cols}
              hi={HI(0)}
              lo={LO(0)}
              x0={colX(0)}
              reducedMotion={reducedMotion}
            />

            <DataWave
              cols={cols}
              row={1}
              values={cols.map((c) => c.din)}
              color={DIN_COLOR}
              hi={HI(1)}
              lo={LO(1)}
              x0={colX(0)}
              reducedMotion={reducedMotion}
            />

            {[0, 1, 2, 3].map((qIdx) => (
              <DataWave
                key={`qwave-${qIdx}`}
                cols={cols}
                row={2 + qIdx}
                values={cols.map((c) => c.q[qIdx])}
                color={BIT_COLORS[qIdx]}
                hi={HI(2 + qIdx)}
                lo={LO(2 + qIdx)}
                x0={colX(0)}
                reducedMotion={reducedMotion}
              />
            ))}

            {/* Cursor del ciclo actual */}
            {currentCol > 0 && (
              <motion.line
                x1={colX(currentCol)}
                y1={PAD_TOP - 12}
                x2={colX(currentCol)}
                y2={PAD_TOP + SIGNALS.length * ROW_H + 4}
                stroke="#22d3ee"
                strokeWidth={1.6}
                strokeDasharray="3 3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ duration: 0.15 }}
                style={{
                  filter: "drop-shadow(0 0 8px rgba(34,211,238,0.5))",
                }}
              />
            )}

            {/* Cursor de hover */}
            {hoverIdx !== null && hoverIdx !== currentCol && (
              <line
                x1={colX(hoverIdx) + COL_W / 2}
                y1={PAD_TOP - 12}
                x2={colX(hoverIdx) + COL_W / 2}
                y2={PAD_TOP + SIGNALS.length * ROW_H + 4}
                stroke="rgba(148,163,184,0.4)"
                strokeWidth={1}
              />
            )}
          </svg>
        </div>
        {/* tooltip */}
        {hoverIdx !== null && cols[hoverIdx] && (
          <div className="border-t hairline px-4 py-2 text-xs font-mono text-slate-300 flex flex-wrap gap-x-4 gap-y-1 bg-white/5">
            <span>
              <span className="text-slate-500">Ciclo:</span>{" "}
              <span className="text-slate-100 font-bold">
                {cols[hoverIdx].cycle}
              </span>
            </span>
            <span>
              <span className="text-slate-500">Din:</span>{" "}
              <span style={{ color: DIN_COLOR }}>
                {cols[hoverIdx].din ?? "–"}
              </span>
            </span>
            {(["Q0", "Q1", "Q2", "Q3"] as const).map((label, qi) => (
              <span key={label}>
                <span className="text-slate-500">{label}:</span>{" "}
                <span style={{ color: BIT_COLORS[qi] }}>
                  {cols[hoverIdx].q[qi]}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SignalLabel({ name, y }: { name: SignalName; y: number }) {
  const color =
    name === "CLK"
      ? CLK_COLOR
      : name === "Din"
      ? DIN_COLOR
      : name === "Q0"
      ? BIT_COLORS[0]
      : name === "Q1"
      ? BIT_COLORS[1]
      : name === "Q2"
      ? BIT_COLORS[2]
      : BIT_COLORS[3];
  return (
    <g>
      <rect
        x={0}
        y={y - 14}
        width={LABEL_W - 8}
        height={28}
        rx={6}
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(148,163,184,0.1)"
      />
      <text
        x={LABEL_W - 16}
        y={y + 5}
        textAnchor="end"
        fontFamily="JetBrains Mono, monospace"
        fontSize={12}
        fontWeight={700}
        fill={color}
        style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
      >
        {name}
      </text>
    </g>
  );
}

function ClockWave({
  cols,
  hi,
  lo,
  x0,
  reducedMotion,
}: {
  cols: ColData[];
  hi: number;
  lo: number;
  x0: number;
  reducedMotion: boolean;
}) {
  // Cada ciclo: en su comienzo hay flanco de subida, y a mitad de columna cae.
  // La columna 0 (estado inicial) permanece en 0.
  let d = `M ${x0} ${lo}`;
  cols.forEach((_, i) => {
    if (i === 0) {
      // solo linea baja a lo largo de la primera columna
      d += ` L ${x0 + COL_W} ${lo}`;
    } else {
      const start = x0 + i * COL_W;
      const mid = start + COL_W / 2;
      const end = start + COL_W;
      // flanco subida al inicio
      d += ` L ${start} ${hi} L ${mid} ${hi} L ${mid} ${lo} L ${end} ${lo}`;
    }
  });
  return (
    <g>
      <motion.path
        d={d}
        fill="none"
        stroke={CLK_COLOR}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 6px ${CLK_COLOR}66)` }}
        initial={reducedMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeOut" }}
      />
      {/* triangulos de flanco de subida */}
      {cols.map((_, i) =>
        i === 0 ? null : (
          <polygon
            key={`edge-${i}`}
            points={`${x0 + i * COL_W - 4},${lo - 2} ${x0 + i * COL_W + 4},${lo - 2} ${x0 + i * COL_W},${hi + 4}`}
            fill={CLK_COLOR}
            opacity={0.3}
          />
        ),
      )}
    </g>
  );
}

function DataWave({
  cols,
  values,
  color,
  hi,
  lo,
  x0,
  reducedMotion,
}: {
  cols: ColData[];
  row: number;
  values: (0 | 1 | number | null)[];
  color: string;
  hi: number;
  lo: number;
  x0: number;
  reducedMotion: boolean;
}) {
  // Construimos el path como niveles constantes por columna.
  // null se dibuja como banda gris a mitad (indefinido).
  const mid = (hi + lo) / 2;

  let d = "";
  let prevY: number | null = null;
  cols.forEach((_, i) => {
    const v = values[i];
    const y = v === null ? mid : v === 1 ? hi : lo;
    const xStart = x0 + i * COL_W;
    const xEnd = xStart + COL_W;
    if (i === 0) {
      d += `M ${xStart} ${y}`;
    } else {
      // transicion vertical si cambio de nivel
      if (prevY !== null && prevY !== y) {
        d += ` L ${xStart} ${prevY} L ${xStart} ${y}`;
      } else {
        d += ` L ${xStart} ${y}`;
      }
    }
    d += ` L ${xEnd} ${y}`;
    prevY = y;
  });

  // Relleno tenue para hacerlo mas "presente" solo cuando es alto
  const highSegments: { x: number; w: number }[] = [];
  values.forEach((v, i) => {
    if (v === 1) {
      highSegments.push({ x: x0 + i * COL_W, w: COL_W });
    }
  });

  return (
    <g>
      {/* Halo sutil bajo tramos altos */}
      {highSegments.map((s, idx) => (
        <rect
          key={`hi-${idx}`}
          x={s.x}
          y={hi - 4}
          width={s.w}
          height={lo - hi + 8}
          fill={color}
          opacity={0.06}
        />
      ))}
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}55)` }}
        initial={reducedMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }}
      />
      {/* Marcadores de valor por columna (0/1) */}
      {values.map((v, i) => {
        if (v === null) return null;
        const y = v === 1 ? hi : lo;
        return (
          <text
            key={`vtxt-${i}`}
            x={x0 + i * COL_W + COL_W / 2}
            y={y - 6}
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize={9}
            fontWeight={600}
            fill={v === 1 ? color : "rgba(148,163,184,0.65)"}
            opacity={0.85}
          >
            {v}
          </text>
        );
      })}
    </g>
  );
}
