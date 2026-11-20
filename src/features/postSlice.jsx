import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = "http://localhost:3001/posts";


// GET POSTS

export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async () => {

        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }

        return await response.json();
    }
);


// ADD POST

export const addPost = createAsyncThunk(
    "posts/addPost",
    async (newPost) => {

        const response = await fetch(API, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                ...newPost,
                resolved: false
            })
        });

        if (!response.ok) {
            throw new Error("Failed to add post");
        }

        return await response.json();
    }
);


// MARK RESOLVED

export const markResolved = createAsyncThunk(
    "posts/markResolved",
    async (id, { getState }) => {

        const post = getState().posts.posts.find(
            (item) => String(item.id) === String(id)
        );

        if (!post) {
            throw new Error("Post not found");
        }

        const response = await fetch(`${API}/${id}`, {

            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                resolved: true
            })

        });

        if (!response.ok) {
            throw new Error("Failed to update post");
        }

        return await response.json();
    }
);


const postsSlice = createSlice({

    name: "posts",

    initialState: {
        posts: [],
        selectedCategory: "All",
        loading: false,
        error: null
    },

    reducers: {

        setCategory: (state, action) => {
            state.selectedCategory = action.payload;
        }

    },

    extraReducers: (builder) => {

        builder

            // FETCH POSTS

            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })

            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })


            // ADD POST

            .addCase(addPost.fulfilled, (state, action) => {
                state.posts.unshift(action.payload);
            })

            .addCase(addPost.rejected, (state, action) => {
                state.error = action.error.message;
            })


            // MARK RESOLVED

            .addCase(markResolved.fulfilled, (state, action) => {

                const index = state.posts.findIndex(
                    (item) => String(item.id) === String(action.payload.id)
                );

                if (index !== -1) {
                    state.posts[index] = action.payload;
                }

            })

            .addCase(markResolved.rejected, (state, action) => {
                state.error = action.error.message;
            });

    }

});


export const { setCategory } = postsSlice.actions;

export default postsSlice.reducer;