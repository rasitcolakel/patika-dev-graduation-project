import { MyStory, Story } from '@src/types/StoryTypes';
import { doc, setDoc } from 'firebase/firestore';

import { auth, db } from './FirebaseService';

export const shareStory = async (media: string) => {
    try {
        const user = auth.currentUser;

        if (user) {
            const story: Partial<MyStory> = {
                media,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                userId: user.uid,
            };
            await setDoc(doc(db, 'stories', user.uid), story);
        }
    } catch (error) {
        console.log('error', error);
    }
};
