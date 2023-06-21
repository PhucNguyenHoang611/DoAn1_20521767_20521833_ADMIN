/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReducer, createAction } from '@reduxjs/toolkit'

// State
interface IImportState {
    importItems: any[];
    getImport: boolean;
    getOrder: boolean;
}
const initialState = { importItems: [], getImport: false, getOrder: false } as IImportState;

// Actions
export const getAllImportItems = createAction<any[]>("GET_ALL_ITEMS");

export const getImports = createAction<boolean>("GET_ALL_IMPORTS");

export const getOrders = createAction<boolean>("GET_ALL_ORDERS");


// Reducer
const importReducer = createReducer(initialState, (builder) => {
    builder.addCase(getAllImportItems, (state, action) => {
       state.importItems = action.payload;
    });

    builder.addCase(getImports, (state, action) => {
        state.getImport = action.payload;
    });

    builder.addCase(getOrders, (state, action) => {
        state.getOrder = action.payload;
    });
});

export default importReducer;