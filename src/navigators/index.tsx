import CustomToast from '@components/CustomToast';
import { getMyProfileAction, logoutAction, setUser } from '@features/authSlice';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { auth } from '@services/FirebaseService';
import { UserType } from '@src/types/UserTypes';
import { useAppDispatch, useAppSelector } from '@store/index';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useColorMode, useColorModeValue, useTheme } from 'native-base';
import React, { useEffect } from 'react';

import AppStack from './App';
import AuthStack from './Auth';

const Navigation = () => {
    const theme = useTheme();
    const { colorMode, toggleColorMode } = useColorMode();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
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

    const initUser = async () => {
        const localUser = await SecureStore.getItemAsync('user');
        if (localUser) {
            const user: UserType = JSON.parse(localUser);
            dispatch(setUser(user));
        }
        console.log('localUser', localUser);
        auth.onAuthStateChanged(async function (user) {
            console.log('onAuthStateChanged', user);
            if (user) {
                // fetch current user from firebase
                dispatch(getMyProfileAction());
                console.log('user', user);
            } else {
                // if no user is logged in, clear storage and log out the user
                dispatch(logoutAction());
            }
        });
    };

    const initTheme = async () => {
        const localTheme = await SecureStore.getItemAsync('theme');
        if (localTheme) {
            const theme = JSON.parse(localTheme);
            console.log('theme', theme);
            if (theme !== colorMode) {
                toggleColorMode();
            }
        }
    };

    useEffect(() => {
        initTheme();
        initUser();
    }, []);

    useEffect(() => {
        SecureStore.setItemAsync('theme', JSON.stringify(colorMode));
    }, [colorMode]);

    return (
        <>
            <CustomToast />
            <StatusBar style={useColorModeValue('dark', 'light')} />
            <NavigationContainer theme={MyTheme}>
                {user ? <AppStack /> : <AuthStack />}
            </NavigationContainer>
        </>
    );
};

export default Navigation;
