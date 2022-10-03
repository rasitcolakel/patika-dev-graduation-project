import { getContactsAction } from '@features/contactsSlice';
import { useNavigation } from '@react-navigation/native';
import { Chat, Message, TextContent } from '@src/types/ChatTypes';
import { UserType } from '@src/types/UserTypes';
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
    useColorModeValue,
} from 'native-base';
import React, { useEffect } from 'react';

type Props = {
    goToChat: (user: UserType) => void;
};

const ChatLists = ({ goToChat }: Props) => {
    const navigation = useNavigation<any>();
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
                    name="contacts"
                    size="140"
                    color="primary.500"
                />
                <Text textAlign="center" my={5} bold={false} fontSize="xl">
                    You don't have any contacts yet. Add some!
                </Text>
                <Button
                    colorScheme="primary"
                    onPress={() => navigation.push('AddContact')}
                >
                    Add a Contact
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
                    <Icon as={MaterialIcons} name="camera-alt" size="sm" />
                    <Text>Photo</Text>
                </HStack>
            );
        } else if (item.type === 'location') {
            return (
                <HStack alignItems="center">
                    {isMe && <Text bold>You: </Text>}
                    <Icon as={MaterialIcons} name="location-on" size="sm" />
                    <Text>Shared Location</Text>
                </HStack>
            );
        } else {
            return <></>;
        }
    };

    const renderItem = ({ item }: { item: Chat }) => {
        const recevier = item.members.find((m) => m.id !== user?.id);
        return (
            <Pressable onPress={() => recevier && goToChat(recevier)}>
                <HStack alignItems="center" w="full" px={2}>
                    <Avatar
                        bg={randomColorFromID(item.id) + '.500'}
                        mr="1"
                        source={{
                            uri: recevier?.photoURL,
                        }}
                    >
                        {recevier &&
                            recevier?.firstName[0] + recevier?.lastName[0]}
                    </Avatar>
                    <VStack flex="1" justifyContent="center">
                        <Text flexGrow={1}>
                            {recevier?.firstName} {recevier?.lastName}
                        </Text>
                        {renderLastMessage(item.lastMessage)}
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
