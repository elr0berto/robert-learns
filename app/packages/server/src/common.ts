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
    DrillData, DrillCardSetData, DrillRunData, DrillRunQuestionData, CardSetLinkData, ResponseStatus
} from "@elr0berto/robert-learns-shared/api/models";
import {exec} from "child_process";
import {smtpTransport} from "./smtp.js";

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
        emailVerified: user.emailVerified,
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
    }, {timeout: 60 * 1000})
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


type DoEmailVerificationResult = {
    status: ResponseStatus,
    errorMessage: string | null,
}
export const doEmailVerification = async (user: PrismaUser) : Promise<DoEmailVerificationResult> => {
    const resp = await prisma.$transaction(async prisma => {
        // delete tokens older than a week
        await prisma.emailVerificationToken.deleteMany({
            where: {
                createdAt: {
                    lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            }
        });

        // refetch user inside the transaction
        const ru = await prisma.user.findFirst({
            where: {
                id: user.id,
            }
        });

        if (ru === null) {
            throw new Error('User is null');
        }
        if (ru.emailVerified) {
            return {
                status: ResponseStatus.UserError,
                errorMessage: 'Email is already verified',
            };
        }
        // check that user doesnt have more than 10 tokens in the last 24 hours
        const tokenCount = await prisma.emailVerificationToken.count({
            where: {
                userId: user.id,
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            }
        });
        if (tokenCount >= 10) {
            return {
                status: ResponseStatus.UserError,
                errorMessage: 'Too many email verification requests in the last 24 hours',
            };
        }
        // get any existing not deleted token
        const existingToken = await prisma.emailVerificationToken.findFirst({
            where: {
                userId: user.id,
                deleted: false,
            }
        });
        if (existingToken) {
            // check if the token is more than 5 minutes old.
            if (existingToken.createdAt.getTime() + 5 * 60 * 1000 > Date.now()) {
                return {
                    status: ResponseStatus.UserError,
                    errorMessage: 'Verification email already sent. Please wait a few minutes before trying again.',
                };
            }
            // mark the existing token as deleted = true
            await prisma.emailVerificationToken.update({
                where: {
                    id: existingToken.id,
                },
                data: {
                    deleted: true,
                }
            });
        }

        let token : string | null = null;
        do {
            // generate a new token
            token = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            // check that the token doesnt exist in db already
            const existingToken2 = await prisma.emailVerificationToken.findFirst({
                where: {
                    token: token,
                }
            });

            if (existingToken2 !== null) {
                token = null;
            }
        } while(token === null);

        // create the token
        await prisma.emailVerificationToken.create({
            data: {
                token: token,
                userId: user.id,
            }
        });

        // send the email
        await sendEmailVerification(user, token);
        return {
            status: ResponseStatus.Success,
            errorMessage: null,
        };
    }, {timeout: 60 * 1000});

    return resp;
}


export const sendEmailVerification = async (user: PrismaUser, token: string) : Promise<void> => {
    const verificationLink = `https://robertlearns.com/verify-email/${token}`;
    await smtpTransport.sendMail({
        from: '"Robert Learns" <robert@robertlearns.com>', // sender address
        to: user.email,
        subject: 'Verify Your Email Address',
        text: `Please verify your email address by clicking on the following link: ${verificationLink}`, // Fallback text for clients that don’t support HTML
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <h2 style="color: #4CAF50;">Welcome to Robert Learns!</h2>
              <p>Thank you for signing up. To complete your registration, please verify your email address by clicking the button below:</p>
              <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; margin-top: 20px;">Verify Email</a>
              <p style="margin-top: 20px;">Or you can paste the following link in your browser:</p>
              <p style="word-break: break-all;"><a href="${verificationLink}">${verificationLink}</a></p>
              <p>If you did not sign up for Robert Learns, please ignore this email.</p>
              <p style="color: #999;">Thank you,<br>The Robert Learns Team</p>
            </div>
          `,
    });
}