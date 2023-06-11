import {Request, Router} from 'express';
import {getCardSetData, getSignedInUser, TypedResponse} from "../common.js";
import prisma from "../db/prisma.js";
import {ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {
    CreateCardSetRequest,
    CreateCardSetResponseData,
    GetCardSetsRequest,
    GetCardSetsResponseData,
    validateCreateCardSetRequest
} from '@elr0berto/robert-learns-shared/api/card-sets';
import {checkPermissions} from "../permissions.js";
import {Capability} from "@elr0berto/robert-learns-shared/permissions";


const cardSets = Router();

cardSets.post('/get', async (req : Request<{}, {}, GetCardSetsRequest>, res : TypedResponse<GetCardSetsResponseData>) => {
    let user = await getSignedInUser(req.session);

    const hasRights = await checkPermissions({user: user, workspaceId: req.body.workspaceId, capability: Capability.ViewWorkspace});

    if (!hasRights) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'You are not allowed to view this workspace.',
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
        errorMessage: null,
        cardSetDatas: cardSets.map(cs => getCardSetData(cs))
    });
});


cardSets.post('/create', async (req: Request<{}, {}, CreateCardSetRequest>, res : TypedResponse<CreateCardSetResponseData>) => {
    let user = await getSignedInUser(req.session);

    const errors = validateCreateCardSetRequest(req.body);

    if (errors.length !== 0) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: errors.join(', '),
            cardSetData: null,
        });
    }

    const hasRights = await checkPermissions({user: user, workspaceId: req.body.workspaceId, capability: Capability.CreateCardSet});

    if (!hasRights) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'You are not allowed to create card sets in this workspace.',
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

    const returnCardSet = await prisma.cardSet.findUniqueOrThrow({
        where: {
            id: returnCardSetId
        }
    });

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        errorMessage: null,
        cardSetData: getCardSetData(returnCardSet),
    });
});

export default cardSets;