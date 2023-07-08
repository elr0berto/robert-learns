import prisma from "./db/prisma.js";
import {
    UserRole as PrismaUserRole,
    User as PrismaUser,
    CardSet as PrismaCardSet,
    Workspace as PrismaWorkspace,
    WorkspaceUser as PrismaWorkspaceUser,
    Card as PrismaCard,
    CardSetCard as PrismaCardSetCard,
} from "@prisma/client";
import {Capability, userCan} from "@elr0berto/robert-learns-shared/permissions";

interface CheckPermissionsParams {
    capability: Capability;
    userId?: number;
    user?: PrismaUser | null;
    workspaceId?: number;
    workspace?: PrismaWorkspace;
    userRole?: PrismaUserRole | null;
    cardSetId?: number;
    cardSet?: PrismaCardSet;
    workspaceUser?: PrismaWorkspaceUser;
    cardId?: number;
    card?: PrismaCard;
    cardSetCard?: PrismaCardSetCard;
}

export async function checkPermissions(params: CheckPermissionsParams): Promise<boolean> {
    let user: PrismaUser | null = null;
    let workspace: PrismaWorkspace | null = null;
    let userRole: PrismaUserRole | null = params.userRole ?? null;

    if (params.userId) {
        user = await prisma.user.findUnique({where: {id: params.userId}});
        if (!user) throw new Error("User not found");
    } else if (params.user) {
        user = params.user;
    }

    if (params.workspaceId) {
        workspace = await prisma.workspace.findUnique({where: {id: params.workspaceId}});
        if (!workspace) throw new Error("Workspace not found");
    } else if (params.workspace) {
        workspace = params.workspace;
    }

    if (!workspace && params.cardSetId) {
        const cardSet = await prisma.cardSet.findUnique({
            where: { id: params.cardSetId },
        });
        if (!cardSet) throw new Error("CardSet not found");
        workspace = await prisma.workspace.findUnique({ where: { id: cardSet.workspaceId }});
    } else if (!workspace && params.cardSet) {
        workspace = await prisma.workspace.findUnique({ where: { id: params.cardSet.workspaceId }});
    }

    if (!workspace && params.cardId) {
        const card = await prisma.card.findUnique({
            where: { id: params.cardId },
        });
        if (!card) throw new Error("Card not found. cardId: " + params.cardId + JSON.stringify(params));
        const cardSetCard = await prisma.cardSetCard.findFirst({ where: { cardId: card.id } });
        if (!cardSetCard) throw new Error("CardSetCard not found");
        const cardSet = await prisma.cardSet.findUnique({ where: { id: cardSetCard.cardSetId } });
        if (!cardSet) throw new Error("CardSet not found");
        workspace = await prisma.workspace.findUnique({ where: { id: cardSet.workspaceId }});
    } else if (!workspace && params.card) {
        const cardSetCard = await prisma.cardSetCard.findFirst({ where: { cardId: params.card.id } });
        if (!cardSetCard) throw new Error("CardSetCard not found");
        const cardSet = await prisma.cardSet.findUnique({ where: { id: cardSetCard.cardSetId } });
        if (!cardSet) throw new Error("CardSet not found");
        workspace = await prisma.workspace.findUnique({ where: { id: cardSet.workspaceId }});
    }

    if (!workspace && params.cardSetCard) {
        const cardSet = await prisma.cardSet.findUnique({ where: { id: params.cardSetCard.cardSetId } });
        if (!cardSet) throw new Error("CardSet not found");
        workspace = await prisma.workspace.findUnique({ where: { id: cardSet.workspaceId }});
    }

    if(!workspace) throw new Error("Workspace is required");

    if (!userRole && user) {
        let workspaceUser: PrismaWorkspaceUser | null = null;

        if(params.workspaceUser) {
            workspaceUser = params.workspaceUser;
        } else {
            workspaceUser = await prisma.workspaceUser.findFirst({
                where: {
                    userId: user.id,
                    workspaceId: workspace.id
                }
            });
        }

        userRole = workspaceUser?.role ?? null;
    }

    return userCan(user === null, workspace.allowGuests, userRole, params.capability);
}
