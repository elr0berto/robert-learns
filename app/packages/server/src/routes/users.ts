import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {getSignedInUser, getUserData, TypedResponse} from "../common.js";
import {UserGetByEmailRequest, UserGetByEmailResponseData, validateUserGetByEmailRequest} from "@elr0berto/robert-learns-shared/api/users";
import { ResponseStatus } from '@elr0berto/robert-learns-shared/api/models';
const users = Router();

users.get('/getByEmail', async (req : Request<{},{},{},UserGetByEmailRequest>, res : TypedResponse<UserGetByEmailResponseData>) => {
    const signedInUser = await getSignedInUser(req.session);
    if (signedInUser.isGuest) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'Not signed in.',
            signedInUserData: null,
            userData: null,
        });
    }

    const errors = validateUserGetByEmailRequest(req.query);
    if (errors.length > 0) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UserError,
            errorMessage: 'Invalid email: ' + errors.join(', ') + ' ' + JSON.stringify(req.params),
            signedInUserData: getUserData(signedInUser),
            userData: null,
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: req.query.email
        },
    });

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        errorMessage: null,
        signedInUserData: getUserData(signedInUser),
        userData: user === null || user.isGuest ? null : getUserData(user),
    });
});

export default users;