import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

export const useIsOnline = () => {
    const appState = useRef(AppState.currentState);
    const [isOnline, setIsOnline] = useState(appState.current);

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextAppState) => {
                appState.current = nextAppState;
                setIsOnline(appState.current);
            },
        );

        return () => {
            subscription.remove();
        };
    }, []);
    return isOnline;
};
