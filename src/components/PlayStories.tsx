import { closePlayStories, openPlayStories } from '@src/features/storiesSlice';
import { useAppDispatch, useAppSelector } from '@src/store';
import { Center, View } from 'native-base';
import React, { useRef } from 'react';
import { FlatList } from 'react-native-gesture-handler';

import { StoriesOfUser } from './StroriesOfUser';

const PlayStories = () => {
    const playStories = useAppSelector((state) => state.stories.playStories);
    const dispatch = useAppDispatch();
    const data = useAppSelector((state) => state.stories.data);
    const flatlistRef = useRef<FlatList>(null);

    if (!playStories.visible || playStories.type === 'mine') return null;

    const nextUser = () => {
        if (playStories.index < data.length - 1) {
            flatlistRef.current?.scrollToIndex({
                animated: true,
                index: playStories.index + 1,
            });
            dispatch(
                openPlayStories({
                    ...playStories,
                    index: playStories.index + 1,
                }),
            );
        } else {
            dispatch(closePlayStories());
        }
    };

    const prevUser = () => {
        if (playStories.index > 0) {
            flatlistRef.current?.scrollToIndex({
                animated: true,
                index: playStories.index - 1,
            });

            dispatch(
                openPlayStories({
                    ...playStories,
                    index: playStories.index - 1,
                }),
            );
        } else {
            dispatch(closePlayStories());
        }
    };

    return (
        <View
            style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                backgroundColor: 'black',
            }}
        >
            <Center flex={1}>
                <FlatList
                    legacyImplementation={false}
                    ref={flatlistRef}
                    style={{
                        flex: 1,
                    }}
                    initialScrollIndex={playStories.index}
                    onScrollToIndexFailed={(info) => {
                        const wait = new Promise((resolve) =>
                            setTimeout(resolve, 100),
                        );
                        wait.then(() => {
                            flatlistRef.current?.scrollToIndex({
                                index: info.index,
                                animated: true,
                            });
                        });
                    }}
                    pagingEnabled
                    data={data}
                    renderItem={({ item }) => (
                        <Center flex={1}>
                            <StoriesOfUser
                                user={item.user}
                                stories={item.stories}
                                nextUser={nextUser}
                                prevUser={prevUser}
                            />
                        </Center>
                    )}
                    keyExtractor={(item) => item.user.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    maxToRenderPerBatch={1}
                    initialNumToRender={1}
                />
            </Center>
        </View>
    );
};

export default PlayStories;
