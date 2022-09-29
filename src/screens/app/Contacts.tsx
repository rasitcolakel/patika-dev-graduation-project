import { getContactsAction } from '@features/contactsSlice';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { db } from '@services/FirebaseService';
import { useAppDispatch, useAppSelector } from '@store/index';
import { MaterialIcons } from 'expo-vector-icons';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { IconButton } from 'native-base';
import React, { useEffect, useLayoutEffect } from 'react';
import { Text, View } from 'react-native';
import {
    AppStackParamList,
    BottomTabsParamList,
} from 'src/types/NavigationTypes';

type Props = CompositeScreenProps<
    BottomTabScreenProps<BottomTabsParamList, 'Contacts'>,
    StackScreenProps<AppStackParamList>
>;

const Contacts = ({ navigation }: Props) => {
    const contacts = useAppSelector((state) => state.contacts.data);
    const userContacts = useAppSelector((state) => state.auth.user?.contacts);
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    console.log('user', user);
    useEffect(() => {
        if (userContacts) {
            dispatch(getContactsAction(userContacts));
        }
    }, []);

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

                    const data = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    console.log('data', data);
                    //dispatch(getContactsAction(data));
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
                />
            ),
        });
    }, []);

    return (
        <View>
            <Text>{contacts.length}</Text>
        </View>
    );
};

export default Contacts;
