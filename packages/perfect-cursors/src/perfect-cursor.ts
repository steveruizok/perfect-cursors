import { Vec } from "@tldraw/vec"
import { Spline } from "./spline"

type AnimationState = "stopped" | "idle" | "animating"

type Animation = {
  curve: boolean
  from: number[]
  to: number[]
  start: number
  distance: number
  timeStamp: number
  duration: number
}

export class PerfectCursor {
  state: AnimationState = "idle"
  queue: Animation[] = []
  timestamp = performance.now()
  lastRequestId = 0
  timeoutId: any = 0
  prevPoint = [0, 0]
  spline = new Spline()
  cb: (point: number[]) => void

  constructor(cb: (point: number[]) => void) {
    this.cb = cb
  }

  addPoint = (point: number[]) => {
    const now = performance.now()
    if (this.state === "stopped") {
      this.timestamp = now
      this.prevPoint = point
      this.spline.clear()
    }
    this.spline.addPoint(point)
    const animation: Animation = {
      distance: this.spline.totalLength,
      curve: this.spline.points.length > 3,
      start: this.spline.points.length - 3,
      from: this.prevPoint,
      to: point,
      timeStamp: now,
      duration: Math.min(now - this.timestamp, 300),
    }
    this.prevPoint = point
    this.timestamp = now
    switch (this.state) {
      case "stopped": {
        this.prevPoint = point
        this.state = "idle"
        break
      }
      case "idle": {
        this.state = "animating"
        this.animateNext(animation)
        break
      }
      case "animating": {
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
          this.cb(
            animation.curve
              ? this.spline.getSplinePoint(t + animation.start)
              : Vec.lrp(animation.from, animation.to, t)
          )
        } catch (e) {
          console.warn(e)
        }
        this.lastRequestId = requestAnimationFrame(loop)
        return
      }
      const next = this.queue.shift()
      if (next) {
        this.state = "animating"
        this.animateNext(next)
      } else {
        this.state = "idle"
        this.timeoutId = setTimeout(() => {
          this.state = "stopped"
        }, 250)
      }
    }
    loop()
  }

  dispose = () => {
    clearTimeout(this.timeoutId)
  }
}
