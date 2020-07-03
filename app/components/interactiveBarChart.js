import * as React from "react";
import { render } from "react-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceDot,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { AutoSizer } from "react-virtualized/dist/commonjs/AutoSizer";
import { scaleLinear } from "d3-scale";

const defaultProps = {
  id: "barchart",
  width: null,
  height: null,
  data: [],
  xName: null,
  yName: null,
  legendLabel: " ",
  color: "#aaaaaa",
  yAxisHeight: 1,
  onChangeValue: () => {},
  onChangeValueEnd: () => {}
};

class InteractiveBarChart extends React.Component {
  constructor() {
    super();
    this.state = {
      change: false,
      selectedX: [],
      yOffset: 0,
      yStart: 0,
      scale: () => {}
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height ||
      nextProps.data !== this.props.data
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const id = `${this.props.id}-y-axis`;
    const yAxis = document.getElementById(id);

    const yAxisHeight = yAxis.attributes.height.value;
    this.setState({
      yAxisHeight
    });
  }

  handleMouseDown = e => {
    if (!e) {
      return;
    }

    const { selectedX, yStart, yAxisHeight } = this.state;
    const { data, yName } = this.props;
    const max = Math.max(...data.map(o => o[yName]));

    this.setState({
      change: true,
      selectedX: e.activeLabel,
      yStart: e.chartY,
      scale: scaleLinear([0, yAxisHeight], [0, max])
    });
  };

  handleMouseMove = e => {
    if (!e || !this.state.change) {
      return;
    }

    const { yOffset, yStart, selectedX, yAxisHeight, scale } = this.state;
    const { xName, yName } = this.props;
    // change data according to the action event

    const dy = scale(yStart - e.chartY);

    this.setState({
      yOffset: yStart - e.chartY
    });
    this.props.onChangeValue({ selectedX, dy, xName, yName });
  };

  handleMouseUp = e => {
    if (!e) {
      return;
    }

    const { yOffset } = this.state;
    this.setState({
      change: false,
      yOffset: 0
    });
    this.props.onChangeValueEnd();
  };

  render() {
    const {
      id,
      width,
      height,
      data,
      xName,
      yName,
      legendLabel,
      color,
      yAxisHeight,
      onChangeValue
    } = this.props;
    const { selectedX } = this.state;
    if (!width || !height || !data || data.length === 0 || !xName || !yName) {
      return null;
    }

    return (
      <BarChart
        width={width}
        height={height}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
      >
        <XAxis dataKey={xName} />
        <YAxis id={`${id}-y-axis`} domain={[0, "dataMax"]} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend
          verticalAlign="top"
          height={30}
          payload={[
            {
              id: `${id}-legend`,
              value: legendLabel,
              type: "line",
              color: color
            }
          ]}
        />
        <Bar barSize={5} dataKey={yName} fill={color} />
      </BarChart>
    );
  }
}

InteractiveBarChart.defaultProps = defaultProps;
export default InteractiveBarChart;
