// Utilidades de tablero
const enRango = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8;

export class Pieza {
  constructor(tipo, color) {
    this.tipo = tipo; // "peon", "torre", "alfil", "caballo", "reina", "rey"
    this.color = color; // "blanco" o "negro"
  }

  esRival(otra) {
    return otra && otra.color !== this.color;
  }

  movimientosLegales(tablero, origen) {
    const [ox, oy] = origen; // fila, columna
    switch (this.tipo) {
      case "peon":
        return movimientosPeon(this, tablero, ox, oy);
      case "torre":
        return movimientosDeslizantes(this, tablero, ox, oy, [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]);
      case "alfil":
        return movimientosDeslizantes(this, tablero, ox, oy, [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ]);
      case "reina":
        return movimientosDeslizantes(this, tablero, ox, oy, [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ]);
      case "caballo":
        return movimientosCaballo(this, tablero, ox, oy);
      case "rey":
        return movimientosRey(this, tablero, ox, oy);
      default:
        return [];
    }
  }
}

function movimientosPeon(pieza, tablero, x, y) {
  const dir = pieza.color === "blanco" ? -1 : 1; // blanco hacia arriba (menor fila)
  const filaInicio = pieza.color === "blanco" ? 6 : 1;
  const moves = [];

  // Adelante 1
  const nx = x + dir;
  if (enRango(nx, y) && !tablero[nx][y]) moves.push([nx, y]);

  // Adelante 2 desde inicio
  const nx2 = x + 2 * dir;
  if (x === filaInicio && !tablero[nx]?.[y] && enRango(nx2, y) && !tablero[nx2][y]) {
    moves.push([nx2, y]);
  }

  // Capturas diagonales
  for (const dy of [-1, 1]) {
    const cx = x + dir;
    const cy = y + dy;
    if (enRango(cx, cy) && pieza.esRival(tablero[cx][cy])) moves.push([cx, cy]);
  }

  // Nota: no se implementa en passant ni promoción aquí.
  return moves;
}

function movimientosDeslizantes(pieza, tablero, x, y, dirs) {
  const moves = [];
  for (const [dx, dy] of dirs) {
    let nx = x + dx;
    let ny = y + dy;
    while (enRango(nx, ny)) {
      const obj = tablero[nx][ny];
      if (!obj) {
        moves.push([nx, ny]);
      } else {
        if (pieza.esRival(obj)) moves.push([nx, ny]);
        break; // bloquea
      }
      nx += dx;
      ny += dy;
    }
  }
  return moves;
}

function movimientosCaballo(pieza, tablero, x, y) {
  const deltas = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
  ];
  const moves = [];
  for (const [dx, dy] of deltas) {
    const nx = x + dx;
    const ny = y + dy;
    if (!enRango(nx, ny)) continue;
    const obj = tablero[nx][ny];
    if (!obj || pieza.esRival(obj)) moves.push([nx, ny]);
  }
  return moves;
}

function movimientosRey(pieza, tablero, x, y) {
  const moves = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (!enRango(nx, ny)) continue;
      const obj = tablero[nx][ny];
      if (!obj || pieza.esRival(obj)) moves.push([nx, ny]);
    }
  }
  // Nota: no se implementa enroque.
  return moves;
}
