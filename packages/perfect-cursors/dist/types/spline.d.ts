export declare class Spline {
    points: number[][];
    lengths: number[];
    totalLength: number;
    private prev?;
    constructor(points?: number[][]);
    addPoint: (point: number[]) => void;
    clear: () => void;
    getSplinePoint: (t: number) => number[];
}
//# sourceMappingURL=spline.d.ts.map