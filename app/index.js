// Author: Chuan Wang
// Email: nauhcy@gmail.com
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider, connect } from "react-redux";
import { handleActions, createAction } from "redux-actions";
import { createSelector } from "reselect";
import reducer from "./reducer";
import "./assets/css/index.css";
import { arrInRange } from "./utils";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import {
  loadData,
  updateBarchartValue,
  updateBarchartValueEnd,
  updateInstanceId,
  clickPredictionButton,
  updateAndFetch
} from "./actions";
// import { getData, getMouseOvered, getHighlighted } from "./selectors/base";
import * as utils from "./utils";
import { AutoSizer } from "react-virtualized/dist/commonjs/AutoSizer";
import InteractiveBarChart from "./components/InteractiveBarChart";
import BackgroundBarChart from "./components/barchart";
import thunk from "redux-thunk";

// ---- consts ----//
const colors = [
  "#8884d8",
  "#82ca9d",
  "#83a6ed",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#ffc658"
];

//  ----  Redux Utility Functions   ---- //
const mapDispatchToProps = {
  loadData,
  updateBarchartValue,
  updateBarchartValueEnd,
  updateInstanceId,
  clickPredictionButton,
  updateAndFetch
};

const mapStateToProps = state => ({
  data: state.data,
  updatedData: state.updatedData,
  currentUpdatedData: state.currentUpdatedData,
  predictionResult: state.predictionResult,
  xName: state.xName,
  yName: state.yName,
  yLabel: state.yLabel,
  selectedInstanceId: state.selectedInstanceId,
  totalInstanceCnt: state.totalInstanceCnt
});

// ---- React Component ---- //
class App extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const {
      selectedInstanceId,
      currentUpdatedData,
      updateAndFetch
    } = this.props;
    updateAndFetch(
      JSON.stringify({
        instanceId: selectedInstanceId,
        featureIdx: [2, 10, 28],
        updatedData: currentUpdatedData
      })
    );
  }

  handleClickPredictionButton = () => {
    const {
      selectedInstanceId,
      currentUpdatedData,
      updateAndFetch
    } = this.props;
    const data = JSON.stringify({
      instanceId: selectedInstanceId,
      featureIdx: [2, 10, 28],
      updatedData: currentUpdatedData
    });
    updateAndFetch(data);
  };

  render() {
    const {
      data,
      updatedData,
      currentUpdatedData,
      predictionResult,
      xName,
      yName,
      yLabel,
      totalInstanceCnt,
      updateBarchartValue,
      updateBarchartValueEnd,
      selectedInstanceId,
      updateInstanceId,
      clickPredictionButton
    } = this.props;

    if (
      !data ||
      data.length === 0 ||
      !currentUpdatedData ||
      currentUpdatedData.length === 0 ||
      predictionResult.length === 0
    ) {
      return null;
    }

    return (
      <div className="App">
        <div className="header-container">
          <div className="header-text-container">
            {"Sequence Outcome Prediction with RNN"}
          </div>
        </div>
        <div className="views-container">
          <div className="barcharts-container">
            <div className="instance-selector-container">
              <InputLabel id="select-text">Patient</InputLabel>
              <Select
                labelId="instance-select-label"
                id="instance-simple-select"
                value={selectedInstanceId}
                onChange={updateInstanceId}
              >
                {arrInRange(totalInstanceCnt).map(i => {
                  return (
                    <MenuItem key={i} value={i}>
                      {i}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
            {arrInRange(3).map(i => {
              return (
                <div key={`div${i}`} className={`barchart${i}`}>
                  <AutoSizer key={`autosizer-${i}`}>
                    {({ height, width }) => (
                      <InteractiveBarChart
                        key={`ibarchart${i}`}
                        id={`ibarchart${i}`}
                        width={width}
                        height={height}
                        data={currentUpdatedData}
                        xName={xName}
                        yName={yName[i]}
                        legendLabel={yLabel[i]}
                        color={colors[i]}
                        onChangeValue={updateBarchartValue}
                        onChangeValueEnd={updateBarchartValueEnd}
                      />
                    )}
                  </AutoSizer>
                </div>
              );
            })}
          </div>
          <div className="prediction-view-container">
            <div className="prediction-button-container">
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleClickPredictionButton}
              >
                Prediction
              </Button>
            </div>
            <div className="prediction-barchart-container">
              <AutoSizer>
                {({ height, width }) => (
                  <BackgroundBarChart
                    width={width}
                    height={height}
                    data={predictionResult}
                    xName={"class"}
                    yName={["original", "predict"]}
                  />
                )}
              </AutoSizer>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// ---- Link Redux to React ---- //
const store = createStore(reducer, applyMiddleware(thunk));
const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

// ---- Render! ---- //
ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById("app")
);
