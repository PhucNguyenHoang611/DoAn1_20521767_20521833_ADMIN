import { createReducer, createAction } from '@reduxjs/toolkit'

// State
interface IAuthState {
    currentUser: string;
}
const initialState = { currentUser: "" } as IAuthState;

// Actions
export const login = createAction<string>("LOGIN");
export const logout = createAction("LOGOUT");

// Reducer
const authReducer = createReducer(initialState, (builder) => {
    builder.addCase(login, (state, action) => {
       state.currentUser = action.payload;
    })
    .addCase(logout, (state) => {
        state.currentUser = "";
     });
});

export default authReducer;