export default class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  copy(v) {
    this.x = v.x;
    this.y = v.y;
  }

  sub(x, y) {
    return new Vector(this.x - x, this.y - y);
  }
}