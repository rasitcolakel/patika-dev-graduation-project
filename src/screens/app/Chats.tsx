import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import ChatLists from '@src/components/ChatsList';
import ListContacts from '@src/components/ListContacts';
import { handleChatChangeAction } from '@src/features/chatsSlice';
import { db } from '@src/services/FirebaseService';
import { useAppDispatch, useAppSelector } from '@src/store';
import {
    AppStackParamList,
    BottomTabsParamList,
} from '@src/types/NavigationTypes';
import { UserType } from '@src/types/UserTypes';
import { Feather } from 'expo-vector-icons';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { IconButton, Modal, View } from 'native-base';
import React, { useEffect, useLayoutEffect } from 'react';

type Props = CompositeScreenProps<
    BottomTabScreenProps<BottomTabsParamList, 'Chats'>,
    StackScreenProps<AppStackParamList>
>;
const Chats = ({ navigation }: Props) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    _icon={{
                        as: Feather,
                        name: 'edit',
                    }}
                    onPress={() => setIsModalOpen(true)}
                />
            ),
        });
    }, []);

    const goToChat = (user: UserType) => {
        navigation.navigate('ChatStack', {
            screen: 'ChatScreen',
            params: {
                user,
            },
        });
    };

    const goToChatFromList = (user: UserType) => {
        setIsModalOpen(false);
        goToChat(user);
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
            <Modal isOpen={isModalOpen} size="full" height="full">
                <Modal.Content
                    marginTop="auto"
                    w="full"
                    height="92%"
                    maxHeight="9925%"
                >
                    <Modal.CloseButton onPress={() => setIsModalOpen(false)} />
                    <Modal.Header>New Chat</Modal.Header>
                    <ListContacts goToChat={goToChatFromList} />
                </Modal.Content>
            </Modal>

            <ChatLists
                goToChat={goToChat}
                openAddChat={() => setIsModalOpen(true)}
            />
        </View>
    );
};

export default Chats;
