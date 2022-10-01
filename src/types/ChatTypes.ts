export type ChatsState = {
    data: Chat[];
    loading: boolean;
    currentChat: string | undefined;
};

export type Chat = {
    id: string;
    type: ChatType;
    members: string[];
    messages: Message[];
    doesConversationStarted: boolean;
};

export enum ChatType {
    ONE_TO_ONE = 'oneToOne',
    GROUP = 'group',
}
export type Message = {
    id: string;
    content: TextContent | ImageContent | LocationContent;
    senderId: string;
    type: MessageType;
    createdAt: string;
};

export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    LOCATION = 'location',
}

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
