import {
    PayloadAction,
    createAsyncThunk,
    createSlice,
    isAnyOf,
} from '@reduxjs/toolkit';
import * as ImageService from '@services/ImageService';
import * as UserService from '@services/UserService';
import { RootState } from '@src/store';
import {
    AuthState,
    LoginForm,
    RegisterForm,
    UserType,
} from '@src/types/UserTypes';
import * as SecureStore from 'expo-secure-store';

import { getContactsAction } from './contactsSlice';

const initialState: AuthState = {
    user: undefined,
    loading: false,
};

export const loginAction = createAsyncThunk(
    'auth/login',
    async (payload: LoginForm) => {
        await UserService.login(payload);
    },
);

export const registerAction = createAsyncThunk(
    'auth/register',
    async (payload: RegisterForm) => {
        try {
            await UserService.register(payload);
            await UserService.login(payload);
        } catch (error) {
            console.log('error', error);
            throw error;
        }
    },
);

export const getMyProfileAction = createAsyncThunk(
    'auth/getMyProfile',
    async (params, { dispatch }) => {
        try {
            const user = await UserService.getMyProfile();
            await SecureStore.setItemAsync('user', JSON.stringify(user));
            await dispatch(getContactsAction(user?.contacts || []));
            return user;
        } catch (error) {
            console.log('error', error);
            throw error;
        }
    },
);

export const logoutAction = createAsyncThunk('auth/logout', async () => {
    await UserService.logout();
    await SecureStore.deleteItemAsync('user');
});

export const updateMyProfile = createAsyncThunk(
    'auth/updateMyProfile',
    async (payload: Partial<UserType>, { dispatch, getState }) => {
        try {
            const state = getState() as RootState;
            const user = state.auth.user;
            const values = {
                ...payload,
            };
            if (payload.photoURL) {
                if (user?.photoURL && user?.photoURL === payload.photoURL) {
                    delete values.photoURL;
                } else {
                    values.photoURL = await ImageService.uploadImage(
                        payload.photoURL,
                    );
                }
            }

            await UserService.updateMyProfile(values);
            await dispatch(fetchMyProfileAction());
        } catch (error) {
            console.log('error', error);
            throw error;
        }
    },
);

export const fetchMyProfileAction = createAsyncThunk(
    'auth/fetchMyProfile',
    async (params, { dispatch }) => {
        try {
            const user = await UserService.getMyProfile();
            await SecureStore.setItemAsync('user', JSON.stringify(user));
            return user;
        } catch (error) {
            console.log('error', error);
            throw error;
        }
    },
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserType>) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logoutAction.fulfilled, (state, action) => {
            state.user = undefined;
        });
        builder.addMatcher(
            isAnyOf(
                loginAction.pending,
                registerAction.pending,
                getMyProfileAction.pending,
                fetchMyProfileAction.pending,
                updateMyProfile.pending,
            ),
            (state) => {
                state.loading = true;
            },
        );
        builder.addMatcher(
            isAnyOf(
                // loginAction.fulfilled,
                // registerAction.fulfilled,
                getMyProfileAction.fulfilled,
                fetchMyProfileAction.fulfilled,
            ),
            (state, action: PayloadAction<UserType | undefined>) => {
                state.loading = false;
                state.user = action.payload;
            },
        );
        builder.addMatcher(
            isAnyOf(loginAction.fulfilled, registerAction.fulfilled),
            (state) => {
                state.loading = false;
            },
        );
        builder.addMatcher(
            isAnyOf(
                loginAction.rejected,
                registerAction.rejected,
                getMyProfileAction.rejected,
                fetchMyProfileAction.rejected,
                updateMyProfile.rejected,
            ),
            (state) => {
                state.user = undefined;
                state.loading = false;
            },
        );
    },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
