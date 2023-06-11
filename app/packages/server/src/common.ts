import { Send } from 'express-serve-static-core';
import prisma from "./db/prisma.js";
import {Session, SessionData} from "express-session";
import {
    Card as PrismaCard,
    CardFace as PrismaCardFace,
    CardSet as PrismaCardSet,
    CardSetCard as PrismaCardSetCard,
    CardSide as PrismaCardSide,
    Media as PrismaMedia,
    User as PrismaUser,
    Workspace as PrismaWorkspace,
    WorkspaceUser as PrismaWorkspaceUser,
    UserRole as PrismaUserRole
} from '@prisma/client';
import {
    CardSetCardData,
    CardSetData,
    MediaData,
    UserData,
    WorkspaceData
} from "@elr0berto/robert-learns-shared/api/models";
import {exec} from "child_process";
import {CardData, CardFaceData} from "@elr0berto/robert-learns-shared/api/models";

export interface TypedResponse<ResBody> extends Express.Response {
    json: Send<ResBody, this>;
}

export const getSignedInUser = async (session: Session & Partial<SessionData>) : Promise<PrismaUser | null> => {
    if (!session.userId) {
        return null;
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


export const getUserData = (user: PrismaUser) : UserData => {
    return {
        id: user.id,
        email: user.email,
        firstName : user.firstName,
        lastName:user.lastName,
        username: user.username,
        dataType: true, // to force the type ... too easy to send the Prisma user otherwise. the user class...
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


export const deleteCardSetCard = async (cardSet: PrismaCardSet, card: PrismaCard) : Promise<void> => {
    await prisma.$transaction(async (tx) => {

        // remove the link to the current card set
        await tx.cardSetCard.delete({
            where: {
                cardId_cardSetId: {
                    cardId: card.id,
                    cardSetId: cardSet.id
                }
            }
        });

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

            await tx.card.delete({
                where: {
                    id: card.id
                }
            });
        }

        // NOTE: Media will be deleted in a separate cronjob...
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

export const getCardSetData = (cardSet: PrismaCardSet) : CardSetData => {
    return {
        dataType: true,
        id: cardSet.id,
        name: cardSet.name,
        description: cardSet.description,
        workspaceId: cardSet.workspaceId,
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