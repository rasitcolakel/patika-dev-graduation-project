import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import Chats from '@screens/app/Chats';
import Status from '@src/screens/app/Status';
import { getUserById } from '@src/services/UserService';
import {
    AppStackParamList,
    BottomTabsParamList,
} from '@src/types/NavigationTypes';
import * as Notifications from 'expo-notifications';
import { FontAwesome, MaterialIcons } from 'expo-vector-icons';
import { useEffect, useRef } from 'react';

import ContactsStack from './ContactsStack';
import SettingsStack from './SettingsStack';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

type Props = StackScreenProps<AppStackParamList, 'BottomTabs'>;

const Tab = createBottomTabNavigator<BottomTabsParamList>();

const BottomTabs = ({ navigation }: Props) => {
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();
    useEffect(() => {
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                console.log('notificationReceived', notification);
            });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                async (response) => {
                    const data = response.notification.request.content.data;
                    console.log('responseReceived', data);
                    if (data.type === 'message') {
                        const user = await getUserById(data.senderId as string);
                        if (user) {
                            navigation.navigate('ChatStack', {
                                screen: 'ChatScreen',
                                params: {
                                    user,
                                },
                            });
                        }
                    }
                },
            );

        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current,
            );
            Notifications.removeNotificationSubscription(
                responseListener.current,
            );
        };
    }, []);
    return (
        <Tab.Navigator initialRouteName="Chats">
            <Tab.Screen
                name="Status"
                component={Status}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome
                            position="absolute"
                            name="circle-o-notch"
                            color={color}
                            size={size}
                        />
                    ),
                    headerShown: false,
                    title: 'Status',
                }}
            />
            <Tab.Screen
                name="ContactsStack"
                component={ContactsStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons
                            name="contacts"
                            color={color}
                            size={size}
                        />
                    ),
                    headerShown: false,
                    title: 'Contacts',
                }}
            />
            <Tab.Screen
                name="Chats"
                component={Chats}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons
                            name="message"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="SettingsStack"
                component={SettingsStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons
                            name="settings"
                            color={color}
                            size={size}
                        />
                    ),
                    headerShown: false,
                    title: 'Settings',
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabs;
