import { getContactsAction } from '@features/contactsSlice';
import { useAppDispatch, useAppSelector } from '@store/index';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

const Contacts = () => {
    const contacts = useAppSelector((state) => state.contacts.data);
    const userContacts = useAppSelector((state) => state.auth.user?.contacts);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (userContacts) {
            dispatch(getContactsAction(userContacts));
        }
    }, []);
    return (
        <View>
            <Text>{contacts.length}</Text>
        </View>
    );
};

export default Contacts;
