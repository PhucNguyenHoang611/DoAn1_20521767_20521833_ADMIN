/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReducer, createAction } from '@reduxjs/toolkit'

// State
interface IProductState {
    allProds: any;
}
const initialState = { allProds: null } as IProductState;

// Actions
export const getAllProds = createAction<any>("GET_ALL_PRODS");

// Reducer
const productReducer = createReducer(initialState, (builder) => {
    builder.addCase(getAllProds, (state, action) => {
       state.allProds = action.payload;
    });
});

export default productReducer;