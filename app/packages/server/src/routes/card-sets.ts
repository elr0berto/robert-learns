import {Request, Router} from 'express';
import {getCardSetData, getSignedInUser, TypedResponse} from "../common.js";
import prisma from "../db/prisma.js";
import {BaseResponseData, ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {
    CreateCardSetRequest,
    CreateCardSetResponseData, DeleteCardSetRequest,
    GetCardSetsRequest,
    GetCardSetsResponseData, UpdateCardSetsOrderRequest,
    validateCreateCardSetRequest,
    validateDeleteCardSetRequest,
    validateGetCardSetsRequest, validateUpdateCardSetsOrderRequest
} from '@elr0berto/robert-learns-shared/api/card-sets';
import {checkPermissions} from "../permissions.js";
import {Capability} from "@elr0berto/robert-learns-shared/permissions";
import {logWithRequest} from "../logger.js";


const cardSets = Router();

cardSets.post('/get-card-sets', async (req : Request<unknown, unknown, GetCardSetsRequest>, res : TypedResponse<GetCardSetsResponseData>, next) => {
    try {
        const errors = validateGetCardSetsRequest(req.body);

        if (errors.length !== 0) {
            logWithRequest('error', req, 'Invalid get card sets request', {errors: errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join(', '),
                cardSetDatas: null,
            });
        }

        const user = await getSignedInUser(req.session);

        // loop over req.body.workspaceIds and check if user has rights to view each workspace
        for (const workspaceId of req.body.workspaceIds) {
            const hasRights = await checkPermissions({
                user: user,
                workspaceId: workspaceId,
                capability: Capability.ViewWorkspace
            });

            if (!hasRights) {
                logWithRequest('error', req, 'User does not have rights to view workspace', {user, workspaceId, capability: Capability.ViewWorkspace});
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    errorMessage: 'You are not allowed to view this workspace.',
                    cardSetDatas: null,
                });
            }
        }

        // get cardSets for all workspaceIds from prisma
        const cardSets = await prisma.cardSet.findMany({
            where: {
                workspaceId: {
                    in: req.body.workspaceIds
                }
            },
        });

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            cardSetDatas: cardSets.map(cs => getCardSetData(cs))
        });
    } catch (ex) {
        console.error('/card-sets/get caught ex', ex);
        next(ex);
        return;
    }
});


cardSets.post('/create-card-set', async (req: Request<unknown, unknown, CreateCardSetRequest>, res : TypedResponse<CreateCardSetResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        const errors = validateCreateCardSetRequest(req.body);

        if (errors.length !== 0) {
            logWithRequest('error', req, 'Invalid create card set request', {errors: errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join(', '),
                cardSetData: null,
            });
        }

        const hasRights = await checkPermissions({user: user, workspaceId: req.body.workspaceId, capability: Capability.CreateCardSet});

        if (!hasRights) {
            logWithRequest('error', req, 'User does not have rights to create card set', {user, workspaceId: req.body.workspaceId, capability: Capability.CreateCardSet});
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
                logWithRequest('error', req, 'existingCardSet.workspaceId !== req.body.workspaceId', {user, existingCardSetWorkspaceId: existingCardSet.workspaceId, reqBodyWorkspaceId: req.body.workspaceId});
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
    } catch (ex) {
        console.error('/card-sets/create caught ex', ex);
        next(ex);
        return;
    }
});


cardSets.post('/delete-card-set', async (req: Request<unknown, unknown, DeleteCardSetRequest>, res : TypedResponse<BaseResponseData>, next) => {
    try {
        const signedInUser = await getSignedInUser(req.session);

        if (signedInUser === null) {
            logWithRequest('error', req, 'Guest users are not allowed to delete card sets');
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Guest users are not allowed to delete card sets.',
            });
        }

        const errors = validateDeleteCardSetRequest(req.body);

        if (errors.length !== 0) {
            logWithRequest('error', req, 'Invalid delete card set request', {errors: errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join(', '),
            });
        }



        if (!await checkPermissions({
            user: signedInUser,
            cardSetId: req.body.cardSetId,
            capability: Capability.DeleteCardSet,
        })) {
            logWithRequest('error', req, 'User does not have rights to delete card set', {user: signedInUser, cardSetId: req.body.cardSetId, capability: Capability.DeleteCardSet});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'You are not allowed to delete this card set',
            });
        }

        const resp = await prisma.$transaction(async tx => {
            const cardSet = await tx.cardSet.findUniqueOrThrow({
                where: {
                    id: req.body.cardSetId
                },
                include: {
                    workspace: true,
                    cards: true,
                    includedCardSets: true,
                },
            });

            if (cardSet.cards.length > 0) {
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UserError,
                    errorMessage: 'Cannot delete card set with cards. Please delete or move all cards from the card set first.',
                });
            }

            if (cardSet.includedCardSets.length > 0) {
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UserError,
                    errorMessage: 'Cannot delete card set with included card sets. Please remove all included card sets from the card set first.',
                });
            }

            await tx.cardSet.delete({
                where: {
                    id: req.body.cardSetId
                }
            });

            return res.json({
                dataType: true,
                status: ResponseStatus.Success,
                errorMessage: null,
            });
        });

        return resp;
    } catch (ex) {
        console.error('/card-set/delete-card-set caught ex', ex);
        next(ex);
        return;
    }
});

cardSets.post('/update-card-sets-order', async (req: Request<unknown, unknown, UpdateCardSetsOrderRequest>, res : TypedResponse<BaseResponseData>, next) => {
    try {
        const signedInUser = await getSignedInUser(req.session);

        if (signedInUser === null) {
            logWithRequest('error', req, 'Guest users are not allowed to sort card sets');
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Guest users are not allowed to sort card sets.',
            });
        }

        const errors = validateUpdateCardSetsOrderRequest(req.body);

        if (errors.length !== 0) {
            logWithRequest('error', req, 'Invalid update card sets order request', {errors: errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join(', '),
            });
        }

        const parentIds = Object.keys(req.body.newSorting).map(id => parseInt(id)).filter(id => id !== 0);
        const cardSetIds = Object.values(req.body.newSorting).flat();
        // combine all ids into one array
        const allIds = parentIds.concat(cardSetIds);
        // get distinct ids as array
        const uniqueIds = [...new Set(allIds)];
        const cardSets = await prisma.cardSet.findMany({
            where: {
                id: {
                    in: uniqueIds
                }
            },
        });

        if (cardSets.length !== uniqueIds.length) {
            logWithRequest('error', req, 'Card set ids do not match card sets', {cardSets, uniqueIds});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Card set ids do not match card sets',
            });
        }

        const workspaceIds = cardSets.map(cs => cs.workspaceId);
        if (workspaceIds.length !== 1) {
            logWithRequest('error', req, 'Card sets are in different workspaces', {workspaceIds});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Card sets are in different workspaces',
            });

        }
        const workspaceId = workspaceIds[0];

        if (!await checkPermissions({
            user: signedInUser,
            workspaceId: workspaceId,
            capability: Capability.EditWorkspace,
        })) {
            logWithRequest('error', req, 'User does not have rights to sort card sets', {user: signedInUser, workspaceId, capability: Capability.EditWorkspace});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'You are not allowed to sort card sets in this workspace',
            });
        }

        dsdasdasdasdsad
        // check that the card-set-links exists for each list of card-set-ids except root.
        // start with saving root-card-sets first in the CardSet.order column
        // then save the children card-sets in their card-set-links.
    } catch (ex) {
        console.error('/card-set/update-card-sets-order caught ex', ex);
        next(ex);
        return;
    }
});


export default cardSets;