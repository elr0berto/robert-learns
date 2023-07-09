import {Request, Router} from 'express';
import {getCardData, getCardSetCardData, getSignedInUser, TypedResponse} from "../common.js";
import prisma from "../db/prisma.js";
import {BaseResponseData, ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {
    CreateCardSetCardsRequest,
    GetCardSetCardsRequest,
    GetCardSetCardsResponseData,
    UpdateCardCardSetsRequest,
    UpdateCardCardSetsResponseData,
    validateCreateCardSetCardsRequest, validateGetCardSetCardsRequest,
    validateUpdateCardCardSetsRequest
} from "@elr0berto/robert-learns-shared/api/card-set-cards";
import {checkPermissions} from "../permissions.js";
import {Capability} from "@elr0berto/robert-learns-shared/permissions";
import { CardSetCard as PrismaCardSetCard } from '@prisma/client';


const cardSetCards = Router();

cardSetCards.post('/get', async (req : Request<unknown, unknown, GetCardSetCardsRequest>, res : TypedResponse<GetCardSetCardsResponseData>) => {
    const user = await getSignedInUser(req.session);

    const errors = validateGetCardSetCardsRequest(req.body);
    if (errors.length > 0) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: errors.join('\n'),
            cardSetCardDatas: [],
        });
    }

    let cardSetCards : PrismaCardSetCard[];
    if (typeof req.body.cardIds !== 'undefined') {
        cardSetCards = await prisma.cardSetCard.findMany({
            where: {
                cardId: {
                    in: req.body.cardIds
                }
            },
        });
    } else {
        cardSetCards = await prisma.cardSetCard.findMany({
            where: {
                cardSetId: {
                    in: req.body.cardSetIds
                }
            },
        });
    }

    const uniqueCardSetIds = new Set(cardSetCards.map(cs => cs.cardSetId));

    // loop over uniqueCardSetIds and check permissions
    for (const cardSetId of uniqueCardSetIds) {
        if (!await checkPermissions({user, cardSetId, capability: Capability.ViewCardSet})) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'You are not authorized to read cards for this card set',
                cardSetCardDatas: [],
            });
        }
    }

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        errorMessage: null,
        cardSetCardDatas: cardSetCards.map(cs => getCardSetCardData(cs))
    });
});

cardSetCards.post('/create', async (req : Request<unknown, unknown, CreateCardSetCardsRequest>, res : TypedResponse<BaseResponseData>) => {
    const user = await getSignedInUser(req.session);

    const errors = validateCreateCardSetCardsRequest(req.body);
    if (errors.length > 0) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: errors.join('\n'),
        });
    }

    const cardSetId = req.body.cardSetId;

    //if (!await canUserCreateCardsForCardSetId(user, cardSetId)) {
    if (!await checkPermissions({user, cardSetId, capability: Capability.CreateCard})) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'You are not authorized to create cards for this card set',
        });
    }

    const cardIds = req.body.cardIds;

    // check if card exists and belongs to the same workspace as the card set
    const cards = await prisma.card.findMany({
        where: {
            id: {
                in: cardIds
            }
        },
        include: {
            cardSetCards: {
                include: {
                    cardSet: true
                }
            }
        }
    });

    // check if cards found are the same as the ones requested
    if (cards.length !== cardIds.length) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'One or more cards do not exist',
        });
    }

    const cardSet = await prisma.cardSet.findUnique({
        where: {
            id: cardSetId
        },
        include: {
            workspace: true
        }
    });

    if (cardSet === null) {
        throw new Error('Card set not found, id: ' + cardSetId);
    }

    const cardSetWorkspaceId = cardSet.workspace.id;

    for(const key in cards) {
        const card = cards[key];

        if (card.cardSetCards.length > 0) {
            if (cardSetWorkspaceId !== card.cardSetCards[0].cardSet.workspaceId) {
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    errorMessage: 'One or more cards do not belong to the same workspace as the card set',
                });
            }
        }
    }

    // check if card set card already exists
    const existingCardSetCards = await prisma.cardSetCard.findMany({
        where: {
            cardSetId: cardSetId,
            cardId: {
                in: cardIds
            }
        }
    });

    if (existingCardSetCards.length > 0) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'One or more cards already exist in the card set',
        });
    }

    // create card set cards
    await prisma.cardSetCard.createMany({
        data: cardIds.map(cardId => {
            return {
                cardSetId: cardSetId,
                cardId: cardId,
            }
        })
    });

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        errorMessage: null,
    });
});

