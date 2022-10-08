import { MyStory } from '@src/types/StoryTypes';
import { collection, doc, setDoc } from 'firebase/firestore';

import { auth, db } from './FirebaseService';

export const shareStory = async (media: string) => {
    try {
        const user = auth.currentUser;

        if (user) {
            const story: Partial<MyStory> = {
                id: user.uid + Date.now(),
                media,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                userId: user.uid,
            };
            const storiesRef = collection(db, 'stories');

            await setDoc(doc(storiesRef, story.id), story);
        }
    } catch (error) {
        console.log('error', error);
    }
};
