export default class Vector {
  x: number
  y: number

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy(v: Vector) {
    this.x = v.x;
    this.y = v.y;
  }

  sub(x: number, y: number): Vector {
    return new Vector(this.x - x, this.y - y);
  }

  subv(other: Vector): Vector {
    return new Vector(this.x - other.x, this.y - other.y);
  }
}