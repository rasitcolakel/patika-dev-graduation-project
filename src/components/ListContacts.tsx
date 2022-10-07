import { filterContactsData, getContactsAction } from '@features/contactsSlice';
import { UserType } from '@src/types/UserTypes';
import { useAppDispatch, useAppSelector } from '@store/index';
import { randomColorFromID } from '@utils/ui';
import { MaterialIcons } from 'expo-vector-icons';
import _ from 'lodash';
import {
    Avatar,
    HStack,
    Heading,
    Icon,
    Input,
    Pressable,
    SectionList,
    Text,
    VStack,
    View,
    useColorModeValue,
} from 'native-base';
import React, { useEffect } from 'react';

type Props = {
    goToChat: (user: UserType) => void;
};

const ListContacts = ({ goToChat }: Props) => {
    const filteredContacts = useAppSelector(
        (state) => state.contacts.filteredData,
    );
    const userContacts = useAppSelector((state) => state.auth.user?.contacts);
    const dispatch = useAppDispatch();
    const filter = useAppSelector((state) => state.contacts.filter);

    useEffect(() => {
        if (userContacts?.length) {
            dispatch(getContactsAction(userContacts));
        }
    }, []);

    const onSearch = (search: string) => {
        dispatch(filterContactsData(search));
    };
    const groupedContacts = _.sortBy(
        _.map(
            _.groupBy(filteredContacts, (contact) =>
                contact.firstName.charAt(0).toUpperCase(),
            ),
            (value, key) => ({ title: key, data: value }),
        ),
        'title',
    );

    console.log('groupedContacts', groupedContacts);

    const isDark = useColorModeValue(false, true);

    return (
        <View flex={1} mt={2}>
            <VStack w="100%" space={5} alignItems="center" mb="2" px={2}>
                <Input
                    placeholder="Search"
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
            <SectionList
                flex={1}
                sections={groupedContacts}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item }) => (
                    <Pressable onPress={() => goToChat(item)}>
                        <HStack alignItems="center" w="full" px={2} py={1}>
                            <Avatar
                                bg={randomColorFromID(item.id) + '.500'}
                                mr="1"
                                source={{
                                    uri: item.photoURL,
                                }}
                                size={10}
                            >
                                {item.firstName[0] + item.lastName[0]}
                            </Avatar>
                            <Text flexGrow={1}>
                                {item.firstName} {item.lastName}
                            </Text>
                        </HStack>
                    </Pressable>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View>
                        <Heading fontSize="xl" p={2}>
                            {title}
                        </Heading>
                        <HStack
                            w="full"
                            borderColor={isDark ? 'gray.700' : 'gray.200'}
                            borderBottomWidth={1}
                            h="0.5"
                            my="1"
                        />
                    </View>
                )}
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

export default ListContacts;
