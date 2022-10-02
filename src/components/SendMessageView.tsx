import { useKeyboard } from '@src/hooks/useKeyboard';
import { sendMessage } from '@src/services/ChatService';
import { useAppSelector } from '@src/store';
import { MaterialIcons } from 'expo-vector-icons';
import {
    HStack,
    IconButton,
    Input,
    useColorModeValue,
    useTheme,
} from 'native-base';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SendMessageView = () => {
    const [message, setMessage] = useState('');
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const keyboardHeight = useKeyboard();
    const user = useAppSelector((state) => state.auth.user);
    const currentChat = useAppSelector((state) => state.chats.currentChat);
    const onSubmit = () => {
        if (user && currentChat) {
            sendMessage(currentChat.id, message);
            setMessage('');
        }
    };
    return (
        <HStack
            bg={useColorModeValue(theme.colors.white, theme.colors.black)}
            paddingBottom={
                keyboardHeight
                    ? Platform.OS === 'ios'
                        ? keyboardHeight
                        : 0
                    : insets.bottom
            }
        >
            <IconButton
                _icon={{
                    as: MaterialIcons,
                    name: 'add',
                }}
            />
            <Input
                bg={useColorModeValue(theme.colors.gray[100], 'gray.700')}
                borderRadius="full"
                flex={1}
                h={10}
                m={2}
                my={1}
                placeholder="Type a message"
                value={message}
                onChangeText={(text) => setMessage(text)}
            />
            <IconButton
                _icon={{
                    as: MaterialIcons,
                    name: 'send',
                }}
                onPress={onSubmit}
            />
        </HStack>
    );
};

export default SendMessageView;
