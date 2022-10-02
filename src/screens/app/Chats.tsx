import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import ChatLists from '@src/components/ChatsList';
import { handleChatChangeAction } from '@src/features/chatsSlice';
import { db } from '@src/services/FirebaseService';
import { useAppDispatch, useAppSelector } from '@src/store';
import {
    AppStackParamList,
    BottomTabsParamList,
} from '@src/types/NavigationTypes';
import { UserType } from '@src/types/UserTypes';
import { MaterialIcons } from 'expo-vector-icons';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { IconButton, View } from 'native-base';
import React, { useEffect, useLayoutEffect } from 'react';

type Props = CompositeScreenProps<
    BottomTabScreenProps<BottomTabsParamList, 'Chats'>,
    StackScreenProps<AppStackParamList>
>;
const Chats = ({ navigation }: Props) => {
    const user = useAppSelector((state) => state.auth.user);
    const chats = useAppSelector((state) => state.chats.data);
    const dispatch = useAppDispatch();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    _icon={{
                        as: MaterialIcons,
                        name: 'add',
                    }}
                />
            ),
        });
    }, []);

    // listen for chat changes
    useEffect(() => {
        if (user?.id) {
            // get nested collection firebase
            const chatsRef = collection(db, 'chats');

            const q = query(
                chatsRef,
                where('members', 'array-contains', user.id),
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    console.log('change', change.doc.id);
                });
            });

            return unsubscribe;
        }
    }, []);

    const goToChat = (user: UserType) => {
        navigation.push('ChatScreen', { user });
    };

    // listen for chat changes
    useEffect(() => {
        if (user?.id) {
            // get nested collection firebase
            const chatsRef = collection(db, 'chats');

            const q = query(
                chatsRef,
                where('members', 'array-contains', user.id),
                where('doesConversationStarted', '==', true),
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    dispatch(handleChatChangeAction(change));
                });
            });

            return unsubscribe;
        }
    }, []);

    return (
        <View flex={1}>
            <ChatLists goToChat={goToChat} />
        </View>
    );
};

export default Chats;
