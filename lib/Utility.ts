import Vector2 from "./Vector2";

export default class Utility {
  static getElementPosition(elem: Element): Vector2 {
    const elemBB = elem.getBoundingClientRect();

    return new Vector2(
      elemBB.left + elemBB.width * 0.5,
      elemBB.top + elemBB.height * 0.5
    );
  }

  static formatBytes(size: number): string {
    if (size > 1e9) {
      return `${(size / 1e9).toFixed(2)} GB`;
    }

    if (size > 1e6) {
      return `${(size / 1e6).toFixed(2)} MB`;
    }

    if (size > 1e3) {
      return `${(size / 1e3).toFixed(2)} KB`;
    }

    return `${size.toFixed(2)} bytes`;
  }
}
