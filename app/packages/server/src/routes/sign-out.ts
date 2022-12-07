import {Router} from 'express';
import prisma from "../db/prisma.js";

import {getSignedInUser, getUserData, TypedResponse} from "../common.js";
import {BaseResponseData, ResponseStatus} from "../../../shared/src/api/models/BaseResponse.js";

const signOut = Router();

signOut.post('/', async (req, res : TypedResponse<BaseResponseData>) => {
    req.session.userId = null;
    const user = await getSignedInUser(req.session);

    return res.json({
        status: ResponseStatus.Success,
        errorMessage: null,
        user: getUserData(user),
    });
});

export default signOut;