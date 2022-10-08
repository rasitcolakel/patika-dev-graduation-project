import { handleStoryChangeAction } from '@src/features/storiesSlice';
import { db } from '@src/services/FirebaseService';
import { useAppDispatch, useAppSelector } from '@src/store';
import { ContactStory } from '@src/types/StoryTypes';
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    startAt,
    where,
} from 'firebase/firestore';
import {
    Avatar,
    FlatList,
    HStack,
    Heading,
    Text,
    View,
    useColorModeValue,
} from 'native-base';
import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import StatusCircle from './StatusBorder';

type Props = {
    openStories: (contact: ContactStory) => void;
};

const MyContactsStories = ({ openStories }: Props) => {
    const isDark = useColorModeValue(false, true);
    const data = useAppSelector((state) => state.stories.data);
    const contacts = useAppSelector((state) => state.contacts.data);

    const dispatch = useAppDispatch();
    // listen for my new stories
    useEffect(() => {
        if (contacts) {
            try {
                const contactIds = contacts.map((contact) => contact.id);
                const mineStoriesRef = collection(db, 'stories');
                const last24Hours = Date.now() - 24 * 60 * 60 * 1000;
                console.log('last24Hours', last24Hours);
                const q = query(
                    mineStoriesRef,
                    where('userId', 'in', contactIds),
                    orderBy('createdAt', 'asc'),
                    startAt(last24Hours),
                );

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        dispatch(handleStoryChangeAction(change));
                    });
                });

                return unsubscribe;
            } catch (error) {
                console.log('error', error);
            }
        }
    }, [contacts]);

    const renderItem = ({ user, stories }: ContactStory) => {
        return (
            <TouchableOpacity onPress={() => openStories({ user, stories })}>
                <HStack alignItems="center">
                    <StatusCircle
                        width={60}
                        height={60}
                        circleProps={{
                            strokeWidth: 5,
                        }}
                        count={stories.length}
                    >
                        <Avatar
                            source={{ uri: user?.photoURL }}
                            style={{
                                width: 48,
                                height: 48,
                            }}
                            bottom={-6}
                            right={-6}
                        >
                            {user?.firstName[0] + ' ' + user?.lastName[0]}
                        </Avatar>
                    </StatusCircle>
                    <Text ml={2}>{user?.firstName + ' ' + user?.lastName}</Text>
                </HStack>
            </TouchableOpacity>
        );
    };
    return (
        <View ml={2} flex={1}>
            <Heading my={2}>Last Updates</Heading>
            <FlatList
                flex={1}
                data={data}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(item) => item.user?.id}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                    <HStack
                        w="full"
                        borderColor={isDark ? 'gray.700' : 'gray.200'}
                        borderBottomWidth={1}
                        h="0.5"
                        my="2"
                    />
                )}
            />
        </View>
    );
};

export default MyContactsStories;
