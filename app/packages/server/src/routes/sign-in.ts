import {Request, Router} from 'express';
import prisma from "../db/prisma.js";

import {getSignedInUser, getUserData, TypedResponse} from "../common.js";
import bcrypt from 'bcryptjs';
import { BaseResponseData, ResponseStatus } from '@elr0berto/robert-learns-shared/api/models';
import { SignInRequest, validateSignInRequest } from '@elr0berto/robert-learns-shared/api/sign-in';


const signIn = Router();

signIn.get('/check', async (req, res : TypedResponse<BaseResponseData>) => {
    const user = await getSignedInUser(req.session);

    return res.json({
        status: ResponseStatus.Success,
        errorMessage: null,
        signedInUser: getUserData(user),
    });
});

signIn.post('/', async (req: Request<{}, {}, SignInRequest>, res : TypedResponse<BaseResponseData>) => {
    const errors = validateSignInRequest(req.body);

    if (errors.length !== 0) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: errors.join(', '),
            signedInUser: null,
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
            status: ResponseStatus.UserError,
            errorMessage: 'Login/password is wrong!!',
            signedInUser: null,
        });
    }

    if (!bcrypt.compareSync(req.body.password, u1.password)) {
        return res.json({
            status: ResponseStatus.UserError,
            errorMessage: 'Login/password is wrong!',
            signedInUser: null,
        });
    }

    req.session.userId = u1.id;

    const user = await getSignedInUser(req.session);

    return res.json({
        status: ResponseStatus.Success,
        errorMessage: null,
        signedInUser: getUserData(user),
    });
});

export default signIn;