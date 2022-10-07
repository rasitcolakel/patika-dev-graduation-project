import { getContactsAction } from '@features/contactsSlice';
import { Chat, Message, TextContent } from '@src/types/ChatTypes';
import { UserType } from '@src/types/UserTypes';
import { getHHMMFromUTC } from '@src/utils/dateUtils';
import { useAppDispatch, useAppSelector } from '@store/index';
import { randomColorFromID } from '@utils/ui';
import { MaterialIcons } from 'expo-vector-icons';
import {
    Avatar,
    Button,
    Center,
    FlatList,
    HStack,
    Icon,
    Pressable,
    Text,
    VStack,
    View,
    useColorModeValue,
} from 'native-base';
import React, { useEffect } from 'react';

type Props = {
    goToChat: (user: UserType) => void;
    openAddChat: () => void;
};

const ChatLists = ({ goToChat, openAddChat }: Props) => {
    const user = useAppSelector((state) => state.auth.user);
    const chats = useAppSelector((state) => state.chats.data);
    const userContacts = useAppSelector((state) => state.auth.user?.contacts);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (userContacts?.length) {
            dispatch(getContactsAction(userContacts));
        }
    }, []);

    const isDark = useColorModeValue(false, true);

    if (chats.length === 0) {
        return (
            <Center flex="1" mx={2}>
                <Icon
                    as={MaterialIcons}
                    name="message"
                    size="140"
                    color="primary.500"
                />
                <Text textAlign="center" my={5} bold={false} fontSize="xl">
                    You don't have any chats yet. Add some!
                </Text>
                <Button colorScheme="primary" onPress={openAddChat}>
                    Add a Chat
                </Button>
            </Center>
        );
    }

    const renderLastMessage = (item: Message | undefined) => {
        const isMe = item?.senderId === user?.id;
        if (!item) {
            return <></>;
        }
        if (item.type === 'text') {
            return (
                <Text>
                    {isMe && <Text bold>You: </Text>}
                    {(item.content as TextContent).text}
                </Text>
            );
        } else if (item.type === 'image') {
            return (
                <HStack alignItems="center">
                    {isMe && <Text bold>You: </Text>}
                    <Icon
                        as={MaterialIcons}
                        name="camera-alt"
                        size="sm"
                        mr={1}
                    />
                    <Text>Photo</Text>
                </HStack>
            );
        } else if (item.type === 'location') {
            return (
                <HStack alignItems="center">
                    {isMe && <Text bold>You: </Text>}
                    <Icon
                        as={MaterialIcons}
                        name="location-on"
                        size="sm"
                        mr={1}
                    />
                    <Text>Shared Location</Text>
                </HStack>
            );
        } else {
            return <></>;
        }
    };

    const renderUnSeenMessagesCount = (count: number) => {
        return (
            <View
                w={6}
                h={6}
                bg="primary.500"
                borderRadius="full"
                alignItems="center"
                justifyContent="center"
            >
                <Text color="white">{count > 9 ? '9+' : count}</Text>
            </View>
        );
    };
    const renderItem = ({ item }: { item: Chat }) => {
        const recevier = item.members.find((m) => m.id !== user?.id);
        return (
            <Pressable onPress={() => recevier && goToChat(recevier)}>
                <HStack alignItems="center" w="full" px={2} py={1}>
                    <Avatar
                        bg={randomColorFromID(item.id) + '.500'}
                        mr="3"
                        source={{
                            uri: recevier?.photoURL,
                        }}
                    >
                        {recevier &&
                            recevier?.firstName[0] + recevier?.lastName[0]}
                    </Avatar>
                    <VStack flex="1" justifyContent="center">
                        <Text bold>
                            {recevier?.firstName} {recevier?.lastName}
                        </Text>
                        {item.lastMessage &&
                            renderLastMessage(item.lastMessage)}
                    </VStack>
                    <VStack justifyContent="center" alignItems="center">
                        {item.lastMessage && (
                            <Text
                                alignSelf="flex-start"
                                opacity={0.6}
                                flex="1"
                                {...{
                                    color:
                                        item.unSeenMessagesCount > 0
                                            ? 'primary.500'
                                            : 'text.500',
                                    bold: item.unSeenMessagesCount > 0,
                                }}
                            >
                                {getHHMMFromUTC(item.lastMessage.createdAt)}
                            </Text>
                        )}
                        {item.unSeenMessagesCount > 0 &&
                            renderUnSeenMessagesCount(item.unSeenMessagesCount)}
                    </VStack>
                </HStack>
            </Pressable>
        );
    };

    return (
        <FlatList
            mt={2}
            flex={1}
            data={chats}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => (
                <HStack
                    w="full"
                    borderColor={isDark ? 'gray.700' : 'gray.200'}
                    borderBottomWidth={1}
                    h="0.5"
                    my="1"
                />
            )}
        />
    );
};

export default ChatLists;
