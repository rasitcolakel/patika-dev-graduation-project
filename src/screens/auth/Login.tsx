import { Button, Center, Text, useColorMode } from 'native-base';
import React from 'react';

const Login = () => {
    const { toggleColorMode } = useColorMode();
    return (
        <Center flex={1}>
            <Text>Login</Text>
            <Button onPress={toggleColorMode}>Login</Button>
        </Center>
    );
};

export default Login;
