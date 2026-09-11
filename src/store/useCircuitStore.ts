import { create } from "zustand";
import {
  Bit,
  HistoryEntry,
  INITIAL_REGISTER,
  Register4,
  boolToBit,
  shiftRight,
} from "../lib/shiftRegister";
import { audio } from "../lib/audio";

export type Phase = "idle" | "clocking";
export type AutoPattern = "alternate" | "ones" | "zeros" | "random";

export interface CircuitState {
  reg: Register4;
  clock: number;
  history: HistoryEntry[];
  phase: Phase;
  lastEdge: "rise" | null;
  lastDin: Bit | null;

  autoClock: boolean;
  speedHz: number;
  autoPattern: AutoPattern;

  muted: boolean;

  // acciones
  pushBit: (bit: Bit) => void;
  reset: () => void;
  toggleAutoClock: () => void;
  setSpeed: (hz: number) => void;
  setAutoPattern: (p: AutoPattern) => void;
  toggleMute: () => void;
}

const CLOCK_ANIM_MS = 320;

let autoTimer: ReturnType<typeof setInterval> | null = null;

function stopAutoTimer() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}

function nextAutoBit(pattern: AutoPattern, clock: number): Bit {
  switch (pattern) {
    case "ones":
      return 1;
    case "zeros":
      return 0;
    case "random":
      return Math.random() < 0.5 ? 0 : 1;
    case "alternate":
    default:
      return (clock % 2 === 0 ? 1 : 0) as Bit;
  }
}

export const useCircuitStore = create<CircuitState>((set, get) => ({
  reg: INITIAL_REGISTER,
  clock: 0,
  history: [],
  phase: "idle",
  lastEdge: null,
  lastDin: null,

  autoClock: false,
  speedHz: 1.5,
  autoPattern: "alternate",

  muted: false,

  pushBit: (bit: Bit) => {
    // Fase clocking (para animar flanco antes de commitear)
    set({ phase: "clocking", lastEdge: "rise", lastDin: bit });
    if (!get().muted) {
      audio.click(bit);
      audio.tick();
    }
    // commit inmediato de la logica; la animacion visual usa lastEdge
    const state = get();
    const nuevoReg = shiftRight(state.reg, bit);
    const nuevoCiclo = state.clock + 1;
    const entrada: HistoryEntry = {
      cycle: nuevoCiclo,
      din: bit,
      q: nuevoReg,
    };
    set({
      reg: nuevoReg,
      clock: nuevoCiclo,
      history: [...state.history, entrada],
    });
    // dejamos el flag lastEdge un momento para que la UI reaccione
    setTimeout(() => {
      set({ phase: "idle", lastEdge: null });
    }, CLOCK_ANIM_MS);
  },

  reset: () => {
    stopAutoTimer();
    set({
      reg: INITIAL_REGISTER,
      clock: 0,
      history: [],
      phase: "idle",
      lastEdge: null,
      lastDin: null,
      autoClock: false,
    });
  },

  toggleAutoClock: () => {
    const on = !get().autoClock;
    set({ autoClock: on });
    stopAutoTimer();
    if (on) {
      const period = () => Math.max(80, 1000 / get().speedHz);
      const tick = () => {
        const s = get();
        const bit = nextAutoBit(s.autoPattern, s.clock);
        s.pushBit(bit);
      };
      // dispara uno de inmediato para "arrancar"
      tick();
      autoTimer = setInterval(tick, period());
    }
  },

  setSpeed: (hz: number) => {
    set({ speedHz: hz });
    if (get().autoClock) {
      stopAutoTimer();
      const period = Math.max(80, 1000 / hz);
      autoTimer = setInterval(() => {
        const s = get();
        const bit = nextAutoBit(s.autoPattern, s.clock);
        s.pushBit(bit);
      }, period);
    }
  },

  setAutoPattern: (p: AutoPattern) => set({ autoPattern: p }),

  toggleMute: () => {
    const m = !get().muted;
    set({ muted: m });
    audio.setMuted(m);
  },
}));

// selector helper: salida serie = Q3
export const selectSerialOut = (s: CircuitState): Bit => boolToBit(s.reg[3]);
