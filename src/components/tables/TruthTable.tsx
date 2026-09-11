import { CLK_COLOR } from "../../lib/colors";

/**
 * Tabla de verdad de un FF tipo D.
 * Q(t+1) toma el valor de D en el flanco de subida; en otro caso Q no cambia.
 */
export function TruthTable() {
  const rows: {
    d: string;
    clk: string;
    qNext: string;
    note?: string;
  }[] = [
    { d: "0", clk: "↑", qNext: "0", note: "captura D" },
    { d: "1", clk: "↑", qNext: "1", note: "captura D" },
    { d: "×", clk: "0", qNext: "Q(t)", note: "sin cambio" },
    { d: "×", clk: "1", qNext: "Q(t)", note: "sin cambio (nivel alto estable)" },
    { d: "×", clk: "↓", qNext: "Q(t)", note: "flanco de bajada — sin efecto" },
  ];

  return (
    <div className="rounded-2xl hairline overflow-hidden bg-white/[0.02]">
      <header className="px-4 py-2 border-b hairline text-xs uppercase tracking-widest text-slate-400">
        Tabla de verdad · FF tipo D
      </header>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-400">
            <Th>D</Th>
            <Th>
              <span style={{ color: CLK_COLOR }}>CLK</span>
            </Th>
            <Th>Q(t+1)</Th>
            <Th className="text-left">Comentario</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="odd:bg-white/[0.015] hover:bg-white/[0.03] transition-colors"
            >
              <Td mono>{r.d}</Td>
              <Td mono>
                <span
                  style={{
                    color:
                      r.clk === "↑"
                        ? CLK_COLOR
                        : r.clk === "↓"
                        ? "#64748b"
                        : "#94a3b8",
                  }}
                >
                  {r.clk}
                </span>
              </Td>
              <Td mono>{r.qNext}</Td>
              <Td className="text-left text-slate-400">{r.note}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`text-center px-3 py-2 text-[11px] font-semibold uppercase tracking-widest ${className}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  mono,
  className = "",
}: {
  children: React.ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <td
      className={`px-3 py-2 text-center ${mono ? "font-mono" : ""} text-slate-200 ${className}`}
    >
      {children}
    </td>
  );
}
