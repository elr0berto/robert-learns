import {Request,Router} from 'express';
import {getCardSetCardData, getSignedInUser, getUserData, TypedResponse} from "../common.js";
import {canUserViewCardSetId} from "../security.js";
import prisma from "../db/prisma.js";
import { ResponseStatus } from '@elr0berto/robert-learns-shared/api/models';
import {GetCardSetCardsRequest, GetCardSetCardsResponseData} from "@elr0berto/robert-learns-shared/api/card-set-cards";


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
    });

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        signedInUserData: getUserData(user),
        errorMessage: null,
        cardSetCardDatas: cardSetCards.map(cs => getCardSetCardData(cs))
    });
});


export default cardSetCards;