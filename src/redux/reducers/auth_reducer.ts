/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReducer, createAction } from '@reduxjs/toolkit'

// State
export interface User {
    token: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    privilege: number;
    startWork: Date;
    status: number;
    expiredDate: Date;
}
interface IAuthState {
    currentUser: User;
    allStaffs: any;
    allCustomers: any;
    allDiscounts: any;
    allColors: any;
    allSuppliers: any;
}
const initialState = { 
    currentUser: {
        token: "",
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        privilege: -1,
        startWork: new Date(),
        status: -2,
        expiredDate: new Date()
    },
    allStaffs: null,
    allCustomers: null,
    allDiscounts: null,
    allColors: null,
    allSuppliers: null
} as IAuthState;

// Actions
export const login = createAction<User>("LOGIN");
export const logout = createAction("LOGOUT");

export const getAllStaffs = createAction<any>("GET_ALL_STAFFS");
export const getAllCustomers = createAction<any>("GET_ALL_CUSTOMERS");
export const getAllDiscounts = createAction<any>("GET_ALL_DISCOUNTS");
export const getAllColors = createAction<any>("GET_ALL_COLORS");
export const getAllSuppliers = createAction<any>("GET_ALL_SUPPLIERS");


// Reducer
const authReducer = createReducer(initialState, (builder) => {
    builder.addCase(login, (state, action) => {
       state.currentUser = action.payload;
    })
    .addCase(logout, (state) => {
        state.currentUser = {
            token: "",
            id: "",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            gender: "",
            privilege: -1,
            startWork: new Date(),
            status: -2,
            expiredDate: new Date()
        };
    })
    .addCase(getAllStaffs, (state, action) => {
       state.allStaffs = action.payload;
    })
    .addCase(getAllCustomers, (state, action) => {
        state.allCustomers = action.payload;
    })
    .addCase(getAllDiscounts, (state, action) => {
        state.allDiscounts = action.payload;
    })
    .addCase(getAllColors, (state, action) => {
        state.allColors = action.payload;
    })
    .addCase(getAllSuppliers, (state, action) => {
        state.allSuppliers = action.payload;
    });
});

export default authReducer;