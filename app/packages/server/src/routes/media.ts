import {Request, Router} from 'express';
import {getMediaData, getSignedInUser, getUrlFromMediaData, getUserData, TypedResponse} from '../common.js';
import prisma from "../db/prisma.js";
import {upload} from "../multer.js";
import {fileTypeFromFile} from "file-type";
import {MediaType} from "@prisma/client";
import { ResponseStatus } from '@elr0berto/robert-learns-shared/api/models';
import {MediaUploadFileResponseData} from "@elr0berto/robert-learns-shared/api/media";
import {canUserContributeToWorkspaceId} from "../security.js";

const media = Router();

media.post('/uploadFile/:workspaceId', upload.single('file'), async (req, res : TypedResponse<MediaUploadFileResponseData>) => {
    let user = await getSignedInUser(req.session);

    // TODO: Check if signed in user can contribute to workspace
    if (!await canUserContributeToWorkspaceId(user, parseInt(req.params.workspaceId))) {
        throw new Error('user cannot contribute to workspace: ' + req.params.workspaceId);
    }

    if (req.file === null || typeof req.file === 'undefined' || req.file.size === 0 || req.file.size > 10000000) {
        throw new Error('file missing or too large or something. file size: ' + (req.file?.size ?? 'undefined'));
    }

    const whitelist = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp'
    ];

    const meta = await fileTypeFromFile(req.file.path)

    if (typeof meta === 'undefined' || !whitelist.includes(meta.mime)) {
        throw new Error('bad file mime: ' + (meta?.mime ?? 'undefined'));
    }


    const newMedia = await prisma.media.create({
        data: {
            path: req.file.path,
            name: req.file.originalname,
            workspaceId: parseInt(req.params.workspaceId),
            type: MediaType.IMAGE
        }
    });

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        signedInUserData: getUserData(user),
        errorMessage: null,
        url: getUrlFromMediaData(getMediaData(newMedia))
    });
});

media.get('/:mediaId/*', async (req, res) => {
    const user = await getSignedInUser(req.session);

    const media = await prisma.media.findFirst({
        where: {
            id: parseInt(req.params.mediaId)
        }
    });

    if (media === null) {
        throw new Error('missing media: ' + req.params.mediaId);
    }

    res.download(media.path, media.name);
});

export default media;