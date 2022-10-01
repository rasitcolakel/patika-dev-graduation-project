import { authSlice } from '@features/authSlice';
import { contactsSlice } from '@features/contactsSlice';
import { uiSlice } from '@features/uiSlice';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        contacts: contactsSlice.reducer,
        ui: uiSlice.reducer,
    },
    // devtools is enabled by default in development mode
    devTools: true,
    middleware: (getDefaultMiddleware) => {
        if (__DEV__) {
            return getDefaultMiddleware();
        }

        return getDefaultMiddleware();
    },
});
export type RootState = ReturnType<typeof store.getState>;

// useAppSelector is a custom hook that can be used to access the store's state
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// useAppDispatch is a custom hook that can be used to access the dispatch function
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
