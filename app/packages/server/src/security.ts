import prisma from "./db/prisma.js";
import {
    UserRole,
    User as PrismaUser,
    Card as PrismaCard,
    CardSetCard as PrismaCardSetCard,
    CardSet as PrismaCardSet,
    Workspace as PrismaWorkspace,
} from "@prisma/client";
import { getWorkspaceUser } from "./db/helpers/workspace-users.js";

export const canUserViewWorkspaceId = async (user: PrismaUser, workspaceId: number) : Promise<boolean> => {
    const workspace = await prisma.workspace.findFirst({
        where: {
            id: workspaceId
        }
    });
    if (workspace === null) {
        throw new Error('workspaceId: ' + workspaceId + ' not found in canUserContributeToWorkspaceId');
    }
    return await canUserViewWorkspace(user, workspace);
}

export const canUserViewWorkspace = async (user: PrismaUser, workspace: PrismaWorkspace) : Promise<boolean> => {
    const workspaceUser = await prisma.workspaceUser.findFirst({
        where: {
            workspaceId: workspace.id,
            userId: user.id
        }
    });

    return workspaceUser !== null;
}

export const canUserContributeToWorkspaceId = async (user: PrismaUser, workspaceId: number) : Promise<boolean> => {
    const workspace = await prisma.workspace.findFirst({
        where: {
            id: workspaceId
        }
    });
    if (workspace === null) {
        throw new Error('workspaceId: ' + workspaceId + ' not found in canUserContributeToWorkspaceId');
    }
    return await canUserContributeToWorkspace(user, workspace);
}

export const canUserContributeToWorkspace = async (user: PrismaUser, workspace: PrismaWorkspace) : Promise<boolean> => {
    const workspaceUser = await prisma.workspaceUser.findFirst({
        where: {
            workspaceId: workspace.id,
            userId: user.id,
            OR: [
                {role: UserRole.OWNER},
                {role: UserRole.ADMINISTRATOR},
                {role: UserRole.CONTRIBUTOR}
            ]
        }
    });

    return workspaceUser !== null;
}

export const canUserAdministerWorkspaceId = async (user: PrismaUser, workspaceId: number) : Promise<boolean> => {
    const workspace = await prisma.workspace.findFirst({
        where: {
            id: workspaceId
        }
    });
    if (workspace === null) {
        throw new Error('workspaceId: ' + workspaceId + ' not found in canUserAdministerWorkspaceId');
    }
    return await canUserAdministerWorkspace(user, workspace);
}



export const canUserAdministerWorkspace = async (user: PrismaUser, workspace: PrismaWorkspace) : Promise<boolean> => {
    const workspaceUser = await getWorkspaceUser(user, workspace);

    return workspaceUser?.role === UserRole.OWNER || workspaceUser?.role === UserRole.ADMINISTRATOR;
}

export const canUserDeleteCardsFromCardSet = async (user: PrismaUser, cardSet: PrismaCardSet & {workspace: PrismaWorkspace}) : Promise<boolean> => {
    return await canUserContributeToWorkspace(user, cardSet.workspace);
}

export const canUserDeleteCardsFromCardSetId = async (user: PrismaUser, cardSetId: number) : Promise<boolean> => {
    const cardSet = await prisma.cardSet.findFirst({
        where: { id: cardSetId },
        include: {
            workspace: true
        }
    });
    if (cardSet === null) {
        throw new Error('cardSetId: ' + cardSetId + ' not found!');
    }
    return await canUserDeleteCardsFromCardSet(user, cardSet);
}

export const canUserViewCardSet = async (user: PrismaUser, cardSet: PrismaCardSet & {workspace: PrismaWorkspace}) : Promise<boolean> => {
    return await canUserViewWorkspace(user, cardSet.workspace);
}

export const canUserViewCardSetId = async (user: PrismaUser, cardSetId: number) : Promise<boolean> => {
    const cardSet = await prisma.cardSet.findFirst({
        where: { id: cardSetId },
        include: {
            workspace: true
        }
    });
    if (cardSet === null) {
        throw new Error('cardSetId: ' + cardSetId + ' not found!');
    }
    return await canUserViewCardSet(user, cardSet);
}

export const canUserCreateCardsForCardSet = async (user: PrismaUser, cardSet: PrismaCardSet & {workspace: PrismaWorkspace}) : Promise<boolean> => {
    return await canUserContributeToWorkspace(user, cardSet.workspace);
}

export const canUserCreateCardsForCardSetId = async (user: PrismaUser, cardSetId: number) : Promise<boolean> => {
    const cardSet = await prisma.cardSet.findFirst({
        where: { id: cardSetId },
        include: {
            workspace: true
        }
    });
    if (cardSet === null) {
        throw new Error('cardSetId: ' + cardSetId + ' not found!');
    }
    return await canUserCreateCardsForCardSet(user, cardSet);
}

export const canUserEditCardId = async (user: PrismaUser, cardId: number) : Promise<boolean> => {
    const card = await prisma.card.findFirst({
        where: { id: cardId },
        include: {
            cardSetCards: {
                include: {
                    cardSet: true
                }
            }
        }
    });

    return await canUserEditCard(user, card!);
}

export const canUserEditCard = async (user: PrismaUser, card: PrismaCard & {cardSetCards: (PrismaCardSetCard & {cardSet: PrismaCardSet})[]}) : Promise<boolean> => {
    let canEdit = false;
    for (const cardSetCard of card.cardSetCards) {
        if (await canUserContributeToWorkspace(user, cardSetCard.cardSet)) {
            canEdit = true;
        }
    }
    return canEdit;
}