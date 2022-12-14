import { AntDesign } from '@expo/vector-icons';
import { clearToast } from '@src/features/uiSlice';
import { useAppDispatch, useAppSelector } from '@store/index';
import { Box, Text, View, useToast } from 'native-base';
import React, { useEffect } from 'react';

const CustomToast = () => {
    const toast = useToast();
    const toastState = useAppSelector((state) => state.ui.toast);
    const dispatch = useAppDispatch();
    const variantColors = {
        success: 'green.500',
        error: 'red.500',
        warning: 'yellow.500',
        info: 'blue.500',
    };
    useEffect(() => {
        if (!toastState) return;
        toast.closeAll();
        toast.show({
            render: () => {
                return (
                    <Box
                        bg={
                            toastState.variant
                                ? variantColors[toastState.variant]
                                : 'emerald.500'
                        }
                        px="2"
                        py="1"
                        rounded="sm"
                        alignItems="center"
                        flexDirection="row"
                        minW="80%"
                    >
                        <AntDesign
                            name={
                                toastState.variant === 'success'
                                    ? 'checkcircle'
                                    : ['warning', 'error'].includes(
                                          toastState?.variant || '',
                                      )
                                    ? 'warning'
                                    : 'infocirlce'
                            }
                            size={30}
                            color="white"
                        />
                        <View mx={4} py={2}>
                            <Text color="white" fontSize="md">
                                {toastState?.title || 'Success'}
                            </Text>
                            {toastState?.message && (
                                <Text color="white">{toastState.message}</Text>
                            )}
                        </View>
                    </Box>
                );
            },
        });
    }, [toastState]);

    // clear toast state
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(clearToast());
        }, 3000);
        return () => clearTimeout(timer);
    }, [toastState]);

    return <></>;
};

export default CustomToast;
