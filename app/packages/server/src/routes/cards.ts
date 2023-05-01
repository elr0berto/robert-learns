import {Request, Router} from 'express';
import {
    awaitExec,
    deleteCardSetCard,
    getCardData,
    getCardSetData,
    getSignedInUser,
    getUserData,
    TypedResponse
} from '../common.js';
import {upload} from "../multer.js";
import {ResponseStatus} from "@elr0berto/robert-learns-shared/api/models";
import * as fs from "fs";
import prisma from "../db/prisma.js";
import {CardSetCard as PrismaCardSetCard, Card as PrismaCard, CardSide, MediaType} from "@prisma/client";
import {
    canUserCreateCardsForCardSet,
    canUserCreateCardsForCardSetId,
    canUserDeleteCardsFromCardSetId,
    canUserViewCardSetId
} from '../security.js';
import {
    CreateCardRequest,
    CreateCardResponseData, DeleteCardRequest, DeleteCardResponseData,
    GetCardsRequest,
    GetCardsResponseData
} from '@elr0berto/robert-learns-shared/api/cards';

const cards = Router();

cards.post('/get', async (req : Request<{}, {}, GetCardsRequest>, res : TypedResponse<GetCardsResponseData>) => {
    let user = await getSignedInUser(req.session);

    for(const key in req.body.cardSetIds) {
        const cardSetId = req.body.cardSetIds[key];

        if (!await canUserViewCardSetId(user, cardSetId)) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                signedInUserData: getUserData(user),
                errorMessage: 'You are not authorized to view this card set',
                cardDatas: [],
            });
        }
    }

    const cardSetCards = await prisma.cardSetCard.findMany({
        where: {
            cardSetId: {
                in: req.body.cardSetIds
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
        dataType: true,
        status: ResponseStatus.Success,
        signedInUserData: getUserData(user),
        errorMessage: null,
        cardDatas: cardSetCards.map(csc => getCardData(csc.card))
    });
});

cards.post('/create', upload.single('audio'),async (req, res: TypedResponse<CreateCardResponseData>) => {
    const user = await getSignedInUser(req.session);


    // load the card set from db including the workspace
    const cardSet = await prisma.cardSet.findUnique({
        where: {
            id: parseInt(req.params.cardSetId),
        },
        include: {
            workspace: true,
        }
    });

    if (cardSet === null) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            signedInUserData: getUserData(user),
            errorMessage: 'Card set not found',
            cardData: null,
        });
    }

    if (!await canUserCreateCardsForCardSet(user, cardSet)) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            signedInUserData: getUserData(user),
            errorMessage: 'You are not authorized to create cards in this card set',
            cardData: null,
        });
    }

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
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    signedInUserData: getUserData(user),
                    errorMessage: 'failed to process audio file! err: exists',
                    cardData: null,
                });
            }
            var stats = fs.statSync(outPath);
            if (stats.size <= 0) {
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    signedInUserData: getUserData(user),
                    errorMessage: 'failed to process audio file! err: size',
                    cardData: null,
                });
            }

            audioMedia = await prisma.media.create({
                data: {
                    path: outPath,
                    name: req.file.originalname+'.mp3',
                    workspaceId: cardSet.workspaceId,
                    type: MediaType.AUDIO
                }
            });
        } catch (ex) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                signedInUserData: getUserData(user),
                errorMessage: 'failed to process audio file! err: ex' + (ex?.toString()),
                cardData: null,
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
            cardSetId: parseInt(req.params.cardSetId),
            cardId: newCard.id,
        }
    });

    const faceFront = await prisma.cardFace.create({
        data: {
            content: req.params.front ?? '',
            cardId: newCard.id,
            side: CardSide.FRONT,
        }
    });

    const faceBack = await prisma.cardFace.create({
        data: {
            content: req.params.back ?? '',
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
        dataType: true,
        status: ResponseStatus.Success,
        signedInUserData: getUserData(user),
        errorMessage: null,
        cardData: getCardData(card!)
    });
});


cards.post('/delete', async (req: Request<{}, {}, DeleteCardRequest>, res : TypedResponse<DeleteCardResponseData>) => {
    const user = await getSignedInUser(req.session);

    if (user.isGuest) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: "guest cannot delete cards",
            signedInUserData: getUserData(user),
            cardExistsInOtherCardSetDatas: null,
        });
    }

    const allowed = await canUserDeleteCardsFromCardSetId(user, req.body.cardSetId);
    if (!allowed) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: "user id: " + user.id + " is not allowed to delete card id: " + req.body.cardId + " in card set id: " + req.body.cardSetId,
            signedInUserData: getUserData(user),
            cardExistsInOtherCardSetDatas: null,
        });
    }

    if (!req.body.confirm) {
        const cardSetCards = await prisma.cardSetCard.findMany({
            where: {
                cardId: req.body.cardId
            },
            include: {
                cardSet: true
            }
        });

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            signedInUserData: getUserData(user),
            cardExistsInOtherCardSetDatas: cardSetCards.filter(csc => csc.cardSetId !== req.body.cardSetId).map(csc => getCardSetData(csc.cardSet))
        });
    }

    const card = await prisma.card.findFirst({
        where: { id: req.body.cardId },
    });

    if (card === null) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: "card not found, id: " + req.body.cardId,
            signedInUserData: getUserData(user),
            cardExistsInOtherCardSetDatas: null,
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
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: "card set not found, id: " + req.body.cardSetId,
            signedInUserData: getUserData(user),
            cardExistsInOtherCardSetDatas: null,
        });
    }

    await deleteCardSetCard(cardSet, card);
    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        errorMessage: null,
        signedInUserData: getUserData(user),
        cardExistsInOtherCardSetDatas: null,
    });
});

export default cards;