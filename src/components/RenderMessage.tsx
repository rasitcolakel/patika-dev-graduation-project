import {
    ImageContent,
    LocationContent,
    Message,
    MessageType,
    TextContent,
} from '@src/types/ChatTypes';
import { getHHMMFromUTC } from '@src/utils/dateUtils';
import { darkMapStyle } from '@src/utils/mapUtils';
import CachedImage from 'expo-cached-image';
import { Text, View, useColorModeValue } from 'native-base';
import React from 'react';
import { ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Animated, { BounceInLeft, BounceInRight } from 'react-native-reanimated';

type Props = {
    isMe: boolean;
    item: Message;
};

const CustomAnimatedView = Animated.createAnimatedComponent(View);

export const RenderMessage = ({ item, isMe }: Props) => {
    const isDark = useColorModeValue(false, true);
    if (item.type === MessageType.TEXT) {
        const content = item.content as TextContent;
        return (
            <CustomAnimatedView
                entering={isMe ? BounceInRight : BounceInLeft}
                bg={isMe ? 'blue.500' : isDark ? 'gray.700' : 'gray.200'}
                borderRadius="lg"
                maxWidth="60%"
                minWidth="15%"
            >
                <Text
                    px="2"
                    pt={1}
                    color={isMe ? 'white' : isDark ? 'gray.100' : 'gray.800'}
                >
                    {content.text}
                </Text>
                <Text
                    fontSize={10}
                    color={isMe ? 'white' : isDark ? 'gray.100' : 'gray.800'}
                    alignSelf="flex-end"
                    pr={1}
                    pb={0.5}
                    opacity={0.8}
                >
                    {getHHMMFromUTC(item.createdAt)}
                </Text>
            </CustomAnimatedView>
        );
    } else if (item.type === MessageType.IMAGE) {
        const content = item.content as ImageContent;
        console.log('item.createdAt', item.createdAt);
        return (
            <CustomAnimatedView
                entering={isMe ? BounceInRight : BounceInLeft}
                p={0.5}
                bg={isMe ? 'blue.500' : isDark ? 'gray.700' : 'gray.200'}
                borderRadius="lg"
            >
                <CachedImage
                    source={{
                        uri: `${content.uri}`,
                        expiresIn: 2_628_288,
                    }}
                    cacheKey={`${item.id}-thumb`}
                    placeholderContent={
                        <ActivityIndicator
                            color="blue"
                            size="small"
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                            }}
                        />
                    }
                    resizeMode="cover"
                    style={{
                        width: Dimensions.get('window').width * 0.6,
                        height: Dimensions.get('window').width * 0.6,
                        borderRadius: 5,
                    }}
                />
                <Text
                    position="absolute"
                    bottom="0"
                    right="0"
                    pr={2}
                    pb={1}
                    fontSize="xs"
                    shadow="2"
                    fontWeight="light"
                >
                    {getHHMMFromUTC(item.createdAt)}
                </Text>
            </CustomAnimatedView>
        );
    } else if (item.type === MessageType.LOCATION) {
        const content = item.content as LocationContent;
        return (
            <CustomAnimatedView
                entering={isMe ? BounceInRight : BounceInLeft}
                h={Dimensions.get('window').height / 5}
                width="3/4"
                bg={isMe ? 'blue.500' : isDark ? 'gray.700' : 'gray.200'}
                p={0.5}
                borderRadius="lg"
            >
                <MapView
                    customMapStyle={isDark ? darkMapStyle : []}
                    userInterfaceStyle={isDark ? 'dark' : 'light'}
                    style={{
                        flex: 1,
                        borderRadius: 5,
                    }}
                    region={{
                        latitude: content.latitude,
                        longitude: content.longitude,
                        latitudeDelta: 0.004,
                        longitudeDelta: 0.002,
                    }}
                    zoomEnabled={false}
                    scrollEnabled={false}
                    cacheEnabled
                >
                    <Marker
                        coordinate={{
                            latitude: content.latitude,
                            longitude: content.longitude,
                        }}
                    />
                </MapView>
                <Text
                    position="absolute"
                    bottom="0"
                    right="0"
                    pr={2}
                    pb={1}
                    fontSize="xs"
                    shadow="2"
                    fontWeight="light"
                >
                    {getHHMMFromUTC(item.createdAt)}
                </Text>
            </CustomAnimatedView>
        );
    }

    return <></>;
};
