import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '@screens/app/ChatScreen';
import { useIsOnline } from '@src/hooks/useIsOnline';
import { setUserStatus } from '@src/services/UserService';
import { AppStackParamList } from '@src/types/NavigationTypes';
import { useEffect } from 'react';

import BottomTabs from './BottomTabs';

const Tab = createStackNavigator<AppStackParamList>();

const AppStack = () => {
    const isOnline = useIsOnline();

    useEffect(() => {
        console.log('isOnline', isOnline);
        setUserStatus(isOnline === 'active');
    }, [isOnline]);

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
