import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import {
    AppStackParamList,
    SettingsStackParamList,
} from '@src/types/NavigationTypes';
import { useAppSelector } from '@store/index';
import { Entypo, FontAwesome } from 'expo-vector-icons';
import {
    Avatar,
    HStack,
    Heading,
    Icon,
    IconButton,
    Switch,
    Text,
    View,
    useColorMode,
} from 'native-base';
import React from 'react';

type Props = CompositeScreenProps<
    StackScreenProps<SettingsStackParamList, 'Settings'>,
    StackScreenProps<AppStackParamList, 'BottomTabs'>
>;

const Settings = ({ navigation }: Props) => {
    const user = useAppSelector((state) => state.auth.user);
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <View my={3}>
            <HStack mx={4} alignItems="center">
                <Avatar source={{ uri: user?.photoURL }} size="xl">
                    {user?.firstName[0] + ' ' + user?.lastName[0]}
                </Avatar>
                <Heading ml={2}>
                    {user?.firstName + ' ' + user?.lastName}
                </Heading>
            </HStack>
            <View
                h={0.25}
                bg={colorMode === 'dark' ? 'gray.500' : 'gray.300'}
                my={4}
            />
            <HStack mx={4} mb={3} alignItems="center">
                <Icon
                    as={FontAwesome}
                    name="user-circle"
                    color="primary.500"
                    size="xl"
                />
                <Text flex={1} mx={4}>
                    Edit Profile
                </Text>
                <IconButton
                    _icon={{
                        as: Entypo,
                        name: 'chevron-right',
                    }}
                    onPress={() => navigation.push('EditProfile')}
                />
            </HStack>
            <HStack mx={4} mb={3} alignItems="center">
                <Icon as={Entypo} name="adjust" color="primary.500" size="xl" />
                <Text flex={1} mx={4}>
                    Dark Mode
                </Text>
                <Switch
                    isChecked={colorMode === 'dark'}
                    onValueChange={toggleColorMode}
                    color="primary.500"
                />
            </HStack>
        </View>
    );
};

export default Settings;
