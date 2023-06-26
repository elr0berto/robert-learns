import {Request, Router} from 'express';
import {
    awaitExec,
    deleteCardSetCard,
    getCardData,
    getCardSetCardData,
    getCardSetData,
    getSignedInUser,
    TypedResponse
} from '../common.js';
import {upload} from "../multer.js";
import {ResponseStatus} from "@elr0berto/robert-learns-shared/api/models";
import * as fs from "fs";
import prisma from "../db/prisma.js";
import {CardSide, MediaType} from "@prisma/client";

import {
    CreateCardResponseData,
    DeleteCardRequest,
    DeleteCardResponseData,
    GetCardsRequest,
    GetCardsResponseData
} from '@elr0berto/robert-learns-shared/api/cards';
import {checkPermissions} from "../permissions.js";
import {Capability} from "@elr0berto/robert-learns-shared/permissions";

const cards = Router();

cards.post('/get', async (req : Request<{}, {}, GetCardsRequest>, res : TypedResponse<GetCardsResponseData>) => {
    let user = await getSignedInUser(req.session);

    for(const key in req.body.cardIds) {
        const cardId = req.body.cardIds[key];

        if (!await checkPermissions({user, cardId, capability: Capability.ViewCardSet})) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'You are not authorized to view this card',
                cardDatas: [],
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
});

cards.post('/create', upload.single('audio'),async (req, res: TypedResponse<CreateCardResponseData>) => {
    const user = await getSignedInUser(req.session);

    // TODO: remove dangerous html from req.body.front and req.body.back

    let cardId : number | null = typeof req.body.cardId !== 'undefined' ? parseInt(req.body.cardId) : null;

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

    const create : boolean = cardId === null;

    let existingCard = create ? null : await prisma.card.findUnique({
        where: {
            id: cardId!,
        },
        include: {
            faces: true,
            audio: true,
            cardSetCards: true,
        }
    });

    if (!create && existingCard === null) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'Card not found',
            cardData: null,
            cardSetCardDatas: null,
        });
    }

    if (existingCard !== null) {
        if (existingCard.cardSetCards.find(s => s.cardSetId === parseInt(req.body.cardSetId)) === undefined) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Card id '+ existingCard.id + ' does not belong to cardSetId: ' + req.body.cardSetId,
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
            var stats = fs.statSync(outPath);
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
                    name: req.file.originalname+'.mp3',
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
            existingCard!.audioId = audioMedia.id;
        } else if (audioUpdateStatus === 'delete-audio') {
            existingCard!.audioId = null;
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

        const existingFaceFront = existingCard!.faces.find(f => f.side === CardSide.FRONT);
        const existingFaceBack = existingCard!.faces.find(f => f.side === CardSide.BACK);

        // save existingCard and its face
        card = await prisma.card.update({
            where: {
                id: existingCard!.id,
            },
            data: {
                audioId: existingCard!.audioId,
                faces: {
                    update: [
                        {
                            where: {
                                id: existingFaceFront!.id,
                            },
                            data: {
                                content: req.body.front ?? '',
                            }
                        },
                        {
                            where: {
                                id: existingFaceBack!.id,
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

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        errorMessage: null,
        cardData: getCardData(card!),
        cardSetCardDatas: card!.cardSetCards.map(csc => getCardSetCardData(csc)),
    });
});


cards.post('/delete', async (req: Request<{}, {}, DeleteCardRequest>, res : TypedResponse<DeleteCardResponseData>) => {
    const user = await getSignedInUser(req.session);

    //const allowed = await canUserDeleteCardsFromCardSetId(user, req.body.cardSetId);
    const allowed = await checkPermissions({user, cardSetId: req.body.cardSetId, capability: Capability.DeleteCard});
    if (!allowed) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: "user id: " + (user?.id ?? 'guest') + " is not allowed to delete card id: " + req.body.cardId + " in card set id: " + req.body.cardSetId,
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
            cardExistsInOtherCardSetDatas: null,
        });
    }

    await deleteCardSetCard(cardSet, card);
    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        errorMessage: null,
        cardExistsInOtherCardSetDatas: null,
    });
});

export default cards;