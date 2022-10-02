import { StackScreenProps } from '@react-navigation/stack';
import { RenderMessage } from '@src/components/RenderMessage';
import SendMessageView from '@src/components/SendMessageView';
import {
    createChatAction,
    handleCurrentChatChangeAction,
} from '@src/features/chatsSlice';
import { db } from '@src/services/FirebaseService';
import { useAppDispatch, useAppSelector } from '@src/store';
import { Message } from '@src/types/ChatTypes';
import { AppStackParamList } from '@src/types/NavigationTypes';
import { randomColorFromID } from '@utils/ui';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Avatar, FlatList, View } from 'native-base';
import React, { useEffect, useLayoutEffect } from 'react';

type Props = StackScreenProps<AppStackParamList, 'ChatScreen'>;

const ChatScreen = ({ navigation, route }: Props) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const currentChat = useAppSelector((state) => state.chats.currentChat);
    const chatMessages = useAppSelector((state) =>
        state.chats.chatMessages?.find(
            (chatMessage) => chatMessage.chatId === currentChat?.id,
        ),
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            title:
                route.params.user.firstName + ' ' + route.params.user.lastName,
            headerRight: () => (
                <Avatar
                    bg={randomColorFromID(route.params.user.id) + '.500'}
                    mr="2"
                    size="sm"
                    source={{
                        uri: route.params.user.photoURL,
                    }}
                >
                    {route.params.user.firstName[0] +
                        route.params.user.lastName[0]}
                </Avatar>
            ),
        });
    }, []);

    // create chat if not exist
    useEffect(() => {
        dispatch(createChatAction(route.params.user.id));
    }, []);

    // listen for new messages
    useEffect(() => {
        if (currentChat?.id) {
            // get nested collection firebase
            const chatsRef = collection(
                db,
                'chats',
                currentChat?.id,
                'messages',
            );
            const q = query(chatsRef, orderBy('createdAt', 'asc'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    dispatch(handleCurrentChatChangeAction(change));
                });
            });

            return unsubscribe;
        }
    }, [currentChat]);

    const renderItem = ({ item }: { item: Message }) => {
        const isMe = item.senderId === user?.id;
        return (
            <View
                px="4"
                py="1"
                flexDirection="row"
                alignItems="center"
                justifyContent={isMe ? 'flex-end' : 'flex-start'}
            >
                <RenderMessage item={item} isMe={isMe} />
            </View>
        );
    };

    return (
        <View flex={1}>
            <FlatList
                inverted
                flex={1}
                data={chatMessages?.messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
            <SendMessageView />
        </View>
    );
};

export default ChatScreen;
