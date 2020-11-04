import { handleActions } from "redux-actions";
import {
  LOAD_DATA,
  LOAD_TSNE,
  LOAD_COUNTERFACTUALS,
  LOAD_PDPLOT,
  UPDATE_BARCHART_VALUE,
  UPDATE_BARCHART_VALUE_END,
  UPDATE_INSTANCE_ID,
  UPDATE_COUNTERFACTUAL_SWITCH_VALUE,
} from "./actions";

// ----  Reducers ---- // (reduce to new state)
// Redux root state tree
const DEFAULT_STATE = {
  tsneData: [],
  counterfactualData: [],
  pdplotData: [],
  data: [],
  updatedData: [],
  currentUpdatedData: [],
  showCounterfactual: false,
  counterfactual: [],
  totalInstanceCnt: 1,
  // selectedInstanceId: 6712,
  selectedInstanceId: 4895,
  predictionResult: [],
  xName: null,
  yName: [],
  yLabel: [],
};

const handleLoadTSNEdata = (state, { payload }) => {
  // console.log("handleLodTSNEdata payload", payload);
  return {
    ...state,
    tsneData: payload,
  };
};

const handleLoadCounterfactualdata = (state, { payload }) => {
  // console.log("handleLoadCounterfactualdata payload", payload);
  return {
    ...state,
    counterfactualData: payload,
  };
};

const handleLoadPdplotData = (state, { payload }) => {
  // console.log("handleLoadpdplotData payload", payload);
  return {
    ...state,
    pdplotData: payload,
  };
};

const handleLoadData = (state, { payload }) => {
  // (state, action) => get payload from action  => (state, {payload})

  return {
    ...state,
    data: payload.original,
    updatedData: payload.updated, //tmp
    currentUpdatedData: payload.updated, // values update in frontend
    counterfactual: payload.counterfactual,
    predictionResult: payload.result,
    totalInstanceCnt: payload.instanceCnt,
    xName: payload.xName,
    yName: payload.yName,
    yLabel: payload.yLabel,
  };
};

const handleUpdateBarchartValue = (state, { payload }) => {
  // console.log("handleUpdateBarchartValue", payload);

  const currentUpdatedData = state.updatedData.map((o) => {
    if (o[payload.xName] === payload.selectedX) {
      let copy = JSON.parse(JSON.stringify(o));
      copy[payload.yName] += Number(payload.dy.toFixed(2));
      return copy;
    } else {
      return o;
    }
  });
  return {
    ...state,
    currentUpdatedData,
  };
};

const handleUpdateBarchartValueEnd = (state, { payload }) => {
  return {
    ...state,
    updatedData: JSON.parse(JSON.stringify(state.currentUpdatedData)),
  };
};

// handled in async function -> don't need handleActions function (sync function)
// const handleClickPredictionButton = (state, { payload }) => {
//   // console.log("handleClickPrediction", payload);
//   return {
//     ...state,
//     predictionResult: state.predictionResult
//   };
// };

const handleUpdateInstanceId = (state, { payload }) => {
  // console.log("handleUpdateInstanceId", payload);
  // this.state.updatedData;
  return {
    ...state,
    selectedInstanceId: payload,
  };
};

const handleUpdateCounterfactualSwitchValue = (state, { payload }) => {
  console.log("handleUpdateCounterfactualSwitchValue", payload);
  // this.state.updatedData;
  return {
    ...state,
    showCounterfactual: payload,
  };
};

// map action ID to functions
export default handleActions(
  {
    [LOAD_DATA]: handleLoadData,
    [LOAD_TSNE]: handleLoadTSNEdata,
    [LOAD_COUNTERFACTUALS]: handleLoadCounterfactualdata,
    [LOAD_PDPLOT]: handleLoadPdplotData,
    [UPDATE_BARCHART_VALUE]: handleUpdateBarchartValue,
    [UPDATE_BARCHART_VALUE_END]: handleUpdateBarchartValueEnd,
    [UPDATE_INSTANCE_ID]: handleUpdateInstanceId,
    [UPDATE_COUNTERFACTUAL_SWITCH_VALUE]: handleUpdateCounterfactualSwitchValue,
  },
  DEFAULT_STATE // initial state
);
