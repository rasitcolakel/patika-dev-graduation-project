import { authInitialState, authSlice } from '@features/authSlice';
import { contactsInitialState, contactsSlice } from '@features/contactsSlice';
import { uiInitialState, uiSlice } from '@features/uiSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import { chatsInitialState, chatsSlice } from '@src/features/chatsSlice';
import { storiesSlice } from '@src/features/storiesSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistReducer,
    persistStore,
} from 'redux-persist';
import thunk from 'redux-thunk';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['stories'],
};
const storiesConfig = {
    key: 'stories',
    storage: AsyncStorage,
    blacklist: ['storyModal', 'loading', 'mine', 'data', 'playStories'],
};

const appReducer = combineReducers({
    auth: authSlice.reducer,
    contacts: contactsSlice.reducer,
    ui: uiSlice.reducer,
    chats: chatsSlice.reducer,
    stories: persistReducer(storiesConfig, storiesSlice.reducer),
});

const rootReducer = (
    state: ReturnType<typeof appReducer>,
    action: AnyAction,
) => {
    /* if you are using RTK, you can import your action and use it's type property instead of the literal definition of the action  */
    if (action.type === 'auth/logout/fulfilled') {
        state = {
            auth: authInitialState,
            contacts: contactsInitialState,
            ui: uiInitialState,
            chats: chatsInitialState,
            // we blacklist stories from the persistConfig
            stories: state.stories,
        };
    }

    return appReducer(state, action);
};

// @ts-ignore
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    // devtools is enabled by default in development mode
    devTools: true,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }).concat(thunk);
    },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

// useAppSelector is a custom hook that can be used to access the store's state
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// useAppDispatch is a custom hook that can be used to access the dispatch function
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
