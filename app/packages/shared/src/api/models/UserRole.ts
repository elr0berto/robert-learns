export const UserRole: { [x: string]: 'OWNER' | 'ADMINISTRATOR' | 'CONTRIBUTOR' | 'USER'} = {
    OWNER: 'OWNER',
    ADMINISTRATOR: 'ADMINISTRATOR',
    CONTRIBUTOR: 'CONTRIBUTOR',
    USER: 'USER'
}

export type UserRole = typeof UserRole[keyof typeof UserRole];