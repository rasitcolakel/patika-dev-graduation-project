import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import MyContactsStories from '@src/components/MyContactsStories';
import MyStories from '@src/components/MyStories';
import NewStory from '@src/components/NewStory';
import { openStoryModal } from '@src/features/storiesSlice';
import { useAppDispatch, useAppSelector } from '@src/store';
import {
    AppStackParamList,
    BottomTabsParamList,
} from '@src/types/NavigationTypes';
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
    const openNewStory = () => {
        dispatch(openStoryModal());
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
    return (
        <View flex={1}>
            <SafeAreaView style={{ flex: 1 }}>
                <MyStories openNewStory={openNewStory} />
                <MyContactsStories />
            </SafeAreaView>
            <NewStory />
        </View>
    );
};

export default Status;
