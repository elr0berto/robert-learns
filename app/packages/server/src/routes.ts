import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import prisma from "./db/prisma";
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

    }
});

export default routes;