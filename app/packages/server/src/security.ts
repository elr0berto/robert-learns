import prisma from "./db/prisma.js";
import {UserRole, User as PrismaUser, CardSet as PrismaCardSet, Workspace as PrismaWorkspace} from "@prisma/client";

export const canUserWriteToWorkspaceId = async (user: PrismaUser, workspaceId: number) : Promise<boolean> => {
    const workspace = await prisma.workspace.findFirst({
        where: {
            id: workspaceId
        }
    });
    if (workspace === null) {
        throw new Error('workspaceId: ' + workspaceId + ' not found in canUserWriteToWorkspaceId');
    }
    return await canUserWriteToWorkspace(user, workspace);
}

export const canUserWriteToWorkspace = async (user: PrismaUser, workspace: PrismaWorkspace) : Promise<boolean> => {
    const workspaceUser = await prisma.workspaceUser.findFirst({
        where: {
            workspaceId: workspace.id,
            userId: user.id,
            OR: [
                {role: UserRole.OWNER},
                {role: UserRole.CONTRIBUTOR}
            ]
        }
    });

    return workspaceUser !== null;
}

export const canUserDeleteCardsFromCardSet = async (user: PrismaUser, cardSet: PrismaCardSet & {workspace: PrismaWorkspace}) : Promise<boolean> => {
    return await canUserWriteToWorkspace(user, cardSet.workspace);
}