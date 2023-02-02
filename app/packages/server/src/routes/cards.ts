import {Router} from 'express';
import {awaitExec, getCardData, getSignedInUser, getUserData, TypedResponse} from '../common.js';
import {upload} from "../multer.js";
import {ResponseStatus} from "@elr0berto/robert-learns-shared/api/models";
import * as fs from "fs";
import prisma from "../db/prisma.js";
import {CardSide, MediaType} from "@prisma/client";
import { CardCreateResponseData } from '@elr0berto/robert-learns-shared/api/cards';

const cards = Router();

cards.post('/card-create', upload.single('audio'),async (req, res: TypedResponse<CardCreateResponseData>) => {
    const user = await getSignedInUser(req.session);

    let audioMedia = null;
    if (req.file !== null && typeof req.file !== 'undefined') {
        if (req.file.size === 0 || req.file.size > 10000000) {
            throw new Error('audio file too large or something. file size: ' + (req.file?.size ?? 'undefined'));
        }

        const outPath = req.file.path + '.mp3';

        try {
            await awaitExec('ffmpeg -i ' + req.file.path + ' ' + outPath);

            if (!fs.existsSync(outPath)) {
                return res.json({
                    status: ResponseStatus.UnexpectedError,
                    signedInUser: getUserData(user),
                    errorMessage: 'failed to process audio file! err: exists',
                    card: null,
                });
            }
            var stats = fs.statSync(outPath);
            if (stats.size <= 0) {
                return res.json({
                    status: ResponseStatus.UnexpectedError,
                    signedInUser: getUserData(user),
                    errorMessage: 'failed to process audio file! err: size',
                    card: null,
                });
            }

            audioMedia = await prisma.media.create({
                data: {
                    path: outPath,
                    name: req.file.originalname+'.mp3',
                    cardSetId: parseInt(req.body.cardSetId),
                    type: MediaType.AUDIO
                }
            });
        } catch (ex) {
            return res.json({
                status: ResponseStatus.UnexpectedError,
                signedInUser: getUserData(user),
                errorMessage: 'failed to process audio file! err: ex' + (ex?.toString()),
                card: null,
            });
        }
    }

    const newCard = await prisma.card.create({
        data: {
            audioId: audioMedia?.id
        }
    });

    const newCardSetCard = await prisma.cardSetCard.create({
        data: {
            cardSetId: parseInt(req.body.cardSetId),
            cardId: newCard.id,
        }
    });

    const faceFront = await prisma.cardFace.create({
        data: {
            content: req.body.front ?? '',
            cardId: newCard.id,
            side: CardSide.FRONT,
        }
    });

    const faceBack = await prisma.cardFace.create({
        data: {
            content: req.body.back ?? '',
            cardId: newCard.id,
            side: CardSide.BACK,
        }
    });

    const card = await prisma.card.findUnique({
        where: {
            id: newCard.id,
        },
        include: {
            faces: true,
            audio: true,
        },
    });

    return res.json({
        status: ResponseStatus.Success,
        signedInUser: getUserData(user),
        errorMessage: null,
        card: getCardData(card!)
    });
});

export default cards;