import { configureStore } from '@reduxjs/toolkit';
import addPostSlice from '../features/AddPost.slice';

// Create Store
export const store = configureStore({
    reducer: {
        addPost: addPostSlice
    }
});


