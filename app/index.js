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
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {
  loadData,
  loadTSNE,
  loadCounterfactuals,
  updateBarchartValue,
  updateBarchartValueEnd,
  updateInstanceId,
  clickPredictionButton,
  updateAndFetchData,
  updateAndFetchCounterfactuals,
  updateAndFetchTSNE,
  updateCounterfactualSwitchValue
} from "./actions";
// import { getData, getMouseOvered, getHighlighted } from "./selectors/base";
import * as utils from "./utils";
import { AutoSizer } from "react-virtualized/dist/commonjs/AutoSizer";
import InteractiveBarChart from "./components/InteractiveBarChart";
import SimpleBarChart from "./components/simpleBarChart";
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
  loadCounterfactuals,
  updateBarchartValue,
  updateBarchartValueEnd,
  updateInstanceId,
  clickPredictionButton,
  updateAndFetchData,
  updateAndFetchTSNE,
  updateAndFetchCounterfactuals,
  updateCounterfactualSwitchValue
};

const mapStateToProps = state => ({
  tsneData: state.tsneData,
  counterfactualData: state.counterfactualData,
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
      updateAndFetchTSNE,
      updateAndFetchCounterfactuals
    } = this.props;
    updateAndFetchData(
      JSON.stringify({
        instanceId: selectedInstanceId,
        // featureIdx: [1, 8, 2],
        featureIdx: [1, 30, 8, 2, 5, 21],
        data2predict: []
      })
    );

    updateAndFetchTSNE({});
    updateAndFetchCounterfactuals(
      JSON.stringify({ instanceId: selectedInstanceId })
    );
  }

  handleClickPredictionButton = () => {
    const {
      selectedInstanceId,
      currentUpdatedData,
      updateAndFetchData
    } = this.props;
    // console.log("handleClickPredictionButton id", selectedInstanceId);
    const data = JSON.stringify({
      instanceId: selectedInstanceId,
      // featureIdx: [1, 8, 2],
      featureIdx: [1, 30, 8, 2, 5, 21],
      data2predict: currentUpdatedData
    });
    updateAndFetchData(data);
  };

  handleTextfieldUpdate = e => {
    const {
      currentUpdatedData,
      updateAndFetchData,
      updateAndFetchCounterfactuals
    } = this.props;

    if (e.key === "Enter") {
      this.props.updateInstanceId(e.target.value);

      const data = JSON.stringify({
        instanceId: e.target.value,
        // featureIdx: [1, 8, 2],
        featureIdx: [1, 30, 8, 2, 5, 21],
        data2predict: []
      });
      // console.log("enter", data);
      updateAndFetchData(data);
      updateAndFetchCounterfactuals(
        JSON.stringify({ instanceId: e.target.value })
      );
    }
  };

  render() {
    const {
      tsneData,
      counterfactualData,
      data,
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
      !counterfactualData ||
      counterfactualData.length === 0 ||
      counterfactual.length === 0 ||
      !currentUpdatedData ||
      currentUpdatedData.length === 0 ||
      predictionResult.length === 0
    ) {
      return null;
    }

    console.log("data", data);

    const featureCnt = yLabel.length;
    const featureBarchartGridDivision = "1fr ".repeat(featureCnt);
    // console.log("showCounterfactual", showCounterfactual);
    // console.log(updateCounterfactualSwitchValue);

    let tsneDataDeepCopy = JSON.parse(JSON.stringify(tsneData));
    tsneDataDeepCopy.forEach((d, i) => {
      tsneDataDeepCopy[i]["highlight"] = 0;
    });
    tsneDataDeepCopy[selectedInstanceId]["highlight"] = 1;

    return (
      <div className="App">
        <div className="header-container">
          <div className="header-text-container">
            {"Sequence What-If Prediction with RNN"}
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
              gridGap: "5px",
              gridTemplateColumns: "60% 39.8%"
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
                  <TextField
                    id="outlined-basic"
                    label="Instance ID"
                    variant="outlined"
                    onKeyPress={this.handleTextfieldUpdate}
                  />
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
              className="prediction-tsne-counterfactual"
              style={{
                display: "grid",
                gridGap: "5px",
                gridTemplateRows: "63% 36.5%"
              }}
            >
              <div
                className="prediction-tsne-container"
                style={{
                  display: "grid",
                  gridGap: "5px",
                  gridTemplateColumns: "45% 54.5%"
                }}
              >
                <div
                  className="prediction"
                  style={{
                    display: "grid",
                    gridGap: "5px",
                    gridTemplateRows: "50px 15% 70% auto",
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
                  className="tsne-view-container"
                  style={{
                    border: "solid #ccc 1px",
                    display: "grid",
                    gridGap: "5px",
                    gridTemplateRows: "50px auto"
                  }}
                >
                  <div className="tsne-title">{"2D Projection"}</div>
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
              </div>

              <div
                className="counterfactual-view-container"
                style={{
                  border: "solid #ccc 1px",
                  display: "grid",
                  gridGap: "5px",
                  gridTemplateRows: "25px auto"
                }}
              >
                <div className="counterfactual-title-container">
                  {"Counterfactuals"}
                </div>
                <div
                  className="counterfactual-chart"
                  style={{
                    display: "grid",
                    gridGap: "5px",
                    gridTemplateRows: "70% 30%"
                  }}
                >
                  <AutoSizer>
                    {({ height, width }) => (
                      <SimpleBarChart
                        width={width}
                        height={height}
                        data={counterfactualData}
                        xName={"idx"}
                        yName={"similarity"}
                        barSize={25}
                      />
                    )}
                  </AutoSizer>
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
