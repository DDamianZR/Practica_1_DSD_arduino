import { AnimatePresence, motion } from "framer-motion";
import { Download } from "lucide-react";
import { useMemo } from "react";
import { useCircuitStore } from "../../store/useCircuitStore";
import { BIT_COLORS } from "../../lib/colors";
import { boolToBit } from "../../lib/shiftRegister";

export function StateTable() {
  const history = useCircuitStore((s) => s.history);
  const clock = useCircuitStore((s) => s.clock);

  const rows = useMemo(() => {
    const base = [
      {
        cycle: 0,
        din: null as null | 0 | 1,
        q: [0, 0, 0, 0] as [number, number, number, number],
      },
    ];
    history.forEach((h) => {
      base.push({
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
    return base;
  }, [history]);

  function exportCSV() {
    const header = ["Ciclo", "Din", "Q0", "Q1", "Q2", "Q3", "Salida serie (Q3)"];
    const lines = [header.join(",")];
    for (const r of rows) {
      lines.push(
        [
          r.cycle,
          r.din === null ? "" : r.din,
          r.q[0],
          r.q[1],
          r.q[2],
          r.q[3],
          r.q[3],
        ].join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registro_siso_estados.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-2xl hairline overflow-hidden bg-white/[0.02]">
      <header className="px-4 py-2 border-b hairline flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-slate-400">
          Tabla de estados · registro (Q0..Q3)
        </span>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 text-xs rounded-full px-3 py-1 bg-white/5 hover:bg-white/10 transition-colors hairline"
          disabled={rows.length <= 1}
        >
          <Download size={13} />
          Exportar CSV
        </button>
      </header>
      <div className="max-h-[420px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-base-900/85 backdrop-blur">
            <tr className="text-slate-400">
              <Th>Ciclo</Th>
              <Th>Din</Th>
              <Th style={{ color: BIT_COLORS[0] }}>Q0</Th>
              <Th style={{ color: BIT_COLORS[1] }}>Q1</Th>
              <Th style={{ color: BIT_COLORS[2] }}>Q2</Th>
              <Th style={{ color: BIT_COLORS[3] }}>Q3</Th>
              <Th>Salida (Q3)</Th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((r) => {
                const isCurrent = r.cycle === clock;
                return (
                  <motion.tr
                    key={r.cycle}
                    layout
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`transition-colors ${
                      isCurrent
                        ? "bg-cyan-400/[0.08] outline outline-1 outline-cyan-400/25"
                        : "odd:bg-white/[0.015]"
                    }`}
                  >
                    <Td mono>{r.cycle}</Td>
                    <Td mono>
                      {r.din === null ? (
                        <span className="text-slate-500">–</span>
                      ) : (
                        r.din
                      )}
                    </Td>
                    {[0, 1, 2, 3].map((i) => (
                      <Td key={i} mono>
                        <span
                          style={{
                            color:
                              r.q[i] === 1 ? BIT_COLORS[i] : "#64748b",
                          }}
                        >
                          {r.q[i]}
                        </span>
                      </Td>
                    ))}
                    <Td mono>
                      <span
                        className="inline-block min-w-[26px] rounded-md px-1.5 py-0.5"
                        style={{
                          background:
                            r.q[3] === 1
                              ? "rgba(244,114,182,0.15)"
                              : "rgba(148,163,184,0.06)",
                          color:
                            r.q[3] === 1 ? BIT_COLORS[3] : "#94a3b8",
                          border:
                            r.q[3] === 1
                              ? `1px solid ${BIT_COLORS[3]}55`
                              : "1px solid rgba(148,163,184,0.15)",
                        }}
                      >
                        {r.q[3]}
                      </span>
                    </Td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      {rows.length <= 1 && (
        <div className="px-4 py-6 text-sm text-slate-500 text-center">
          Aun no hay pulsos. Usa los botones{" "}
          <span className="font-mono text-slate-300">[0]</span> /{" "}
          <span className="font-mono text-slate-300">[1]</span> para inyectar
          bits.
        </div>
      )}
    </div>
  );
}

function Th({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <th
      className="text-center px-3 py-2 text-[11px] font-semibold uppercase tracking-widest"
      style={style}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  mono,
}: {
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <td
      className={`px-3 py-2 text-center ${mono ? "font-mono" : ""} text-slate-200`}
    >
      {children}
    </td>
  );
}
