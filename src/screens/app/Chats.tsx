import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { MaterialIcons } from 'expo-vector-icons';
import { IconButton, View } from 'native-base';
import React, { useLayoutEffect } from 'react';
import {
    AppStackParamList,
    BottomTabsParamList,
} from 'src/types/NavigationTypes';

type Props = CompositeScreenProps<
    BottomTabScreenProps<BottomTabsParamList, 'Chats'>,
    StackScreenProps<AppStackParamList>
>;
const Chats = ({ navigation }: Props) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    _icon={{
                        as: MaterialIcons,
                        name: 'add',
                    }}
                />
            ),
        });
    }, []);

    return <View />;
};

export default Chats;
