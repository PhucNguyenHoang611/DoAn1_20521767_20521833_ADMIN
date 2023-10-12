/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReducer, createAction } from '@reduxjs/toolkit'

// State
interface IFeedbackState {
    allFeedbacks: any;
}
const initialState = { allFeedbacks: null } as IFeedbackState;

// Actions
export const getFeedbacks = createAction<any>("GET_ALL_FEEDBACKS");

// Reducer
const feedbackProducer = createReducer(initialState, (builder) => {
    builder.addCase(getFeedbacks, (state, action) => {
       state.allFeedbacks = action.payload;
    });
});

export default feedbackProducer;