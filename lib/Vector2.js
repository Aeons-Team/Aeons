export default class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  sub(x, y) {
    return new Vector(this.x - x, this.y - y);
  }
}