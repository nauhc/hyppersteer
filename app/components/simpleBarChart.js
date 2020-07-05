import * as React from "react";
import { render } from "react-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const defaultProps = {
  id: "barchart",
  width: null,
  height: null,
  data: [],
  xName: null,
  yName: null,
  yDomain: [],
  barSize: 10,
  color: "#83a6ed",
  bgColor: "#ddd"
};

class SimpleBarChart extends React.Component {
  constructor() {
    super();
  }

  render() {
    const {
      id,
      width,
      height,
      data,
      xName,
      yName,
      yDomain,
      barSize,
      color,
      bgColor
    } = this.props;

    if (!width || !height || !data || data.length === 0 || !xName || !yName) {
      return null;
    }

    return (
      <BarChart
        width={width}
        height={height}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xName} />
        <YAxis domain={yDomain.length === 0 ? [0, 1] : [0, "dataMax"]} />
        <Tooltip />
        <Legend />
        <Bar barSize={barSize} dataKey={yName} fill={color} />
      </BarChart>
    );
  }
}

SimpleBarChart.defaultProps = defaultProps;
export default SimpleBarChart;
