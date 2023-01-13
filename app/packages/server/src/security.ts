import prisma from "./db/prisma.js";
import {UserRole, User as PrismaUser, CardSet as PrismaCardSet, Workspace as PrismaWorkspace} from "@prisma/client";

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