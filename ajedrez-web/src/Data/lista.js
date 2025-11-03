export class Lista {
  constructor() {
    this.items = [];
  }

  agregar(item) {
    this.items.push(item);
  }

  obtenerTodos() {
    return this.items;
  }
}
