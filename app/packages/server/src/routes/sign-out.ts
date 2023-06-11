import {Router} from 'express';
import {TypedResponse} from "../common.js";
import { BaseResponseData, ResponseStatus } from '@elr0berto/robert-learns-shared/api/models';

const signOut = Router();

signOut.post('/', async (req, res : TypedResponse<BaseResponseData>) => {
    req.session.userId = null;

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        errorMessage: null,
    });
});

export default signOut;