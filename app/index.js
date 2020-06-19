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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {
  loadData,
  loadTSNE,
  updateBarchartValue,
  updateBarchartValueEnd,
  updateInstanceId,
  clickPredictionButton,
  updateAndFetchData,
  updateAndFetchTSNE,
  updateCounterfactualSwitchValue
} from "./actions";
// import { getData, getMouseOvered, getHighlighted } from "./selectors/base";
import * as utils from "./utils";
import { AutoSizer } from "react-virtualized/dist/commonjs/AutoSizer";
import InteractiveBarChart from "./components/InteractiveBarChart";
import BackgroundBarChart from "./components/barchart";
import thunk from "redux-thunk";
import LassoScatteplot from "./components/lassoScatteplot";

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
  loadTSNE,
  updateBarchartValue,
  updateBarchartValueEnd,
  updateInstanceId,
  clickPredictionButton,
  updateAndFetchData,
  updateAndFetchTSNE,
  updateCounterfactualSwitchValue
};

const mapStateToProps = state => ({
  tsneData: state.tsneData,
  data: state.data,
  updatedData: state.updatedData,
  currentUpdatedData: state.currentUpdatedData,
  showCounterfactual: state.showCounterfactual,
  counterfactual: state.counterfactual,
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
      updateAndFetchData,
      updateAndFetchTSNE
    } = this.props;
    updateAndFetchData(
      JSON.stringify({
        instanceId: selectedInstanceId,
        // featureIdx: [1, 8, 2],
        featureIdx: [1, 30, 8, 2, 5, 21],
        updatedData: currentUpdatedData
      })
    );

    updateAndFetchTSNE({});
  }

  handleClickPredictionButton = () => {
    const {
      selectedInstanceId,
      currentUpdatedData,
      updateAndFetchData
    } = this.props;
    const data = JSON.stringify({
      instanceId: selectedInstanceId,
      // featureIdx: [1, 8, 2],
      featureIdx: [1, 30, 8, 2, 5, 21],
      updatedData: currentUpdatedData
    });
    updateAndFetchData(data);
  };

  render() {
    const {
      tsneData,
      data,
      updatedData,
      currentUpdatedData,
      showCounterfactual,
      updateCounterfactualSwitchValue,
      counterfactual,
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
      !tsneData ||
      tsneData.length === 0 ||
      counterfactual.length === 0 ||
      !currentUpdatedData ||
      currentUpdatedData.length === 0 ||
      predictionResult.length === 0
    ) {
      return null;
    }

    const featureCnt = yLabel.length;
    const featureBarchartGridDivision = "1fr ".repeat(featureCnt);
    // console.log("showCounterfactual", showCounterfactual);
    // console.log(updateCounterfactualSwitchValue);

    let tsneDataDeepCopy = JSON.parse(JSON.stringify(tsneData));
    tsneDataDeepCopy.forEach((d, i) => {
      tsneDataDeepCopy[i]["highlight"] = 0;
    });

    return (
      <div className="App">
        <div className="header-container">
          <div className="header-text-container">
            {"Sequence Outcome Prediction with RNN"}
          </div>
        </div>
        <div
          className="views-container"
          style={{
            display: "grid",
            gridGap: "5px",
            gridTemplateRows: "70% 30%"
          }}
        >
          <div
            className="instance-prediction-tsne-container"
            style={{
              display: "grid",
              gridGap: "10px",
              gridTemplateColumns: "auto 700px"
            }}
          >
            <div
              className="instance-prediction"
              style={{
                display: "grid",
                gridGap: "5px",
                gridTemplateColumns: "80% 20%"
              }}
            >
              <div
                className="instances"
                style={{
                  display: "grid",
                  gridGap: "5px",
                  gridTemplateRows: "50px auto",
                  border: "solid #ccc 1px"
                }}
              >
                <div
                  className="title-n-selector-container"
                  style={{
                    display: "grid",
                    gridGap: "5px",
                    gridTemplateColumns: "20% 50% auto"
                  }}
                >
                  <div className="instance-title-container">
                    {"Instance Features"}
                  </div>
                  <div className="switch-container">
                    <div className="counterfactual-switch">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={showCounterfactual}
                            onChange={(e, v) =>
                              updateCounterfactualSwitchValue(v)
                            }
                            name="counterfactualSwitch"
                            color="primary"
                          />
                        }
                        label="Show Counterfactual"
                      />
                    </div>
                  </div>
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
                </div>
                <div
                  className="barcharts-container"
                  style={{
                    display: "grid",
                    gridTemplateRows: featureBarchartGridDivision
                  }}
                >
                  {arrInRange(yLabel.length).map(i => {
                    return (
                      <div key={`div${i}`} className={`barchart${i}`}>
                        <AutoSizer key={`autosizer-${i}`}>
                          {({ height, width }) => (
                            <InteractiveBarChart
                              key={`ibarchart${i}`}
                              id={`ibarchart${i}`}
                              width={width}
                              height={height}
                              data={
                                showCounterfactual
                                  ? counterfactual
                                  : currentUpdatedData
                              }
                              xName={xName}
                              yName={yName[i]}
                              legendLabel={yLabel[i]}
                              color={showCounterfactual ? colors[1] : colors[0]}
                              onChangeValue={updateBarchartValue}
                              onChangeValueEnd={updateBarchartValueEnd}
                            />
                          )}
                        </AutoSizer>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                className="prediction"
                style={{
                  display: "grid",
                  gridGap: "5px",
                  gridTemplateRows: "1fr 1fr"
                }}
              >
                <div
                  className="prediction-certainty"
                  style={{
                    display: "grid",
                    gridGap: "5px",
                    gridTemplateRows: "50px 15% auto",
                    border: "solid #ccc 1px"
                  }}
                >
                  <div className="certainty-title-container">
                    {"Prediction Certainty"}
                  </div>
                  <div className="prediction-button-container">
                    <Button
                      variant="contained"
                      color={"primary"}
                      onClick={this.handleClickPredictionButton}
                      disabled={showCounterfactual}
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

                <div
                  className="prediction-confusionMatix"
                  style={{ border: "solid #ccc 1px" }}
                >
                  <div className="confMat-title-container">
                    {"Confusion Matrix"}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="tsne-counterfactual-container"
              style={{
                display: "grid",
                gridGap: "5px",
                gridTemplateRows: "70% auto"
              }}
            >
              <div
                className="tsne-view-container"
                style={{
                  border: "solid #ccc 1px",
                  display: "grid",
                  gridGap: "5px",
                  gridTemplateRows: "80px auto"
                }}
              >
                <h3 style={{ color: "#666" }} className="tsne-title">
                  2D Projection
                </h3>
                <div className="lassoscatterplot">
                  <AutoSizer>
                    {({ tsneWidth, tsneHeight }) => (
                      <LassoScatteplot
                        width={tsneWidth}
                        height={tsneHeight}
                        data={tsneDataDeepCopy}
                        id={"id"}
                        dotSize={5}
                        colorby={"label"}
                        highlightby={"highlight"}
                      />
                    )}
                  </AutoSizer>
                </div>
              </div>

              <div
                className="counterfactual-view-container"
                style={{ border: "solid #ccc 1px" }}
              >
                <div className="counterfactual-title-container">
                  {"Counterfactuals"}
                </div>
              </div>
            </div>
          </div>

          <div
            className="partial-dependence-view-container"
            style={{
              border: "solid #ccc 1px"
            }}
          >
            <div className="SPD-title-container">
              {"Sequence Partial Dependence"}
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
