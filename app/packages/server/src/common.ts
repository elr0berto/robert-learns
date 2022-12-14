import { Send } from 'express-serve-static-core';
import prisma from "./db/prisma.js";
import {Session, SessionData} from "express-session";
import { User, UserRole } from '@prisma/client';
import {MediaData, UserData} from "@elr0berto/robert-learns-shared/api/models";


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
    return '/media/'+media.id+'/'+media.name;
}