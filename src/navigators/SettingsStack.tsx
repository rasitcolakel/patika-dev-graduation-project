import { createStackNavigator } from '@react-navigation/stack';
import Settings from '@src/screens/app/Settings';
import EditProfile from '@src/screens/app/Settings/EditProfile';
import { SettingsStackParamList } from '@src/types/NavigationTypes';
import React from 'react';

const Stack = createStackNavigator<SettingsStackParamList>();

const SettingsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                options={{
                    title: 'Edit Profile',
                }}
            />
        </Stack.Navigator>
    );
};

export default SettingsStack;
