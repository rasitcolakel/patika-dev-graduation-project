// This service is used to manage contacts from the Firebase
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore';

import { auth, db } from './FirebaseService';

export const saveContactToFirebase = async (id: string) => {
    try {
        const user = auth.currentUser;
        if (user) {
            const contactToAdd = {
                id,
                createdAt: new Date(),
            };
            const contactsRef = collection(db, 'users', user.uid, 'contacts');
            await setDoc(doc(contactsRef, id), contactToAdd);
        }
    } catch (error) {
        console.log('error', error);
    }
};

export const removeContactFromFirebase = async (id: string) => {
    try {
        const user = auth.currentUser;
        if (user) {
            const contactsRef = collection(db, 'users', user.uid, 'contacts');
            await deleteDoc(doc(contactsRef, id));
        }
    } catch (error) {
        console.log('error', error);
    }
};
