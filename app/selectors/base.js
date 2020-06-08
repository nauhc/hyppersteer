import { createSelector } from "reselect";

//  ---- Selectors  ---- //
const rootSelector = state => state;

export const getData = createSelector(rootSelector, state => {
  return state.data;
});

export const getMouseOvered = createSelector(rootSelector, state => {
  return state.mouseOveredId;
  // {
  //   ...state,
  //   highlight: {
  //     r:
  //   }
  // }
});
export const getHighlighted = createSelector(
  [getData, getMouseOvered],
  (data, id) => {
    if (!data || data.length === 0 || !id) {
      return null;
    }
    // console.log('data, id', data, id);
    const [x, y] = id.split("-");
    // console.log(data[x][y]);
    return {
      x: parseInt(x),
      y: parseInt(y),
      r: data[x][y] + 2
    };
  }
);
