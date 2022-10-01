import ContactsList from '@components/ContactsList';
import { getContactsAction } from '@features/contactsSlice';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { db } from '@services/FirebaseService';
import { useAppDispatch, useAppSelector } from '@store/index';
import { MaterialIcons } from 'expo-vector-icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { IconButton, View } from 'native-base';
import React, { useEffect, useLayoutEffect } from 'react';
import {
    BottomTabsParamList,
    ContactsStackParamList,
} from 'src/types/NavigationTypes';

type Props = CompositeScreenProps<
    StackScreenProps<ContactsStackParamList, 'Contacts'>,
    BottomTabScreenProps<BottomTabsParamList, 'ContactsStack'>
>;

const Contacts = ({ navigation }: Props) => {
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    // onsnapshot
    useEffect(() => {
        if (user?.id) {
            // get nested collection firebase
            const unsubscribe = onSnapshot(
                collection(db, 'users', user.id, 'contacts'),
                (snapshot) => {
                    // snapshot.docChanges().forEach((change) => {
                    //     console.log('change', change.doc.id);
                    // });
                    const data = snapshot.docs.map((doc) => doc.id);
                    console.log('data', data);
                    dispatch(getContactsAction(data));
                },
            );

            return unsubscribe;
        }
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    _icon={{
                        as: MaterialIcons,
                        name: 'person-add',
                    }}
                    mr={2}
                    onPress={() => navigation.push('AddContact')}
                />
            ),
        });
    }, []);

    return (
        <View flex={1}>
            <ContactsList />
        </View>
    );
};

export default Contacts;
