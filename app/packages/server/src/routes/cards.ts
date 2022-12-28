import {Request, Router} from 'express';
import {getSignedInUser, getUrlFromMedia, getUserData, TypedResponse} from '../common.js';
import prisma from "../db/prisma.js";
import {upload} from "../multer.js";
import {CardCreateResponseData, ResponseStatus} from "@elr0berto/robert-learns-shared/api/models";
import {CardCreateRequest} from "@elr0berto/robert-learns-shared/api/cards";
import {fileTypeFromFile} from "file-type";


const cards = Router();

cards.post('/card-create',  upload.single('audio'), async (req: Request<{}, {}, CardCreateRequest>, res: TypedResponse<CardCreateResponseData>) => {
    const user = await getSignedInUser(req.session);

    console.log('req', req);
    if (req.file === null || typeof req.file === 'undefined' || req.file.size === 0 || req.file.size > 10000000) {
        throw new Error('file missing or too large or something. file size: ' + (req.file?.size ?? 'undefined'));
    }

    const whitelist = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp'
    ];

    const meta = await fileTypeFromFile(req.file.path);

    if (typeof meta === 'undefined' || !whitelist.includes(meta.mime)) {
        throw new Error('bad file mime: ' + (meta?.mime ?? 'undefined'));
    }

    return res.json({
        status: ResponseStatus.Success,
        user: getUserData(user),
        errorMessage: null,
    });
});

export default cards;