import Vector2 from './Vector2'

export default class Utility {
  static getElementPosition(elem) {
    const elemBB = elem.getBoundingClientRect()

    return new Vector2(
      elemBB.left + elemBB.width * 0.5,
      elemBB.top + elemBB.height * 0.5
    )
  }

  static formatSize(size) {
    if (size > 1e9) {
      return `${(size / 1e9).toFixed(2)} gB`
    }
    
    if (size > 1e6) {
      return `${(size / 1e6).toFixed(2)} mB`
    }
    
    if (size > 1e3) {
      return `${(size / 1e3).toFixed(2)} kB`
    }
    
    return `${(size).toFixed(2)} bytes`
  }
}