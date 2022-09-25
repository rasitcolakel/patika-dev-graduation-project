import { Button, Text, View, useColorMode } from 'native-base';
import React from 'react';
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';

const Chats = () => {
    const { toggleColorMode } = useColorMode();
    const [chats, setChats] = React.useState([
        {
            id: 1.13123,
            value: 1,
        },
        {
            id: 2.13123,
            value: 2,
        },
        {
            id: 3.13123,
            value: 3,
        },
        // add 10 items
        {
            id: 4.13123,
            value: 4,
        },
    ]);

    const addChat = () => {
        setChats([...chats, { id: chats.length, value: Math.random() * 100 }]);
    };
    const removeChat = () => {
        setChats(chats.slice(0, -1));
    };
    return (
        <View>
            <Text>Chats</Text>
            {chats.map((chat) => (
                <Animated.View
                    key={chat.id}
                    entering={FadeInLeft}
                    exiting={FadeOutRight}
                >
                    <View bg="blue.300">
                        <Text>{chat.value}</Text>
                    </View>
                </Animated.View>
            ))}

            <Button onPress={addChat} mt={10}>
                Add Chat
            </Button>
            <Button onPress={removeChat} mt={2}>
                Remove Chat
            </Button>
            <Button onPress={toggleColorMode} mt={2}>
                Theme
            </Button>
        </View>
    );
};

export default Chats;
