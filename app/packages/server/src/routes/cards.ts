import {Request, Router} from 'express';
import { Express } from 'express-serve-static-core';
import {
    awaitExec,
    deleteCardSetCard,
    getCardData,
    getCardSetCardData,
    getSignedInUser,
    TypedResponse
} from '../common.js';
import {upload} from "../multer.js";
import {BaseResponseData, ResponseStatus} from "@elr0berto/robert-learns-shared/api/models";
import * as fs from "fs";
import prisma from "../db/prisma.js";
import {Card as PrismaCard, CardSetCard as PrismaCardSetCard, CardFace as PrismaCardFace, CardSide as PrismaCardSide, MediaType} from "@prisma/client";

import {
    CreateCardResponseData,
    DeleteCardRequest,
    GetCardsRequest,
    GetCardsResponseData
} from '@elr0berto/robert-learns-shared/api/cards';
import {checkPermissions} from "../permissions.js";
import {Capability} from "@elr0berto/robert-learns-shared/permissions";

const cards = Router();

cards.post('/get', async (req : Request<unknown, unknown, GetCardsRequest>, res : TypedResponse<GetCardsResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        for (const key in req.body.cardIds) {
            const cardId = req.body.cardIds[key];

            if (!await checkPermissions({user, cardId, capability: Capability.ViewCardSet})) {
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    errorMessage: 'You are not authorized to view this card',
                    cardDatas: null,
                });
            }
        }

        const cards = await prisma.card.findMany({
            where: {
                id: {
                    in: req.body.cardIds
                }
            },
            include: {
                faces: true,
                audio: true,
            },
        });

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            cardDatas: cards.map(card => getCardData(card))
        });
    } catch (ex) {
        console.error('/cards/get caught ex', ex);
        next(ex);
        return;
    }
});

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

