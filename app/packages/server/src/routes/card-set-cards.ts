import {Request, Router} from 'express';
import {getCardData, getCardSetCardData, getSignedInUser, TypedResponse} from "../common.js";
import prisma from "../db/prisma.js";
import {BaseResponseData, ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {
    CreateCardSetCardsRequest,
    GetCardSetCardsRequest,
    GetCardSetCardsResponseData,
    UpdateCardCardSetsRequest,
    UpdateCardCardSetsResponseData, UpdateCardSetCardsOrderRequest, UpdateCardSetCardsOrderResponseData,
    validateCreateCardSetCardsRequest, validateGetCardSetCardsRequest,
    validateUpdateCardCardSetsRequest, validateUpdateCardSetCardsOrderRequest
} from "@elr0berto/robert-learns-shared/api/card-set-cards";
import {checkPermissions} from "../permissions.js";
import {Capability} from "@elr0berto/robert-learns-shared/permissions";
import { CardSetCard as PrismaCardSetCard } from '@prisma/client';
import logger, {logWithRequest} from "../logger.js";


const cardSetCards = Router();

cardSetCards.post('/get-card-set-cards', async (req : Request<unknown, unknown, GetCardSetCardsRequest>, res : TypedResponse<GetCardSetCardsResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        const errors = validateGetCardSetCardsRequest(req.body);
        if (errors.length > 0) {
            logWithRequest('error', req, 'validateGetCardSetCardsRequest failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join('\n'),
                cardSetCardDatas: null,
            });
        }

        let cardSetCards: PrismaCardSetCard[];
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
                logWithRequest('error', req, 'checkPermissions failed', {user, cardSetId, capability: Capability.ViewCardSet});
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    errorMessage: 'You are not authorized to read cards for this card set',
                    cardSetCardDatas: null,
                });
            }
        }

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            cardSetCardDatas: cardSetCards.map(cs => getCardSetCardData(cs))
        });
    } catch (ex) {
        console.error('/card-set-cards/get caught ex', ex);
        next(ex);
        return;
    }
});

cardSetCards.post('/create-card-set-cards', async (req : Request<unknown, unknown, CreateCardSetCardsRequest>, res : TypedResponse<BaseResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        const errors = validateCreateCardSetCardsRequest(req.body);
        if (errors.length > 0) {
            logWithRequest('error', req, 'validateCreateCardSetCardsRequest failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join('\n'),
            });
        }

        const cardSetId = req.body.cardSetId;

        //if (!await canUserCreateCardsForCardSetId(user, cardSetId)) {
        if (!await checkPermissions({user, cardSetId, capability: Capability.CreateCard})) {
            logWithRequest('error', req, 'checkPermissions failed', {user, cardSetId, capability: Capability.CreateCard});
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
            logWithRequest('error', req, 'cards.length !== cardIds.length', {cards, cardIds})
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
                    logWithRequest('error', req, 'cardSetWorkspaceId !== card.cardSetCards[0].cardSet.workspaceId', {cardSetWorkspaceId, cardSet: card.cardSetCards[0].cardSet});
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
            logWithRequest('error', req, 'existingCardSetCards.length > 0', {existingCardSetCards});
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
    } catch (ex) {
        console.error('/card-set-cards/create caught ex', ex);
        next(ex);
        return;
    }
});

cardSetCards.post('/update-card-card-sets', async (req : Request<unknown, unknown, UpdateCardCardSetsRequest>, res : TypedResponse<UpdateCardCardSetsResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        const errors = validateUpdateCardCardSetsRequest(req.body);
        if (errors.length > 0) {
            logWithRequest('error', req, 'validateUpdateCardCardSetsRequest failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join('\n'),
                cardData: null,
                cardSetCardDatas: null,
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
            logWithRequest('error', req, '!card', {cardId});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Card does not exist',
                cardData: null,
                cardSetCardDatas: null,
            });
        }

        //if (!await canUserEditCard(user, card)) {
        if (!await checkPermissions({user, card, capability: Capability.EditCard})) {
            logWithRequest('error', req, 'checkPermissions failed', {user, card, capability: Capability.EditCard});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'You are not authorized to edit this card',
                cardData: null,
                cardSetCardDatas: null,
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
            logWithRequest('error', req, 'cardSets.length !== cardSetIds.length', {cardSets, cardSetIds})
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'One or more card sets do not exist',
                cardData: null,
                cardSetCardDatas: null,
            });
        }

        const cardWorkspaceId = card.cardSetCards[0].cardSet.workspaceId;

        for (const key in cardSets) {
            const cardSet = cardSets[key];

            if (cardWorkspaceId !== cardSet.workspaceId) {
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    errorMessage: 'One or more card sets do not belong to the same workspace as the card',
                    cardData: null,
                    cardSetCardDatas: null,
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
    } catch (ex) {
        console.error('/card-set-cards/updateCardCardSets caught ex', ex);
        next(ex);
        return;
    }
});

// updateCardSetCardsOrder
cardSetCards.post('/update-card-set-cards-order', async (req : Request<unknown, unknown, UpdateCardSetCardsOrderRequest>, res : TypedResponse<UpdateCardSetCardsOrderResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);
        const errors = validateUpdateCardSetCardsOrderRequest(req.body);
        if (errors.length > 0) {
            logWithRequest('error', req, 'validateUpdateCardSetCardsOrderRequest failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join('\n'),
                cardSetCardDatas: null,
            });
        }

        // check that user is allowed to edit card set
        const cardSetId = req.body.cardSetId;
        if (!await checkPermissions({user, cardSetId, capability: Capability.EditCardSet})) {
            logWithRequest('error', req, 'checkPermissions failed', {user, cardSetId, capability: Capability.EditCardSet});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'You are not authorized to edit this card set',
                cardSetCardDatas: null,
            });
        }

        const cardIds = req.body.cardIds.reverse();

        // get all the card-sets-cards with cardSetId and cardIds
        const cardSetCards = await prisma.cardSetCard.findMany({
            where: {
                cardSetId: cardSetId,
            }
        });

        // set the order column in each cardSetCard based on the order of cardIds in the request
        for (const key in cardIds) {
            const cardId = cardIds[key];
            const cardSetCard = cardSetCards.find(csc => csc.cardId === cardId);
            if (!cardSetCard) {
                throw new Error('cardSetCard not found, cardId: ' + cardId);
            }
            cardSetCard.order = parseInt(key);
            // save the cardSetCard
            await prisma.cardSetCard.update({
                where: {
                    cardId_cardSetId: {
                        cardId: cardSetCard.cardId,
                        cardSetId: cardSetCard.cardSetId,
                    },
                },
                data: {
                    order: cardSetCard.order,
                }
            });
        }

        // return all the cardSetCards
        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            cardSetCardDatas: cardSetCards.map(csc => getCardSetCardData(csc)),
        });
    } catch (ex) {
        console.error('/card-set-cards/updateCardSetCardsOrder caught ex', ex);
        next(ex);
        return;
    }
});

export default cardSetCards;