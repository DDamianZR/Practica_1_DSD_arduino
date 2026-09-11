/**
 * Registro de corrimiento SISO de 4 bits.
 *
 *   reg[0] = Q0 (entrada serie: bit nuevo)
 *   reg[3] = Q3 (salida serie)
 *
 * En cada flanco de subida del reloj todos los flip-flops capturan D
 * simultaneamente: Q3<-Q2, Q2<-Q1, Q1<-Q0, Q0<-bitEntrada.
 */
export type Bit = 0 | 1;
export type Register4 = readonly [boolean, boolean, boolean, boolean];

export const REGISTER_LENGTH = 4 as const;

export const INITIAL_REGISTER: Register4 = [false, false, false, false];

export function boolToBit(b: boolean): Bit {
  return b ? 1 : 0;
}

/**
 * Aplica un pulso de reloj con el bit de entrada dado y retorna
 * el nuevo estado del registro (no muta el original).
 */
export function shiftRight(reg: Register4, bitEntrada: Bit): Register4 {
  const nuevoQ0 = bitEntrada === 1;
  return [nuevoQ0, reg[0], reg[1], reg[2]] as const;
}

/**
 * Ejecuta una secuencia de bits sobre un registro y regresa el estado final
 * junto con el historial completo (util para tests y visualizaciones).
 */
export interface HistoryEntry {
  cycle: number;
  din: Bit;
  q: Register4;
}

export function runSequence(
  bits: readonly Bit[],
  initial: Register4 = INITIAL_REGISTER,
): { register: Register4; history: HistoryEntry[] } {
  let reg = initial;
  const history: HistoryEntry[] = [];
  bits.forEach((bit, index) => {
    reg = shiftRight(reg, bit);
    history.push({ cycle: index + 1, din: bit, q: reg });
  });
  return { register: reg, history };
}

/** Salida serie es siempre Q3 (indice 3). */
export function serialOut(reg: Register4): Bit {
  return boolToBit(reg[3]);
}

/** Utilidad de formato: "Q3 Q2 Q1 Q0" en string de 4 caracteres. */
export function formatMSB(reg: Register4): string {
  return `${boolToBit(reg[3])}${boolToBit(reg[2])}${boolToBit(reg[1])}${boolToBit(reg[0])}`;
}
