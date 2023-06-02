/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReducer, createAction } from '@reduxjs/toolkit'

// State
interface ISupplierState {
    allSuppliers: any;
}
const initialState = { allSuppliers: null } as ISupplierState;

// Actions
export const getAllSuppliers = createAction<any>("GET_ALL_SUPPLIERS");

// Reducer
const supplierReducer = createReducer(initialState, (builder) => {
    builder.addCase(getAllSuppliers, (state, action) => {
       state.allSuppliers = action.payload;
    });
});

export default supplierReducer;