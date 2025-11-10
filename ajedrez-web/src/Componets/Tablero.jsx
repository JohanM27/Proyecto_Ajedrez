import React, { useEffect, useMemo, useState } from "react";
import { posicionInicial, aplicarMovimiento, clonarTablero } from "../Data/tablero";
import { Pieza } from "../Data/piezas";
import { Pila } from "../Data/pila";
import { esJaque } from "../Jaque/esJaque";
import { esJaqueMate } from "../Jaque/esJaqueMate";

const ICONOS = {
  blanco: {
    rey: "♔",
    reina: "♕",
    torre: "♖",
    alfil: "♗",
    caballo: "♘",
    peon: "♙",
  },
  negro: {
    rey: "♚",
    reina: "♛",
    torre: "♜",
    alfil: "♝",
    caballo: "♞",
    peon: "♟",
  },
};

const STORAGE_KEY = "ajedrez:estado";

export default function Tablero() {
  
  const cargarEstado = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      // Revivir piezas
      const t = data.tablero.map((fila) =>
        fila.map((p) => (p ? new Pieza(p.tipo, p.color) : null))
      );
      return {
        tablero: t,
        turno: data.turno,
        historial: data.historial || [],
      };
    } catch (e) {
      return null;
    }
  };

  const estadoInicial = cargarEstado();

  const [tablero, setTablero] = useState(estadoInicial?.tablero || posicionInicial());
  const [turno, setTurno] = useState(estadoInicial?.turno || "blanco");
  const [seleccionado, setSeleccionado] = useState(null); // [x,y] o null
  const [movimientos, setMovimientos] = useState([]); // Array<[x,y]>
  const [historial, setHistorial] = useState(estadoInicial?.historial || []);
  const pilaRef = useMemo(() => new Pila(), []);
  const [mensajeJaque, setMensajeJaque] = useState("");
  const [jaqueMate, setJaqueMate] = useState(false);



  useEffect(() => {
    // Persistir a localStorage
    const plano = tablero.map((f) => f.map((p) => (p ? { tipo: p.tipo, color: p.color } : null)));
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ tablero: plano, turno, historial })
    );
    const enJaque = esJaque(tablero, turno);
    setMensajeJaque(enJaque ? `¡${turno} está en jaque!` : "");
  }, [tablero, turno, historial]);

  const onClickCasilla = (i, j) => {
    if (jaqueMate) return; //Bloqueamos movimientos despues de jaque mate
    const pieza = tablero[i][j];
    // Si ya hay selección y se pulsa un destino válido
    if (seleccionado) {
      const isDestino = movimientos.some(([x, y]) => x === i && y === j);
      if (isDestino) {
        // Guardar estado previo en pila para deshacer
        pilaRef.push(clonarTablero(tablero));
        const { tablero: t2, captura } = aplicarMovimiento(tablero, seleccionado, [i, j]);
        const mov = {
          from: seleccionado,
          to: [i, j],
          pieza: tablero[seleccionado[0]][seleccionado[1]].tipo,
          color: turno,
          captura: !!captura,
        };
        setTablero(t2);
        //Alerta de Jaquemate
        if (esJaqueMate(t2, turno === "blanco" ? "negro" : "blanco")) {
           alert(`¡Jaque mate! Gana ${turno}`);}
           //dectecccion de jaquemate en cada juada
           if (esJaqueMate(t2, turno === "blanco" ? "negro" : "blanco")) {
              setJaqueMate(true);
               setMensajeJaque(`¡Jaque mate! Gana ${turno}`);
                 return; // evita seguir procesando
                  }
          {jaqueMate && (
             <div style={{ marginTop: 8, color: "#f87171", fontWeight: "bold" }}>
             {mensajeJaque}
              <div style={{ marginTop: 8 }}>
             <button onClick={reiniciar} style={btnEstilo}>Reiniciar partida</button>
              </div>
              </div>)}


        setTurno(turno === "blanco" ? "negro" : "blanco");
        setSeleccionado(null);
        setMovimientos([]);
        setHistorial((h) => [...h, mov]);
        return;
      }
      // Si clic fuera de movimientos, limpiar y posiblemente seleccionar otra pieza válida
      setSeleccionado(null);
      setMovimientos([]);
      if (pieza && pieza.color === turno) seleccionar(i, j, pieza);
      return;
    }

    // Sin selección previa: seleccionar pieza del turno
    if (pieza && pieza.color === turno) seleccionar(i, j, pieza);
  };

  const seleccionar = (i, j, pieza) => {
    const movs = pieza.movimientosLegales(tablero, [i, j]);
    setSeleccionado([i, j]);
    setMovimientos(movs);
  };

  const deshacer = () => {
    if (pilaRef.isEmpty()) return;
    const previo = pilaRef.pop();
    setTablero(previo);
    setTurno((t) => (t === "blanco" ? "negro" : "blanco"));
    setHistorial((h) => h.slice(0, -1));
    setSeleccionado(null);
    setMovimientos([]);
  };

  const reiniciar = () => {
    setTablero(posicionInicial());
    setTurno("blanco");
    setHistorial([]);
    setSeleccionado(null);
    setMovimientos([]);
    setJaqueMate(false);
    setMensajeJaque("");

    // limpiar pila creando una nueva
    // (más simple en este contexto)
    // Nota: pilaRef es un objeto con estado interno; re-crear:
    // no es trivial aquí, así que vaciamos manualmente
    while (!pilaRef.isEmpty()) pilaRef.pop();
  };

  const size = 56; // px por casilla, un poco más grande

  return (

    <div style={{ display: "flex", gap: 16 }}>
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            width: `${size * 8}px`,
            border: "2px solid #374151",
          }}
        >
          {tablero.map((fila, i) =>
            fila.map((celda, j) => {
              const isLight = (i + j) % 2 === 0;
              const esSeleccionado = seleccionado && seleccionado[0] === i && seleccionado[1] === j;
              const esMovPosible = movimientos.some(([x, y]) => x === i && y === j);
              const borde = esSeleccionado ? "3px solid #f59e0b" : esMovPosible ? "3px solid #10b981" : "1px solid transparent";
              return (
                <div
                  key={`${i}-${j}`}
                  onClick={() => onClickCasilla(i, j)}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isLight ? "#f0d9b5" : "#b58863",
                    color: isLight ? "#111827" : "#F9FAFB",
                    userSelect: "none",
                    fontSize: "32px",
                    cursor: "pointer",
                    boxSizing: "border-box",
                    border: borde,
                  }}
                  aria-label={`casilla-${i}-${j}`}
                  title={`${i},${j}`}
                >
                  {celda ? ICONOS[celda.color][celda.tipo] : ""}
                </div>
              );
            })
          )}
        </div>
        <div style={{ marginTop: 8, color: "#e5e7eb" }}>
          Turno: <strong style={{ color: turno === "blanco" ? "#f9fafb" : "#f9fafb" }}>{turno}</strong>
        </div>
        {mensajeJaque && (
        <div style={{ marginTop: 4, color: "#f87171", fontWeight: "bold" }}>{mensajeJaque}
        </div>)}
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button onClick={deshacer} style={btnEstilo}>Deshacer</button>
          <button onClick={reiniciar} style={btnEstilo}>Reiniciar</button>
        </div>
      </div>

      <div style={{ width: 240 }}>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Historial</h3>
        <ol style={{ margin: 0, paddingLeft: 18, maxHeight: `${size * 6}px`, overflowY: "auto" }}>
          {historial.map((m, idx) => (
            <li key={idx} style={{ marginBottom: 4 }}>
              {idx + 1}. {m.color[0].toUpperCase()}-{m.pieza} {coordStr(m.from)} → {coordStr(m.to)} {m.captura ? "x" : ""}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const btnEstilo = {
  padding: "8px 12px",
  backgroundColor: "#374151",
  color: "#f9fafb",
  border: "1px solid #4b5563",
  borderRadius: 6,
  cursor: "pointer",
};

function coordStr([x, y]) {
  const files = "abcdefgh";
  return files[y] + (8 - x);
}


