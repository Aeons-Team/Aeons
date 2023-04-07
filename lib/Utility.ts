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
      return `${(size / 1e9).toFixed(1)} GB`;
    }

    if (size > 1e6) {
      return `${(size / 1e6).toFixed(1)} MB`;
    }

    if (size > 1e3) {
      return `${(size / 1e3).toFixed(1)} KB`;
    }

    return `${size.toFixed(1)} bytes`;
  }

  static formatTime(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)} seconds`

    if (seconds < 60 * 60) return `${Math.round(seconds / 60)} minutes`

    if (seconds < 24 * 60 * 60) return `${Math.round(seconds / (60 * 60))} hours`

    return `${Math.round(seconds / (24 * 60 * 60))} days`
  }

  static formatDate(epoch: number): string {
    const date = new Date(epoch)

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  static genColor(input: string, start: number, range: number): string {
    const color = [0, 0, 0]

    for (let i = 0; i < input.length; ++i) {
      let code = input.charCodeAt(i)
      color[i % 3] += code
    }

    for (let i = 0; i < 3; ++i) {
      color[i] = start + color[i] % range
    }

    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
  }
}
