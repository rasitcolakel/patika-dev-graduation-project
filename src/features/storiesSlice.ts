import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as ImageService from '@src/services/ImageService';
import * as StoriesService from '@src/services/StoriesService';
import * as UserService from '@src/services/UserService';
import { PlayStories, StoriesState } from '@src/types/StoryTypes';
import { DocumentChange, DocumentData } from 'firebase/firestore';
import _ from 'lodash';

const initialState: StoriesState = {
    data: [],
    mine: [],
    loading: false,
    storyModal: false,
    playStories: {
        visible: false,
        index: 0,
        storyIndex: 0,
        type: 'mine',
    },
};

type ShareStoryActionProps = {
    media: string;
    callback?: () => void;
};
export const shareStoryAction = createAsyncThunk(
    'stories/shareStory',
    async ({ media, callback }: ShareStoryActionProps) => {
        const imageURL = await ImageService.uploadImage(media);
        await StoriesService.shareStory(imageURL);
        if (callback !== undefined) callback();
    },
);

export const handleMineStoryChangeAction = createAsyncThunk(
    'stories/handleMineStoryChange',
    async (change: DocumentChange<DocumentData>, { dispatch }) => {
        if (change.type === 'added') {
            if (change.doc.data().userId) {
                dispatch(addMineStory(change.doc.data()));
            }
        } else if (change.type === 'modified') {
            dispatch(updateMineStory(change.doc.data()));
        } else if (change.type === 'removed') {
            dispatch(removeMineStory(change.doc.data()));
        }
    },
);

export const handleStoryChangeAction = createAsyncThunk(
    'stories/handleStoryChange',
    async (change: DocumentChange<DocumentData>, { dispatch }) => {
        const user = await UserService.getUserById(change.doc.data().userId);
        if (!user) return;
        if (change.type === 'added') {
            dispatch(
                addStory({
                    user,
                    ...change.doc.data(),
                }),
            );
        } else if (change.type === 'modified') {
            dispatch(
                updateStory({
                    user,
                    ...change.doc.data(),
                }),
            );
        } else if (change.type === 'removed') {
            dispatch(
                removeStory({
                    user,
                    ...change.doc.data(),
                }),
            );
        }
    },
);

export const storiesSlice = createSlice({
    name: 'stories',
    initialState,
    reducers: {
        openStoryModal: (state) => {
            state.storyModal = true;
        },
        closeStoryModal: (state) => {
            state.storyModal = false;
        },
        openPlayStories: (state, action: PayloadAction<PlayStories>) => {
            state.playStories = action.payload;
        },
        closePlayStories: (state) => {
            state.playStories = initialState.playStories;
        },
        addMineStory: (state, action) => {
            const checkIsAdded = _.find(state.mine, (story) => {
                return story.id === action.payload.id;
            });
            if (!checkIsAdded) {
                state.mine.push(action.payload);
            }
        },
        updateMineStory: (state, action) => {
            const story = _.find(state.mine, (story) => {
                return story.id === action.payload.id;
            });
            if (story) {
                story.media = action.payload.media;
            }
        },
        removeMineStory: (state, action) => {
            _.remove(state.mine, (story) => {
                return story.id === action.payload.id;
            });
        },
        addStory: (state, action) => {
            const findStoryGroup = _.find(state.data, (story) => {
                return story.user.id === action.payload.userId;
            });
            console.log('addStory', action.payload);
            console.log('addStoryfindStoryGroup', findStoryGroup);
            if (findStoryGroup) {
                const checkIsAdded = _.find(findStoryGroup.stories, (story) => {
                    return story.id === action.payload.id;
                });
                console.log('addStorycheckIsAdded', checkIsAdded);
                if (!checkIsAdded) {
                    findStoryGroup.stories.push(action.payload);
                }
            } else {
                state.data.push({
                    user: action.payload.user,
                    stories: [action.payload],
                });
            }
        },
        updateStory: (state, action) => {
            const findStoryGroup = _.find(state.data, (story) => {
                return story.user.id === action.payload.userId;
            });
            if (findStoryGroup) {
                findStoryGroup.stories = _.map(
                    findStoryGroup.stories,
                    (story) => {
                        return story.id === action.payload.id
                            ? action.payload
                            : story;
                    },
                );
            } else {
                state.data.push({
                    user: action.payload.user,
                    stories: [action.payload],
                });
            }
        },
        removeStory: (state, action) => {
            const findStoryGroup = _.find(state.data, (story) => {
                return story.user.id === action.payload.userId;
            });
            if (findStoryGroup) {
                _.remove(findStoryGroup.stories, (story) => {
                    return story.id === action.payload.id;
                });
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(shareStoryAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(shareStoryAction.fulfilled, (state) => {
            state.loading = false;
            state.storyModal = false;
        });
        builder.addCase(shareStoryAction.rejected, (state) => {
            state.loading = false;
        });
    },
});

export const {
    openStoryModal,
    closeStoryModal,
    addMineStory,
    updateMineStory,
    removeMineStory,
    addStory,
    updateStory,
    removeStory,
    openPlayStories,
    closePlayStories,
} = storiesSlice.actions;

export default storiesSlice.reducer;
