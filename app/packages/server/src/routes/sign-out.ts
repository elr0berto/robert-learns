import {Router} from 'express';
import {TypedResponse} from "../common.js";
import { BaseResponseData, ResponseStatus } from '@elr0berto/robert-learns-shared/api/models';

const signOut = Router();

signOut.post('/', async (req, res : TypedResponse<BaseResponseData>, next) => {
    try {
        req.session.userId = null;

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
        });
    } catch (ex) {
        console.error('/sign-out caught ex', ex);
        next(ex);
        return;
    }
});

export default signOut;