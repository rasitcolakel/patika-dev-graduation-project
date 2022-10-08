import { useAppSelector } from '@src/store';
import { Center, View } from 'native-base';
import React from 'react';

import { StoriesOfUser } from './StroriesOfUser';

const PlayMyStories = () => {
    const playStories = useAppSelector((state) => state.stories.playStories);
    const data = useAppSelector((state) => state.stories.mine);
    const user = useAppSelector((state) => state.auth.user);

    if (!playStories.visible || playStories.type === 'contact') return null;

    if (!user) return null;
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
                <StoriesOfUser
                    user={user}
                    stories={data}
                    nextUser={() => {}}
                    prevUser={() => {}}
                />
            </Center>
        </View>
    );
};

export default PlayMyStories;
