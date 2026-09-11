import { CircuitView } from "./components/circuit/CircuitView";
import { ControlBar } from "./components/ControlBar";
import { FlipFlopAnatomy } from "./components/flipflop/FlipFlopAnatomy";
import { Hero } from "./components/layout/Hero";
import { SectionNav } from "./components/layout/SectionNav";
import { StateTable } from "./components/tables/StateTable";
import { TimingDiagram } from "./components/timing/TimingDiagram";
import { TruthTable } from "./components/tables/TruthTable";
import { useKeyboardControls } from "./hooks/useKeyboardControls";

export default function App() {
  useKeyboardControls();

  return (
    <>
      <div className="min-h-screen pb-32">
        <SectionNav />
        <Hero />

        <main className="max-w-7xl mx-auto px-3 sm:px-6 space-y-8">
          <CircuitView />

          <TimingDiagram />

          <FlipFlopAnatomy />

          <section
            id="tablas"
            className="w-full rounded-3xl glass shadow-panel p-4 sm:p-6"
          >
            <header className="mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Tablas
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Tabla de verdad del FF D y tabla de estados del registro
                completa (pulso por pulso). Exportable como CSV para el reporte
                de la practica.
              </p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,1fr)_minmax(0,1.5fr)] gap-4">
              <TruthTable />
              <StateTable />
            </div>
          </section>

          <footer className="pt-2 pb-8 text-center text-xs text-slate-500 font-mono">
            SISO 4-bit · Q0 = entrada · Q3 = salida ·{" "}
            <span className="text-slate-400">DSD 2027-1 · IPN</span>
          </footer>
        </main>

        <ControlBar />
      </div>
    </>
  );
}
