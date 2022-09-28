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
    user: null | UserType;
};

export type UserType =
    | {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          photoURL: string;
          contacts?: string[];
      }
    | undefined;

export type Contacts = UserType[];

export type ContactsState = {
    data: Contacts;
    loading: boolean;
};
