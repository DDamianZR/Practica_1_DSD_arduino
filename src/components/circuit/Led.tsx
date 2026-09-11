import { motion } from "framer-motion";

interface LedProps {
  cx: number;
  cy: number;
  color: string;
  on: boolean;
  label: string;
  pinLabel?: string;
  flash?: boolean;
}

/**
 * LED estilizado con glow real cuando esta prendido.
 * El halo se dibuja con multiples circulos + filter drop-shadow.
 */
export function Led({ cx, cy, color, on, label, pinLabel, flash }: LedProps) {
  const bodyR = 18;
  return (
    <g>
      {/* Halo exterior cuando on */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={bodyR + 26}
        fill={color}
        initial={false}
        animate={{ opacity: on ? 0.18 : 0 }}
        transition={{ duration: 0.25 }}
      />
      <motion.circle
        cx={cx}
        cy={cy}
        r={bodyR + 12}
        fill={color}
        initial={false}
        animate={{ opacity: on ? 0.28 : 0 }}
        transition={{ duration: 0.2 }}
      />
      {/* Base del LED (patas) */}
      <line
        x1={cx - 6}
        y1={cy + bodyR + 2}
        x2={cx - 6}
        y2={cy + bodyR + 22}
        stroke="#64748b"
        strokeWidth={1.6}
      />
      <line
        x1={cx + 6}
        y1={cy + bodyR + 2}
        x2={cx + 6}
        y2={cy + bodyR + 22}
        stroke="#64748b"
        strokeWidth={1.6}
      />
      {/* Cuerpo */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={bodyR}
        fill={on ? color : "#1a2440"}
        stroke={on ? color : "#334155"}
        strokeWidth={1.8}
        style={{
          filter: on
            ? `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 24px ${color})`
            : "none",
        }}
        initial={false}
        animate={{
          scale: flash ? [1, 1.15, 1] : 1,
        }}
        transition={{ duration: 0.35 }}
      />
      {/* Reflejo interno */}
      <ellipse
        cx={cx - 5}
        cy={cy - 6}
        rx={5}
        ry={3.2}
        fill="rgba(255,255,255,0.45)"
        opacity={on ? 0.7 : 0.15}
      />
      {/* Etiqueta */}
      <text
        x={cx}
        y={cy - bodyR - 10}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={13}
        fontWeight={700}
        fill={on ? color : "#94a3b8"}
        style={{
          filter: on ? `drop-shadow(0 0 6px ${color})` : "none",
        }}
      >
        {label}
      </text>
      {pinLabel && (
        <text
          x={cx}
          y={cy + bodyR + 36}
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize={10}
          fill="#64748b"
        >
          {pinLabel}
        </text>
      )}
    </g>
  );
}
