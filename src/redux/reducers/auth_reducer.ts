import { createReducer } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null
}

const authReducer = createReducer(initialState, (builder) => {});

export default authReducer;