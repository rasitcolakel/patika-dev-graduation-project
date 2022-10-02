import Navigation from '@navigators/index';
import { persistor, store } from '@store/index';
import { NativeBaseProvider, extendTheme } from 'native-base';
import React from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// persistor.purge();
// Define the config
const config = {
    useSystemColorMode: true,
};

// extend the theme
export const theme = extendTheme({
    colors: {
        primary: {
            50: '#D8E7FC',
            100: '#C5DCFA',
            200: '#A0C5F7',
            300: '#7AAEF3',
            400: '#5597F0',
            500: '#2F80ED',
            600: '#1264D2',
            700: '#0E4B9E',
            800: '#09336A',
            900: '#051A37',
        },
    },
    config,
});
type MyThemeType = typeof theme;

declare module 'native-base' {
    interface ICustomTheme extends MyThemeType {}
}
export default function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <NativeBaseProvider theme={theme}>
                    <Navigation />
                </NativeBaseProvider>
            </PersistGate>
        </Provider>
    );
}
