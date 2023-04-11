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
      return `${Math.round(size / 1e9)} GB`;
    }

    if (size > 1e6) {
      return `${Math.round(size / 1e6)} MB`;
    }

    if (size > 1e3) {
      return `${Math.round(size / 1e3)} KB`;
    }

    return `${Math.round(size)} bytes`;
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

  static async resizeImage(src: string, size: number): Promise<string> {
    const image = new Image()
    image.src = src
    image.crossOrigin = 'anonymous'

    return new Promise((resolve, reject) => {
      image.onload = () => {
        let width = image.width 
        let height = image.height 
  
        if (width > height) {
          let tempWidth = width
          width = size 
          height = (size / tempWidth) * height
        }
  
        else {
          let tempHeight = height
          height = size
          width = (size / tempHeight) * width
        }
  
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, width, height)
  
        resolve(canvas.toDataURL())
      }
    })
  }
}
