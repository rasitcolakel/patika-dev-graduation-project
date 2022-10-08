import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { setToast } from '@features/uiSlice';
import { useIsFocused } from '@react-navigation/native';
import { closeStoryModal, shareStoryAction } from '@src/features/storiesSlice';
import { useAppDispatch, useAppSelector } from '@src/store';
import { Camera, CameraType } from 'expo-camera';
import { manipulateAsync } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import {
    Button,
    Center,
    Checkbox,
    HStack,
    Heading,
    Icon,
    Spinner,
    Text,
    VStack,
} from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, Linking, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StoryImage from './StoryImage';

export type ShareImageFormData = {
    image: string;
};
const NewStory = () => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const storyModal = useAppSelector((state) => state.stories.storyModal);
    const loading = useAppSelector((state) => state.stories.loading);

    const [cameraPermission, setCameraPermission] = useState<boolean | null>(
        null,
    );
    const isFocused = useIsFocused();
    const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
    const cameraRef = useRef<Camera>(null);
    const [image, setImage] = useState<string>('');

    const pickImage = async () => {
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
                                width: result.width / 2,
                                height: result.height / 2,
                            },
                        },
                    ],
                    { compress: 0.5 },
                );
                setImage(resizedImage.uri);
            } else {
                setImage(result.uri);
            }
        }
    };

    const checkPermissions = async () => {
        const { status: cameraStatus } =
            await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus === 'granted') {
            setCameraPermission(true);
        } else {
            setCameraPermission(false);
            dispatch(
                setToast({
                    title: 'Camera permission not granted',
                    variant: 'error',
                }),
            );
        }
    };

    useEffect(() => {
        // when app mounted check permissions
        checkPermissions();
    }, []);

    useEffect(() => {
        AppState.addEventListener('change', (state) => {
            console.log('App state changed', state);
            if (state === 'active') {
                checkPermissions();
            }
        });
    }, []);

    const onShare = () => {
        dispatch(shareStoryAction({ media: image }));
    };

    // While permissions checking
    const renderLoading = () => {
        return <Text>Loading...</Text>;
    };

    // If user denied a permission or not granted, show a link to settings
    const renderSetPermissions = () => {
        return (
            <Center flex={1}>
                <VStack space={4}>
                    <Heading alignSelf="center">Permissions Needed</Heading>
                    <Text alignSelf="center">
                        To share a photo you need to grant location and camera
                        permissions.
                    </Text>
                    <Checkbox
                        isChecked={!!cameraPermission}
                        colorScheme="green"
                        value="camera"
                        isDisabled={!!cameraPermission}
                        onChange={() => {
                            if (!cameraPermission) {
                                Linking.openSettings();
                            }
                        }}
                        size="md"
                    >
                        Camera Permission
                    </Checkbox>
                </VStack>
            </Center>
        );
    };

    // change camera type
    const changeCameraType = () => {
        console.log('change camera type', cameraType);
        setCameraType(
            cameraType === CameraType.front
                ? CameraType.back
                : CameraType.front,
        );
    };

    // take a photo
    const takePhoto = async () => {
        if (cameraPermission) {
            const photo = await cameraRef.current?.takePictureAsync();
            console.log('photo', photo);
            if (photo) {
                setImage(photo?.uri);
            }
        }
    };

    // on go back reset image
    const onGoBack = () => {
        setImage('');
    };

    // on close modal reset image
    const onCloseModal = () => {
        setImage('');
        dispatch(closeStoryModal());
    };

    // take picture or pick from gallery
    const renderTakePicture = () => {
        return (
            <Camera
                ref={cameraRef}
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'space-between',
                }}
                type={cameraType}
            >
                <HStack
                    style={{
                        marginTop: insets.top,
                    }}
                    pl={2}
                >
                    <Pressable onPress={onCloseModal}>
                        <Ionicons name="close" size={35} color="white" />
                    </Pressable>
                </HStack>
                <HStack
                    space={4}
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                >
                    <Pressable onPress={pickImage}>
                        <AntDesign name="picture" size={30} color="white" />
                    </Pressable>
                    <Pressable onPress={takePhoto}>
                        <Entypo name="circle" size={65} color="white" />
                    </Pressable>
                    <Pressable onPress={changeCameraType}>
                        <Ionicons
                            name="camera-reverse-outline"
                            size={30}
                            color="white"
                        />
                    </Pressable>
                </HStack>
            </Camera>
        );
    };

    // If image is selected, show it and a button to share
    const renderShare = () => {
        return (
            <VStack
                flex={1}
                justifyContent="space-between"
                style={{
                    marginTop: insets.top,
                }}
            >
                <HStack position="absolute" top={0} zIndex={1} pl={2}>
                    <Pressable onPress={onGoBack}>
                        <Ionicons name="chevron-back" size={35} color="white" />
                    </Pressable>
                </HStack>

                <StoryImage image={image} />

                <HStack
                    position="absolute"
                    space={4}
                    bottom={0}
                    zIndex={1}
                    flex={1}
                    w="100%"
                    justifyContent="flex-end"
                    p={2}
                >
                    <Button
                        bg="white"
                        borderRadius="full"
                        onPress={onShare}
                        disabled={loading}
                    >
                        {loading ? (
                            <Spinner color="primary.500" size={25} my={1} />
                        ) : (
                            <Icon
                                color="primary.500"
                                bg="white"
                                borderRadius="full"
                                as={Ionicons}
                                name="send"
                                alignSelf="flex-end"
                                size="xl"
                                my={1}
                            />
                        )}
                    </Button>
                </HStack>
            </VStack>
        );
    };
    if (!storyModal) {
        return null;
    }
    return (
        <Center
            flex={1}
            bg="black"
            position="absolute"
            w="full"
            h="full"
            pb={insets.bottom}
        >
            {isFocused && <StatusBar style="light" />}
            {cameraPermission === null
                ? renderLoading()
                : cameraPermission === false
                ? renderSetPermissions()
                : image
                ? renderShare()
                : renderTakePicture()}
        </Center>
    );
};

export default NewStory;
