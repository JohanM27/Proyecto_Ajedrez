//funcion que permite identificar si alguno de los reyes se encuentra amenazado por una piza contratia
//
export function esJaque(tablero, color) {
  let reyPos = null;

  // Busca la posición del rey del color dado
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const pieza = tablero[i][j];
      if (pieza && pieza.tipo === "rey" && pieza.color === color) {
        reyPos = [i, j];
        break;
      }
    }
    if (reyPos) break;
  }

  if (!reyPos) return false; // Si no se encuentra el rey, no hay jaque

  // verificar si alguna pieza enemiga puede atacar al rey
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const pieza = tablero[i][j];
      if (pieza && pieza.color !== color) {
        const movs = pieza.movimientosLegales(tablero, [i, j]);
        if (movs.some(([x, y]) => x === reyPos[0] && y === reyPos[1])) {
          return true; // el rey esta amenazado
        }
      }
    }
  }

  return false; 
  // nnguna pieza enemiga amenaza al rey
}
