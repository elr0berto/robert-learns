import prisma from "./db/prisma.js";
import {UserRole, User as PrismaUser, CardSet as PrismaCardSet, Workspace as PrismaWorkspace} from "@prisma/client";
import { getWorkspaceUser } from "./db/helpers/workspace-users.js";

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