cardSetCards.post('/updateCardCardSets', async (req : Request<unknown, unknown, UpdateCardCardSetsRequest>, res : TypedResponse<UpdateCardCardSetsResponseData>) => {
    const user = await getSignedInUser(req.session);

    const errors = validateUpdateCardCardSetsRequest(req.body);
    if (errors.length > 0) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: errors.join('\n'),
            cardData: null,
            cardSetCardDatas: [],
        });
    }

    const cardId = req.body.cardId;

    const card = await prisma.card.findUnique({
        where: {
            id: cardId
        },
        include: {
            cardSetCards: {
                include: {
                    cardSet: true
                }
            }
        }
    });

    if (!card) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'Card does not exist',
            cardData: null,
            cardSetCardDatas: [],
        });
    }

    //if (!await canUserEditCard(user, card)) {
    if (!await checkPermissions({user, card, capability: Capability.EditCard})) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'You are not authorized to edit this card',
            cardData: null,
            cardSetCardDatas: [],
        });
    }

    const cardSetIds = req.body.cardSetIds;

    // check if card set exists and belongs to the same workspace as the card
    const cardSets = await prisma.cardSet.findMany({
        where: {
            id: {
                in: cardSetIds
            }
        }
    });

    // check if card sets found are the same as the ones requested
    if (cardSets.length !== cardSetIds.length) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'One or more card sets do not exist',
            cardData: null,
            cardSetCardDatas: [],
        });
    }

    const cardWorkspaceId = card.cardSetCards[0].cardSet.workspaceId;

    for(const key in cardSets) {
        const cardSet = cardSets[key];

        if (cardWorkspaceId !== cardSet.workspaceId) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'One or more card sets do not belong to the same workspace as the card',
                cardData: null,
                cardSetCardDatas: [],
            });
        }
    }

    // check if card set card already exists
    const existingCardSetCards = card.cardSetCards;

    const existingCardSetIds = existingCardSetCards.map(csc => csc.cardSetId);

    const cardSetIdsToAdd = cardSetIds.filter(csid => !existingCardSetIds.includes(csid));
    const cardSetIdsToRemove = existingCardSetIds.filter(csid => !cardSetIds.includes(csid));

    if (cardSetIdsToAdd.length > 0) {
        await prisma.cardSetCard.createMany({
            data: cardSetIdsToAdd.map(csid => {
                return {
                    cardSetId: csid,
                    cardId: cardId,
                }
            })
        });
    }

    if (cardSetIdsToRemove.length > 0) {
        await prisma.cardSetCard.deleteMany({
            where: {
                cardSetId: {
                    in: cardSetIdsToRemove
                },
                cardId: cardId,
            }
        });
    }

    // reget the card from db
    const updatedCard = await prisma.card.findUnique({
        where: {
            id: cardId
        },
        include: {
            faces: true,
            audio: true,
            cardSetCards: {
                include: {
                    cardSet: true,
                }
            }
        }
    });

    if (!updatedCard) {
        throw new Error('Card not found, id: ' + cardId);
    }

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        errorMessage: null,
        cardData: getCardData(updatedCard),
        cardSetCardDatas: updatedCard.cardSetCards.map(csc => getCardSetCardData(csc)),
    });
});

export default cardSetCards;