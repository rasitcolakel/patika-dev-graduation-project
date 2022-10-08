import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import MyContactsStories from '@src/components/MyContactsStories';
import MyStories from '@src/components/MyStories';
import NewStory from '@src/components/NewStory';
import PlayMyStories from '@src/components/PlayMyStories';
import PlayStories from '@src/components/PlayStories';
import { openPlayStories, openStoryModal } from '@src/features/storiesSlice';
import { useAppDispatch, useAppSelector } from '@src/store';
import {
    AppStackParamList,
    BottomTabsParamList,
} from '@src/types/NavigationTypes';
import { ContactStory } from '@src/types/StoryTypes';
import _ from 'lodash';
import { View } from 'native-base';
import React, { useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = CompositeScreenProps<
    BottomTabScreenProps<BottomTabsParamList, 'Status'>,
    StackScreenProps<AppStackParamList>
>;
const Status = (props: Props) => {
    const dispatch = useAppDispatch();
    const storyModal = useAppSelector((state) => state.stories.storyModal);
    const playStories = useAppSelector((state) => state.stories.playStories);
    const data = useAppSelector((state) => state.stories.data);

    const openNewStory = () => {
        dispatch(openStoryModal());
        // hide bottom tab
        props.navigation.setOptions({
            tabBarStyle: { display: 'none' },
        });
    };

    // open play stories
    const open = (item: ContactStory) => {
        const index = _.findIndex(data, (o) => o.user.id === item.user.id);
        dispatch(
            openPlayStories({
                index,
                storyIndex: 0,
                visible: true,
                type: 'contact',
            }),
        );
        // hide bottom tab
        props.navigation.setOptions({
            tabBarStyle: { display: 'none' },
        });
    };

    const openMine = () => {
        dispatch(
            openPlayStories({
                index: 0,
                storyIndex: 0,
                visible: true,
                type: 'mine',
            }),
        );
        // hide bottom tab
        props.navigation.setOptions({
            tabBarStyle: { display: 'none' },
        });
    };

    useLayoutEffect(() => {
        if (!storyModal)
            props.navigation.setOptions({
                tabBarStyle: { display: 'flex' },
            });
    }, [storyModal]);

    useLayoutEffect(() => {
        if (!playStories.visible)
            props.navigation.setOptions({
                tabBarStyle: { display: 'flex' },
            });
    }, [playStories]);

    return (
        <View flex={1}>
            <SafeAreaView style={{ flex: 1 }}>
                <MyStories openNewStory={openNewStory} openMine={openMine} />
                <MyContactsStories openStories={open} />
            </SafeAreaView>
            <NewStory />
            <PlayStories />
            <PlayMyStories />
        </View>
    );
};

export default Status;
