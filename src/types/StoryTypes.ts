import { UserType } from './UserTypes';

export type StoriesState = {
    data: ContactStory[];
    mine: MyStory[];
    loading: boolean;
    storyModal: boolean;
    playStories: PlayStories;
};

export type PlayStories = {
    visible: boolean;
    index: number;
    storyIndex: number;
    type: 'mine' | 'contact';
};

export type ContactStory = {
    user: UserType;
    stories: Story[];
};

export type Story = {
    id: string;
    userId: string;
    media: string;
    createdAt: number;
    seen: boolean;
};

export type MyStory = {
    id: string;
    media: string;
    createdAt: number;
    updatedAt: number;
    seenBy: UserType[];
    userId?: string;
};
