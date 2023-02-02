import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {deleteCardSetCard, getCardData, getSignedInUser, getUrlFromMedia, getUserData, TypedResponse} from "../common.js";
import { MediaType } from '@prisma/client';
import {upload} from "../multer.js";
import { fileTypeFromFile } from 'file-type';
import {ResponseStatus} from "@elr0berto/robert-learns-shared/api/models";
import {CardSetDeleteCardRequest, CardSetCardListResponseData, CardSetUploadFileResponseData, CardSetDeleteCardResponseData} from "@elr0berto/robert-learns-shared/api/cardSets";
import {canUserDeleteCardsFromCardSetId} from "../security.js";

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
                    faces: true,
                    audio: true,
                },
            },
        },
    });

    return res.json({
        status: ResponseStatus.Success,
        signedInUser: getUserData(user),
        errorMessage: null,
        cards: cardSetCards.map(csc => getCardData(csc.card))
    });
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
        signedInUser: getUserData(user),
        errorMessage: null,
        url: getUrlFromMedia(newMedia)
    });
});

cardSets.post('/delete-card', async (req: Request<{}, {}, CardSetDeleteCardRequest>, res : TypedResponse<CardSetDeleteCardResponseData>) => {
    const user = await getSignedInUser(req.session);

    if (user.isGuest) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: "guest cannot delete cards",
            signedInUser: getUserData(user),
            cardExistsInOtherCardSets: null,
        });
    }

    const allowed = await canUserDeleteCardsFromCardSetId(user, req.body.cardSetId);
    if (!allowed) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: "user id: " + user.id + " is not allowed to delete card id: " + req.body.cardId + " in card set id: " + req.body.cardSetId,
            signedInUser: getUserData(user),
            cardExistsInOtherCardSets: null,
        });
    }

    if (!req.body.confirm) {
        const cardSetCards = await prisma.cardSetCard.findMany({
           where: {
               cardSetId: req.body.cardSetId
           },
           include: {
               cardSet: true
           }
        });

        return res.json({
            status: ResponseStatus.Success,
            errorMessage: null,
            signedInUser: getUserData(user),
            cardExistsInOtherCardSets: cardSetCards.map(csc => ({id: csc.cardSet.id, name: csc.cardSet.name})),
        });
    }

    const card = await prisma.card.findFirst({
        where: { id: req.body.cardId },
    });

    if (card === null) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: "card not found, id: " + req.body.cardId,
            signedInUser: getUserData(user),
            cardExistsInOtherCardSets: null,
        });
    }

    const cardSet = await prisma.cardSet.findFirst({
        where: { id: req.body.cardSetId },
        include: {
            workspace: true
        }
    });

    if (cardSet === null) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: "card set not found, id: " + req.body.cardSetId,
            signedInUser: getUserData(user),
            cardExistsInOtherCardSets: null,
        });
    }

    await deleteCardSetCard(cardSet, card);
    return res.json({
        status: ResponseStatus.Success,
        errorMessage: null,
        signedInUser: getUserData(user),
        cardExistsInOtherCardSets: null,
    });
});


export default cardSets;