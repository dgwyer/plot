import {create, line as shapeLine} from "d3";
import {Curve} from "../curve.js";
import {Mark} from "../plot.js";
import {indexOf, identity, maybeTuple, maybeZ} from "../options.js";
import {applyDirectStyles, applyIndirectStyles, applyTransform, applyGroupedChannelStyles, offset, groupIndex, maybeHalo} from "../style.js";
import {maybeDenseIntervalX, maybeDenseIntervalY} from "../transforms/bin.js";
import {applyGroupedMarkers, markers} from "./marker.js";

const defaults = {
  ariaLabel: "line",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeMiterlimit: 1
};

export class Line extends Mark {
  constructor(data, options = {}) {
    const {x, y, z, curve, tension, halo} = options;
    super(
      data,
      [
        {name: "x", value: x, scale: "x"},
        {name: "y", value: y, scale: "y"},
        {name: "z", value: maybeZ(options), optional: true}
      ],
      options,
      defaults
    );
    this.z = z;
    this.curve = Curve(curve, tension);
    this.halo = maybeHalo(halo);
    markers(this, options);
  }
  filter(index) {
    return index;
  }
  render(I, {x, y}, channels, dimensions) {
    const {x: X, y: Y} = channels;
    const {dx, dy, halo} = this;
    let haloInsertion;
    return create("svg:g")
        .call(applyIndirectStyles, this, dimensions)
        .call(applyTransform, x, y, offset + dx, offset + dy)
        .call(g => g.selectAll()
          .data(groupIndex(I, [X, Y], this, channels))
          .enter()
          .append("path")
            .call(applyDirectStyles, this)
            .call(applyGroupedChannelStyles, this, channels)
            .call(applyGroupedMarkers, this, channels)
            .attr("d", shapeLine()
              .curve(this.curve)
              .defined(i => i >= 0)
              .x(i => X[i])
              .y(i => Y[i]))
            .call(!halo ? () => {} : path => path.clone(true)
              .each(function() {
                // a halo must be inserted before the first aesthetic segment of the same line
                if (!this.previousSibling.__data__.segment) haloInsertion = this.previousSibling;
                this.parentNode.insertBefore(this, haloInsertion);
                this.setAttribute("marker-start", null);
                this.setAttribute("marker-mid", null);
                this.setAttribute("marker-end", null);
              })
              .call(applyIndirectStyles, halo, dimensions)
              .call(applyDirectStyles, halo)))
      .node();
  }
}

export function line(data, {x, y, ...options} = {}) {
  ([x, y] = maybeTuple(x, y));
  return new Line(data, {...options, x, y});
}

export function lineX(data, {x = identity, y = indexOf, ...options} = {}) {
  return new Line(data, maybeDenseIntervalY({...options, x, y}));
}

export function lineY(data, {x = indexOf, y = identity, ...options} = {}) {
  return new Line(data, maybeDenseIntervalX({...options, x, y}));
}
