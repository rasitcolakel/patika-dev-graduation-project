import { useAppSelector } from '@store/index';
import { Button, Text, View, useColorMode } from 'native-base';
import React from 'react';

const Settings = () => {
    const user = useAppSelector((state) => state.auth.user);
    const { toggleColorMode } = useColorMode();
    return (
        <View>
            <Text>{user?.firstName + ' ' + user?.lastName}</Text>
            <Button onPress={toggleColorMode}>Change Theme</Button>
        </View>
    );
};

export default Settings;
