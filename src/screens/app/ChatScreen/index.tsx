import { StackScreenProps } from '@react-navigation/stack';
import { RenderMessage } from '@src/components/RenderMessage';
import SendMessageView from '@src/components/SendMessageView';
import {
    createChatAction,
    handleCurrentChatChangeAction,
} from '@src/features/chatsSlice';
import { readMessages } from '@src/services/ChatService';
import { db } from '@src/services/FirebaseService';
import { useAppDispatch, useAppSelector } from '@src/store';
import { Message } from '@src/types/ChatTypes';
import { ChatScreenStackParamList } from '@src/types/NavigationTypes';
import { getLastSeenFromUTC } from '@src/utils/dateUtils';
import { randomColorFromID } from '@utils/ui';
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    where,
} from 'firebase/firestore';
import { Avatar, FlatList, Text, View } from 'native-base';
import React, { useEffect, useLayoutEffect } from 'react';
import { Platform } from 'react-native';

type Props = StackScreenProps<ChatScreenStackParamList, 'ChatScreen'>;

const ChatScreen = ({ navigation, route }: Props) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const currentChat = useAppSelector((state) => state.chats.currentChat);
    const chatMessages = useAppSelector((state) =>
        state.chats.chatMessages?.find(
            (chatMessage) => chatMessage.chatId === currentChat?.id,
        ),
    );

    const [chattingUserStatus, setChattingUserStatus] = React.useState<{
        isOnline: boolean;
        lastSeen: number;
    }>({
        isOnline: false,
        lastSeen: 0,
    });

    const goToMessageDetail = (message: Message) => {
        if (!user) {
            return;
        }
        navigation.navigate('MessageDetail', {
            message,
            user: message.senderId === user?.id ? user : route.params.user,
        });
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View
                    alignItems={Platform.OS === 'ios' ? 'center' : 'flex-start'}
                >
                    <Text bold fontSize="sm">
                        {route.params.user.firstName +
                            ' ' +
                            route.params.user.lastName}
                    </Text>
                    <Text fontSize="10" opacity={0.7}>
                        {chattingUserStatus.isOnline
                            ? 'Online'
                            : 'last seen ' +
                              getLastSeenFromUTC(chattingUserStatus.lastSeen)}
                    </Text>
                </View>
            ),
            headerRight: () => (
                <Avatar
                    bg={randomColorFromID(route.params.user.id) + '.500'}
                    mr="2"
                    size="sm"
                    source={{
                        uri: route.params.user.photoURL,
                    }}
                >
                    <Avatar.Badge
                        bg={
                            chattingUserStatus.isOnline
                                ? 'green.500'
                                : 'red.500'
                        }
                    />
                    {route.params.user.firstName[0] +
                        route.params.user.lastName[0]}
                </Avatar>
            ),
        });
    }, [chattingUserStatus]);

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
            const q = query(
                chatsRef,
                where('createdAt', '>', chatMessages?.lastMessageTime || 0),
                orderBy('createdAt', 'asc'),
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach(async (change) => {
                    await dispatch(handleCurrentChatChangeAction(change));
                    await readMessages(currentChat?.id);
                });
            });

            return () => unsubscribe();
        }
    }, [currentChat, chatMessages?.lastMessageTime]);

    useEffect(() => {
        if (route.params.user.id) {
            const chatsRef = doc(db, 'users', route.params.user.id);
            const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
                setChattingUserStatus({
                    isOnline: snapshot.data()?.isOnline,
                    lastSeen: snapshot.data()?.lastSeen,
                });
            });

            return unsubscribe;
        }
    }, [route.params.user.id]);

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
                <RenderMessage
                    item={item}
                    isMe={isMe}
                    goToMessageDetail={goToMessageDetail}
                />
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
                // performance settings
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
            />
            <SendMessageView />
        </View>
    );
};

export default ChatScreen;
