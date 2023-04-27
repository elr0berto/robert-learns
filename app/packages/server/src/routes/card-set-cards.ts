import {Request,Router} from 'express';
import {getSignedInUser, getUserData, TypedResponse} from "../common.js";
import {canUserViewCardSetId} from "../security.js";
import prisma from "../db/prisma.js";
import { ResponseStatus } from '@elr0berto/robert-learns-shared/api/models';


const cardSetCards = Router();

cardSetCards.post('/get', async (req : Request<{}, {}, GetCardSetCardsRequest>, res : TypedResponse<GetCardSetCardsResponseData>) => {
    let user = await getSignedInUser(req.session);

    const hasRights = canUserViewCardSetId(user,req.body.cardSetId);
    if (!hasRights) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'You are not allowed to view this workspace.',
            signedInUserData: null,
            cardSetDatas: null,
        });
    }

    const cardSetCards = await prisma.cardSetCard.findMany({
        where: {
            cardSetId: {
                equals: req.body.cardSetId
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