import * as React from 'react'
import { Cursor } from './components/Cursor'
import throttle from 'lodash.throttle'
import { INTERVAL_DURATION } from './constants'

export default function App() {
  const [point, setPoint] = React.useState<number[]>()
  const [duration, setDuration] = React.useState<number>(INTERVAL_DURATION)

  const onPointerMove = React.useCallback(
    throttle((e: React.PointerEvent) => {
      setPoint([e.clientX, e.clientY])
    }, duration),
    [setPoint, duration]
  )

  const handleChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
    setDuration(Math.floor(+e.currentTarget.value))
  }, [])

  return (
    <div className="app" onPointerMove={onPointerMove}>
      <div className="duration-wrapper">
        <input
          className="input"
          type="range"
          min={0}
          max={1000}
          value={duration}
          onChange={handleChange}
        />
        <label htmlFor="duration-control">{duration}</label>
      </div>
      {point && <Cursor point={point} maxInterval={duration} />}
    </div>
  )
}
