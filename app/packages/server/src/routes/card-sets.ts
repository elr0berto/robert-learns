import {Request,Router} from 'express';
import {getCardSetData, getSignedInUser, getUserData, TypedResponse} from "../common.js";
import {canUserContributeToWorkspaceId, canUserViewWorkspaceId} from "../security.js";
import prisma from "../db/prisma.js";
import { ResponseStatus } from '@elr0berto/robert-learns-shared/api/models';
import {
    CreateCardSetRequest, CreateCardSetResponseData,
    GetCardSetsRequest,
    GetCardSetsResponseData, validateCreateCardSetRequest
} from '@elr0berto/robert-learns-shared/api/cardSets';


const cardSets = Router();

cardSets.post('/get', async (req : Request<{}, {}, GetCardSetsRequest>, res : TypedResponse<GetCardSetsResponseData>) => {
    let user = await getSignedInUser(req.session);

    const hasRights = canUserViewWorkspaceId(user,req.body.workspaceId);
    if (!hasRights) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'You are not allowed to view this workspace.',
            signedInUserData: null,
            cardSetDatas: null,
        });
    }

    const cardSets = await prisma.cardSet.findMany({
        where: {
            workspaceId: {
                equals: req.body.workspaceId
            }
        },
    });

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        signedInUserData: getUserData(user),
        errorMessage: null,
        cardSetDatas: cardSets.map(cs => getCardSetData(cs))
    });
});


cardSets.post('/create', async (req: Request<{}, {}, CreateCardSetRequest>, res : TypedResponse<CreateCardSetResponseData>) => {
    let user = await getSignedInUser(req.session);

    if (user.isGuest) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'Guest users are not allowed to create card sets. please sign in first!',
            signedInUserData: null,
            cardSetData: null,
        });
    }

    const errors = validateCreateCardSetRequest(req.body);

    if (errors.length !== 0) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: errors.join(', '),
            signedInUserData: null,
            cardSetData: null,
        });
    }

    const hasRights = canUserContributeToWorkspaceId(user,req.body.workspaceId);
    if (!hasRights) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'You are not allowed to create card sets in this workspace.',
            signedInUserData: null,
            cardSetData: null,
        });
    }

    const scope = req.body.cardSetId ? 'edit' : 'create';

    let returnCardSetId : number;
    if (scope === 'create') {
        const existingCardSetWithSameName = await prisma.cardSet.findFirst({
            where: {
                name: req.body.name,
                workspaceId: req.body.workspaceId,
            }
        });

        if (existingCardSetWithSameName) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UserError,
                errorMessage: 'A card set with the same name already exists in this workspace.',
                signedInUserData: null,
                cardSetData: null,
            });
        }

        const returnCardSet = await prisma.cardSet.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                workspaceId: req.body.workspaceId,
            }
        });
        returnCardSetId = returnCardSet.id;
    } else {
        const existingCardSet = await prisma.cardSet.findUniqueOrThrow({
            where: {
                id: req.body.cardSetId,
            }
        });

        if (existingCardSet.workspaceId !== req.body.workspaceId) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Access denied',
                signedInUserData: null,
                cardSetData: null,
            });
        }

        if (existingCardSet.name !== req.body.name || existingCardSet.description !== req.body.description) {
            if (existingCardSet.name !== req.body.name) {
                const existingCardSetWithSameName = await prisma.cardSet.findFirst({
                    where: {
                        name: req.body.name,
                        workspaceId: req.body.workspaceId,
                    }
                });

                if (existingCardSetWithSameName) {
                    return res.json({
                        dataType: true,
                        status: ResponseStatus.UserError,
                        errorMessage: 'A card set with the same name already exists in this workspace.',
                        signedInUserData: null,
                        cardSetData: null,
                    });
                }
            }

            await prisma.cardSet.update({
                where: {
                    id: req.body.cardSetId,
                },
                data: {
                    name: req.body.name,
                    description: req.body.description,
                }
            });
        }
        returnCardSetId = existingCardSet.id;
    }

    user = await getSignedInUser(req.session);

    const returnCardSet = await prisma.cardSet.findUniqueOrThrow({
        where: {
            id: returnCardSetId
        }
    });

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        signedInUserData: getUserData(user),
        errorMessage: null,
        cardSetData: getCardSetData(returnCardSet),
    });
});

export default cardSets;