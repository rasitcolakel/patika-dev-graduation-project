// Import the functions you need from the SDKs you need
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
import {
    Contacts,
    LoginForm,
    RegisterForm,
    UserType,
} from 'src/types/UserTypes';

import { auth, db } from './FirebaseService';

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
    } catch (error) {
        console.log('user could not be logged in', error);
        throw error;
    }
};

export const register = async (
    values: RegisterForm,
): Promise<UserCredential> => {
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

export async function getMyProfile(): Promise<UserType> {
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
        console.log(error);
    }
}

export const userDocToUserType = (doc: any): UserType => {
    const userData: UserType = {
        id: doc.id,
        email: doc.email,
        firstName: doc.firstName,
        lastName: doc.lastName,
        photoURL: doc.photoURL,
        contacts: doc.contacts || [],
    };
    return userData;
};

export const getMyContacts = async (): Promise<Contacts> => {
    const user = await getMyProfile();
    if (user) {
        const usersRef = collection(db, 'users');
        const contactsQuery = query(usersRef, where('id', 'in', user.contacts));
        const querySnapshot = await getDocs(contactsQuery);
        const contacts: Contacts = [];

        querySnapshot.forEach((doc) => {
            const contact = userDocToUserType(doc.data());
            if (contact?.contacts) {
                delete contact.contacts;
            }
            contacts.push(contact);
        });
        console.log('contacts', contacts);
        return contacts;
    } else {
        return [];
    }
};
