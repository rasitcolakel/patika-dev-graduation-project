import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as StoriesService from '@src/services/StoriesService';
import { StoriesState } from '@src/types/StoryTypes';

const initialState: StoriesState = {
    data: [],
    mine: [],
    loading: false,
};

export const shareStoryAction = createAsyncThunk(
    'stories/shareStory',
    async (media: string) => {
        await StoriesService.shareStory(media);
    },
);

export const storiesSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(shareStoryAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(shareStoryAction.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(shareStoryAction.rejected, (state) => {
            state.loading = false;
        });
    },
});

export const {} = storiesSlice.actions;

export default storiesSlice.reducer;
