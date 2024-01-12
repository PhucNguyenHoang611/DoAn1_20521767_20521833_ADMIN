/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReducer, createAction } from '@reduxjs/toolkit'

// State
interface IVoucherState {
    allVouchers: any;
}
const initialState = { allVouchers: null } as IVoucherState;

// Actions
export const getAllVouchers = createAction<any>("GET_ALL_VOUCHERS");

// Reducer
const voucherReducer = createReducer(initialState, (builder) => {
    builder.addCase(getAllVouchers, (state, action) => {
       state.allVouchers = action.payload;
    });
});

export default voucherReducer;