import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Chats from '@screens/app/Chats';

const Tab = createBottomTabNavigator();

const AppStack = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Chats" component={Chats} />
        </Tab.Navigator>
    );
};

export default AppStack;
