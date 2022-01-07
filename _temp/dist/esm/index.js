// src/index.ts
var _Vec = class {
  static clamp(n, min, max) {
    return Math.max(min, typeof max !== "undefined" ? Math.min(n, max) : n);
  }
  static clampV(A, min, max) {
    return A.map((n) => max ? _Vec.clamp(n, min, max) : _Vec.clamp(n, min));
  }
  static cross(x, y, z) {
    return (y[0] - x[0]) * (z[1] - x[1]) - (z[0] - x[0]) * (y[1] - x[1]);
  }
  static snap(a, step = 1) {
    return [Math.round(a[0] / step) * step, Math.round(a[1] / step) * step];
  }
};
var Vec = _Vec;
Vec.neg = (A) => {
  return [-A[0], -A[1]];
};
Vec.add = (A, B) => {
  return [A[0] + B[0], A[1] + B[1]];
};
Vec.addScalar = (A, n) => {
  return [A[0] + n, A[1] + n];
};
Vec.sub = (A, B) => {
  return [A[0] - B[0], A[1] - B[1]];
};
Vec.subScalar = (A, n) => {
  return [A[0] - n, A[1] - n];
};
Vec.vec = (A, B) => {
  return [B[0] - A[0], B[1] - A[1]];
};
Vec.mul = (A, n) => {
  return [A[0] * n, A[1] * n];
};
Vec.mulV = (A, B) => {
  return [A[0] * B[0], A[1] * B[1]];
};
Vec.div = (A, n) => {
  return [A[0] / n, A[1] / n];
};
Vec.divV = (A, B) => {
  return [A[0] / B[0], A[1] / B[1]];
};
Vec.per = (A) => {
  return [A[1], -A[0]];
};
Vec.dpr = (A, B) => {
  return A[0] * B[0] + A[1] * B[1];
};
Vec.cpr = (A, B) => {
  return A[0] * B[1] - B[0] * A[1];
};
Vec.len2 = (A) => {
  return A[0] * A[0] + A[1] * A[1];
};
Vec.len = (A) => {
  return Math.hypot(A[0], A[1]);
};
Vec.pry = (A, B) => {
  return _Vec.dpr(A, B) / _Vec.len(B);
};
Vec.uni = (A) => {
  return _Vec.div(A, _Vec.len(A));
};
Vec.normalize = (A) => {
  return _Vec.uni(A);
};
Vec.tangent = (A, B) => {
  return _Vec.uni(_Vec.sub(A, B));
};
Vec.dist2 = (A, B) => {
  return _Vec.len2(_Vec.sub(A, B));
};
Vec.dist = (A, B) => {
  return Math.hypot(A[1] - B[1], A[0] - B[0]);
};
Vec.fastDist = (A, B) => {
  const V = [B[0] - A[0], B[1] - A[1]];
  const aV = [Math.abs(V[0]), Math.abs(V[1])];
  let r = 1 / Math.max(aV[0], aV[1]);
  r = r * (1.29289 - (aV[0] + aV[1]) * r * 0.29289);
  return [V[0] * r, V[1] * r];
};
Vec.ang = (A, B) => {
  return Math.atan2(_Vec.cpr(A, B), _Vec.dpr(A, B));
};
Vec.angle = (A, B) => {
  return Math.atan2(B[1] - A[1], B[0] - A[0]);
};
Vec.med = (A, B) => {
  return _Vec.mul(_Vec.add(A, B), 0.5);
};
Vec.rot = (A, r = 0) => {
  return [A[0] * Math.cos(r) - A[1] * Math.sin(r), A[0] * Math.sin(r) + A[1] * Math.cos(r)];
};
Vec.rotWith = (A, C, r = 0) => {
  if (r === 0)
    return A;
  const s = Math.sin(r);
  const c = Math.cos(r);
  const px = A[0] - C[0];
  const py = A[1] - C[1];
  const nx = px * c - py * s;
  const ny = px * s + py * c;
  return [nx + C[0], ny + C[1]];
};
Vec.isEqual = (A, B) => {
  return A[0] === B[0] && A[1] === B[1];
};
Vec.lrp = (A, B, t) => {
  return _Vec.add(A, _Vec.mul(_Vec.sub(B, A), t));
};
Vec.int = (A, B, from, to, s = 1) => {
  const t = (_Vec.clamp(from, to) - from) / (to - from);
  return _Vec.add(_Vec.mul(A, 1 - t), _Vec.mul(B, s));
};
Vec.ang3 = (p1, pc, p2) => {
  const v1 = _Vec.vec(pc, p1);
  const v2 = _Vec.vec(pc, p2);
  return _Vec.ang(v1, v2);
};
Vec.abs = (A) => {
  return [Math.abs(A[0]), Math.abs(A[1])];
};
Vec.rescale = (a, n) => {
  const l = _Vec.len(a);
  return [n * a[0] / l, n * a[1] / l];
};
Vec.isLeft = (p1, pc, p2) => {
  return (pc[0] - p1[0]) * (p2[1] - p1[1]) - (p2[0] - p1[0]) * (pc[1] - p1[1]);
};
Vec.clockwise = (p1, pc, p2) => {
  return _Vec.isLeft(p1, pc, p2) > 0;
};
Vec.toFixed = (a, d = 2) => {
  return a.map((v) => +v.toFixed(d));
};
Vec.nearestPointOnLineThroughPoint = (A, u, P) => {
  return _Vec.add(A, _Vec.mul(u, _Vec.pry(_Vec.sub(P, A), u)));
};
Vec.distanceToLineThroughPoint = (A, u, P) => {
  return _Vec.dist(P, _Vec.nearestPointOnLineThroughPoint(A, u, P));
};
Vec.nearestPointOnLineSegment = (A, B, P, clamp = true) => {
  const u = _Vec.uni(_Vec.sub(B, A));
  const C = _Vec.add(A, _Vec.mul(u, _Vec.pry(_Vec.sub(P, A), u)));
  if (clamp) {
    if (C[0] < Math.min(A[0], B[0]))
      return A[0] < B[0] ? A : B;
    if (C[0] > Math.max(A[0], B[0]))
      return A[0] > B[0] ? A : B;
    if (C[1] < Math.min(A[1], B[1]))
      return A[1] < B[1] ? A : B;
    if (C[1] > Math.max(A[1], B[1]))
      return A[1] > B[1] ? A : B;
  }
  return C;
};
Vec.distanceToLineSegment = (A, B, P, clamp = true) => {
  return _Vec.dist(P, _Vec.nearestPointOnLineSegment(A, B, P, clamp));
};
Vec.nudge = (A, B, d) => {
  if (_Vec.isEqual(A, B))
    return A;
  return _Vec.add(A, _Vec.mul(_Vec.uni(_Vec.sub(B, A)), d));
};
Vec.nudgeAtAngle = (A, a, d) => {
  return [Math.cos(a) * d + A[0], Math.sin(a) * d + A[1]];
};
Vec.toPrecision = (a, n = 4) => {
  return [+a[0].toPrecision(n), +a[1].toPrecision(n)];
};
Vec.pointsBetween = (A, B, steps = 6) => {
  return Array.from(Array(steps)).map((_, i) => {
    const t = i / (steps - 1);
    const k = Math.min(1, 0.5 + Math.abs(0.5 - t));
    return [..._Vec.lrp(A, B, t), k];
  });
};
Vec.slope = (A, B) => {
  if (A[0] === B[0])
    return NaN;
  return (A[1] - B[1]) / (A[0] - B[0]);
};
Vec.max = (...v) => {
  return [Math.max(...v.map((a) => a[0])), Math.max(...v.map((a) => a[1]))];
};
Vec.min = (...v) => {
  return [Math.max(...v.map((a) => a[0])), Math.max(...v.map((a) => a[1]))];
};
var src_default = Vec;
export {
  Vec,
  src_default as default
};
//# sourceMappingURL=index.js.map
