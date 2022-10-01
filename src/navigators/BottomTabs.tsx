import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Chats from '@screens/app/Chats';
import Settings from '@screens/app/Settings';
import { MaterialIcons } from 'expo-vector-icons';
import { BottomTabsParamList } from 'src/types/NavigationTypes';

import ContactsStack from './ContactsStack';

const Tab = createBottomTabNavigator<BottomTabsParamList>();

const BottomTabs = () => {
    return (
        <Tab.Navigator initialRouteName="Chats">
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
                name="Settings"
                component={Settings}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons
                            name="settings"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabs;
