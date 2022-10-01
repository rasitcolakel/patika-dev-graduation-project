import { StackScreenProps } from '@react-navigation/stack';
import { createChatAction } from '@src/features/chatsSlice';
import { sendMessage } from '@src/services/ChatService';
import { useAppDispatch, useAppSelector } from '@src/store';
import { AppStackParamList } from '@src/types/NavigationTypes';
import { randomColorFromID } from '@utils/ui';
import { MaterialIcons } from 'expo-vector-icons';
import {
    Avatar,
    HStack,
    IconButton,
    Input,
    View,
    useColorModeValue,
    useTheme,
} from 'native-base';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = StackScreenProps<AppStackParamList, 'ChatScreen'>;

const ChatScreen = ({ navigation, route }: Props) => {
    const [message, setMessage] = useState('');
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const user = useAppSelector((state) => state.auth.user);
    const currentChat = useAppSelector((state) => state.chats.currentChat);
    const dispatch = useAppDispatch();

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

    const [keyboardHeight, setKeyboardHeight] = React.useState(0);

    useEffect(() => {
        dispatch(createChatAction(route.params.user.id));
        const showSubscription = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                console.log('keyboard will show');
                setKeyboardHeight(e.endCoordinates.height);
            },
        );
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            console.log('keyboard will hide');
            setKeyboardHeight(0);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log('keyboardHeight', keyboardHeight);
    const onSubmit = () => {
        if (user && currentChat) {
            sendMessage(currentChat, message);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
                flex: 1,
            }}
        >
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                style={{
                    flex: 1,
                }}
            >
                <View flex={1}>
                    <View flex={1} />
                    <HStack
                        bg={useColorModeValue(
                            theme.colors.white,
                            theme.colors.black,
                        )}
                        paddingBottom={
                            keyboardHeight
                                ? Platform.OS === 'ios'
                                    ? 103
                                    : 85
                                : insets.bottom
                        }
                    >
                        <IconButton
                            _icon={{
                                as: MaterialIcons,
                                name: 'add',
                            }}
                            onPress={() => navigation.goBack()}
                        />
                        <Input
                            bg={useColorModeValue(
                                theme.colors.gray[100],
                                'gray.700',
                            )}
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
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default ChatScreen;
