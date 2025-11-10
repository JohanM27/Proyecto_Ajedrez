//verifica si el jugador está en jaque y no tiene ningún movimiento  que lo saque del jaque. 
// si no puede escapar, es jaque mate.
//
import { esJaque } from "./esJaque";
import { clonarTablero, aplicarMovimiento } from "../Data/tablero";

export function esJaqueMate(tablero, color) {
  // si no esta en jaque, no puede ser jaque mate
  if (!esJaque(tablero, color)) return false;

  // que el jugador no tiene movimentos
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const pieza = tablero[i][j];
      if (pieza && pieza.color === color) {
        const movs = pieza.movimientosLegales(tablero, [i, j]);

        for (const [x, y] of movs) {
          // simular el movimiento en una copia del tablero
          const copia = clonarTablero(tablero);
          aplicarMovimiento(copia, [i, j], [x, y]);

          // si después del movimiento el rey ya no está en jaque, no es jaque mate
          if (!esJaque(copia, color)) {
            return false;
          }
        }
      }
    }
  }

  // si ningún movimiento evita el jaque, es jaque mate
  return true;
}
