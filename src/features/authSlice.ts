import {
    PayloadAction,
    createAsyncThunk,
    createSlice,
    isAnyOf,
} from '@reduxjs/toolkit';
import * as UserService from '@services/UserService';
import * as SecureStore from 'expo-secure-store';
import {
    AuthState,
    LoginForm,
    RegisterForm,
    UserType,
} from 'src/types/UserTypes';

const initialState: AuthState = {
    user: undefined,
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
    async () => {
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

export const logoutAction = createAsyncThunk('auth/logout', async () => {
    await UserService.logout();
    await SecureStore.deleteItemAsync('user');
});

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
                // loginAction.fulfilled,
                // registerAction.fulfilled,
                getMyProfileAction.fulfilled,
            ),
            (state, action: PayloadAction<UserType>) => {
                state.user = action.payload;
            },
        );
        builder.addMatcher(
            isAnyOf(loginAction.rejected, registerAction.rejected),
            (state) => {
                state.user = undefined;
            },
        );
    },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
