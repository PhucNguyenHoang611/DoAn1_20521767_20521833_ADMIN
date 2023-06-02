/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReducer, createAction } from '@reduxjs/toolkit'

// State
interface IColorState {
    allColors: any;
}
const initialState = { allColors: null } as IColorState;

// Actions
export const getAllColors = createAction<any>("GET_ALL_COLORS");

// Reducer
const colorReducer = createReducer(initialState, (builder) => {
    builder.addCase(getAllColors, (state, action) => {
       state.allColors = action.payload;
    });
});

export default colorReducer;