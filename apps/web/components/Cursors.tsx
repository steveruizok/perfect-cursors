import * as React from "react"
import { Cursor } from "./Cursor"

export function Cursors() {
  const [point, setPoint] = React.useState<number[]>()

  const onPointerMove = React.useCallback((e: React.PointerEvent) => {
    setPoint([e.clientX, e.clientY])
  }, [])

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onPointerMove={onPointerMove}
    >
      {point && <Cursor point={point} />}
    </div>
  )
}
