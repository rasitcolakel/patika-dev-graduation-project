import CustomFormControl from '@components/CustomFormControl';
import { registerAction } from '@features/authSlice';
import { RegisterForm } from '@src/types/UserTypes';
import { useAppDispatch } from '@store/index';
import { AntDesign, MaterialIcons } from 'expo-vector-icons';
import {
    Button,
    Center,
    Heading,
    Icon,
    Input,
    KeyboardAvoidingView,
    ScrollView,
} from 'native-base';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform } from 'react-native';

const Register = () => {
    const {
        handleSubmit,
        control,
        getValues,
        formState: { errors },
    } = useForm<RegisterForm>();
    const dispatch = useAppDispatch();

    const onSubmit = (data: RegisterForm) => {
        dispatch(registerAction(data));
    };

    return (
        <ScrollView
            contentContainerStyle={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                flex={1}
            >
                <Center flex={1} mx="3">
                    <Heading color="primary.500" my="4">
                        Welcome to MessApp
                    </Heading>

                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomFormControl
                                error={errors.email}
                                label="Email"
                            >
                                <Input
                                    placeholder="Email"
                                    my={2}
                                    size="lg"
                                    InputLeftElement={
                                        <Icon
                                            as={<MaterialIcons name="person" />}
                                            size={5}
                                            ml="2"
                                            color="muted.400"
                                        />
                                    }
                                    onBlur={onBlur}
                                    onChangeText={(value) => onChange(value)}
                                    value={value}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </CustomFormControl>
                        )}
                        name="email"
                        rules={{
                            required: {
                                value: true,
                                message: 'Email is required',
                            },
                        }}
                    />

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
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomFormControl
                                error={errors.password}
                                label="Password"
                            >
                                <Input
                                    placeholder="Password"
                                    my={2}
                                    size="lg"
                                    onBlur={onBlur}
                                    onChangeText={(value) => onChange(value)}
                                    value={value}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    type="password"
                                    InputLeftElement={
                                        <Icon
                                            as={
                                                <MaterialIcons name="vpn-key" />
                                            }
                                            size={5}
                                            ml="2"
                                            color="muted.400"
                                        />
                                    }
                                />
                            </CustomFormControl>
                        )}
                        name="password"
                        rules={{
                            required: {
                                value: true,
                                message: 'Password is required',
                            },
                            minLength: {
                                value: 6,
                                message:
                                    'Password must be at least 6 characters',
                            },
                        }}
                    />

                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <CustomFormControl
                                error={errors.confirmPassword}
                                label="Confirm Password"
                            >
                                <Input
                                    placeholder="Confirm Password"
                                    my={2}
                                    size="lg"
                                    onBlur={onBlur}
                                    onChangeText={(value) => onChange(value)}
                                    value={value}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    type="password"
                                    InputLeftElement={
                                        <Icon
                                            as={
                                                <MaterialIcons name="vpn-key" />
                                            }
                                            size={5}
                                            ml="2"
                                            color="muted.400"
                                        />
                                    }
                                />
                            </CustomFormControl>
                        )}
                        name="confirmPassword"
                        rules={{
                            required: {
                                value: true,
                                message: 'Password is required',
                            },
                            minLength: {
                                value: 6,
                                message:
                                    'Password must be at least 6 characters',
                            },
                            validate: (value) =>
                                value === getValues('password') ||
                                'The passwords do not match',
                        }}
                    />
                    <Button
                        onPress={handleSubmit(onSubmit)}
                        w="full"
                        size="lg"
                        my="2"
                    >
                        Register
                    </Button>
                </Center>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

export default Register;
