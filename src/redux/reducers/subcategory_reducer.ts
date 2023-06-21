/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReducer, createAction } from '@reduxjs/toolkit'

// State
interface ISubcategoryState {
    allSubcategories: any;
}
const initialState = { allSubcategories: null } as ISubcategoryState;

// Actions
export const getAllSubcategories = createAction<any>("GET_ALL_SUBCATEGORIES");

// Reducer
const subcategoryReducer = createReducer(initialState, (builder) => {
    builder.addCase(getAllSubcategories, (state, action) => {
       state.allSubcategories = action.payload;
    });
});

export default subcategoryReducer;