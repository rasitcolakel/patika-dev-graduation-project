import { handleMineStoryChangeAction } from '@src/features/storiesSlice';
import { db } from '@src/services/FirebaseService';
import { useAppDispatch, useAppSelector } from '@src/store';
import { MaterialIcons } from 'expo-vector-icons';
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    startAt,
    where,
} from 'firebase/firestore';
import { Avatar, HStack, IconButton, Pressable, Text, View } from 'native-base';
import React, { useEffect } from 'react';

import StatusCircle from './StatusBorder';

type Props = {
    openNewStory: () => void;
    openMine: () => void;
};

const MyStories = ({ openNewStory, openMine }: Props) => {
    const mine = useAppSelector((state) => state.stories.mine);
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    // listen for my new stories
    useEffect(() => {
        if (user) {
            try {
                const mineStoriesRef = collection(db, 'stories');
                const last24Hours = Date.now() - 24 * 60 * 60 * 1000;
                console.log('last24Hours', last24Hours);
                console.log();
                const q = query(
                    mineStoriesRef,
                    where('userId', '==', user.id),
                    orderBy('createdAt', 'asc'),
                    startAt(last24Hours),
                );
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        dispatch(handleMineStoryChangeAction(change));
                    });
                });

                return unsubscribe;
            } catch (error) {
                console.log('error', error);
            }
        }
    }, []);
    if (!user) return null;
    return (
        <View ml={2}>
            <Pressable onPress={openMine}>
                <HStack alignItems="center">
                    <StatusCircle
                        width={60}
                        height={60}
                        circleProps={{
                            strokeWidth: 5,
                        }}
                        count={mine.length}
                    >
                        <Avatar
                            source={{ uri: user?.photoURL }}
                            style={
                                mine.length === 0
                                    ? {
                                          width: 60,
                                          height: 60,
                                      }
                                    : {
                                          width: 48,
                                          height: 48,
                                          bottom: -6,
                                          right: -6,
                                      }
                            }
                        >
                            <Text>
                                {user?.firstName[0] + user?.lastName[0]}
                            </Text>
                        </Avatar>
                    </StatusCircle>
                    <Text ml={2} flex={1}>
                        {user?.firstName + ' ' + user?.lastName}
                    </Text>
                    <IconButton
                        _icon={{
                            as: MaterialIcons,
                            name: 'camera-alt',
                            size: 'xl',
                        }}
                        onPress={openNewStory}
                    />
                </HStack>
            </Pressable>
        </View>
    );
};

export default MyStories;
