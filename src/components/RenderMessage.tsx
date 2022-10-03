import {
    ImageContent,
    LocationContent,
    Message,
    MessageType,
    TextContent,
} from '@src/types/ChatTypes';
import { Text, View, useColorModeValue } from 'native-base';
import React from 'react';
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
                px="4"
                py="2"
                borderRadius="lg"
                maxWidth="60%"
            >
                <Text color={isMe ? 'white' : isDark ? 'gray.100' : 'gray.800'}>
                    {content.text}
                </Text>
            </CustomAnimatedView>
        );
    } else if (item.type === MessageType.IMAGE) {
        const content = item.content as ImageContent;
        return <Text>Image</Text>;
    } else if (item.type === MessageType.LOCATION) {
        const content = item.content as LocationContent;
        return (
            <View
                h={140}
                width="3/4"
                bg={isMe ? 'blue.500' : isDark ? 'gray.700' : 'gray.200'}
                p={0.5}
                borderRadius="lg"
            >
                <MapView
                    style={{
                        flex: 1,
                        borderRadius: 5,
                    }}
                    region={{
                        latitude: content.latitude,
                        longitude: content.longitude,
                        latitudeDelta: 0.002,
                        longitudeDelta: 0.002,
                    }}
                    zoomEnabled={false}
                    scrollEnabled={false}
                >
                    <Marker
                        coordinate={{
                            latitude: content.latitude,
                            longitude: content.longitude,
                        }}
                    />
                </MapView>
            </View>
        );
    }

    return <></>;
};
