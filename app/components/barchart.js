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
  color: "#8884d8",
  bgColor: "#ddd"
};

class BackgroundBarChart extends React.Component {
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
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yName[0]} fill={bgColor} />
        <Bar dataKey={yName[1]} fill={color} />
      </BarChart>
    );
  }
}

BackgroundBarChart.defaultProps = defaultProps;
export default BackgroundBarChart;
