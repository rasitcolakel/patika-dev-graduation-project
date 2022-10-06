import {
    Chat,
    ChatType,
    ContentType,
    Message,
    MessageType,
} from '@src/types/ChatTypes';
import {
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
            querySnapshot.forEach(async (doc) => {
                const data = doc.data() as Chat;
                data.unSeenMessagesCount =
                    (await getunSeenMessagesCount(data.id)) || 0;
                chats.push(data);
            });
            return chats;
        }
    } catch (error) {
        console.log('error', error);
    }
};

export const sendMessage = async (
    chatId: string,
    message: ContentType,
    type: MessageType = MessageType.TEXT,
) => {
    try {
        const user = auth.currentUser;
        if (user) {
            const messageToAdd: Message = {
                id: user.uid + Date.now().toString(),
                type,
                senderId: user.uid,
                createdAt: Date.now(),
                content: message,
                isSeen: false,
            };

            const messagesRef = collection(db, 'chats', chatId, 'messages');
            await setDoc(doc(messagesRef, messageToAdd.id), messageToAdd);
            await setLastMessage(chatId, messageToAdd);
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

export const readMessages = async (chatId: string) => {
    try {
        console.log('readMessages', chatId);
        const user = auth.currentUser;
        if (user) {
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            const q = query(
                messagesRef,
                where('senderId', '!=', user.uid),
                where('isSeen', '==', false),
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (message) => {
                console.log('messagequerySnapshot', message);
                const data = message.data();
                const messageRef = doc(messagesRef, data.id);
                await updateDoc(messageRef, {
                    isSeen: true,
                });
            });
            console.log('readMessages querySnapshot.size', querySnapshot.size);
            if (querySnapshot.size > 0) {
                const chatRef = doc(db, 'chats', chatId);
                await updateDoc(chatRef, {
                    updatedAt: Date.now(),
                });
            }
        }
    } catch (error) {
        console.log('error', error);
    }
};

export const getunSeenMessagesCount = async (chatId: string) => {
    try {
        const user = auth.currentUser;
        if (user) {
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            const q = query(
                messagesRef,
                where('senderId', '!=', user.uid),
                where('isSeen', '==', false),
            );
            const querySnapshot = await getDocs(q);
            console.log('querySnapshot.size', querySnapshot.size);
            return querySnapshot.size;
        }
    } catch (error) {
        console.log('error', error);
    }
};
