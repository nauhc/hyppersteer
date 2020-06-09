import { createAction } from "redux-actions";

// ---- Actions ---- //
// ACTION TYPE/ID
export const LOAD_DATA = "LOAD_DATA";
export const UPDATE_BARCHART_VALUE = "UPDATE_BARCHART_VALUE";
export const UPDATE_BARCHART_VALUE_END = "UPDATE_BARCHART_VALUE_END";
// export const CLICK_PREDICTION_BUTTON = "CLICK_PREDICTION_BUTTON";
export const UPDATE_INSTANCE_ID = "UPDATE_INSTANCE_ID";
export const UPDATE_COUNTERFACTUAL_SWITCH_VALUE =
  "UPDATE_COUNTERFACTUAL_SWITCH_VALUE";

// ACTION
// load data for compnentDidMount.
// when laodData is called, the program will emit an action of ID 'LOAD_DATA'
export const loadData = createAction(LOAD_DATA);
export const updateBarchartValue = createAction(UPDATE_BARCHART_VALUE);
export const updateBarchartValueEnd = createAction(UPDATE_BARCHART_VALUE_END);
// export const clickPredictionButton = createAction(CLICK_PREDICTION_BUTTON);
export const updateInstanceId = createAction(UPDATE_INSTANCE_ID);
export const updateCounterfactualSwitchValue = createAction(
  UPDATE_COUNTERFACTUAL_SWITCH_VALUE
);

export const updateAndFetch = data => {
  return dispatch => {
    fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: data
    })
      .then(res => {
        return res.json();
      })
      .then(d => {
        dispatch(loadData(d));
      })
      .catch(err => console.log(err));
  };
};
