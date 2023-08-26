import {Request, Router} from 'express';
import prisma from "../db/prisma.js";

import {getSignedInUser, getUserData, TypedResponse} from "../common.js";
import bcrypt from 'bcryptjs';
import { ResponseStatus } from '@elr0berto/robert-learns-shared/api/models';
import {
    SignInCheckResponseData,
    SignInRequest, SignInResponseData,
    validateSignInRequest
} from '@elr0berto/robert-learns-shared/api/sign-in';
import {logWithRequest} from "../logger.js";


const signIn = Router();

signIn.post('/check', async (req, res : TypedResponse<SignInCheckResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);
        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            userData: user === null ? null : getUserData(user),
        });
    } catch (ex) {
        console.error('/sign-in/check caught ex', ex);
        next(ex);
        return;
    }
});

signIn.post('/', async (req: Request<unknown, unknown, SignInRequest>, res : TypedResponse<SignInResponseData>, next) => {
    try {
        const errors = validateSignInRequest(req.body);

        if (errors.length !== 0) {
            logWithRequest('error', req, 'Sign in request validation failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join(', '),
                userData: null,
            });
        }

        const u1 = await prisma.user.findFirst({
            where: {
                OR: [
                    {username: req.body.username},
                    {email: req.body.username},
                ]
            }
        });

        if (u1 === null) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UserError,
                errorMessage: 'Login/password is wrong!!',
                userData: null,
            });
        }

        if (!bcrypt.compareSync(req.body.password, u1.password)) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UserError,
                errorMessage: 'Login/password is wrong!',
                userData: null,
            });
        }

        req.session.userId = u1.id;

        const user = await getSignedInUser(req.session);

        if (user === null) {
            throw new Error('User is null after successful sign in.');
        }

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            userData: getUserData(user),
        });
    } catch (ex) {
        console.error('/sign-in/ caught ex', ex);
        next(ex);
        return;
    }
});

export default signIn;