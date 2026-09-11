import { motion } from "framer-motion";

interface DFlipFlopProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  label: string;
  dValue: 0 | 1;
  qValue: 0 | 1;
  color: string;
  clocking: boolean; // se ilumina cuando ocurre un flanco
  showQBar?: boolean;
  compact?: boolean;
}

export function DFlipFlop({
  x,
  y,
  width = 130,
  height = 120,
  label,
  dValue,
  qValue,
  color,
  clocking,
  showQBar = true,
  compact = false,
}: DFlipFlopProps) {
  const cx = x + width / 2;
  const clkTriangleH = 10;
  const stroke = clocking ? color : "rgba(148,163,184,0.55)";

  return (
    <g>
      {/* halo del clocking */}
      <motion.rect
        x={x - 6}
        y={y - 6}
        width={width + 12}
        height={height + 12}
        rx={12}
        fill={color}
        initial={false}
        animate={{ opacity: clocking ? 0.08 : 0 }}
        transition={{ duration: 0.15 }}
      />
      {/* cuerpo */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill="rgba(11,16,32,0.9)"
        stroke={stroke}
        strokeWidth={1.4}
        style={{
          filter: clocking
            ? `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 18px ${color}55)`
            : "none",
        }}
      />
      {/* etiqueta */}
      <text
        x={cx}
        y={y + 22}
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize={13}
        fontWeight={700}
        fill="#e2e8f0"
      >
        {label}
      </text>
      {/* pines */}
      <text
        x={x + 10}
        y={y + height / 2 - 8}
        fontFamily="JetBrains Mono, monospace"
        fontSize={11}
        fontWeight={700}
        fill="#94a3b8"
      >
        D
      </text>
      <text
        x={x + width - 10}
        y={y + height / 2 - 8}
        textAnchor="end"
        fontFamily="JetBrains Mono, monospace"
        fontSize={11}
        fontWeight={700}
        fill="#94a3b8"
      >
        Q
      </text>
      {showQBar && (
        <text
          x={x + width - 10}
          y={y + height / 2 + 22}
          textAnchor="end"
          fontFamily="JetBrains Mono, monospace"
          fontSize={11}
          fontWeight={700}
          fill="#94a3b8"
        >
          {/* Overline lograda con caracter combinado */}
          Q&#772;
        </text>
      )}

      {/* Simbolo de flanco (triangulo) */}
      <polygon
        points={`${x},${y + height - 20} ${x + clkTriangleH * 1.5},${y + height - 14} ${x},${y + height - 8}`}
        fill="none"
        stroke={stroke}
        strokeWidth={1.4}
      />
      <text
        x={x + 20}
        y={y + height - 10}
        fontFamily="JetBrains Mono, monospace"
        fontSize={10}
        fill="#94a3b8"
      >
        CLK
      </text>

      {/* Valores actuales */}
      <ValueChip
        x={x - 30}
        y={y + height / 2}
        value={dValue}
        color="#e2e8f0"
        anchor="end"
      />
      <ValueChip
        x={x + width + 30}
        y={y + height / 2}
        value={qValue}
        color={color}
        anchor="start"
        glow
      />
      {showQBar && (
        <ValueChip
          x={x + width + 30}
          y={y + height / 2 + 30}
          value={qValue === 1 ? 0 : 1}
          color="rgba(148,163,184,0.85)"
          anchor="start"
          dim
        />
      )}

      {/* Etiqueta compacta debajo */}
      {!compact && (
        <text
          x={cx}
          y={y + height + 22}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize={11}
          fill="#64748b"
        >
          flip-flop tipo D
        </text>
      )}
    </g>
  );
}

function ValueChip({
  x,
  y,
  value,
  color,
  anchor,
  glow,
  dim,
}: {
  x: number;
  y: number;
  value: 0 | 1;
  color: string;
  anchor: "start" | "end";
  glow?: boolean;
  dim?: boolean;
}) {
  return (
    <text
      x={x}
      y={y + 5}
      textAnchor={anchor}
      fontFamily="JetBrains Mono, monospace"
      fontSize={22}
      fontWeight={800}
      fill={color}
      opacity={dim ? 0.6 : 1}
      style={{
        filter: glow ? `drop-shadow(0 0 6px ${color})` : "none",
      }}
    >
      {value}
    </text>
  );
}
