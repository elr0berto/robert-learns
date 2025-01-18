import {UserRole} from "./api/models/UserRole.js";

export enum Capability {
    CreateWorkspace = 'CreateWorkspace',
    EditWorkspace = 'EditWorkspace',
    ViewWorkspace = 'ViewWorkspace',
    DeleteWorkspace = 'DeleteWorkspace',
    AddUserToWorkspace = 'AddUserToWorkspace',
    CreateCardSet = 'CreateCardSet',
    EditCardSet = 'EditCardSet',
    ViewCardSet = 'ViewCardSet',
    DeleteCardSet = 'DeleteCardSet',
    CreateCard = 'CreateCard',
    EditCard = 'EditCard',
    DeleteCard = 'DeleteCard',
}

export const permissions = {
    [Capability.EditWorkspace]: [UserRole.OWNER, UserRole.ADMINISTRATOR],
    [Capability.ViewWorkspace]: [UserRole.OWNER, UserRole.ADMINISTRATOR, UserRole.CONTRIBUTOR, UserRole.USER],
    [Capability.DeleteWorkspace]: [UserRole.OWNER],
    [Capability.AddUserToWorkspace]: [UserRole.OWNER, UserRole.ADMINISTRATOR],
    [Capability.CreateCardSet]: [UserRole.OWNER, UserRole.ADMINISTRATOR, UserRole.CONTRIBUTOR],
    [Capability.EditCardSet]: [UserRole.OWNER, UserRole.ADMINISTRATOR, UserRole.CONTRIBUTOR],
    [Capability.ViewCardSet]: [UserRole.OWNER, UserRole.ADMINISTRATOR, UserRole.CONTRIBUTOR, UserRole.USER],
    [Capability.DeleteCardSet]: [UserRole.OWNER, UserRole.ADMINISTRATOR, UserRole.CONTRIBUTOR],
    [Capability.CreateCard]: [UserRole.OWNER, UserRole.ADMINISTRATOR, UserRole.CONTRIBUTOR],
    [Capability.EditCard]: [UserRole.OWNER, UserRole.ADMINISTRATOR, UserRole.CONTRIBUTOR],
    [Capability.DeleteCard]: [UserRole.OWNER, UserRole.ADMINISTRATOR, UserRole.CONTRIBUTOR],
}

export const guestCapabilities = [
    Capability.ViewWorkspace,
    Capability.ViewCardSet,
];

export const userCan = (userIsGuest: boolean, workspaceAllowsGuests: boolean, userRole: UserRole | null, capability: Capability, hasVerifiedEmail: boolean) => {
    if (capability === Capability.CreateWorkspace) {
        return !userIsGuest && hasVerifiedEmail;
    }

    if (workspaceAllowsGuests && guestCapabilities.includes(capability)) {
        return true;
    }

    if (userRole === null || !hasVerifiedEmail) {
        return false;
    }

    const roles = permissions[capability];
    return roles.includes(userRole);
}


export const canUserRemoveUser = (user1HasEmailVerified: boolean, user1: {user_id: number, role: UserRole} | null, user2: {user_id: number, role: UserRole}) => {
    if (user1 === null || !user1HasEmailVerified) {
        return false;
    }

    if (user1.user_id === user2.user_id) {
        return false;
    }

    switch(user1.role) {
        case UserRole.OWNER:
            return true;
        case UserRole.ADMINISTRATOR:
            return user2.role !== UserRole.OWNER;
        default:
            return false;
    }
}

export const getAllRoles = () => {
    return Object.values(UserRole);
}

export const getRolesUserCanChangeUser = (user1HasEmailVerified: boolean, user1: {userId: number, role: UserRole} | null, user2: {userId: number, role: UserRole}) : UserRole[] => {
    if (user1 === null || !user1HasEmailVerified) {
        return [user2.role];
    }

    if (user1.userId === user2.userId) {
        return [user2.role];
    }

    switch(user1.role) {
        case UserRole.OWNER:
            return getAllRoles();
        case UserRole.ADMINISTRATOR:
            return user2.role === UserRole.OWNER ? [user2.role] : Object.values(UserRole).filter(role => role !== UserRole.OWNER);
        default:
            return [user2.role];
    }
}

export const canUserChangeUserRole = (user1HasEmailVerified: boolean, user1: {userId: number, role: UserRole} | null, user2: {userId: number, role: UserRole}) => {
    return getRolesUserCanChangeUser(user1HasEmailVerified, user1, user2).length > 1;
}

export const canUserChangeUserRoleRole = (user1HasEmailVerified: boolean, user1: {userId: number, role: UserRole} | null, user2: {userId: number, role: UserRole}, wantedRole: UserRole) => {
    const possibleRoles = getRolesUserCanChangeUser(user1HasEmailVerified, user1, user2);
    return possibleRoles.filter(r => r === wantedRole).length > 0;
}

export const canUserDeleteWorkspaceUser = (user1HasEmailVerified: boolean, user1: {userId: number, role: UserRole} | null, user2: {userId: number, role: UserRole}) => {
    if (user1 === null || !user1HasEmailVerified) {
        return false;
    }

    if (user1.userId === user2.userId) {
        return false;
    }

    switch(user1.role) {
        case UserRole.OWNER:
            return true;
        case UserRole.ADMINISTRATOR:
            return user2.role !== UserRole.OWNER;
        default:
            return false;
    }
}