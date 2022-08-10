import {Router} from 'express';
import prisma from "../db/prisma";
import {
    BaseResponse,
    BaseResponseData,
    ResponseStatus
} from "@elr0berto/robert-learns-shared/src/api/models/BaseResponse";
import {getSignedInUser, getUserData, TypedResponse} from "../common";

const signOut = Router();

signOut.get('/', async (req, res : TypedResponse<BaseResponseData>) => {
    req.session.userId = null;
    const user = await getSignedInUser(req.session);

    return res.json({
        status: ResponseStatus.Success,
        errorMessage: null,
        user: getUserData(user),
    });
});

export default signOut;