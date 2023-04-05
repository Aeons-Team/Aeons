import Vector2 from "./Vector2";

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

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

  static formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds.toFixed(1)} seconds`

    if (seconds < 60 * 60) return `${Math.round(seconds / 60)} minutes`

    if (seconds < 24 * 60 * 60) return `${Math.round(seconds / (60 * 60))} hours`

    return `${Math.round(seconds / (24 * 60 * 60))} days`
  }

  static formatDate(epoch: number): string {
    const date = new Date(epoch)

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }
}
