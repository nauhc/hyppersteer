import * as React from "react";
import { render } from "react-dom";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  // ReferenceDot,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { AutoSizer } from "react-virtualized/dist/commonjs/AutoSizer";

const defaultProps = {
  id: "barchart",
  width: null,
  height: null,
  data: [],
  xName: null,
  yName: null,
  legendLabel: " ",
  color: "#aaaaaa",
  yAxisHeight: 1
};

const arrInRange = N => {
  return Array.from({ length: N }, (v, k) => k);
};

const colors = [
  "#83a6ed",
  "#8dd1e1",
  "#ffc658",
  "#a4de6c",
  "#d0ed57",
  "#8884d8",
  "#82ca9d"
];

class PDplot extends React.Component {
  render() {
    const { id, width, height, data, xName } = this.props;
    // console.log("pdplot", width, height);
    console.log("PDplot data", data);

    const clusterSize = data.sizes.length;
    const pdData = data.pd;

    return (
      <ComposedChart
        width={height * 2.5}
        height={height}
        data={pdData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey={xName} />
        <YAxis />
        <Tooltip />
        {arrInRange(clusterSize).map(i => {
          return (
            <Area
              key={`${id}-area${i}`}
              id={`${id}-area${i}`}
              type="monotone"
              dataKey={`h${i}`}
              stroke={"none"}
              fillOpacity={0.33}
              fill={colors[i % colors.length]}
            />
          );
        })}

        {arrInRange(clusterSize).map(i => {
          return (
            <Line
              key={`${id}-line${i}`}
              id={`${id}-line${i}`}
              type="monotone"
              dataKey={`m${i}`}
              dot={false}
              strokeWidth={2}
              stroke={colors[i % colors.length]}
            />
          );
        })}
      </ComposedChart>
    );
  }
}

PDplot.defaultProps = defaultProps;
export default PDplot;
