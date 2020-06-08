import { createAction } from "redux-actions";

// ---- Actions ---- //
// ACTION TYPE/ID
export const LOAD_DATA = "LOAD_DATA";
export const UPDATE_LINECHART_VALUE = "UPDATE_LINECHART_VALUE";
export const UPDATE_LINECHART_VALUE_END = "UPDATE_LINECHART_VALUE_END";
export const CLICK_PREDICTION_BUTTON = "CLICK_PREDICTION_BUTTON";
export const UPDATE_INSTANCE_ID = "UPDATE_INSTANCE_ID";

// ACTION
// load data for compnentDidMount.
// when laodData is called, the program will emit an action of ID 'LOAD_DATA'
export const loadData = createAction(LOAD_DATA);
export const updateLinechartValue = createAction(UPDATE_LINECHART_VALUE);
export const updateLinechartValueEnd = createAction(UPDATE_LINECHART_VALUE_END);
export const clickPredictionButton = createAction(CLICK_PREDICTION_BUTTON);
export const updateInstanceId = createAction(UPDATE_INSTANCE_ID);

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
