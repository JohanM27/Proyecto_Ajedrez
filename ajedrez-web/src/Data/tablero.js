import { Pieza } from "./piezas";

export const crearTablero = () => {
  // Crea una matriz 8x8 llena de null
  const tablero = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
  return tablero;
};

export const clonarTablero = (t) => t.map((fila) => fila.slice());

export const posicionInicial = () => {
  const t = crearTablero();
  // Colocar piezas negras (fila 0 y 1)
  t[0][0] = new Pieza("torre", "negro");
  t[0][1] = new Pieza("caballo", "negro");
  t[0][2] = new Pieza("alfil", "negro");
  t[0][3] = new Pieza("reina", "negro");
  t[0][4] = new Pieza("rey", "negro");
  t[0][5] = new Pieza("alfil", "negro");
  t[0][6] = new Pieza("caballo", "negro");
  t[0][7] = new Pieza("torre", "negro");
  for (let j = 0; j < 8; j++) t[1][j] = new Pieza("peon", "negro");

  // Colocar piezas blancas (fila 6 y 7)
  for (let j = 0; j < 8; j++) t[6][j] = new Pieza("peon", "blanco");
  t[7][0] = new Pieza("torre", "blanco");
  t[7][1] = new Pieza("caballo", "blanco");
  t[7][2] = new Pieza("alfil", "blanco");
  t[7][3] = new Pieza("reina", "blanco");
  t[7][4] = new Pieza("rey", "blanco");
  t[7][5] = new Pieza("alfil", "blanco");
  t[7][6] = new Pieza("caballo", "blanco");
  t[7][7] = new Pieza("torre", "blanco");
  return t;
};

export const aplicarMovimiento = (tablero, origen, destino) => {
  const [ox, oy] = origen;
  const [dx, dy] = destino;
  const pieza = tablero[ox][oy];
  const captura = tablero[dx][dy] || null;
  const nuevo = clonarTablero(tablero);
  nuevo[dx][dy] = pieza;
  nuevo[ox][oy] = null;
  return { tablero: nuevo, captura };
};

export const enRango = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8;
