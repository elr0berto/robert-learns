import {Request, Router} from 'express';
import {getCardSetLinkData, getSignedInUser, TypedResponse} from "../common.js";
import prisma from "../db/prisma.js";
import {ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';

import {checkPermissions} from "../permissions.js";
import {Capability} from "@elr0berto/robert-learns-shared/permissions";
import {logWithRequest} from "../logger.js";
import {
    GetCardSetLinksRequest, GetCardSetLinksResponseData, SetCardSetLinksRequest, SetCardSetLinksResponseData,
    validateGetCardSetLinksRequest, validateSetCardSetLinksRequest
} from "@elr0berto/robert-learns-shared/api/card-set-links";


const cardSetLinks = Router();

cardSetLinks.post('/get-card-set-links', async (req : Request<unknown, unknown, GetCardSetLinksRequest>, res : TypedResponse<GetCardSetLinksResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        const errors = validateGetCardSetLinksRequest(req.body);
        if (errors.length > 0) {
            logWithRequest('error', req, 'validateGetCardSetLinksRequest failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join('\n'),
                cardSetLinkDatas: null,
            });
        }

        // load all the cardSets from the db
        const cardSets = await prisma.cardSet.findMany({
            where: {
                id: {
                    in: req.body.cardSetIds,
                }
            }
        });

        // loop over cardSets and check permissions
        for (const cardSet of cardSets) {
            if (!await checkPermissions({user, cardSetId: cardSet.id, capability: Capability.ViewCardSet})) {
                logWithRequest('error', req, 'checkPermissions failed', {user, cardSetId: cardSet.id, capability: Capability.ViewCardSet});
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    errorMessage: 'You are not authorized to view card sets',
                    cardSetLinkDatas: null,
                });
            }
        }

        const cardSetLinks = await prisma.cardSetLink.findMany({
            where: {
                OR: [
                    {
                        parentCardSetId: {
                            in: req.body.cardSetIds,
                        },
                    },
                    {
                        includedCardSetId: {
                            in: req.body.cardSetIds,
                        },
                    },
                ],
            },
        });


        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            cardSetLinkDatas: cardSetLinks.map(cs => getCardSetLinkData(cs))
        });
    } catch (ex) {
        console.error('/card-set-links/get caught ex', ex);
        next(ex);
        return;
    }
});

cardSetLinks.post('/set-card-set-links', async (req : Request<unknown, unknown, SetCardSetLinksRequest>, res : TypedResponse<SetCardSetLinksResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        if (user === null) {
            logWithRequest('error', req, 'Guest users are not allowed to link card-sets. please sign in first!');
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Guest users are not allowed to link card-sets. please sign in first!',
                cardSetLinkDatas: null,
            });
        }

        const errors = validateSetCardSetLinksRequest(req.body);
        if (errors.length > 0) {
            logWithRequest('error', req, 'validateSetCardSetLinksRequest failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join('\n'),
                cardSetLinkDatas: null,
            });
        }

        const parentCardSet = await prisma.cardSet.findUnique({
            where: {
                id: req.body.parentCardSetId,
            },
        });

        if (!parentCardSet) {
            logWithRequest('error', req, 'parentCardSet not found', {parentCardSetId: req.body.parentCardSetId});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Parent card set not found',
                cardSetLinkDatas: null,
            });
        }

        if (!await checkPermissions({user, cardSetId: parentCardSet.id, capability: Capability.EditCardSet})) {
            logWithRequest('error', req, 'checkPermissions failed', {
                user,
                cardSetId: parentCardSet.id,
                capability: Capability.EditCardSet
            });
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'You are not authorized to edit card sets',
                cardSetLinkDatas: null,
            });
        }

        const cardSets = await prisma.cardSet.findMany({
            where: {
                id: {
                    in: req.body.cardSetIds,
                }
            }
        });

        // loop over cardSets and check permissions
        for (const cardSet of cardSets) {
            if (!await checkPermissions({user, cardSetId: cardSet.id, capability: Capability.ViewCardSet})) {
                logWithRequest('error', req, 'checkPermissions failed', {
                    user,
                    cardSetId: cardSet.id,
                    capability: Capability.ViewCardSet
                });
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    errorMessage: 'You are not authorized to view card sets',
                    cardSetLinkDatas: null,
                });
            }

            // check that cardSet has same workspace as parentCardSet
            if (cardSet.workspaceId !== parentCardSet.workspaceId) {
                logWithRequest('error', req, 'cardSet has different workspace', {
                    cardSetId: cardSet.id,
                    parentCardSetId: parentCardSet.id
                });
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    errorMessage: 'Card set has different workspace',
                    cardSetLinkDatas: null,
                });
            }
        }

        const cardSetLinks = await prisma.cardSetLink.findMany({
            where: {
                parentCardSetId: req.body.parentCardSetId,
            },
        });

        const existingCardSetIds = cardSetLinks.map(csl => csl.includedCardSetId);
        const newCardSetIds = req.body.cardSetIds.filter(id => !existingCardSetIds.includes(id));

        // begin transaction
        await prisma.$transaction([
            // delete cardSetLinks that are no longer in the list
            ...cardSetLinks.filter(csl => !req.body.cardSetIds.includes(csl.includedCardSetId)).map(csl => prisma.cardSetLink.delete({
                where: {
                    parentCardSetId_includedCardSetId: {
                        parentCardSetId: req.body.parentCardSetId,
                        includedCardSetId: csl.includedCardSetId,
                    }
                },
            })),
            // create new cardSetLinks
            ...newCardSetIds.map(newCardSetId => prisma.cardSetLink.create({
                data: {
                    parentCardSetId: req.body.parentCardSetId,
                    includedCardSetId: newCardSetId,
                },
            })),
        ]);

        const updatedCardSetLinks = await prisma.cardSetLink.findMany({
            where: {
                parentCardSetId: req.body.parentCardSetId,
            },
        });

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            cardSetLinkDatas: updatedCardSetLinks.map(cs => getCardSetLinkData(cs))
        });
    } catch (ex) {
        console.error('/card-set-links/set caught ex', ex);
        next(ex);
        return;
    }
});

export default cardSetLinks;