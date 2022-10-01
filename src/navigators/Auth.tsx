import { createStackNavigator } from '@react-navigation/stack';
import ForgotPassword from '@screens/auth/ForgotPassword';
import Login from '@screens/auth/Login';
import Register from '@screens/auth/Register';
import { AuthStackParamList } from '@src/types/NavigationTypes';
import React from 'react';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
    );
};

export default AuthStack;
