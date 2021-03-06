import { createAction } from "redux-actions";

// ---- Actions ---- //
// ACTION TYPE/ID
export const LOAD_DATA = "LOAD_DATA";
export const LOAD_TSNE = "LOAD_TSNE";
export const LOAD_COUNTERFACTUALS = "LOAD_COUNTERFACTUALS";
export const LOAD_PDPLOT = "LOAD_PDPLOT";
export const UPDATE_BARCHART_VALUE = "UPDATE_BARCHART_VALUE";
export const UPDATE_BARCHART_VALUE_END = "UPDATE_BARCHART_VALUE_END";
export const CLICK_PREDICTION_BUTTON = "CLICK_PREDICTION_BUTTON";
export const UPDATE_INSTANCE_ID = "UPDATE_INSTANCE_ID";
export const UPDATE_COUNTERFACTUAL_SWITCH_VALUE =
  "UPDATE_COUNTERFACTUAL_SWITCH_VALUE";

// ACTION
// load data for compnentDidMount.
// when laodData is called, the program will emit an action of ID 'LOAD_DATA'
export const loadData = createAction(LOAD_DATA);
export const loadTSNE = createAction(LOAD_TSNE);
export const loadCounterfactuals = createAction(LOAD_COUNTERFACTUALS);
export const loadPDplot = createAction(LOAD_PDPLOT);
export const updateBarchartValue = createAction(UPDATE_BARCHART_VALUE);
export const updateBarchartValueEnd = createAction(UPDATE_BARCHART_VALUE_END);
export const clickPredictionButton = createAction(CLICK_PREDICTION_BUTTON);
export const updateInstanceId = createAction(UPDATE_INSTANCE_ID);
export const updateCounterfactualSwitchValue = createAction(
  UPDATE_COUNTERFACTUAL_SWITCH_VALUE
);

export const updateAndFetchData = data => {
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

export const updateAndFetchTSNE = data => {
  return dispatch => {
    fetch("http://localhost:5000/tsne", {
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
        dispatch(loadTSNE(d));
      })
      .catch(err => console.log(err));
  };
};

export const updateAndFetchCounterfactuals = data => {
  return dispatch => {
    fetch("http://localhost:5000/counterfactual", {
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
        dispatch(loadCounterfactuals(d));
      })
      .catch(err => console.log(err));
  };
};

export const updateAndFetchPdplot = data => {
  return dispatch => {
    fetch("http://localhost:5000/pdplot", {
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
        dispatch(loadPDplot(d));
      })
      .catch(err => console.log(err));
  };
};
