import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import prisma from "./db/prisma";
import {plainToClass} from "class-transformer";
import {BaseResponse} from "@elr0berto/robert-learns-shared/dist/api/response";
import User from "@elr0berto/robert-learns-shared/dist/api/models/User";
//import {RobertLearnsTest} from "@elr0berto/robert-learns-shared/src/test";

const routes = Router();

routes.get('/api', async (_, res) => {
    /*await prisma.user.create({
        data: {
            firstName: 'Alice',
            lastName: 'Wonder',
            username: 'xxx',
            password: 'abc123',
            email: 'aliddce@prisma.io',
        },
    })


    const allUsers = await prisma.user.findMany()
    console.log('XXX:',allUsers)
    */
    return res.json({message: 'db Succuess'});
});

routes.get('/api/login/check', async (req, res) => {
    if (!req.session.userId) {
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

        req.session.userId = guestUser.id;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: req.session.userId!
        }
    });

    const resp = new BaseResponse();
    resp.User = new User();
    return res.json(plainToClass(BaseResponse, {

    }));
});

export default routes;