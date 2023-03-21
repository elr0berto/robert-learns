import { Send } from 'express-serve-static-core';
import prisma from "./db/prisma.js";
import {Session, SessionData} from "express-session";
import {
    Card as PrismaCard,
    CardFace as PrismaCardFace,
    CardSet as PrismaCardSet,
    CardSide as PrismaCardSide,
    Media as PrismaMedia,
    User as PrismaUser,
    Workspace as PrismaWorkspace,
    WorkspaceUser as PrismaWorkspaceUser,
    UserRole as PrismaUserRole
} from '@prisma/client';
import {MediaData, UserData} from "@elr0berto/robert-learns-shared/api/models";
import {exec} from "child_process";
import {CardData, CardFaceData} from "@elr0berto/robert-learns-shared/api/models";
import { PermissionUser, UserRole } from '@elr0berto/robert-learns-shared/types';



export interface TypedResponse<ResBody> extends Express.Response {
    json: Send<ResBody, this>;
}

export const getGuestUser = async () : Promise<PrismaUser> => {
    let guestUser = await prisma.user.findFirst({
        where: {
            isGuest: true
        }
    });

    if (guestUser === null) {
        guestUser = await prisma.user.create({
            data: {
                firstName: 'Guest',
                lastName: '',
                username: 'guest',
                password: '25uihdsfoi2345esfdoij23t',
                email: 'guest@robert-learns.com',
                isGuest: true,
            }
        });
    }
    return guestUser;
}

export const getSignedInUser = async (session: Session & Partial<SessionData>) : Promise<PrismaUser> => {
    if (!session.userId) {
        const guestUser = await getGuestUser();

        session.userId = guestUser.id;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.userId!
        },
        include: {
            workspaces: {
                include: {
                    workspace: true
                }
            }
        }
    });

    if (user === null) {
        throw new Error("Could not find user!");
    }

    return user;
}


export const getUserData = (user: UserData) : UserData => {
    return {
        id: user.id,
        email: user.email,
        firstName : user.firstName,
        lastName:user.lastName,
        username: user.username,
        isGuest : user.isGuest,
        dataType: true, // to force the type ... too easy to send the Prisma user otherwise. the user class...
    };
}


export const getUrlFromMedia = (media: MediaData) : string => {
    return '/api/media/'+media.id+'/'+media.name;
}

export const awaitExec = (cmd: string) : Promise<void> => {
    return new Promise((done, failed) => {
        exec(cmd, (err) => {
            if (err) {
                failed(err)
                return;
            }

            done();
        });
    });
}

function getMediaData(media: PrismaMedia | null) : MediaData | null {
    if (media === null) {
        return null;
    }
    return {
        id: media.id,
        name: media.name,
    };
}

function getFaceData(face: PrismaCardFace) : CardFaceData {
    return {
        content: face.content,
        side: face.side
    };
}

export function getCardData(card: PrismaCard & {faces: PrismaCardFace[], audio: PrismaMedia | null}) : CardData {
    const front = card.faces.filter(f => f.side === PrismaCardSide.FRONT)[0];
    const back = card.faces.filter(f => f.side === PrismaCardSide.BACK)[0];
    return {
        id: card.id,
        front: getFaceData(front),
        back: getFaceData(back),
        audio: getMediaData(card.audio)
    };
}


export const deleteCardSetCard = async (cardSet: PrismaCardSet, card: PrismaCard) : Promise<void> => {
    await prisma.$transaction(async (tx) => {
        await tx.cardFace.deleteMany({
            where: {
                cardId: card.id
            }
        });
        await tx.cardSetCard.delete({
            where: {
                cardId_cardSetId: {
                    cardId: card.id,
                    cardSetId: cardSet.id
                }
            }
        });
        const cardSetCardsRemaining = await tx.cardSetCard.findMany({
            where: {
                cardId: card.id
            }
        });

        console.log('cardSetCardsRemaining: ', cardSetCardsRemaining);

        if (cardSetCardsRemaining.length === 0) {
            await tx.card.delete({
                where: {
                    id: card.id
                }
            });
        }

        // NOTE: Media will be deleted in a separate cronjob...
    })
}

export const canUserRemoveUser = (user1: PrismaWorkspaceUser & {user: PrismaUser} | null, user2: PrismaWorkspaceUser & {user: PrismaUser}) => {
    if (user1 === null) {
        return false;
    }

    if (user1.user.id === user2.user.id) {
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

export const getRolesUserCanChangeUser = (user1: PrismaWorkspaceUser & {user: PrismaUser} | null, user2: PrismaWorkspaceUser & {user: PrismaUser}) : UserRole[] => {
    if (user1 === null) {
        return [user2.role];
    }

    if (user1.user.id === user2.user.id) {
        return [user2.role];
    }

    switch(user1.role) {
        case UserRole.OWNER:
            return Object.values(UserRole);
        case UserRole.ADMINISTRATOR:
            return user2.role === UserRole.OWNER ? [user2.role] : Object.values(UserRole).filter(role => role !== UserRole.OWNER);
        default:
            return [user2.role];
    }
}

export const canUserChangeUserRole = (user1: PrismaWorkspaceUser & {user: PrismaUser} | null, user2: PrismaWorkspaceUser & {user: PrismaUser}) => {
    return getRolesUserCanChangeUser(user1, user2).length > 1;
}

export const canUserChangeUserRoleRole = (user1: PrismaWorkspaceUser & {user: PrismaUser} | null, user2: PrismaWorkspaceUser & {user: PrismaUser}, wantedRole: UserRole) => {
    const possibleRoles = getRolesUserCanChangeUser(user1, user2);
    return possibleRoles.filter(r => r === wantedRole).length > 0;
}

export const getPermissionUsersFromWorkspace = (workspace: PrismaWorkspace & { users : (PrismaWorkspaceUser & {user: PrismaUser})[]}, user: PrismaUser) : PermissionUser[] => {
    const workspaceUsers = workspace.users.filter(u => u.userId === user.id);
    const workspaceUser = workspaceUsers.length === 1 ? workspaceUsers[0] : null;

    return workspace.users.map(u => ({
        userId: u.userId,
        name: u.user.firstName + " " + u.user.lastName,
        email: u.user.email,
        role: u.role,
        isGuest: u.user.isGuest,
        canBeRemoved: canUserRemoveUser(workspaceUser, u),
        canRoleBeChanged: canUserChangeUserRole(workspaceUser, u),
        availableRoles: getRolesUserCanChangeUser(workspaceUser, u),
    }));
}

export const getUsersMyRoleForWorkspace = (workspace: PrismaWorkspace & { users : (PrismaWorkspaceUser & {user: PrismaUser})[]}, user: PrismaUser) : PrismaUserRole => {
    const workspaceUsers = workspace.users.filter(u => u.userId === user.id);
    const workspaceUser = workspaceUsers.length === 1 ? workspaceUsers[0] : null;

    if (workspaceUser === null) {
        throw new Error('user: ' + user.id + ' does not have a workspace-user in workspace: ' + workspace.id);
    }

    return workspaceUser.role;
}
