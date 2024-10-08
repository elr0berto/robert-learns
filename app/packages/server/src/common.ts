import { Send } from 'express-serve-static-core';
import prisma from "./db/prisma.js";
import { format } from 'date-fns';
import {Session, SessionData} from "express-session";
import {
    Card as PrismaCard,
    CardFace as PrismaCardFace,
    CardSet as PrismaCardSet,
    CardSetCard as PrismaCardSetCard,
    CardSetLink as PrismaCardSetLink,
    CardSide as PrismaCardSide,
    Media as PrismaMedia,
    User as PrismaUser,
    Workspace as PrismaWorkspace,
    WorkspaceUser as PrismaWorkspaceUser,
    Logs as PrismaLogs,
    Drill as PrismaDrill,
    DrillRun as PrismaDrillRun,
    DrillCardSet as PrismaDrillCardSet,
    DrillRunQuestion as PrismaDrillRunQuestion,
} from '@prisma/client';
import {
    CardSetCardData, CardSetData,
    CardData, CardFaceData,
    LogEntryData,
    MediaData,
    UserData,
    WorkspaceData, WorkspaceUserData,
    DrillData, DrillCardSetData, DrillRunData, DrillRunQuestionData, CardSetLinkData
} from "@elr0berto/robert-learns-shared/api/models";
import {exec} from "child_process";

export interface TypedResponse<ResBody> extends Express.Response {
    json: Send<ResBody, this>;
}

export const getSignedInUser = async (session: Session & Partial<SessionData>) : Promise<PrismaUser | null> => {
    if (!session.userId) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.userId
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


export const getUserData = (user: PrismaUser) : UserData => {
    return {
        id: user.id,
        email: user.email,
        firstName : user.firstName,
        lastName: user.lastName,
        username: user.username,
        admin: user.admin,
        dataType: true,
    };
}

export const getLogEntryData = (logEntry: PrismaLogs) : LogEntryData => {
    return {
        id: logEntry.id,
        message: logEntry.message,
        timestamp: format(logEntry.timestamp, 'yyyy-MM-dd HH:mm:ss'),
        level: logEntry.level,
        meta: logEntry.meta ? JSON.stringify(logEntry.meta) : null,
        dataType: true,
    };
}

export const getUrlFromMediaData = (media: MediaData) : string => {
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

export const getMediaData = (media: PrismaMedia) : MediaData => {
    return {
        dataType: true,
        id: media.id,
        name: media.name,
    };
}

function getFaceData(face: PrismaCardFace) : CardFaceData {
    return {
        dataType: true,
        content: face.content,
        side: face.side
    };
}

export function getCardData(card: PrismaCard & {faces: PrismaCardFace[], audio: PrismaMedia | null}) : CardData {
    const front = card.faces.filter(f => f.side === PrismaCardSide.FRONT)[0];
    const back = card.faces.filter(f => f.side === PrismaCardSide.BACK)[0];
    return {
        dataType: true,
        id: card.id,
        front: getFaceData(front),
        back: getFaceData(back),
        audioData: card.audio === null ? null : getMediaData(card.audio),
    };
}


export const deleteCardSetCardAndCardIfNeeded = async (card: PrismaCard, allCardSets: boolean, cardSetId?: number) : Promise<void> => {
    await prisma.$transaction(async (tx) => {

        if (allCardSets) {
            // remove the card from all card sets
            await tx.cardSetCard.deleteMany({
                where: {
                    cardId: card.id
                }
            });
        } else {
            if (cardSetId === undefined) {
                throw new Error('cardSetId is required when not deleting from specific card set');
            }
            // remove the link to the current card set
            await tx.cardSetCard.delete({
                where: {
                    cardId_cardSetId: {
                        cardId: card.id,
                        cardSetId: cardSetId
                    }
                }
            });
        }

        // check if card still exists in other card sets
        const cardSetCardsRemaining = await tx.cardSetCard.findMany({
            where: {
                cardId: card.id
            }
        });

        // if not, delete the card
        if (cardSetCardsRemaining.length === 0) {
            await tx.cardFace.deleteMany({
                where: {
                    cardId: card.id
                }
            });

            await tx.drillRunQuestion.deleteMany({
                where: {
                    cardId: card.id
                }
            });

            await tx.card.delete({
                where: {
                    id: card.id
                }
            });
        }
    })
}


export const getWorkspaceData = (workspace: PrismaWorkspace) : WorkspaceData => {
    return {
        dataType: true,
        id: workspace.id,
        name: workspace.name,
        description: workspace.description,
        allowGuests: workspace.allowGuests,
    };
}

export const getWorkspaceUserData = (workspaceUser: PrismaWorkspaceUser) : WorkspaceUserData => {
    return {
        dataType: true,
        userId: workspaceUser.userId,
        workspaceId: workspaceUser.workspaceId,
        role: workspaceUser.role,
    };
}

export const getCardSetData = (cardSet: PrismaCardSet) : CardSetData => {
    return {
        dataType: true,
        id: cardSet.id,
        name: cardSet.name,
        description: cardSet.description,
        workspaceId: cardSet.workspaceId,
        order: cardSet.order,
    };
}

export const getCardSetCardData = (cardSetCard: PrismaCardSetCard) : CardSetCardData => {
    return {
        dataType: true,
        cardId: cardSetCard.cardId,
        cardSetId: cardSetCard.cardSetId,
        order: cardSetCard.order
    };
}

export const getCardSetLinkData = (cardSetLink: PrismaCardSetLink) : CardSetLinkData => {
    return {
        dataType: true,
        parentCardSetId: cardSetLink.parentCardSetId,
        includedCardSetId: cardSetLink.includedCardSetId,
        order: cardSetLink.order,
    };
}

export const getDrillData = (drill: PrismaDrill) : DrillData => {
    return {
        dataType: true,
        id: drill.id,
        name: drill.name,
        description: drill.description,
        userId: drill.userId,
    };
}

export const getDrillRunData = (drillRun: PrismaDrillRun) : DrillRunData => {
    return {
        dataType: true,
        id: drillRun.id,
        drillId: drillRun.drillId,
        startTime: drillRun.startTime.toISOString(),
        endTime: drillRun.endTime?.toISOString() ?? null,
        isLimited: drillRun.isLimited,
    };
}

export const getDrillCardSetData = (drillCardSet: PrismaDrillCardSet) : DrillCardSetData => {
    return {
        dataType: true,
        drillId: drillCardSet.drillId,
        cardSetId: drillCardSet.cardSetId,
    };
}

export const getDrillRunQuestionData = (drillRunQuestion: PrismaDrillRunQuestion) : DrillRunQuestionData => {
    return {
        dataType: true,
        id: drillRunQuestion.id,
        drillRunId: drillRunQuestion.drillRunId,
        cardId: drillRunQuestion.cardId,
        order: drillRunQuestion.order,
        correct: drillRunQuestion.correct,
        answeredAt: drillRunQuestion.answeredAt?.toISOString() ?? null,
    };
}