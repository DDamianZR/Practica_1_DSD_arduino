import { motion } from "framer-motion";

export function Hero() {
  return (
    <header className="relative pt-12 pb-8 px-4 sm:px-6 max-w-6xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 hairline bg-white/[0.03] text-xs uppercase tracking-widest text-slate-300"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
        Simulador interactivo · DSD · Practica 1
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.05 }}
        className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.02]"
      >
        Registro de corrimiento{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(90deg,#22d3ee,#34d399,#f59e0b,#f472b6)",
          }}
        >
          SISO
        </span>{" "}
        de 4 bits
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-4 text-slate-400 max-w-2xl mx-auto text-base sm:text-lg"
      >
        Arduino UNO + 4 flip-flops en cascada. Cada pulso de reloj inyecta un
        bit en Q0 y corre los demas hacia Q3. Presiona{" "}
        <kbd className="font-mono text-slate-200">1</kbd> o{" "}
        <kbd className="font-mono text-slate-200">0</kbd> para empezar.
      </motion.p>
    </header>
  );
}
