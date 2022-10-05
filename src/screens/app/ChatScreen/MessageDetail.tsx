import { StackScreenProps } from '@react-navigation/stack';
import { useAppSelector } from '@src/store';
import { ImageContent, LocationContent, Message } from '@src/types/ChatTypes';
import { ChatScreenStackParamList } from '@src/types/NavigationTypes';
import { darkMapStyle } from '@src/utils/mapUtils';
import {
    Avatar,
    Image,
    Text,
    VStack,
    View,
    useColorModeValue,
} from 'native-base';
import React from 'react';
import MapView, { Marker } from 'react-native-maps';

type Props = StackScreenProps<ChatScreenStackParamList, 'MessageDetail'>;

const checkIsImage = (message: Message) => {
    return message.type === 'image';
};

const MessageDetail = ({ route }: Props) => {
    const user = useAppSelector((state) => state.auth.user);
    const isDark = useColorModeValue(false, true);
    const renderImage = () => {
        const content = route.params.message.content as ImageContent;
        console.log('content', content);
        return (
            <Image
                source={{ uri: content.uri }}
                alt="image"
                flex={1}
                resizeMode="contain"
                w="full"
                minW="full"
            />
        );
    };

    const renderMap = () => {
        const content = route.params.message.content as LocationContent;
        return (
            <View flex={1} justifyContent="center" alignItems="center">
                <MapView
                    style={{ width: '100%', height: '100%' }}
                    initialRegion={{
                        ...content,
                        latitudeDelta: 0.003,
                        longitudeDelta: 0.003,
                    }}
                    customMapStyle={isDark ? darkMapStyle : []}
                    userInterfaceStyle={isDark ? 'dark' : 'light'}
                >
                    <Marker
                        coordinate={{
                            latitude: content.latitude,
                            longitude: content.longitude,
                        }}
                    >
                        <VStack alignItems="center">
                            <Avatar
                                bg="primary.500"
                                size="md"
                                source={{
                                    uri: route.params.user.photoURL,
                                }}
                                key={route.params.user.id}
                                borderColor={
                                    user?.id === route.params.user.id
                                        ? 'primary.700'
                                        : isDark
                                        ? 'gray.700'
                                        : 'gray.200'
                                }
                                borderWidth={2}
                            >
                                {route.params.user.firstName[0] +
                                    route.params.user.lastName[0]}
                            </Avatar>
                            {route.params.user.id === user?.id && (
                                <Text color={isDark ? 'white' : 'black'}>
                                    You
                                </Text>
                            )}
                        </VStack>
                    </Marker>
                </MapView>
            </View>
        );
    };

    return checkIsImage(route.params.message) ? renderImage() : renderMap();
};

export default MessageDetail;
