import {Request, Router} from 'express';
import {awaitExec, getSignedInUser, getUserData, TypedResponse} from '../common.js';
import {upload} from "../multer.js";
import {CardCreateResponseData, ResponseStatus} from "@elr0berto/robert-learns-shared/api/models";
import {CardCreateRequest} from "@elr0berto/robert-learns-shared/api/cards";
import * as fs from "fs";

const cards = Router();

cards.post('/card-create', upload.single('audio'),async (req: Request<{}, {}, CardCreateRequest>, res: TypedResponse<CardCreateResponseData>) => {
    const user = await getSignedInUser(req.session);

    console.log('req.file', req.file);
    if (req.file === null || typeof req.file === 'undefined' || req.file.size === 0 || req.file.size > 10000000) {
        throw new Error('file missing or too large or something. file size: ' + (req.file?.size ?? 'undefined'));
    }

    const outPath = req.file.path+'.mp3';

    try {
        await awaitExec('ffmpeg -i ' + req.file.path + ' ' + outPath);

        if (!fs.existsSync(outPath)) {
            return res.json({
                status: ResponseStatus.UnexpectedError,
                user: getUserData(user),
                errorMessage: 'failed to process audio file! err: exists',
            });
        }
        var stats = fs.statSync(outPath);
        if (stats.size <= 0) {
            return res.json({
                status: ResponseStatus.UnexpectedError,
                user: getUserData(user),
                errorMessage: 'failed to process audio file! err: size',
            });
        }
    } catch (ex) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            user: getUserData(user),
            errorMessage: 'failed to process audio file! err: ex',
        });
    }

    return res.json({
        status: ResponseStatus.Success,
        user: getUserData(user),
        errorMessage: null,
    });
});

export default cards;