cards.post('/create', upload.single('audio'),async (req: MulterRequest, res: TypedResponse<CreateCardResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        // TODO: remove dangerous html from req.body.front and req.body.back

        const cardId: number | null = typeof req.body.cardId !== 'undefined' ? parseInt(req.body.cardId) : null;

        const audioUpdateStatus = req.body.audioUpdateStatus;
        // check that audioUpdateStatus is a string with one of the following values: 'new-card' | 'new-audio' | 'delete-audio' | 'no-change';
        if (typeof audioUpdateStatus !== 'string' || !['new-card', 'new-audio', 'delete-audio', 'no-change'].includes(audioUpdateStatus)) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'invalid audioUpdateStatus',
                cardData: null,
                cardSetCardDatas: null,
            });
        }

        const create: boolean = cardId === null;

        let existingCard: PrismaCard & { cardSetCards: PrismaCardSetCard[], faces: PrismaCardFace[] } | null = null;
        if (!create) {
            if (cardId === null) {
                throw new Error('cardId is null');
            }
            existingCard = await prisma.card.findUnique({
                where: {
                    id: cardId,
                },
                include: {
                    faces: true,
                    audio: true,
                    cardSetCards: true,
                }
            });

            if (existingCard === null) {
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    errorMessage: 'Card not found',
                    cardData: null,
                    cardSetCardDatas: null,
                });
            }

            if (existingCard.cardSetCards.find(s => s.cardSetId === parseInt(req.body.cardSetId)) === undefined) {
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    errorMessage: 'Card id ' + existingCard.id + ' does not belong to cardSetId: ' + req.body.cardSetId,
                    cardData: null,
                    cardSetCardDatas: null,
                });
            }
        }


        // load the card set from db including the workspace
        const cardSet = await prisma.cardSet.findUnique({
            where: {
                id: parseInt(req.body.cardSetId),
            },
            include: {
                workspace: true,
            }
        });

        if (cardSet === null) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Card set not found',
                cardData: null,
                cardSetCardDatas: null,
            });
        }

        if (!await checkPermissions({user, cardSet, capability: Capability.CreateCard})) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'You are not authorized to create/edit cards in this card set',
                cardData: null,
                cardSetCardDatas: null,
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
                        errorMessage: 'failed to process audio file! err: exists',
                        cardData: null,
                        cardSetCardDatas: null,
                    });
                }
                const stats = fs.statSync(outPath);
                if (stats.size <= 0) {
                    return res.json({
                        dataType: true,
                        status: ResponseStatus.UnexpectedError,
                        errorMessage: 'failed to process audio file! err: size',
                        cardData: null,
                        cardSetCardDatas: null,
                    });
                }

                audioMedia = await prisma.media.create({
                    data: {
                        path: outPath,
                        name: req.file.originalname + '.mp3',
                        workspaceId: cardSet.workspaceId,
                        type: MediaType.AUDIO
                    }
                });
            } catch (ex) {
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    errorMessage: 'failed to process audio file! err: ex' + (ex?.toString()),
                    cardData: null,
                    cardSetCardDatas: null,
                });
            }
        }
        let card = null;
        if (create) {
            const newCard = await prisma.card.create({
                data: {
                    audioId: audioMedia?.id
                }
            });

            await prisma.cardSetCard.create({
                data: {
                    cardSetId: parseInt(req.body.cardSetId),
                    cardId: newCard.id,
                }
            });

            await prisma.cardFace.create({
                data: {
                    content: req.body.front ?? '',
                    cardId: newCard.id,
                    side: PrismaCardSide.FRONT,
                }
            });

            await prisma.cardFace.create({
                data: {
                    content: req.body.back ?? '',
                    cardId: newCard.id,
                    side: PrismaCardSide.BACK,
                }
            });

            card = await prisma.card.findUnique({
                where: {
                    id: newCard.id,
                },
                include: {
                    faces: true,
                    audio: true,
                    cardSetCards: {
                        include: {
                            cardSet: true,
                        }
                    }
                },
            });
        } else {
            if (existingCard === null) {
                throw new Error('existingCard is null');
            }
            // 'new-audio' | 'delete-audio' | 'no-change'
            if (audioUpdateStatus === 'new-audio') {
                if (audioMedia === null) {
                    return res.json({
                        dataType: true,
                        status: ResponseStatus.UnexpectedError,
                        errorMessage: 'missing audio media when audioUpdateStatus is new-audio',
                        cardData: null,
                        cardSetCardDatas: null,
                    });
                }
                existingCard.audioId = audioMedia.id;
            } else if (audioUpdateStatus === 'delete-audio') {
                existingCard.audioId = null;
            } else if (audioUpdateStatus === 'no-change') {
                // do nothing
            } else {
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    errorMessage: 'unexpected audioUpdateStatus: ' + audioUpdateStatus,
                    cardData: null,
                    cardSetCardDatas: null,
                });
            }

            const existingFaceFront = existingCard.faces.find(f => f.side === PrismaCardSide.FRONT);
            const existingFaceBack = existingCard.faces.find(f => f.side === PrismaCardSide.BACK);

            if (existingFaceFront === undefined || existingFaceBack === undefined) {
                throw new Error('existingFaceFront or existingFaceBack is undefined');
            }
            // save existingCard and its face
            card = await prisma.card.update({
                where: {
                    id: existingCard.id,
                },
                data: {
                    audioId: existingCard.audioId,
                    faces: {
                        update: [
                            {
                                where: {
                                    id: existingFaceFront.id,
                                },
                                data: {
                                    content: req.body.front ?? '',
                                }
                            },
                            {
                                where: {
                                    id: existingFaceBack.id,
                                },
                                data: {
                                    content: req.body.back ?? '',
                                }
                            }
                        ]
                    }
                },
                include: {
                    faces: true,
                    audio: true,
                    cardSetCards: {
                        include: {
                            cardSet: true,
                        }
                    },
                },
            });
        }

        if (card === null) {
            throw new Error('card is null');
        }

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            cardData: getCardData(card),
            cardSetCardDatas: card.cardSetCards.map(csc => getCardSetCardData(csc)),
        });
    } catch (ex) {
        console.error('/cards/create caught ex', ex);
        next(ex);
        return;
    }
});


cards.post('/delete', async (req: Request<unknown, unknown, DeleteCardRequest>, res : TypedResponse<BaseResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        //const allowed = await canUserDeleteCardsFromCardSetId(user, req.body.cardSetId);
        const allowed = await checkPermissions({
            user,
            cardSetId: req.body.cardSetId,
            capability: Capability.DeleteCard
        });
        if (!allowed) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: "user id: " + (user?.id ?? 'guest') + " is not allowed to delete card id: " + req.body.cardId + " in card set id: " + req.body.cardSetId,
            });
        }

        const card = await prisma.card.findFirst({
            where: {id: req.body.cardId},
        });

        if (card === null) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: "card not found, id: " + req.body.cardId,
            });
        }

        const cardSet = await prisma.cardSet.findFirst({
            where: {id: req.body.cardSetId},
            include: {
                workspace: true
            }
        });

        if (cardSet === null) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: "card set not found, id: " + req.body.cardSetId,
            });
        }

        await deleteCardSetCard(cardSet, card);

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
        });
    } catch (ex) {
        console.error('/cards/delete caught ex', ex);
        next(ex);
        return;
    }
});

export default cards;