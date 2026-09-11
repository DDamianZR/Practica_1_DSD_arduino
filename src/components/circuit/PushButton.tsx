import { motion } from "framer-motion";
import { useState } from "react";

interface PushButtonProps {
  cx: number;
  cy: number;
  color: string;
  label: string;
  pinLabel?: string;
  onPress: () => void;
}

export function PushButton({
  cx,
  cy,
  color,
  label,
  pinLabel,
  onPress,
}: PushButtonProps) {
  const [pressed, setPressed] = useState(false);
  const outerR = 28;
  const capR = 20;

  const handleDown = () => {
    setPressed(true);
  };
  const handleUp = () => {
    if (pressed) {
      setPressed(false);
      onPress();
    }
  };

  return (
    <g
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerLeave={() => setPressed(false)}
      style={{ cursor: "pointer" }}
    >
      {/* base metalica */}
      <rect
        x={cx - outerR - 2}
        y={cy - outerR - 2}
        width={(outerR + 2) * 2}
        height={(outerR + 2) * 2}
        rx={8}
        fill="#0f172a"
        stroke="#334155"
        strokeWidth={1.6}
      />
      <circle
        cx={cx}
        cy={cy}
        r={outerR}
        fill="#1e293b"
        stroke="#475569"
        strokeWidth={1.4}
      />
      {/* casquete */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={capR}
        fill={color}
        stroke="#0b1020"
        strokeWidth={1.4}
        initial={false}
        animate={{
          scale: pressed ? 0.9 : 1,
          filter: pressed
            ? `drop-shadow(0 0 4px ${color})`
            : `drop-shadow(0 6px 12px rgba(0,0,0,0.4))`,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 24 }}
      />
      {/* label en el casquete */}
      <text
        x={cx}
        y={cy + 6}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={18}
        fontWeight={800}
        fill="#0b1020"
        pointerEvents="none"
      >
        {label}
      </text>
      {/* pin */}
      {pinLabel && (
        <text
          x={cx}
          y={cy + outerR + 18}
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
