import {Request, Router} from 'express';
import prisma from "../db/prisma";
import {
    BaseResponseData,
    ResponseStatus
} from "@elr0berto/robert-learns-shared/src/api/models/BaseResponse";
import {getSignedInUser, getUserData, TypedResponse} from "../common";
import {SignInRequest, validateSignInRequest} from "@elr0berto/robert-learns-shared/dist/api/sign-in";
import bcrypt from 'bcryptjs';

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