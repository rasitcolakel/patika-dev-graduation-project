import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Chats from '@screens/app/Chats';
import Contacts from '@screens/app/Contacts';
import Settings from '@screens/app/Settings';
import { AppStackParamList } from 'src/types/NavigationTypes';

const Tab = createBottomTabNavigator<AppStackParamList>();

const AppStack = () => {
    return (
        <Tab.Navigator initialRouteName="Chats">
            <Tab.Screen name="Contacts" component={Contacts} />
            <Tab.Screen name="Chats" component={Chats} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    );
};

export default AppStack;
