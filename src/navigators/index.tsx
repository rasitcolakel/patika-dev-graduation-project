import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useColorModeValue, useTheme } from 'native-base';
import React from 'react';

import AppStack from './App';
import AuthStack from './Auth';

const Navigation = () => {
    const theme = useTheme();

    const MyTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: theme.colors.primary[500],
            background: useColorModeValue(
                theme.colors.light[100],
                theme.colors.dark[100],
            ),
            card: useColorModeValue(theme.colors.white, theme.colors.black),
            text: useColorModeValue(theme.colors.black, theme.colors.white),
            border: useColorModeValue(theme.colors.white, theme.colors.black),
            // notification: 'rgb(255, 69, 58)',
        },
    };
    return (
        <>
            <StatusBar style={useColorModeValue('dark', 'light')} />
            <NavigationContainer theme={MyTheme}>
                {/* <AuthStack /> */}
                <AppStack />
            </NavigationContainer>
        </>
    );
};

export default Navigation;
