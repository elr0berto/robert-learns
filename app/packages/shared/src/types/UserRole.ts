export const UserRole = {
    OWNER: 'OWNER',
    ADMINISTRATOR: 'ADMINISTRATOR',
    CONTRIBUTOR: 'CONTRIBUTOR',
    USER: 'USER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole];