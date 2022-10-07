import { NavigatorScreenParams } from '@react-navigation/native';

import { Message } from './ChatTypes';
import { UserType } from './UserTypes';

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
};

export type AppStackParamList = {
    BottomTabs: BottomTabsParamList;
    ChatStack: NavigatorScreenParams<ChatScreenStackParamList>;
};

export type BottomTabsParamList = {
    Chats: undefined;
    ContactsStack: ContactsStackParamList;
    SettingsStack: NavigatorScreenParams<SettingsStackParamList>;
};

export type ContactsStackParamList = {
    Contacts: undefined;
    AddContact: undefined;
};

export type ChatScreenStackParamList = {
    ChatScreen: { user: UserType };
    MessageDetail: { message: Message; user: UserType };
};

export type SettingsStackParamList = {
    Settings: undefined;
    EditProfile: undefined;
    ChangePassword: undefined;
};
