import {Router} from 'express';
import prisma from "../db/prisma";
import {
    BaseResponse,
    BaseResponseData,
    ResponseStatus
} from "@elr0berto/robert-learns-shared/src/api/models/BaseResponse";
import {getSignedInUser, TypedResponse} from "../common";

const signIn = Router();

signIn.get('/check', async (req, res : TypedResponse<BaseResponseData>) => {
    const user = await getSignedInUser(req.session);

    return res.json({
        status: ResponseStatus.Success,
        errorMessage: null,
        user: {
            id: user.id,
            email: user.email,
            firstName : user.firstName,
            lastName:user.lastName,
            username: user.username,
            isGuest : user.isGuest
        },
    });
});

export default signIn;