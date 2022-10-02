import { UserType } from './UserTypes';

export type ChatsState = {
    data: Chat[];
    loading: boolean;
    currentChat: CurrentChat | undefined;
    chatMessages: ChatMessages[] | undefined;
};

export type ChatMessages = {
    chatId: string;
    messages: Message[];
};

export type CurrentChat = {
    id: string;
    members: UserType[] | undefined;
    messages: Message[] | undefined;
};

export type Chat = {
    id: string;
    type: ChatType;
    members: UserType[];
    messages: Message[];
    doesConversationStarted: boolean;
    lastMessage: Message | undefined;
};

export enum ChatType {
    ONE_TO_ONE = 'oneToOne',
    GROUP = 'group',
}
export type Message = {
    id: string;
    content: ContentType;
    senderId: string;
    type: MessageType;
    createdAt: number;
};

export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    LOCATION = 'location',
}

export type ContentType = TextContent | ImageContent | LocationContent;

export type TextContent = {
    text: string;
};

export type ImageContent = {
    uri: string;
};

export type LocationContent = {
    latitude: number;
    longitude: number;
};
