import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '@src/screens/app/ChatScreen';
import MessageDetail from '@src/screens/app/ChatScreen/MessageDetail';
import { ChatScreenStackParamList } from '@src/types/NavigationTypes';
import React from 'react';

const Stack = createStackNavigator<ChatScreenStackParamList>();

const ChatScreenStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{
                    title: 'Chat',
                }}
            />
            <Stack.Screen
                name="MessageDetail"
                component={MessageDetail}
                options={{
                    title: 'Message Detail',
                }}
            />
        </Stack.Navigator>
    );
};

export default ChatScreenStack;
