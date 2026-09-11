interface ArduinoBoardProps {
  x: number;
  y: number;
  width: number;
  height: number;
  ledPins: { x: number; y: number; label: string }[];
  buttonPins: { x: number; y: number; label: string }[];
  gndPin: { x: number; y: number };
}

/**
 * Ilustracion estilizada de un Arduino UNO (linea limpia tipo Fritzing).
 * No es fotorrealista: enfoca en pines relevantes y look de esquematico.
 */
export function ArduinoBoard({
  x,
  y,
  width,
  height,
  ledPins,
  buttonPins,
  gndPin,
}: ArduinoBoardProps) {
  const cx = x + width / 2;

  return (
    <g>
      {/* placa base */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={16}
        fill="url(#pcbFill)"
        stroke="#0f766e"
        strokeWidth={1.4}
      />
      {/* borde interno */}
      <rect
        x={x + 6}
        y={y + 6}
        width={width - 12}
        height={height - 12}
        rx={12}
        fill="none"
        stroke="rgba(15,118,110,0.35)"
        strokeDasharray="2 4"
      />
      {/* logo / marca */}
      <text
        x={cx}
        y={y + height / 2 - 6}
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontWeight={800}
        fontSize={22}
        fill="rgba(255,255,255,0.85)"
        letterSpacing="0.14em"
      >
        ARDUINO
      </text>
      <text
        x={cx}
        y={y + height / 2 + 14}
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontWeight={600}
        fontSize={12}
        fill="rgba(255,255,255,0.55)"
        letterSpacing="0.32em"
      >
        UNO · SISO 4-bit
      </text>

      {/* Detalles decorativos: chip principal */}
      <rect
        x={cx - 60}
        y={y + height - 44}
        width={120}
        height={30}
        rx={4}
        fill="#0b1020"
        stroke="rgba(255,255,255,0.15)"
      />
      <text
        x={cx}
        y={y + height - 24}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize={9}
        fill="rgba(255,255,255,0.55)"
      >
        ATmega328P
      </text>

      {/* USB port */}
      <rect
        x={x - 14}
        y={y + 20}
        width={22}
        height={30}
        rx={2}
        fill="#94a3b8"
        stroke="#334155"
      />
      <rect
        x={x - 10}
        y={y + 24}
        width={14}
        height={22}
        rx={1}
        fill="#0b1020"
      />
      {/* Barril de alimentacion */}
      <rect
        x={x - 8}
        y={y + 62}
        width={16}
        height={20}
        rx={3}
        fill="#0b1020"
        stroke="#475569"
      />

      {/* Header de pines superiores */}
      <PinHeader
        x={x + 20}
        y={y + 4}
        pins={12}
        vertical={false}
      />
      {/* Header de pines inferiores */}
      <PinHeader
        x={x + 20}
        y={y + height - 12}
        pins={12}
        vertical={false}
      />

      {/* Etiquetas de pines usados: LEDs */}
      {ledPins.map((p) => (
        <g key={`ledpin-${p.label}`}>
          <circle
            cx={p.x}
            cy={p.y}
            r={4.5}
            fill="#0b1020"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={1.2}
          />
          <text
            x={p.x}
            y={p.y + 18}
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize={9}
            fill="rgba(255,255,255,0.7)"
          >
            {p.label}
          </text>
        </g>
      ))}

      {/* Etiquetas de pines: botones */}
      {buttonPins.map((p) => (
        <g key={`btnpin-${p.label}`}>
          <circle
            cx={p.x}
            cy={p.y}
            r={4.5}
            fill="#0b1020"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={1.2}
          />
          <text
            x={p.x}
            y={p.y - 10}
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize={9}
            fill="rgba(255,255,255,0.7)"
          >
            {p.label}
          </text>
        </g>
      ))}

      {/* GND */}
      <g>
        <circle
          cx={gndPin.x}
          cy={gndPin.y}
          r={4.5}
          fill="#0b1020"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth={1.2}
        />
        <text
          x={gndPin.x}
          y={gndPin.y - 10}
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize={9}
          fill="rgba(255,255,255,0.7)"
        >
          GND
        </text>
      </g>

      <defs>
        <linearGradient id="pcbFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f4a45" />
          <stop offset="1" stopColor="#0a2f2c" />
        </linearGradient>
      </defs>
    </g>
  );
}

function PinHeader({
  x,
  y,
  pins,
}: {
  x: number;
  y: number;
  pins: number;
  vertical: boolean;
}) {
  const step = 12;
  return (
    <g>
      <rect
        x={x - 2}
        y={y}
        width={pins * step + 4}
        height={8}
        rx={1.5}
        fill="#111827"
        stroke="#374151"
      />
      {Array.from({ length: pins }).map((_, i) => (
        <rect
          key={i}
          x={x + i * step + 2}
          y={y + 1.5}
          width={5}
          height={5}
          rx={0.8}
          fill="#94a3b8"
        />
      ))}
    </g>
  );
}
