import {Request, Router} from 'express';
import {getCardSetData, getSignedInUser, TypedResponse} from "../common.js";
import prisma from "../db/prisma.js";
import {BaseResponseData, ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {
    CreateCardSetRequest,
    CreateCardSetResponseData, DeleteCardSetRequest,
    GetCardSetsRequest,
    GetCardSetsResponseData,
    validateCreateCardSetRequest
} from '@elr0berto/robert-learns-shared/api/card-sets';
import {checkPermissions} from "../permissions.js";
import {Capability} from "@elr0berto/robert-learns-shared/permissions";
import workspaces from "./workspaces.js";


const cardSets = Router();

cardSets.post('/get', async (req : Request<unknown, unknown, GetCardSetsRequest>, res : TypedResponse<GetCardSetsResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        const hasRights = await checkPermissions({
            user: user,
            workspaceId: req.body.workspaceId,
            capability: Capability.ViewWorkspace
        });

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
    } catch (ex) {
        console.error('/card-sets/get caught ex', ex);
        next(ex);
        return;
    }
});


cardSets.post('/create', async (req: Request<unknown, unknown, CreateCardSetRequest>, res : TypedResponse<CreateCardSetResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

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
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Guest users are not allowed to delete workspaces.',
            });
        }

        if (!await checkPermissions({
            user: signedInUser,
            cardSetId: req.body.cardSetId,
            capability: Capability.DeleteCardSet,
        })) {
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
                },
            });

            if (cardSet.cards.length > 0) {
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UserError,
                    errorMessage: 'Cannot delete card set with cards. Please delete or move all cards from the card set first.',
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


export default cardSets;