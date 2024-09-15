import { createSlice, nanoid } from "@reduxjs/toolkit";

// Initial State
const initialState = {
    Post: {
        id: nanoid(),
        title: "",
        desc: "",
        article: "",
        img: ""
    }
};

export const addPostSlice = createSlice({
    name: "addPost",
    initialState,
    reducers: {
        addPost: (state, action) => {
            // Update the Post state with new values
            state.Post = {
                id: nanoid(),
                title: action.payload.title,
                desc: action.payload.desc,
                article: action.payload.article,
                img: action.payload.img,
            };
        },
        resetAddPost: (state) => {
            // Reset the Post state to initial values
            state.Post = initialState.Post;
        }
    }
});

export const { addPost, resetAddPost } = addPostSlice.actions;

export default addPostSlice.reducer;
