import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '@screens/app/ChatScreen';
import Contacts from '@screens/app/Contacts';
import { AppStackParamList } from 'src/types/NavigationTypes';

import BottomTabs from './BottomTabs';

const Tab = createStackNavigator<AppStackParamList>();

const AppStack = () => {
    return (
        <Tab.Navigator initialRouteName="BottomTabs">
            <Tab.Screen
                name="BottomTabs"
                component={BottomTabs}
                options={{
                    headerShown: false,
                }}
            />
            <Tab.Screen name="ChatScreen" component={ChatScreen} />
        </Tab.Navigator>
    );
};

export default AppStack;
