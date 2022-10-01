export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
};

export type AppStackParamList = {
    BottomTabs: BottomTabsParamList;
    ChatScreen: undefined;
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
