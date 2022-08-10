import {Request, Router} from 'express';
import prisma from "../db/prisma";
import {
    BaseResponseData,
    ResponseStatus
} from "@elr0berto/robert-learns-shared/src/api/models/BaseResponse";
import {getSignedInUser, getUserData, TypedResponse} from "../common";
import {SignInSubmitRequest, ValidateSignInSubmitRequest} from "@elr0berto/robert-learns-shared/dist/api/sign-in";

const signIn = Router();

signIn.get('/check', async (req, res : TypedResponse<BaseResponseData>) => {
    const user = await getSignedInUser(req.session);

    return res.json({
        status: ResponseStatus.Success,
        errorMessage: null,
        user: getUserData(user),
    });
});

signIn.get('/submit', async (req: Request<{}, {}, SignInSubmitRequest>, res : TypedResponse<BaseResponseData>) => {
    const errors = ValidateSignInSubmitRequest(req.body);

    if (errors.length !== 0) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: errors.join(', '),
            user: null,
        });
    }

    const user = await getSignedInUser(req.session);

    return res.json({
        status: ResponseStatus.Success,
        errorMessage: null,
        user: getUserData(user),
    });
});

export default signIn;