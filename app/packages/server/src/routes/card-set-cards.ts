import {Request,Router} from 'express';
import {getCardSetCardData, getSignedInUser, getUserData, TypedResponse} from "../common.js";
import {canUserCreateCardsForCardSetId, canUserViewCardSetId} from "../security.js";
import prisma from "../db/prisma.js";
import {BaseResponseData, ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {
    CreateCardSetCardsRequest,
    GetCardSetCardsRequest,
    GetCardSetCardsResponseData, validateCreateCardSetCardsRequest
} from "@elr0berto/robert-learns-shared/api/card-set-cards";


const cardSetCards = Router();

cardSetCards.post('/get', async (req : Request<{}, {}, GetCardSetCardsRequest>, res : TypedResponse<GetCardSetCardsResponseData>) => {
    let user = await getSignedInUser(req.session);

    for(const key in req.body.cardSetIds) {
        const cardSetId = req.body.cardSetIds[key];

        if (!await canUserViewCardSetId(user, cardSetId)) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                signedInUserData: getUserData(user),
                errorMessage: 'You are not authorized to view this card set',
                cardSetCardDatas: [],
            });
        }
    }


    const cardSetCards = await prisma.cardSetCard.findMany({
        where: {
            cardSetId: {
                in: req.body.cardSetIds
            }
        },
    });

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        signedInUserData: getUserData(user),
        errorMessage: null,
        cardSetCardDatas: cardSetCards.map(cs => getCardSetCardData(cs))
    });
});

cardSetCards.post('/create', async (req : Request<{}, {}, CreateCardSetCardsRequest>, res : TypedResponse<BaseResponseData>) => {
    let user = await getSignedInUser(req.session);

    const errors = validateCreateCardSetCardsRequest(req.body);
    if (errors.length > 0) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            signedInUserData: getUserData(user),
            errorMessage: errors.join('\n'),
        });
    }

    const cardSetId = req.body.cardSetId;

    if (!await canUserCreateCardsForCardSetId(user, cardSetId)) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            signedInUserData: getUserData(user),
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
            sets: {
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
            signedInUserData: getUserData(user),
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

    const cardSetWorkspaceId = cardSet!.workspace.id;

    for(const key in cards) {
        const card = cards[key];

        if (card.sets.length > 0) {
            if (cardSetWorkspaceId !== card.sets[0].cardSet.workspaceId) {
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    signedInUserData: getUserData(user),
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
            signedInUserData: getUserData(user),
            errorMessage: 'One or more cards already exist in the card set',
        });
    }

    // create card set cards
    const cardSetCards = await prisma.cardSetCard.createMany({
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
        signedInUserData: getUserData(user),
        errorMessage: null,
    });
});

export default cardSetCards;