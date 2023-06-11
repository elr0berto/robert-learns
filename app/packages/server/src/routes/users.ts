import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {getSignedInUser, getUserData, TypedResponse} from "../common.js";
import {UserGetByEmailRequest, UserGetByEmailResponseData, validateUserGetByEmailRequest} from "@elr0berto/robert-learns-shared/api/users";
import { ResponseStatus } from '@elr0berto/robert-learns-shared/api/models';
const users = Router();

users.post('/getByEmail', async (req : Request<{},{},UserGetByEmailRequest>, res : TypedResponse<UserGetByEmailResponseData>) => {
    const signedInUser = await getSignedInUser(req.session);
    if (signedInUser === null) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'Not signed in.',
            userData: null,
        });
    }

    const errors = validateUserGetByEmailRequest(req.body);

    if (errors.length > 0) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UserError,
            errorMessage: 'Invalid email: ' + errors.join(', ') + ' ' + JSON.stringify(req.params),
            userData: null,
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: req.body.email
        },
    });

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        errorMessage: null,
        userData: user === null ? null : getUserData(user),
    });
});

export default users;