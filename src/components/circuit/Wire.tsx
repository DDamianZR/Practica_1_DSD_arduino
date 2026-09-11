import { AnimatePresence, motion } from "framer-motion";

interface WireProps {
  d: string;
  color: string;
  active?: boolean;
  pulseKey?: number | string | null;
  reducedMotion?: boolean;
  strokeWidth?: number;
  dashed?: boolean;
}

/**
 * Alambre SVG con capacidad de emitir un pulso viajero.
 * Se le pasa una `pulseKey` que al cambiar dispara la animacion.
 */
export function Wire({
  d,
  color,
  active = false,
  pulseKey = null,
  reducedMotion = false,
  strokeWidth = 2.2,
  dashed = false,
}: WireProps) {
  return (
    <g>
      {/* Sombra sutil para dar profundidad */}
      <path
        d={d}
        stroke="rgba(0,0,0,0.5)"
        strokeWidth={strokeWidth + 1.4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0,1.4)"
        opacity={0.45}
      />
      {/* Trazo base */}
      <path
        d={d}
        stroke={active ? color : `${color}80`}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? "4 4" : undefined}
        style={{
          filter: active
            ? `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 10px ${color})`
            : "none",
          transition: "stroke 200ms ease, filter 200ms ease",
        }}
      />
      {/* Pulso viajero */}
      <AnimatePresence>
        {pulseKey !== null && !reducedMotion && (
          <motion.g
            key={`pulse-${pulseKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <TravelingPulse d={d} color={color} />
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
}

function TravelingPulse({ d, color }: { d: string; color: string }) {
  const id = `path-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <>
      <defs>
        <path id={id} d={d} />
      </defs>
      <motion.circle
        r={5}
        fill={color}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.55, times: [0, 0.15, 0.85, 1] }}
      >
        <animateMotion dur="0.55s" repeatCount="1" fill="freeze">
          <mpath xlinkHref={`#${id}`} />
        </animateMotion>
      </motion.circle>
    </>
  );
}
