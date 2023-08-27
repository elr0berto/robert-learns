export const UserRole: { [x: string]: 'OWNER' | 'ADMINISTRATOR' | 'CONTRIBUTOR' | 'USER'} = {
    OWNER: 'OWNER',
    ADMINISTRATOR: 'ADMINISTRATOR',
    CONTRIBUTOR: 'CONTRIBUTOR',
    USER: 'USER'
}

export const UserRolesInOrder = Object.values(UserRole);


export type UserRole = typeof UserRole[keyof typeof UserRole];