import { UserType } from './UserTypes';

export type StoriesState = {
    data: Story[];
    mine: MyStory[];
    loading: boolean;
};

export type Story = {
    id: string;
    userId: string;
    user: UserType;
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
