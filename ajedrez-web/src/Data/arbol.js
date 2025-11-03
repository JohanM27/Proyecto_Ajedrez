import { aplicarMovimiento, clonarTablero } from "./tablero";

export class NodoJuego {
  constructor(tablero, turno, movimiento = null) {
    this.tablero = tablero;
    this.turno = turno; // "blanco" | "negro"
    this.movimiento = movimiento; // {from:[x,y], to:[x,y], captura?:boolean}
    this.hijos = [];
  }
}

// Genera árbol de jugadas hasta cierta profundidad (mínimo 2)
export function generarArbolJugadas(tablero, turno, profundidad, obtenerMovimientos) {
  const raiz = new NodoJuego(clonarTablero(tablero), turno);
  construir(raiz, profundidad, obtenerMovimientos);
  return raiz;
}

function construir(nodo, profundidad, obtenerMovimientos) {
  if (profundidad === 0) return;
  const jugadas = obtenerMovimientos(nodo.tablero, nodo.turno);
  for (const jugada of jugadas) {
    const { from, to } = jugada;
    const { tablero: t2, captura } = aplicarMovimiento(nodo.tablero, from, to);
    const sigTurno = nodo.turno === "blanco" ? "negro" : "blanco";
    const hijo = new NodoJuego(t2, sigTurno, { ...jugada, captura: !!captura });
    nodo.hijos.push(hijo);
    construir(hijo, profundidad - 1, obtenerMovimientos);
  }
}
