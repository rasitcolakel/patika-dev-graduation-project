import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import CustomFormControl from '@src/components/CustomFormControl';
import { updateMyProfile } from '@src/features/authSlice';
import { useAppDispatch, useAppSelector } from '@src/store';
import {
    AppStackParamList,
    SettingsStackParamList,
} from '@src/types/NavigationTypes';
import { EditProfileForm } from '@src/types/UserTypes';
import { manipulateAsync } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from 'expo-vector-icons';
import {
    Avatar,
    Button,
    Icon,
    IconButton,
    Input,
    KeyboardAvoidingView,
    Spinner,
    View,
} from 'native-base';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

type Props = CompositeScreenProps<
    StackScreenProps<SettingsStackParamList, 'EditProfile'>,
    StackScreenProps<AppStackParamList, 'BottomTabs'>
>;

const EditProfile = ({ navigation }: Props) => {
    const user = useAppSelector((state) => state.auth.user);
    const loading = useAppSelector((state) => state.auth.loading);
    const {
        handleSubmit,
        watch,
        control,
        setValue,
        formState: { errors },
    } = useForm<EditProfileForm>({
        defaultValues: {
            firstName: user?.firstName,
            lastName: user?.lastName,
            photoURL: user?.photoURL,
        },
    });
    const dispatch = useAppDispatch();

    const onShareImage = async () => {
        let imageUri = '';
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 0.4,
            allowsEditing: true,
        });

        if (!result.cancelled) {
            if (result.fileSize && result.fileSize > 100000) {
                const resizedImage = await manipulateAsync(
                    result.uri,
                    [
                        {
                            resize: {
                                width: result.width / 3,
                                height: result.height / 3,
                            },
                        },
                    ],
                    { compress: 0.5 },
                );
                imageUri = resizedImage.uri;
            } else {
                imageUri = result.uri;
            }

            setValue('photoURL', imageUri);
        }
    };

    const onSubmit = async (data: EditProfileForm) => {
        await dispatch(updateMyProfile(data));
        navigation.goBack();
    };
    console.log('values', watch());
    return (
        <ScrollView
            contentContainerStyle={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                flex={1}
            >
                <View flex={1} mx="3" alignItems="center">
                    <View>
                        <Avatar source={{ uri: watch('photoURL') }} size="xl">
                            {watch('firstName')[0] + ' ' + watch('lastName')[0]}
                        </Avatar>
                        <IconButton
                            bg="primary.500"
                            borderRadius="full"
                            position="absolute"
                            bottom={0}
                            right={0}
                            _icon={{
                                as: AntDesign,
                                name: 'camera',
                                color: 'white',
                                size: 'sm',
                            }}
                            onPress={onShareImage}
                        />
                    </View>

                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomFormControl
                                error={errors.firstName}
                                label="First Name"
                            >
                                <Input
                                    placeholder="First Name"
                                    my={2}
                                    size="lg"
                                    InputLeftElement={
                                        <Icon
                                            as={<AntDesign name="idcard" />}
                                            size={5}
                                            ml="2"
                                            color="muted.400"
                                        />
                                    }
                                    onBlur={onBlur}
                                    onChangeText={(value) => onChange(value)}
                                    value={value}
                                />
                            </CustomFormControl>
                        )}
                        name="firstName"
                        rules={{
                            required: {
                                value: true,
                                message: 'First Name is required',
                            },
                        }}
                    />

                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomFormControl
                                error={errors.lastName}
                                label="Last Name"
                            >
                                <Input
                                    placeholder="Last Name"
                                    my={2}
                                    size="lg"
                                    InputLeftElement={
                                        <Icon
                                            as={<AntDesign name="idcard" />}
                                            size={5}
                                            ml="2"
                                            color="muted.400"
                                        />
                                    }
                                    onBlur={onBlur}
                                    onChangeText={(value) => onChange(value)}
                                    value={value}
                                />
                            </CustomFormControl>
                        )}
                        name="lastName"
                        rules={{
                            required: {
                                value: true,
                                message: 'Last Name is required',
                            },
                        }}
                    />
                    <Button
                        onPress={handleSubmit(onSubmit)}
                        my={4}
                        colorScheme="primary"
                        size="lg"
                        width="100%"
                        rightIcon={loading ? <Spinner size="sm" /> : <></>}
                    >
                        Save
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

export default EditProfile;
