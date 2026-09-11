import { useEffect } from "react";
import { useCircuitStore } from "../store/useCircuitStore";
import { audio } from "../lib/audio";

/**
 * Atajos de teclado globales:
 *   0 / 1 : inyecta bit
 *   R     : reset
 *   Space : toggle reloj automatico
 *   M     : mute
 */
export function useKeyboardControls() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignora si esta escribiendo en un input/textarea
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;

      audio.primeOnFirstInteraction();
      const s = useCircuitStore.getState();
      switch (e.key) {
        case "1":
          s.pushBit(1);
          e.preventDefault();
          break;
        case "0":
          s.pushBit(0);
          e.preventDefault();
          break;
        case "r":
        case "R":
          s.reset();
          break;
        case " ":
          s.toggleAutoClock();
          e.preventDefault();
          break;
        case "m":
        case "M":
          s.toggleMute();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
