import * as Plot from "@observablehq/plot";

const data = Array.from(["none", "10 5", [20, 3], [30, 5, 10, 10], null],
  (strokeDasharray) => Array.from([0, 2, 20, 60, NaN],
    (strokeDashoffset) => ({strokeDasharray, strokeDashoffset})
  )
).flat();

export default async function() {
  return Plot.plot({
    facet: {data, x: "strokeDasharray", y: "strokeDashoffset"},
    marks: [
      Plot.arrow(data, {
        x1: 0,
        x2: 1,
        y1: 0,
        y2: 1,
        strokeDasharray: d => d.strokeDasharray,
        strokeDashoffset: d => d.strokeDashoffset,
        bend: true,
        headLength: 0
      })
    ],
    fx: {padding: 0.2},
    fy: {padding: 0.2},
    axis: null
  });
}