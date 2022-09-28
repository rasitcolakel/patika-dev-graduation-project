import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as UserService from '@services/UserService';
import { ContactsState } from 'src/types/UserTypes';

const initialState: ContactsState = {
    data: [],
    loading: false,
};

export const getContactsAction = createAsyncThunk('auth/login', async () => {
    const contacts = await UserService.getMyContacts();
    return contacts;
});

export const contactsSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getContactsAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getContactsAction.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        });
        builder.addCase(getContactsAction.rejected, (state) => {
            state.loading = false;
        });
    },
});

// export const {} = contactsSlice.actions;

export default contactsSlice.reducer;
