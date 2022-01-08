import * as React from "react"
import { Cursor } from "./Cursor"
import throttle from "lodash.throttle"
import { INTERVAL_DURATION } from "../constants"

export function Cursors() {
  const [point, setPoint] = React.useState<number[]>()

  const onPointerMove = React.useCallback(
    throttle((e: React.PointerEvent) => {
      setPoint([e.clientX, e.clientY])
    }, INTERVAL_DURATION),
    [setPoint]
  )

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onPointerMove={onPointerMove}
    >
      {point && <Cursor point={point} />}
    </div>
  )
}
