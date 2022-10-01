import { UserType } from './UserTypes';

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
};

export type AppStackParamList = {
    BottomTabs: BottomTabsParamList;
    ChatScreen: { user: UserType };
};

export type BottomTabsParamList = {
    Chats: undefined;
    ContactsStack: ContactsStackParamList;
    Settings: undefined;
};

export type ContactsStackParamList = {
    Contacts: undefined;
    AddContact: undefined;
};
