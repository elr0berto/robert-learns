import {Request, Router} from 'express';
import prisma from "../db/prisma.js";

import {getSignedInUser, getUserData, TypedResponse} from "../common.js";
import bcrypt from 'bcryptjs';
import { BaseResponseData, ResponseStatus } from '@elr0berto/robert-learns-shared/api/models';
import {
    SignInCheckResponseData,
    SignInRequest, SignInResponseData,
    validateSignInRequest
} from '@elr0berto/robert-learns-shared/api/sign-in';


const signIn = Router();

signIn.post('/check', async (req, res : TypedResponse<SignInCheckResponseData>) => {
    const user = await getSignedInUser(req.session);

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        errorMessage: null,
        userData: user === null ? null : getUserData(user),
    });
});

signIn.post('/', async (req: Request<{}, {}, SignInRequest>, res : TypedResponse<SignInResponseData>) => {
    const errors = validateSignInRequest(req.body);

    if (errors.length !== 0) {
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

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        errorMessage: null,
        userData: getUserData(user!),
    });
});

export default signIn;