import { Chat, ChatType, Message, MessageType } from '@src/types/ChatTypes';
import {
    Timestamp,
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import _ from 'lodash';

import { auth, db } from './FirebaseService';

export const createChat = async (userId: string) => {
    try {
        const user = auth.currentUser;
        if (user) {
            const id = _.sortBy([user.uid, userId]).join('_');
            const chatToAdd = {
                id,
                members: _.sortBy([user.uid, userId]),
                type: ChatType.ONE_TO_ONE,
                doesConversationStarted: false,
                lastMessage: null,
                createdAt: Date.now(),
            };
            const chatsRef = collection(db, 'chats');
            await setDoc(doc(chatsRef, id), chatToAdd);
            return id;
        }
    } catch (error) {
        console.log('error', error);
    }
};

export const getChats = async () => {
    try {
        const user = auth.currentUser;
        console.log('user', user);
        if (user) {
            // get nested collection firebase
            const chatsRef = collection(db, 'chats');

            const q = query(
                chatsRef,
                where('members', 'array-contains', user.uid),
                where('doesConversationStarted', '==', true),
            );
            const querySnapshot = await getDocs(q);
            const chats: Chat[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                chats.push(data as Chat);
            });
            return chats;
        }
    } catch (error) {
        console.log('error', error);
    }
};

export const sendMessage = async (chatId: string, message: string) => {
    try {
        const user = auth.currentUser;
        if (user) {
            const messageToAdd: Message = {
                id: user.uid + Date.now().toString(),
                type: MessageType.TEXT,
                senderId: user.uid,
                createdAt: Date.now(),
                content: {
                    text: message,
                },
            };
            await setLastMessage(chatId, messageToAdd);
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            await setDoc(doc(messagesRef, messageToAdd.id), messageToAdd);
        }
    } catch (error) {
        console.log('error', error);
    }
};

export const setLastMessage = async (chatId: string, message: Message) => {
    try {
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {
            lastMessage: message,
            doesConversationStarted: true,
        });
    } catch (error) {
        console.log('error', error);
    }
};
