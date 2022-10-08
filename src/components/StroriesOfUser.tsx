import { closePlayStories } from '@src/features/storiesSlice';
import { useAppDispatch } from '@src/store';
import { MyStory, Story } from '@src/types/StoryTypes';
import { UserType } from '@src/types/UserTypes';
import { getLastSeenFromUTC } from '@src/utils/dateUtils';
import { randomColorFromID } from '@src/utils/ui';
import { MaterialIcons } from 'expo-vector-icons';
import {
    Avatar,
    Center,
    HStack,
    IconButton,
    Text,
    VStack,
    View,
} from 'native-base';
import React, { useRef } from 'react';
import { Dimensions, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StoryImage from './StoryImage';

type StoriesOfUserProps = {
    stories: Story[] | MyStory[];
    user: UserType;
    nextUser: () => void;
    prevUser: () => void;
};

export const StoriesOfUser = ({
    stories,
    user,
    nextUser,
    prevUser,
}: StoriesOfUserProps) => {
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const [currentStory, setCurrentStory] = React.useState(1);
    const scrollViewRef = useRef<ScrollView>(null);
    const goNext = () => {
        console.log('currentStorygoNext', currentStory);
        if (currentStory <= stories.length - 1) {
            if (scrollViewRef.current) {
                scrollViewRef?.current.scrollTo({
                    y: 0,
                    x: currentStory * Dimensions.get('window').width,
                    animated: true,
                });
            }
            setCurrentStory((prev) => prev + 1);
        } else {
            console.log('next user');
            nextUser();
        }
    };

    const goPrev = () => {
        console.log('currentStorygoPrev', currentStory);
        if (currentStory > 1) {
            if (scrollViewRef.current) {
                scrollViewRef?.current.scrollTo({
                    y: 0,
                    x: (currentStory - 2) * Dimensions.get('window').width,
                    animated: true,
                });
            }
            setCurrentStory(currentStory - 1);
        } else {
            console.log('prev user');
            prevUser();
        }
    };

    return (
        <Center flex={1}>
            <VStack
                w="full"
                position="absolute"
                style={{
                    top: insets.top,
                }}
                zIndex={1}
            >
                <HStack alignItems="center" w="full" px={2}>
                    <Avatar
                        bg={randomColorFromID(user.id) + '.500'}
                        mr="3"
                        source={{
                            uri: user.photoURL,
                        }}
                    >
                        {user.firstName[0] + user.lastName[0]}
                    </Avatar>
                    <VStack flexGrow={1}>
                        <Text color="white">
                            {user.firstName} {user.lastName}
                        </Text>
                        <Text color="white" fontSize="xs">
                            {getLastSeenFromUTC(
                                stories[currentStory - 1].createdAt,
                            )}
                        </Text>
                    </VStack>

                    <IconButton
                        _icon={{
                            color: 'white',
                            as: MaterialIcons,
                            name: 'close',
                        }}
                        colorScheme="white"
                        mr={2}
                        onPress={() => dispatch(closePlayStories())}
                    />
                </HStack>
                <HStack w="full" px={2} mt={2}>
                    {stories.map((story, index) => (
                        <View
                            flex={1}
                            key={story.id}
                            h={1}
                            bg={index < currentStory ? 'white' : 'gray.500'}
                            mr={index === stories.length - 1 ? 0 : 2}
                        />
                    ))}
                </HStack>
            </VStack>

            <ScrollView
                style={{
                    flex: 1,
                    width: Dimensions.get('window').width,
                    maxWidth: Dimensions.get('window').width,
                }}
                horizontal
                scrollEnabled={false}
                ref={scrollViewRef}
            >
                {stories.map((story, index) => (
                    <Center flex={1} key={story.id}>
                        <StoryImage image={story.media} cacheId={story.id} />
                    </Center>
                ))}
            </ScrollView>

            <Pressable
                onPress={goPrev}
                style={{
                    position: 'absolute',
                    height: '85%',
                    width: '50%',
                    bottom: 0,
                    left: 0,
                    zIndex: 1,
                }}
            />
            <Pressable
                onPress={goNext}
                style={{
                    position: 'absolute',
                    height: '85%',
                    width: '50%',
                    bottom: 0,
                    right: 0,
                    zIndex: 1,
                }}
            />
        </Center>
    );
};
