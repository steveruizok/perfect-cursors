import { Spline } from "./spline";
declare type AnimationState = "stopped" | "idle" | "animating";
declare type Animation = {
    curve: boolean;
    from: number[];
    to: number[];
    start: number;
    distance: number;
    timeStamp: number;
    duration: number;
};
export declare class PerfectCursor {
    state: AnimationState;
    queue: Animation[];
    timestamp: number;
    lastRequestId: number;
    timeoutId: any;
    prevPoint: number[];
    spline: Spline;
    cb: (point: number[]) => void;
    constructor(cb: (point: number[]) => void);
    addPoint: (point: number[]) => void;
    animateNext: (animation: Animation) => void;
    dispose: () => void;
}
export {};
//# sourceMappingURL=perfect-cursor.d.ts.map