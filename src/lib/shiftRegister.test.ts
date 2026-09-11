import { describe, expect, it } from "vitest";
import {
  INITIAL_REGISTER,
  formatMSB,
  runSequence,
  serialOut,
  shiftRight,
} from "./shiftRegister";

describe("shiftRegister — semantica canonica", () => {
  it("empieza en 0000", () => {
    expect(INITIAL_REGISTER).toEqual([false, false, false, false]);
  });

  it("un pulso inyecta el bit en Q0 y corre los demas", () => {
    const r = shiftRight(INITIAL_REGISTER, 1);
    expect(r).toEqual([true, false, false, false]);
  });

  it("secuencia 1,0,1,1 deja [1,1,0,1] (Q0..Q3) y salida serie 1", () => {
    const { register, history } = runSequence([1, 0, 1, 1]);
    // reg[0]=Q0 (ultimo bit inyectado) ... reg[3]=Q3 (primer bit inyectado)
    expect(register).toEqual([true, true, false, true]);
    expect(serialOut(register)).toBe(1);
    expect(history).toHaveLength(4);

    // Snapshot ciclo por ciclo (Q0..Q3)
    expect(history[0].q).toEqual([true, false, false, false]);
    expect(history[1].q).toEqual([false, true, false, false]);
    expect(history[2].q).toEqual([true, false, true, false]);
    expect(history[3].q).toEqual([true, true, false, true]);
  });

  it("leido en formato MSB (Q3 Q2 Q1 Q0), la palabra 1011 se conserva", () => {
    const { register } = runSequence([1, 0, 1, 1]);
    expect(formatMSB(register)).toBe("1011");
  });

  it("un 1 tarda 4 pulsos en llegar de Q0 a Q3", () => {
    // Inyectar un 1 y luego tres 0s
    const { history } = runSequence([1, 0, 0, 0]);
    expect(history[0].q[0]).toBe(true); // en Q0 tras pulso 1
    expect(history[1].q[1]).toBe(true); // en Q1 tras pulso 2
    expect(history[2].q[2]).toBe(true); // en Q2 tras pulso 3
    expect(history[3].q[3]).toBe(true); // en Q3 tras pulso 4
  });

  it("shiftRight es puro: no muta la entrada", () => {
    const inicial: readonly [boolean, boolean, boolean, boolean] = [
      true,
      false,
      true,
      false,
    ];
    const copia = [...inicial];
    shiftRight(inicial, 1);
    expect(inicial).toEqual(copia);
  });
});
