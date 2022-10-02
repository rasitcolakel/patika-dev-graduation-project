import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as ChatService from '@services/ChatService';
import * as UserService from '@services/UserService';
import { RootState } from '@src/store';
import { Chat, ChatType, ChatsState } from '@src/types/ChatTypes';
import { DocumentChange, DocumentData } from 'firebase/firestore';
import _ from 'lodash';

const initialState: ChatsState = {
    data: [],
    loading: false,
    currentChat: undefined,
    chatMessages: [],
};

export const createChatAction = createAsyncThunk(
    'chats/createChat',
    async (userId: string, { getState }) => {
        const state = getState() as RootState;
        const findChat = _.find(state.chats.data, (chat) => {
            return (
                chat.type === ChatType.ONE_TO_ONE &&
                _.isEqual(
                    _.sortBy(chat.members.map((member) => member.id)),
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

export const handleChatChangeAction = createAsyncThunk(
    'contacts/handleContactChange',
    async (change: DocumentChange<DocumentData>, { getState, dispatch }) => {
        console.log('changeChat', change.type, change.doc.data());
        const state = getState() as RootState;
        if (change.type === 'added') {
            const checkIsAdded = _.find(state.chats.data, (chat) => {
                return chat.id === change.doc.id;
            });
            if (!checkIsAdded) {
                const getChatMembersDetails = await UserService.getUsersByIds(
                    change.doc.data().members,
                );
                dispatch(
                    addChat({
                        ...change.doc.data(),
                        members: getChatMembersDetails,
                    }),
                );
            }
        } else if (change.type === 'modified') {
            const checkIsAdded = _.find(state.chats.data, (chat) => {
                return chat.id === change.doc.id;
            });
            if (checkIsAdded) {
                dispatch(
                    updateChat({
                        ...change.doc.data(),
                        members: checkIsAdded?.members,
                    }),
                );
            }
        } else if (change.type === 'removed') {
            dispatch(removeChat(change.doc.id));
        }
    },
);

export const handleCurrentChatChangeAction = createAsyncThunk(
    'chats/handleCurrentChatChange',
    async (change: DocumentChange<DocumentData>, { getState, dispatch }) => {
        console.log('changeCurrentChat', change.type, change.doc.data());
        if (change.type === 'added') {
            dispatch(addMessageToChat(change.doc.data()));
        }
    },
);

export const chatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setChats: (state, action: PayloadAction<Chat[]>) => {
            state.data = action.payload;
        },
        addChat: (state, action) => {
            state.data.push(action.payload);
            // sort chats by last message
            state.data = _.sortBy(state.data, (chat) => {
                return chat.lastMessage?.createdAt;
            }).reverse();
        },
        removeChat: (state, action) => {
            state.data = state.data.filter(
                (chat) => chat.id !== action.payload,
            );
        },
        updateChat: (state, action) => {
            state.data = state.data.map((chat) => {
                if (chat.id === action.payload.id) {
                    return action.payload;
                }
                return chat;
            });
            // sort chats by last message
            state.data = _.sortBy(state.data, (chat) => {
                return chat.lastMessage?.createdAt;
            }).reverse();
        },
        addMessageToChat: (state, action) => {
            if (!state.currentChat?.id) {
                return;
            }
            const findChatMessage = _.find(
                state.chatMessages,
                (chatMessage) => {
                    return chatMessage.chatId === state.currentChat?.id;
                },
            );
            if (findChatMessage) {
                const checkIsAdded = _.find(
                    findChatMessage.messages,
                    (message) => {
                        return message.id === action.payload.id;
                    },
                );
                console.log('checkIsAdded', checkIsAdded, action.payload.id);
                if (!checkIsAdded) {
                    findChatMessage.messages.unshift(action.payload);
                }
            } else {
                state.chatMessages?.push({
                    chatId: state.currentChat.id,
                    messages: [action.payload],
                });
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createChatAction.pending, (state) => {
            state.loading = true;
            state.currentChat = undefined;
        });
        builder.addCase(createChatAction.fulfilled, (state, action) => {
            if (action.payload) {
                state.currentChat = {
                    id: action.payload,
                    members: undefined,
                    messages: undefined,
                };
                state.loading = false;
            }
        });
        builder.addCase(createChatAction.rejected, (state) => {
            state.loading = false;
            state.currentChat = undefined;
        });
    },
});

export const { setChats, addChat, updateChat, removeChat, addMessageToChat } =
    chatsSlice.actions;

export default chatsSlice.reducer;
