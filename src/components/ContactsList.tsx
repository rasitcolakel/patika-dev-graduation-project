import {
    getContactsAction,
    removeContactAction,
} from '@features/contactsSlice';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@store/index';
import { randomColorFromID } from '@utils/ui';
import { MaterialIcons } from 'expo-vector-icons';
import {
    Avatar,
    Button,
    Center,
    FlatList,
    HStack,
    Icon,
    IconButton,
    Text,
} from 'native-base';
import React, { useEffect } from 'react';
import { Swipeable } from 'react-native-gesture-handler';

const ContactsList = () => {
    const navigation = useNavigation<any>();
    const contacts = useAppSelector((state) => state.contacts.data);
    const userContacts = useAppSelector((state) => state.auth.user?.contacts);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (userContacts?.length) {
            dispatch(getContactsAction(userContacts));
        }
    }, []);

    if (contacts.length === 0) {
        return (
            <Center flex="1" mx={2}>
                <Icon
                    as={MaterialIcons}
                    name="contacts"
                    size="140"
                    color="primary.500"
                />
                <Text textAlign="center" my={5} bold={false} fontSize="xl">
                    You don't have any contacts yet. Add some!
                </Text>
                <Button
                    colorScheme="primary"
                    onPress={() => navigation.navigate('AddContact')}
                >
                    Add a Contact
                </Button>
            </Center>
        );
    }

    return (
        <FlatList
            mt={2}
            flex={1}
            data={contacts}
            renderItem={({ item }) => (
                <Swipeable
                    renderRightActions={() => (
                        <IconButton
                            icon={<Icon as={MaterialIcons} name="delete" />}
                            _icon={{ color: 'white' }}
                            colorScheme="white"
                            mr={2}
                            bg="red.500"
                            onPress={() =>
                                dispatch(removeContactAction(item.id))
                            }
                        />
                    )}
                >
                    <HStack alignItems="center" w="full" px={2}>
                        <Avatar
                            bg={randomColorFromID(item.id) + '.500'}
                            mr="1"
                            source={{
                                uri: item.photoURL,
                            }}
                        >
                            {item.firstName[0] + item.lastName[0]}
                        </Avatar>
                        <Text flexGrow={1}>
                            {item.firstName} {item.lastName}
                        </Text>
                    </HStack>
                </Swipeable>
            )}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => (
                <HStack
                    w="full"
                    borderColor="gray.200"
                    borderBottomWidth={1}
                    h="0.5"
                    my="1"
                />
            )}
        />
    );
};

export default ContactsList;
