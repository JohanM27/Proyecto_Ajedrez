import React from "react";
import Tablero from "./Componets/Tablero";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">♟ Juego de Ajedrez</h1>
      <Tablero />
    </div>
  );
}

export default App;
