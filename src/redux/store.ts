import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/auth_reducer'
import productReducer from './reducers/product_reducer'
import categoryReducer from './reducers/category_reducer'
import subcategoryReducer from './reducers/subcategory_reducer'
import supplierReducer from './reducers/supplier_reducer'
import colorReducer from './reducers/color_reducer'
import importReducer from './reducers/import_reducer'
import feedbackProducer from './reducers/feedback_reducer';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        category: categoryReducer,
        subcategory: subcategoryReducer,
        supplier: supplierReducer,
        color: colorReducer,
        import: importReducer,
        feedback: feedbackProducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

// Get RootState and AppDispatch from store
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;