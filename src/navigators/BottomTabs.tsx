import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Chats from '@screens/app/Chats';
import Contacts from '@screens/app/Contacts';
import Settings from '@screens/app/Settings';
import { MaterialIcons } from 'expo-vector-icons';
import { BottomTabsParamList } from 'src/types/NavigationTypes';

const Tab = createBottomTabNavigator<BottomTabsParamList>();

const BottomTabs = () => {
    return (
        <Tab.Navigator initialRouteName="Chats">
            <Tab.Screen
                name="Contacts"
                component={Contacts}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons
                            name="contacts"
                            color={color}
                            size={size}
                        />
                    ),
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
