import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {getSignedInUser, getUserData, TypedResponse} from "../common.js";
import {UserGetByEmailRequest, UserGetByEmailResponseData, validateUserGetByEmailRequest} from "@elr0berto/robert-learns-shared/api/users";
import { ResponseStatus } from '@elr0berto/robert-learns-shared/api/models';
const users = Router();

users.get('/getByEmail', async (req : Request<UserGetByEmailRequest>, res : TypedResponse<UserGetByEmailResponseData>) => {
    const signedInUser = await getSignedInUser(req.session);
    if (!signedInUser.isGuest) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'Not signed in.',
            signedInUser: null,
            user: null,
        });
    }

    const errors = validateUserGetByEmailRequest(req.params);
    if (errors.length > 0) {
        return res.json({
            status: ResponseStatus.UserError,
            errorMessage: 'Invalid email',
            signedInUser: getUserData(signedInUser),
            user: null,
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: req.params.email
        },
    });

    return res.json({
        status: ResponseStatus.Success,
        errorMessage: null,
        signedInUser: getUserData(signedInUser),
        user: user === null || user.isGuest ? null : getUserData(user),
    });
});

export default users;