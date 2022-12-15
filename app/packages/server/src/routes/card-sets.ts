import {Router} from 'express';
import prisma from "../db/prisma.js";

import {getSignedInUser, getUrlFromMedia, getUserData, TypedResponse} from "../common.js";
import { CardSide, CardFace as PrismaCardFace, Media as PrismaMedia, MediaType } from '@prisma/client';
import {upload} from "../multer.js";

import { fileTypeFromFile } from 'file-type';
import {CardSetCardListResponseData, MediaData, CardFaceData, ResponseStatus, CardSetUploadFileResponseData} from "@elr0berto/robert-learns-shared/api/models";


const cardSets = Router();

cardSets.get('/:cardSetId/cards', async (req, res : TypedResponse<CardSetCardListResponseData>) => {
    let user = await getSignedInUser(req.session);
    const cardSetCards = await prisma.cardSetCard.findMany({
        where: {
            cardSetId: {
                equals: parseInt(req.params.cardSetId)
            }
        },
        include: {
            card : {
                include: {
                    faces: {
                        include: {
                            media: true,
                        }
                    },
                    audio: true,
                },
            },
        },
    });

    function getMediaData(media: PrismaMedia | null) : MediaData | null {
        if (media === null) {
            return null;
        }
        return {
            id: media.id,
            path: media.path,
            name: media.name,
        };
    }

    function getFaceData(face: PrismaCardFace & { media : PrismaMedia} | null) : CardFaceData | null {
        if (face === null) {
            return null;
        }
        return {
            content: face.content,
            side: face.side,
            media: getMediaData(face.media),
        };
    }

    return res.json({
        status: ResponseStatus.Success,
        user: getUserData(user),
        errorMessage: null,
        cards: cardSetCards.map(csc => {
            const front = csc.card.faces.filter(f => f.side === CardSide.FRONT)[0];
            const backs = csc.card.faces.filter(f => f.side === CardSide.BACK);
            const back = backs.length === 1 ? backs[0] : null;
            return {
                id: csc.card.id,
                front: getFaceData(front)!,
                back: getFaceData(back),
                audio: getMediaData(csc.card.audio)
            };
        })
    })
});

cardSets.post('/:cardSetId/uploadFile', upload.single('file'), async (req, res : TypedResponse<CardSetUploadFileResponseData>) => {
    let user = await getSignedInUser(req.session);

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
            cardSetId: parseInt(req.params.cardSetId),
            type: MediaType.IMAGE
        }
    });

    return res.json({
        status: ResponseStatus.Success,
        user: getUserData(user),
        errorMessage: null,
        url: getUrlFromMedia(newMedia)
    });
});

export default cardSets;