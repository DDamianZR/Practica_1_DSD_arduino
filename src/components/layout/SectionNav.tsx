import { motion } from "framer-motion";
import { Cpu, Table2, GitBranch, Waveform } from "./_icons";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "circuito", label: "Circuito", Icon: Cpu },
  { id: "tiempos", label: "Carta de tiempos", Icon: Waveform },
  { id: "anatomia", label: "Flip-flop D", Icon: GitBranch },
  { id: "tablas", label: "Tablas", Icon: Table2 },
] as const;

export function SectionNav() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && e.intersectionRatio > 0.35) {
              setActive(id);
            }
          });
        },
        { threshold: [0.35, 0.6] },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav
      className="sticky top-3 z-30 mx-auto mt-3 w-fit max-w-full overflow-x-auto rounded-full glass shadow-panel px-1.5 py-1.5"
      aria-label="Secciones"
    >
      <ul className="flex items-center gap-1">
        {SECTIONS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/10 hairline"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <Icon size={14} className="relative" />
                <span className="relative whitespace-nowrap">{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
