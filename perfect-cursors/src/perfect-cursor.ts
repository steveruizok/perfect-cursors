import { Vec } from '@tldraw/vec'
import { Spline } from './spline'

type AnimationState = 'stopped' | 'idle' | 'animating'

type Animation = {
  from: number[]
  to: number[]
  start: number
  duration: number
}

export class PerfectCursor {
  state: AnimationState = 'idle'
  queue: Animation[] = []
  timestamp = performance.now()
  lastRequestId = 0
  timeoutId: any = 0
  prevPoint?: number[]
  spline = new Spline()
  cb: (point: number[]) => void

  constructor(cb: (point: number[]) => void) {
    this.cb = cb
  }

  addPoint = (point: number[]) => {
    clearTimeout(this.timeoutId)
    const now = performance.now()
    const duration = Math.min(now - this.timestamp, PerfectCursor.MAX_INTERVAL)
    if (!this.prevPoint) {
      this.spline.clear()
      this.prevPoint = point
      this.spline.addPoint(point)
      this.cb(point)
      this.state = 'stopped'
      return
    }
    if (this.state === 'stopped') {
      if (Vec.dist(this.prevPoint, point) < 4) {
        this.cb(point)
        return
      }
      this.spline.clear()
      this.spline.addPoint(this.prevPoint)
      this.spline.addPoint(this.prevPoint)
      this.spline.addPoint(point)
      this.state = 'idle'
    } else {
      this.spline.addPoint(point)
    }
    if (duration < 16) {
      this.prevPoint = point
      this.timestamp = now
      this.cb(point)
      return
    }
    const animation: Animation = {
      start: this.spline.points.length - 3,
      from: this.prevPoint,
      to: point,
      duration,
    }
    this.prevPoint = point
    this.timestamp = now
    switch (this.state) {
      case 'idle': {
        this.state = 'animating'
        this.animateNext(animation)
        break
      }
      case 'animating': {
        this.queue.push(animation)
        break
      }
    }
  }

  animateNext = (animation: Animation) => {
    const start = performance.now()
    const loop = () => {
      const t = (performance.now() - start) / animation.duration
      if (t <= 1 && this.spline.points.length > 0) {
        try {
          this.cb(this.spline.getSplinePoint(t + animation.start))
        } catch (e) {
          console.warn(e)
        }
        this.lastRequestId = requestAnimationFrame(loop)
        return
      }
      const next = this.queue.shift()
      if (next) {
        this.state = 'animating'
        this.animateNext(next)
      } else {
        this.state = 'idle'
        this.timeoutId = setTimeout(() => {
          this.state = 'stopped'
        }, PerfectCursor.MAX_INTERVAL)
      }
    }
    loop()
  }

  static MAX_INTERVAL = 300

  dispose = () => {
    clearTimeout(this.timeoutId)
  }
}
