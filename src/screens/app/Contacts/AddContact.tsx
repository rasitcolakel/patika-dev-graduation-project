import AddContactList from '@components/AddContactList';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { View } from 'native-base';
import React from 'react';
import {
    BottomTabsParamList,
    ContactsStackParamList,
} from 'src/types/NavigationTypes';

type Props = CompositeScreenProps<
    StackScreenProps<ContactsStackParamList, 'AddContact'>,
    BottomTabScreenProps<BottomTabsParamList, 'ContactsStack'>
>;

const AddContact = ({ navigation }: Props) => {
    return (
        <View flex={1}>
            <AddContactList />
        </View>
    );
};

export default AddContact;
