export type LoginForm = {
    email: string;
    password: string;
};

export type RegisterForm = {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
};

export type AuthState = {
    user: undefined | UserType;
    loading: boolean;
};

export type UserType = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    photoURL: string;
    contacts?: string[];
};

export type Contacts = UserType[];

export type FilteredContact = UserType & {
    isContact: boolean;
    loading: boolean;
};

export type ContactsState = {
    data: Contacts;
    filteredData: Contacts;
    loading: boolean;
    filter: string;
    addContact: {
        loading: boolean;
        data: Contacts;
        filter: string;
        filteredData: FilteredContact[];
    };
};

export type SwipeableState = {
    isOpen: boolean;
    children: React.ReactNode | null;
};

export type EditProfileForm = {
    photoURL: string;
    firstName: string;
    lastName: string;
};
