import {
    addContactAction,
    filterContacts,
    removeContactAction,
    searchContactsAction,
} from '@features/contactsSlice';
import { useAppDispatch, useAppSelector } from '@store/index';
import { randomColorFromID } from '@utils/ui';
import { MaterialIcons } from 'expo-vector-icons';
import {
    Avatar,
    FlatList,
    HStack,
    Icon,
    IconButton,
    Input,
    Spinner,
    Text,
    VStack,
    View,
    useColorModeValue,
} from 'native-base';
import React, { useEffect } from 'react';

const AddContactList = () => {
    const dispatch = useAppDispatch();
    const contacts = useAppSelector(
        (state) => state.contacts.addContact.filteredData,
    );
    const filter = useAppSelector((state) => state.contacts.addContact.filter);
    useEffect(() => {
        dispatch(searchContactsAction());
    }, []);

    const onSearch = (search: string) => {
        dispatch(filterContacts(search));
    };

    const add = (id: string) => {
        dispatch(addContactAction(id));
    };

    const remove = (id: string) => {
        dispatch(removeContactAction(id));
    };

    const isDark = useColorModeValue(false, true);

    return (
        <View flex={1} mt={2}>
            <VStack w="100%" space={5} alignItems="center" mb="4" px={2}>
                <Input
                    placeholder="Search People"
                    width="100%"
                    borderRadius="4"
                    py="3"
                    px="1"
                    fontSize="14"
                    InputLeftElement={
                        <Icon
                            m="2"
                            ml="3"
                            size="6"
                            color="gray.400"
                            as={<MaterialIcons name="search" />}
                        />
                    }
                    onChangeText={onSearch}
                    value={filter}
                />
            </VStack>
            <FlatList
                flex={1}
                data={contacts}
                renderItem={({ item }) => (
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
                        <IconButton
                            icon={
                                item.loading ? (
                                    <Spinner color="primary.500" size="sm" />
                                ) : (
                                    <Icon
                                        name={item.isContact ? 'cancel' : 'add'}
                                        as={MaterialIcons}
                                        color={
                                            item.isContact
                                                ? 'red.500'
                                                : 'primary.500'
                                        }
                                    />
                                )
                            }
                            onPress={() =>
                                item.isContact ? remove(item.id) : add(item.id)
                            }
                            colorScheme={item.isContact ? 'red' : 'primary'}
                            size="lg"
                        />
                    </HStack>
                )}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => (
                    <HStack
                        w="full"
                        borderColor={isDark ? 'gray.700' : 'gray.200'}
                        borderBottomWidth={1}
                        h="0.5"
                        my="1"
                    />
                )}
            />
        </View>
    );
};

export default AddContactList;
