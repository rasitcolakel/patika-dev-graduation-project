import { getContactsAction } from '@features/contactsSlice';
import { useAppDispatch, useAppSelector } from '@store/index';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

const Contacts = () => {
    const contacts = useAppSelector((state) => state.contacts.data);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getContactsAction());
    }, []);
    return (
        <View>
            <Text>{contacts.length}</Text>
        </View>
    );
};

export default Contacts;
