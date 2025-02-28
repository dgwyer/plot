import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

export default async function () {
  const downloads = (await d3.csv("data/downloads.csv", d3.autoType)).filter(
    (d) => d.date.getUTCFullYear() === 2019 && d.date.getUTCMonth() <= 1 && d.downloads > 0
  );
  return Plot.plot({
    width: 960,
    marginBottom: 55,
    x: {
      interval: d3.utcDay,
      tickRotate: -90,
      tickFormat: "%b %d"
    },
    marks: [
      Plot.barY(downloads, {x: "date", y: "downloads", fill: "#ccc"}),
      Plot.tickY(downloads, {x: "date", y: "downloads"}),
      Plot.ruleY([0])
    ]
  });
}
