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
}
const initialState = { currentUser: {
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
} } as IAuthState;

// Actions
export const login = createAction<User>("LOGIN");
export const logout = createAction("LOGOUT");

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
     });
});

export default authReducer;