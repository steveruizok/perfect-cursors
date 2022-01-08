# perfect-cursors

Perfect interpolation for animated multiplayer cursors. Used in [tldraw](https://tldraw.com).

💕 Love this library? Consider [becoming a sponsor](https://github.com/sponsors/steveruizok?frequency=recurring&sponsor=steveruizok).

[![Edit perfect-cursors-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/perfect-cursors-demo-u85tu?fontsize=14&hidenavigation=1&theme=dark)

## Installation

```bash
yarn add perfect-cursors
# or
npm i perfect-cursors
```

## Introduction

You can use this library to smoothly animate a cursor based on limited information.

![Kapture 2022-01-08 at 09 25 50](https://user-images.githubusercontent.com/23072548/148639100-864b46ee-f69f-4f9a-a695-848936050b50.gif)

_Above: We are updating the red cursor's position once every 80 milliseconds. The `perfect-cursors` library is being used to correctly animate between these positions._

### Animating between points

When implementing a multiplayer app, you will most likely be displaying each user's cursor location based on the information you receive from a multiplayer service such as [Pusher](https://pusher.com/), [Liveblocks](https://liveblocks.io/).

In a perfect world, these updates would occur "in real time": that is, arriving with zero latency and arriving at the same rate as the user's monitor.

![Kapture 2022-01-08 at 09 35 34](https://user-images.githubusercontent.com/23072548/148639423-529a7027-cab9-4085-a9f4-d85e28cce744.gif)

_Above: Updating the cursor instantly._

In the real world, however, services often "throttle" their updates to roughly one update every 50-80 milliseconds.

Updating the cursors' locations directly will cause cursors to "jump" between points.

![Kapture 2022-01-08 at 09 22 43](https://user-images.githubusercontent.com/23072548/148639039-f810a907-6d43-433c-b446-92d90f240281.gif)

_Above: Updating the cursor's once position every 80 milliseconds._

Transitioning between points via CSS can work, however this looks increasingly artificial as the delay increases. Worse, because updates do not come in on an _exact_ interval, some animations will never finish while others will pause between animations.

![Kapture 2022-01-08 at 09 31 55](https://user-images.githubusercontent.com/23072548/148639280-a26003c6-f628-49cf-a4ea-3cf1b7881fdf.gif)

_Above: Transitioning the cursor's once position every 80 milliseconds._

Smart animating with JavaScript and dynamic durations can be better, however this still looks artificial as the delay increases.

![Kapture 2022-01-08 at 10 11 39](https://user-images.githubusercontent.com/23072548/148640411-14821049-fbca-4d39-ae0e-fb601a6f27de.gif)

_Above: Animating the cursor once position every 80 milliseconds._

For best results, you would animate while _interpolating_ the cursors' locations based on a set of connected curves (e.g. a "spline").

![Kapture 2022-01-08 at 09 25 50](https://user-images.githubusercontent.com/23072548/148639100-864b46ee-f69f-4f9a-a695-848936050b50.gif)

_Above: Animating the cursor once position every 80 milliseconds using spline interpolation._

In this way, your animations can very closely approximate the actual movement of a cursor. So closely, in fact, that it appears as though the cursor is being updated "in real time" with a "one-update" delay.

## Usage

Quick n' dirty docs.

### Usage

To use the library directly, create an instance of the `PerfectCursor` class and pass it a callback to fire on each animation frame.

```ts
import { PerfectCursor } from 'perfect-cursors'

const elm = document.getElementById('cursor')

function updateMyCursor(point: number[]) {
  elm.style.setProperty('transform', `translate(${point[0]}px, ${point[1]}px)`)
}

const pc = new PerfectCursor(updateMyCursor)
```

Use the instance's `addPoint` to add a point whenever you have a new one.

```ts
pc.addPoint([0, 0])
setTimeout(() => pc.addPoint([100, 100]), 80)
setTimeout(() => pc.addPoint([200, 150]), 160)
```

Use the `dispose` method to clean up any intervals.

```
pc.dispose()
```

### Usage in React

To use the library in React, create a React hook called `usePerfectCursor`.

```tsx
// hooks/usePerfectCursor

import { PerfectCursor } from 'perfect-cursors'

export function usePerfectCursor(cb: (point: number[]) => void, point?: number[]) {
  const [pc] = React.useState(() => new PerfectCursor(cb))

  React.useLayoutEffect(() => {
    if (point) pc.addPoint(point)
    return () => pc.dispose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pc])

  const onPointChange = React.useCallback((point: number[]) => pc.addPoint(point), [pc])

  return onPointChange
}
```

And then a Cursor component that looks something like this:

```tsx
// components/Cursor

import * as React from 'react'
import { usePerfectCursor } from '../hooks/usePerfectCursors'

export function Cursor({ point }: { point: number[] }) {
  const rCursor = React.useRef<SVGSVGElement>(null)

  const animateCursor = React.useCallback((point: number[]) => {
    const elm = rCursor.current
    if (!elm) return
    elm.style.setProperty('transform', `translate(${point[0]}px, ${point[1]}px)`)
  }, [])

  const onPointMove = usePerfectCursor(animateCursor)

  React.useLayoutEffect(() => onPointMove(point), [onPointMove, point])

  return (
    <svg
      ref={rCursor}
      style={{
        position: 'absolute',
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
      <g fill={'red'}>
        <path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
        <path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
      </g>
    </svg>
  )
}
```

When the user's cursor point changes, pass that information to the Cursor component.

## Development

To start the development server:

- clone this repo
- run `yarn` or `npm install` to install dependencies
- run `yarn start` or `npm run start` from the project root.
- open `localhost:5420` in your browser to view the example project.

## Community

### License

This project is licensed under MIT.

If you're using the library in a commercial product, please consider [becoming a sponsor](https://github.com/sponsors/steveruizok?frequency=recurring&sponsor=steveruizok).

## Author

- [@steveruizok](https://twitter.com/steveruizok)
