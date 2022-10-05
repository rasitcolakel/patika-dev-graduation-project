import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '@screens/app/ChatScreen';
import { useIsOnline } from '@src/hooks/useIsOnline';
import { setUserPushToken, setUserStatus } from '@src/services/UserService';
import { AppStackParamList } from '@src/types/NavigationTypes';
import { registerForPushNotificationsAsync } from '@src/utils/notificationUtils';
import { useEffect } from 'react';

import BottomTabs from './BottomTabs';

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
            <Tab.Screen name="ChatScreen" component={ChatScreen} />
        </Tab.Navigator>
    );
};

export default AppStack;
