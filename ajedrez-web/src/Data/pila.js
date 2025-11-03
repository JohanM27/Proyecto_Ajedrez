export class Pila {
  constructor() {
    this.items = [];
  }

  push(elemento) {
    this.items.push(elemento);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}
