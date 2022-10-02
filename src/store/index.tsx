import { authSlice } from '@features/authSlice';
import { contactsSlice } from '@features/contactsSlice';
import { uiSlice } from '@features/uiSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { chatsSlice } from '@src/features/chatsSlice';
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
};
const rootReducer = combineReducers({
    auth: authSlice.reducer,
    contacts: contactsSlice.reducer,
    ui: uiSlice.reducer,
    chats: chatsSlice.reducer,
});
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
