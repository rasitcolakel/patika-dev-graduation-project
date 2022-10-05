import ContactsList from '@components/ContactsList';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { db } from '@services/FirebaseService';
import { handleContactChangeAction } from '@src/features/contactsSlice';
import {
    AppStackParamList,
    ContactsStackParamList,
} from '@src/types/NavigationTypes';
import { UserType } from '@src/types/UserTypes';
import { useAppDispatch, useAppSelector } from '@store/index';
import { MaterialIcons } from 'expo-vector-icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { IconButton, View } from 'native-base';
import React, { useEffect, useLayoutEffect } from 'react';

type Props = CompositeScreenProps<
    StackScreenProps<ContactsStackParamList, 'Contacts'>,
    StackScreenProps<AppStackParamList, 'BottomTabs'>
>;

const Contacts = ({ navigation }: Props) => {
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const goToChat = (user: UserType) => {
        navigation.navigate('ChatStack', {
            screen: 'ChatScreen',
            params: {
                user,
            },
        });
    };

    // onsnapshot
    useEffect(() => {
        if (user?.id) {
            // get nested collection firebase
            const unsubscribe = onSnapshot(
                collection(db, 'users', user.id, 'contacts'),
                (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        dispatch(handleContactChangeAction(change));
                    });
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
            <ContactsList goToChat={goToChat} />
        </View>
    );
};

export default Contacts;
