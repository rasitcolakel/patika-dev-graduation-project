import { createStackNavigator } from '@react-navigation/stack';
import Contacts from '@screens/app/Contacts';
import AddContact from '@screens/app/Contacts/AddContact';
import React from 'react';
import { ContactsStackParamList } from 'src/types/NavigationTypes';

const Stack = createStackNavigator<ContactsStackParamList>();

const ContactsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Contacts" component={Contacts} />
            <Stack.Screen
                name="AddContact"
                component={AddContact}
                options={{
                    title: 'Add Contact',
                }}
            />
        </Stack.Navigator>
    );
};

export default ContactsStack;
