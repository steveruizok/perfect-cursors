# perfect-cursors

Perfect interpolation for animated multiplayer cursors. Used in [tldraw](https://tldraw.com).

💕 Love this library? Consider [becoming a sponsor](https://github.com/sponsors/steveruizok?frequency=recurring&sponsor=steveruizok).

## Installation

```bash
yarn add perfect-cursors
# or
npm i perfect-cursors
```

## Usage

Quick n' dirty docs.

This library may be used to smoothly animate a cursor based on presence information from a multiplayer backend, such as the Presence layer of [Y.js](https://github.com/yjs/yjs).

### Usage in React

To use the library in React, create a React hook called `usePerfectCursor`.

```tsx
// hooks/usePerfectCursor

export function usePerfectCursor(
  cb: (point: number[]) => void,
  point?: number[]
) {
  const [pc] = React.useState(() => new PerfectCursor(cb))

  React.useLayoutEffect(() => {
    if (point) pc.addPoint(point)
    return () => pc.dispose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pc])

  const onPointChange = React.useCallback(
    (point: number[]) => pc.addPoint(point),
    [pc]
  )

  return onPointChange
}
```

And then a Cursor component that looks something like this:

```tsx
// components/Cursor

import * as React from "react"
import { usePerfectCursor } from "../hooks/usePerfectCursors"

export function Cursor({ point }: { point: number[] }) {
  const rCursor = React.useRef<SVGSVGElement>(null)

  const animateCursor = React.useCallback((point: number[]) => {
    const elm = rCursor.current
    if (!elm) return
    elm.style.setProperty(
      "transform",
      `translate(${point[0]}px, ${point[1]}px)`
    )
  }, [])

  const onPointMove = usePerfectCursor(animateCursor)

  React.useLayoutEffect(() => onPointMove(point), [onPointMove, point])

  return (
    <svg
      ref={rCursor}
      style={{
        position: "absolute",
        top: -15,
        left: -15,
        width: 35,
        height: 35,
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 35 35"
      fill="none"
      fillRule="evenodd"
    >
      <g fill="rgba(0,0,0,.2)" transform="translate(1,1)">
        <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
        <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
      </g>
      <g fill="white">
        <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
        <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
      </g>
      <g fill={"red"}>
        <path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
        <path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
      </g>
    </svg>
  )
}
```

When the user's cursor point changes, pass that information to the Cursor component.

## Community

### License

This project is licensed under MIT.

If you're using the library in a commercial product, please consider [becoming a sponsor](https://github.com/sponsors/steveruizok?frequency=recurring&sponsor=steveruizok).

## Author

- [@steveruizok](https://twitter.com/steveruizok)
