import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import * as ContactsService from '@services/ContactsService';
import * as UserService from '@services/UserService';
import { ContactsState } from '@src/types/UserTypes';
import { RootState } from '@store/index';
import { DocumentChange, DocumentData } from 'firebase/firestore';
import _ from 'lodash';

const initialState: ContactsState = {
    data: [],
    filteredData: [],
    loading: false,
    filter: '',
    addContact: {
        loading: false,
        data: [],
        filter: '',
        filteredData: [],
    },
};

export const getContactsAction = createAsyncThunk(
    'contacts/getContacts',
    async (userContacts: string[]) => {
        const contacts = await UserService.getMyContacts(userContacts);
        return contacts;
    },
);

export const searchContactsAction = createAsyncThunk(
    'contacts/searchContacts',
    async (props, { getState }) => {
        const state = getState() as RootState;
        const contacts = await UserService.getAllUsers(
            state.contacts.data.map((contact) => contact.id),
        );
        return contacts;
    },
);

export const addContactAction = createAsyncThunk(
    'contacts/addContact',
    async (contactId: string) => {
        const contacts = await ContactsService.saveContactToFirebase(contactId);
        return contacts;
    },
);

export const removeContactAction = createAsyncThunk(
    'contacts/removeContact',
    async (contactId: string) => {
        const contacts = await ContactsService.removeContactFromFirebase(
            contactId,
        );
        return contacts;
    },
);

export const handleContactChangeAction = createAsyncThunk(
    'contacts/handleContactChange',
    async (change: DocumentChange<DocumentData>, { getState, dispatch }) => {
        console.log('change', change.type, change.doc.data());
        const state = getState() as RootState;
        if (change.type === 'added') {
            const checkIsAdded = _.find(
                state.contacts.data,
                (contact) => contact.id === change.doc.id,
            );
            if (!checkIsAdded) {
                const user = await UserService.getUserById(change.doc.id);
                console.log('user getUserById', user);
                if (user) {
                    dispatch(addContact(user));
                }
            }
        } else if (change.type === 'removed') {
            dispatch(removeContact(change.doc.id));
        }
    },
);

export const contactsSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {
        filterContactsData: (state, action) => {
            state.filteredData = _.map(state.data, (contact) => {
                return {
                    ...contact,
                    isContact: !!_.find(state.data, { id: contact.id }),
                    loading: false,
                };
            }).filter((contact) => {
                return (
                    contact.firstName
                        .toLocaleLowerCase()
                        .includes(action.payload.toLocaleLowerCase()) ||
                    contact.lastName
                        .toLocaleLowerCase()
                        .includes(action.payload.toLocaleLowerCase())
                );
            });
        },
        filterAddContactsData: (state, action) => {
            state.addContact.filter = action.payload;
            state.addContact.filteredData = _.map(
                state.addContact.data,
                (contact) => {
                    return {
                        ...contact,
                        isContact: !!_.find(state.data, { id: contact.id }),
                        loading: false,
                    };
                },
            ).filter((contact) => {
                return (
                    contact.firstName
                        .toLocaleLowerCase()
                        .includes(action.payload.toLocaleLowerCase()) ||
                    contact.lastName
                        .toLocaleLowerCase()
                        .includes(action.payload.toLocaleLowerCase())
                );
            });
        },
        addContact: (state, action) => {
            state.data.push(action.payload);
        },
        removeContact: (state, action) => {
            state.data = state.data.filter(
                (contact) => contact.id !== action.payload,
            );
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getContactsAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getContactsAction.fulfilled, (state, action) => {
            if (action.payload) {
                state.data = action.payload;
                state.filteredData = action.payload;
                state.loading = false;
            }
        });
        builder.addCase(getContactsAction.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(searchContactsAction.fulfilled, (state, action) => {
            if (action.payload) {
                state.addContact.data = action.payload;
                state.addContact.filter = '';
                state.addContact.filteredData = _.map(action.payload, (c) => ({
                    ...c,
                    isContact: !!state.data.find((d) => d.id === c.id),
                    loading: false,
                }));
                // state.addContact.data = action.payload;
                state.addContact.loading = false;
            }
        });

        builder.addCase(addContactAction.fulfilled, (state, action) => {
            const contact = _.find(state.addContact.filteredData, {
                id: action.meta.arg,
            });
            if (contact) {
                contact.loading = false;
                contact.isContact = true;
            }
        });
        builder.addCase(removeContactAction.fulfilled, (state, action) => {
            const contact = _.find(state.addContact.filteredData, {
                id: action.meta.arg,
            });
            if (contact) {
                contact.loading = false;
                contact.isContact = false;
            }
        });
        builder.addMatcher(
            isAnyOf(addContactAction.pending, removeContactAction.pending),
            (state, action) => {
                const contact = _.find(state.addContact.filteredData, {
                    id: action.meta.arg,
                });
                if (contact) {
                    contact.loading = true;
                }
            },
        );
        builder.addMatcher(
            isAnyOf(addContactAction.rejected, removeContactAction.rejected),
            (state, action) => {
                const contact = _.find(state.addContact.filteredData, {
                    id: action.meta.arg,
                });

                if (contact) {
                    contact.loading = false;
                }
            },
        );
    },
});

export const {
    filterContactsData,
    filterAddContactsData,
    addContact,
    removeContact,
} = contactsSlice.actions;

export default contactsSlice.reducer;
export const contactsInitialState = initialState;
