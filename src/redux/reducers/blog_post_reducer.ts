/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReducer, createAction } from '@reduxjs/toolkit'

// State
interface IBlogPostState {
    allBlogPosts: any;
}
const initialState = { allBlogPosts: null } as IBlogPostState;

// Actions
export const getAllBlogPosts = createAction<any>("GET_ALL_BLOG_POSTS");

// Reducer
const blogPostReducer = createReducer(initialState, (builder) => {
    builder.addCase(getAllBlogPosts, (state, action) => {
       state.allBlogPosts = action.payload;
    });
});

export default blogPostReducer;