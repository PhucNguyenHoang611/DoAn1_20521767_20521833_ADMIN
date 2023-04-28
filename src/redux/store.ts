import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/auth_reducer';

export const store = configureStore({
    reducer: {
        auth: authReducer
    }
});

// Get RootState and AppDispatch from store
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;