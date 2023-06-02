/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReducer, createAction } from '@reduxjs/toolkit'

// State
interface ICategoryState {
    allCategories: any;
}
const initialState = { allCategories: null } as ICategoryState;

// Actions
export const getAllCategories = createAction<any>("GET_ALL_CATEGORIES");

// Reducer
const categoryReducer = createReducer(initialState, (builder) => {
    builder.addCase(getAllCategories, (state, action) => {
       state.allCategories = action.payload;
    });
});

export default categoryReducer;