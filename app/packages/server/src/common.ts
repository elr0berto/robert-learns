import { Send } from 'express-serve-static-core';
import prisma from "./db/prisma.js";
import {Session, SessionData} from "express-session";
import {Card as PrismaCard, CardFace as PrismaCardFace, CardSide, Media as PrismaMedia, User, UserRole} from '@prisma/client';
import {MediaData, UserData} from "@elr0berto/robert-learns-shared/api/models";
import {exec} from "child_process";
import {CardData, CardFaceData} from "@elr0berto/robert-learns-shared/api/models";



export interface TypedResponse<ResBody> extends Express.Response {
    json: Send<ResBody, this>;
}

export const getSignedInUser = async (session: Session & Partial<SessionData>) : Promise<User> => {
    if (!session.userId) {
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
        isGuest : user.isGuest
    };
}

export const userCanWriteToWorkspace = async (user: UserData, workspaceId: number) : Promise<boolean> => {
    const workspaceUser = await prisma.workspaceUser.findFirst({
        where: {
            workspaceId: workspaceId,
            userId: user.id,
            OR: [
                {role: UserRole.OWNER},
                {role: UserRole.CONTRIBUTOR}
            ]
        }
    });

    return workspaceUser !== null;
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
        path: media.path,
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
    const front = card.faces.filter(f => f.side === CardSide.FRONT)[0];
    const back = card.faces.filter(f => f.side === CardSide.BACK)[0];
    return {
        id: card.id,
        front: getFaceData(front),
        back: getFaceData(back),
        audio: getMediaData(card.audio)
    };
}