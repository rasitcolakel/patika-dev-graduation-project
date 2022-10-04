import { setToast } from '@src/features/uiSlice';
import { useKeyboard } from '@src/hooks/useKeyboard';
import { sendMessage } from '@src/services/ChatService';
import { uploadImage } from '@src/services/ImageService';
import { useAppDispatch, useAppSelector } from '@src/store';
import { MessageType } from '@src/types/ChatTypes';
import { manipulateAsync } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { MaterialIcons } from 'expo-vector-icons';
import {
    Actionsheet,
    HStack,
    Icon,
    IconButton,
    Input,
    Text,
    useColorModeValue,
    useDisclose,
    useTheme,
} from 'native-base';
import React, { useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SendMessageView = () => {
    const [message, setMessage] = useState('');
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const keyboardHeight = useKeyboard();
    const user = useAppSelector((state) => state.auth.user);
    const currentChat = useAppSelector((state) => state.chats.currentChat);
    const { isOpen, onOpen, onClose } = useDisclose();
    const dispatch = useAppDispatch();

    const onSubmit = () => {
        if (user && currentChat && message) {
            sendMessage(currentChat.id, {
                text: message,
            });
            setMessage('');
        }
    };

    const onShareLocation = async () => {
        if (user && currentChat) {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                dispatch(
                    setToast({
                        title: 'Permission Denied',
                        message: 'Permission to access location was denied',
                        variant: 'error',
                    }),
                );
                return;
            }

            const location = await Location.getCurrentPositionAsync({});

            if (location) {
                sendMessage(
                    currentChat.id,
                    {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    },
                    MessageType.LOCATION,
                );
            }
            onClose();
        }
    };

    const onShareImage = async () => {
        if (user && currentChat) {
            let imageUri = '';
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 0.4,
                allowsEditing: true,
            });

            if (!result.cancelled) {
                if (result.fileSize && result.fileSize > 100000) {
                    const resizedImage = await manipulateAsync(
                        result.uri,
                        [
                            {
                                resize: {
                                    width: result.width / 3,
                                    height: result.height / 3,
                                },
                            },
                        ],
                        { compress: 0.5 },
                    );
                    imageUri = resizedImage.uri;
                } else {
                    imageUri = result.uri;
                }
                const uploadedImage = await uploadImage(imageUri);
                sendMessage(
                    currentChat.id,
                    {
                        uri: uploadedImage,
                    },
                    MessageType.IMAGE,
                );
            }
            onClose();
        }
    };

    const onActionSheetOpen = () => {
        Keyboard.dismiss();
        onOpen();
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
            px={1}
        >
            <IconButton
                _icon={{
                    as: MaterialIcons,
                    name: 'add',
                }}
                onPress={onActionSheetOpen}
            />
            <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                    <Actionsheet.Item p={2}>
                        <HStack alignItems="center">
                            <Icon
                                as={MaterialIcons}
                                name="camera-alt"
                                size="xl"
                                color="primary.500"
                                mr={2}
                            />
                            <Text fontSize="lg">Camera</Text>
                        </HStack>
                    </Actionsheet.Item>
                    <Actionsheet.Item p={2} onPress={onShareImage}>
                        <HStack alignItems="center">
                            <Icon
                                as={MaterialIcons}
                                name="insert-photo"
                                size="xl"
                                color="primary.500"
                                mr={2}
                            />
                            <Text fontSize="lg">Photo</Text>
                        </HStack>
                    </Actionsheet.Item>
                    <Actionsheet.Item p={2} onPress={onShareLocation}>
                        <HStack alignItems="center">
                            <Icon
                                as={MaterialIcons}
                                name="location-on"
                                size="xl"
                                color="primary.500"
                                mr={2}
                            />
                            <Text fontSize="lg">Share Your Location</Text>
                        </HStack>
                    </Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>
            <Input
                bg={useColorModeValue(theme.colors.gray[100], 'gray.900')}
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
