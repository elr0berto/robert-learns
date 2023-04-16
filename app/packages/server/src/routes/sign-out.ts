import {Router} from 'express';
import {getSignedInUser, getUserData, TypedResponse} from "../common.js";
import { BaseResponseData, ResponseStatus } from '@elr0berto/robert-learns-shared/api/models';

const signOut = Router();

signOut.post('/', async (req, res : TypedResponse<BaseResponseData>) => {
    req.session.userId = null;
    const user = await getSignedInUser(req.session);

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        errorMessage: null,
        signedInUserData: getUserData(user),
    });
});

export default signOut;