import CustomFormControl from '@components/CustomFormControl';
import { loginAction } from '@features/authSlice';
import { StackScreenProps } from '@react-navigation/stack';
import { useAppDispatch } from '@store/index';
import { MaterialIcons } from 'expo-vector-icons';
import {
    Button,
    Center,
    Heading,
    Icon,
    Input,
    KeyboardAvoidingView,
    ScrollView,
    useColorMode,
} from 'native-base';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform } from 'react-native';
import { AuthStackParamList } from 'src/types/NavigationTypes';
import { LoginForm } from 'src/types/UserTypes';

type Props = StackScreenProps<AuthStackParamList, 'Login'>;

const Login = ({ navigation }: Props) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<LoginForm>();
    const dispatch = useAppDispatch();

    const onSubmit = (data: LoginForm) => {
        dispatch(loginAction(data));
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
                            <CustomFormControl error={errors.email}>
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
                            <CustomFormControl error={errors.password}>
                                <Input
                                    placeholder="Password"
                                    my={2}
                                    size="lg"
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
                                    onBlur={onBlur}
                                    onChangeText={(value) => onChange(value)}
                                    value={value}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    type="password"
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
                        defaultValue=""
                    />

                    <Button
                        onPress={handleSubmit(onSubmit)}
                        w="full"
                        size="lg"
                        my="2"
                    >
                        Login
                    </Button>

                    <Button
                        onPress={() => navigation.navigate('Register')}
                        w="full"
                        size="lg"
                        my="2"
                        variant="ghost"
                    >
                        Don't have an account? Register
                    </Button>
                </Center>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

export default Login;
