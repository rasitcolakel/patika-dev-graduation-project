import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as ChatService from '@services/ChatService';
import { RootState } from '@src/store';
import { Chat, ChatType, ChatsState } from '@src/types/ChatTypes';
import _ from 'lodash';

const initialState: ChatsState = {
    data: [],
    loading: false,
    currentChat: undefined,
};

export const createChatAction = createAsyncThunk(
    'chats/createChat',
    async (userId: string, { getState }) => {
        const state = getState() as RootState;
        const findChat = _.find(state.chats.data, (chat) => {
            return (
                chat.type === ChatType.ONE_TO_ONE &&
                _.isEqual(
                    _.sortBy(chat.members),
                    _.sortBy([userId, state.auth.user?.id]),
                )
            );
        });
        let chatId = findChat?.id;
        if (!findChat) {
            chatId = await ChatService.createChat(userId);
        }
        return chatId;
    },
);

export const getChatsAction = createAsyncThunk('chats/getChats', async () => {
    const chats = await ChatService.getChats();
    console.log('chats', chats);
    return chats;
});

export const chatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setChats: (state, action: PayloadAction<Chat[]>) => {
            state.data = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getChatsAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getChatsAction.fulfilled, (state, action) => {
            if (action.payload) {
                state.data = action.payload;
                state.loading = false;
            }
        });
        builder.addCase(getChatsAction.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(createChatAction.pending, (state) => {
            state.loading = true;
            state.currentChat = undefined;
        });
        builder.addCase(createChatAction.fulfilled, (state, action) => {
            if (action.payload) {
                state.currentChat = action.payload;
                state.loading = false;
            }
        });
        builder.addCase(createChatAction.rejected, (state) => {
            state.loading = false;
            state.currentChat = undefined;
        });
    },
});

export const { setChats } = chatsSlice.actions;

export default chatsSlice.reducer;
