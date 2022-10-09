import { loginAction, registerAction } from '@features/authSlice';
import { PayloadAction, createSlice, isAnyOf } from '@reduxjs/toolkit';

export type ToastState = {
    toast: ToastType | null;
};
export type ToastType = {
    title: string;
    message?: string;
    variant?: 'success' | 'error' | 'warning' | 'info';
};
const initialState: ToastState = {
    toast: null,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setToast: (state, action: PayloadAction<ToastType>) => {
            console.log('setToast', action.payload);
            state.toast = {
                ...action.payload,
            };
        },
        clearToast: (state) => {
            state.toast = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                isAnyOf(loginAction.rejected, registerAction.rejected),
                (state, action) => {
                    state.toast = {
                        title: 'Error',
                        message: action.error.message,
                        variant: 'error',
                    };
                },
            )
            .addMatcher(
                isAnyOf(loginAction.pending, loginAction.pending),
                (state, action) => {
                    state.toast = {
                        title: 'Processing...',
                        variant: 'info',
                    };
                },
            );
        // .addMatcher(
        //     isAnyOf(loginAction.fulfilled, registerAction.fulfilled),
        //     (state, action) => {
        //         state.toast = {
        //             title: 'Success',
        //             variant: 'success',
        //         };
        //     },
        // );
    },
});

export const { setToast, clearToast } = uiSlice.actions;

export default uiSlice.reducer;
export const uiInitialState = initialState;
