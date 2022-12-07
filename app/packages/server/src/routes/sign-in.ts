import {Request, Router} from 'express';
import prisma from "../db/prisma.js";

import {getSignedInUser, getUserData, TypedResponse} from "../common.js";
import bcrypt from 'bcryptjs';
import {BaseResponseData, ResponseStatus} from "../../../shared/src/api/models/BaseResponse.js";
import {SignInRequest, validateSignInRequest} from "../../../shared/src/api/sign-in.js";

const signIn = Router();

signIn.get('/check', async (req, res : TypedResponse<BaseResponseData>) => {
    const user = await getSignedInUser(req.session);

    return res.json({
        status: ResponseStatus.Success,
        errorMessage: null,
        user: getUserData(user),
    });
});

signIn.post('/', async (req: Request<{}, {}, SignInRequest>, res : TypedResponse<BaseResponseData>) => {
    const errors = validateSignInRequest(req.body);

    if (errors.length !== 0) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: errors.join(', '),
            user: null,
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
            user: null,
        });
    }

    if (!bcrypt.compareSync(req.body.password, u1.password)) {
        return res.json({
            status: ResponseStatus.UserError,
            errorMessage: 'Login/password is wrong!',
            user: null,
        });
    }

    req.session.userId = u1.id;

    const user = await getSignedInUser(req.session);

    return res.json({
        status: ResponseStatus.Success,
        errorMessage: null,
        user: getUserData(user),
    });
});

export default signIn;