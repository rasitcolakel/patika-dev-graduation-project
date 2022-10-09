import { createStackNavigator } from '@react-navigation/stack';
import { useIsOnline } from '@src/hooks/useIsOnline';
import { setUserPushToken, setUserStatus } from '@src/services/UserService';
import { AppStackParamList } from '@src/types/NavigationTypes';
import { registerForPushNotificationsAsync } from '@src/utils/notificationUtils';
import { useEffect } from 'react';
import { LogBox } from 'react-native';

import BottomTabs from './BottomTabs';
import ChatScreenStack from './ChatScreenStack';

LogBox.ignoreAllLogs();

const Tab = createStackNavigator<AppStackParamList>();

const AppStack = () => {
    const isOnline = useIsOnline();

    const getPushToken = async () => {
        const token = await registerForPushNotificationsAsync();
        console.log('token', token);
        if (token) {
            await setUserPushToken(token);
        }
    };

    useEffect(() => {
        console.log('isOnline', isOnline);
        setUserStatus(isOnline === 'active');
    }, [isOnline]);

    useEffect(() => {
        getPushToken();
    }, []);

    return (
        <Tab.Navigator initialRouteName="BottomTabs">
            <Tab.Screen
                name="BottomTabs"
                component={BottomTabs}
                options={{
                    headerShown: false,
                    title: '',
                }}
            />
            <Tab.Screen
                name="ChatStack"
                component={ChatScreenStack}
                options={{
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};

export default AppStack;
