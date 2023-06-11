import {User as PrismaUser, Workspace as PrismaWorkspace, WorkspaceUser as PrismaWorkspaceUser} from "@prisma/client";
import prisma from "../prisma.js";

export const getWorkspaceUser = async (user: PrismaUser, workspace: PrismaWorkspace) : Promise<PrismaWorkspaceUser & {user : PrismaUser} | null> => {
    return await prisma.workspaceUser.findFirst({
        where: {
            workspaceId: workspace.id,
            userId: user.id,
        },
        include: {
            user: true
        }
    });
}