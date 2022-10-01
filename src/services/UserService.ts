// Import the functions you need from the SDKs you need
import {
    Contacts,
    LoginForm,
    RegisterForm,
    UserType,
} from '@src/types/UserTypes';
import {
    UserCredential,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
} from 'firebase/firestore';

import { auth, db } from './FirebaseService';

enum authErrors {
    'auth/email-already-in-use' = 'Email already in use',
    'auth/invalid-email' = 'Invalid email',
    'auth/operation-not-allowed' = 'Operation not allowed',
    'auth/weak-password' = 'Weak password',
    'auth/user-disabled' = 'User disabled',
    'auth/user-not-found' = 'User not found',
    'auth/wrong-password' = 'Wrong password',
}

export const login = async ({
    email,
    password,
}: LoginForm): Promise<UserCredential> => {
    try {
        console.log('user is being logged in');
        const response = await signInWithEmailAndPassword(
            auth,
            email,
            password,
        );
        console.log('user has been logged in');
        console.log(response);
        return response;
    } catch (error: any) {
        const code = error.code as keyof typeof authErrors;
        const message = authErrors[code] || error.message;
        throw new Error(message);
    }
};

export const register = async (
    values: RegisterForm,
): Promise<UserCredential> => {
    try {
        console.log('user is being registered');
        const response = await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password,
        );
        console.log('user is registered');

        console.log('user will be saved to firestore');
        await saveUserToFirestore(response, values);
        console.log('user saved to firestore');
        return response;
    } catch (error: any) {
        const code = error.code as keyof typeof authErrors;
        const message = authErrors[code] || error.message;
        throw new Error(message);
    }
};

export const logout = async () => {
    const response = await auth.signOut();
    return response;
};

export async function saveUserToFirestore(
    user: UserCredential,
    form: RegisterForm,
): Promise<void> {
    try {
        const userDoc = doc(db, 'users', user.user.uid);
        const docData = {
            id: user.user.uid,
            email: user.user.email,
            photoURL: user.user.photoURL || '',
            firstName: form.firstName,
            lastName: form.lastName,
        };
        const response = await setDoc(userDoc, docData);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getMyProfile(): Promise<UserType | undefined> {
    try {
        console.log('getting my profile');
        const user = auth.currentUser;
        if (user) {
            const userDoc = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userDoc);
            if (docSnap.exists()) {
                console.log('found my profile');
                const docData = docSnap.data();
                const userData: UserType = userDocToUserType(docData);
                return userData;
            }
        }
    } catch (error) {
        console.log('error getMyProfile', error);
    }
}

export const userDocToUserType = (doc: any): UserType => {
    console.log('converting user doc to user type', doc);
    const userData: UserType = {
        id: doc.id,
        email: doc.email,
        firstName: doc.firstName,
        lastName: doc.lastName,
        photoURL: doc.photoURL,
    };
    return userData;
};

export const getMyContacts = async (
    userContacts: string[],
): Promise<Contacts | undefined> => {
    try {
        const user = auth.currentUser;
        if (user) {
            const contactsQuery = collection(db, 'users', user.uid, 'contacts');

            const querySnapshot = await getDocs(contactsQuery);
            const userContacts: string[] = [];
            querySnapshot.forEach((doc) => {
                userContacts.push(doc.id);
            });
            console.log('userContacts', userContacts);

            const usersQuery = query(
                collection(db, 'users'),
                where('id', 'in', userContacts),
            );
            const usersQuerySnapshot = await getDocs(usersQuery);
            const contacts: Contacts = [];
            usersQuerySnapshot.forEach((doc) => {
                const contact = userDocToUserType(doc.data());
                if (contact?.contacts) {
                    delete contact.contacts;
                }
                contacts.push(contact);
            });
            console.log('contacts', contacts);
            return contacts;
        }
    } catch (error) {
        console.log(error);
    }
};

export const getAllUsers = async (
    userContacts?: string[],
): Promise<UserType[] | undefined> => {
    try {
        const user = auth.currentUser;
        if (user) {
            const usersRef = collection(db, 'users');

            const querySnapshot = await getDocs(
                userContacts && userContacts?.length > 0
                    ? query(
                          usersRef,
                          where('id', 'not-in', [user.uid, ...userContacts]),
                      )
                    : usersRef,
            );
            const users: UserType[] = [];

            querySnapshot.forEach((doc) => {
                const contact = userDocToUserType(doc.data());
                if (contact?.contacts) {
                    delete contact.contacts;
                }
                users.push(contact);
            });
            console.log('users', users);
            return users;
        }
    } catch (error) {
        console.log(error);
    }
};

export const getUserById = async (
    id: string,
): Promise<UserType | undefined> => {
    try {
        const userDoc = doc(db, 'users', id);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
            console.log('found user by id');
            const docData = docSnap.data();
            const userData: UserType = userDocToUserType(docData);
            if (userData?.contacts) {
                delete userData.contacts;
            }
            return userData;
        }
    } catch (error) {
        console.log('error getUserById', error);
    }
};
