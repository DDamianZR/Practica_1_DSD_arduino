/**
 * Wrapper de Tone.js con inicializacion diferida.
 * El contexto de audio arranca solo tras la primera interaccion
 * (politica de autoplay del navegador).
 */
import type { Bit } from "./shiftRegister";

type MembraneSynth = import("tone").MembraneSynth;
type MetalSynth = import("tone").MetalSynth;
type Synth = import("tone").Synth;

let started = false;
let starting = false;
let muted = false;

let synthOne: Synth | null = null;
let synthZero: Synth | null = null;
let clockSynth: MembraneSynth | null = null;
let tickSynth: MetalSynth | null = null;

async function ensureStarted() {
  if (started || starting) return;
  starting = true;
  try {
    const Tone = await import("tone");
    await Tone.start();
    // Voz para "1" (mas aguda)
    synthOne = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
    }).toDestination();
    synthOne.volume.value = -14;

    // Voz para "0" (mas grave)
    synthZero = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
    }).toDestination();
    synthZero.volume.value = -14;

    // Kick corto de reloj
    clockSynth = new Tone.MembraneSynth({
      pitchDecay: 0.02,
      octaves: 2,
      envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
    }).toDestination();
    clockSynth.volume.value = -22;

    // Chispa metalica sutil
    tickSynth = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.03, release: 0.03 },
      harmonicity: 5.1,
      modulationIndex: 22,
      resonance: 3000,
      octaves: 1.2,
    }).toDestination();
    tickSynth.volume.value = -34;

    started = true;
  } finally {
    starting = false;
  }
}

// Fire-and-forget helpers
function fire(fn: () => void) {
  if (muted) return;
  if (!started) {
    ensureStarted().then(() => {
      if (!muted) fn();
    });
    return;
  }
  fn();
}

export const audio = {
  click(bit: Bit) {
    fire(() => {
      if (bit === 1) synthOne?.triggerAttackRelease("A5", "16n");
      else synthZero?.triggerAttackRelease("C4", "16n");
    });
  },
  tick() {
    fire(() => {
      clockSynth?.triggerAttackRelease("G2", "32n");
      tickSynth?.triggerAttackRelease("C7", "64n", undefined, 0.4);
    });
  },
  primeOnFirstInteraction() {
    // Llamado desde un onPointerDown/onKeyDown global
    if (!started && !starting) {
      ensureStarted().catch(() => {
        /* silencioso: si falla, el usuario simplemente no escuchara audio */
      });
    }
  },
  setMuted(m: boolean) {
    muted = m;
  },
  isMuted() {
    return muted;
  },
};
