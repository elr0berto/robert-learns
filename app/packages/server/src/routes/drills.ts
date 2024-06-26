import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {getDrillCardSetData, getDrillData, getSignedInUser, TypedResponse} from "../common.js";
import {ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {
    CreateDrillRequest,
    CreateDrillResponseData,
    GetDrillsResponseData, validateCreateDrillRequest
} from "@elr0berto/robert-learns-shared/api/drills";
import {logWithRequest} from "../logger.js";
import {checkPermissions} from "../permissions.js";
import {Capability} from "@elr0berto/robert-learns-shared/permissions";
import {GetDrillsRequest} from "@elr0berto/robert-learns-shared/api/drills";
import {validateGetDrillsRequest} from "@elr0berto/robert-learns-shared/api/drills";

const drills = Router();

drills.post('/get-drills', async (req: Request<unknown, unknown, GetDrillsRequest>, res : TypedResponse<GetDrillsResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        if (!user) {
            return res.json({
                dataType: true,
                status: ResponseStatus.Success,
                errorMessage: null,
                drillDatas: null,
            });
        }

        // validate request
        const errors = validateGetDrillsRequest(req.body);
        if (errors.length !== 0) {
            logWithRequest('error', req, 'Get drills request validation failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join(', '),
                drillDatas: null,
            });
        }

        const requestBodyHasDrillIds : boolean = req.body.drillIds !== null && req.body.drillIds !== undefined;
        const drills = await prisma.drill.findMany({
            where: !requestBodyHasDrillIds ? {
                userId: user.id,
            } : {
                id: {
                    in: req.body.drillIds
                }
            },
        });

        // check that all drills are owned by user
        if (req.body.drillIds !== null) {
            for (const drill of drills) {
                if (drill.userId !== user.id) {
                    logWithRequest('error', req, `User ${user.id} is not allowed to view drill ${drill.id}`);
                    return res.json({
                        dataType: true,
                        status: ResponseStatus.UnexpectedError,
                        errorMessage: `You are not allowed to view drill ${drill.id}`,
                        drillDatas: null,
                    });
                }
            }
        }

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            drillDatas: drills.map(w => getDrillData(w)),
        });
    } catch (ex) {
        console.error('/drills/get-drills caught ex', ex);
        next(ex);
        return;
    }
});

drills.post('/create-drill', async (req: Request<unknown, unknown, CreateDrillRequest>, res : TypedResponse<CreateDrillResponseData>, next) => {
    try {
        const signedInUser = await getSignedInUser(req.session);

        if (signedInUser === null) {
            logWithRequest('error', req, 'Guest users are not allowed to create or edit drills. please sign in first!');
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Guest users are not allowed to create or edit drills. please sign in first!',
                drillData: null,
                drillCardSetDatas: null,
            });
        }

        const errors = validateCreateDrillRequest(req.body);

        if (errors.length !== 0) {
            logWithRequest('error', req, 'Create drill request validation failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join(', '),
                drillData: null,
                drillCardSetDatas: null,
            });
        }

        // loop over req.body.cardSetIds
        for (const cardSetId of req.body.cardSetIds) {
            // check if user has permission to view cardSetId
            if (!await checkPermissions({
                user: signedInUser,
                cardSetId,
                capability: Capability.ViewCardSet,
            })) {
                logWithRequest('error', req, `You are not allowed to view card set ${cardSetId}`);
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    errorMessage: `You are not allowed to view card set ${cardSetId}`,
                    drillData: null,
                    drillCardSetDatas: null,
                });
            }
        }

        const scope = req.body.drillId === null ? 'create' : 'update';

        if (scope === 'create') {
            const drill = await prisma.drill.create({
                data: {
                    name: req.body.name,
                    description: req.body.description,
                    userId: signedInUser.id,
                    drillCardSets: {
                        create: req.body.cardSetIds.map(cardSetId => ({
                            cardSet: {
                                connect: {
                                    id: cardSetId
                                },
                            },
                        })),
                    },
                },
                include: {
                    drillCardSets: true,
                }
            });

            return res.json({
                dataType: true,
                status: ResponseStatus.Success,
                errorMessage: null,
                drillData: getDrillData(drill),
                drillCardSetDatas: drill.drillCardSets.map(dcs => getDrillCardSetData(dcs)),
            });
        } else {
            if (req.body.drillId === null) {
                throw new Error('Invalid drill id');
            }
            const drill = await prisma.drill.update({
                where: {
                    id: req.body.drillId,
                },
                data: {
                    name: req.body.name,
                    description: req.body.description,
                    drillCardSets: {
                        deleteMany: {},
                        create: req.body.cardSetIds.map(cardSetId => ({
                            cardSet: {
                                connect: {
                                    id: cardSetId
                                },
                            },
                        })),
                    },
                },
                include: { drillCardSets: true },
            });

            return res.json({
                dataType: true,
                status: ResponseStatus.Success,
                errorMessage: null,
                drillData: getDrillData(drill),
                drillCardSetDatas: drill.drillCardSets.map(dcs => getDrillCardSetData(dcs)),
            });

        }

    } catch (ex) {
        console.error('/drills/create-drill caught ex', ex);
        next(ex);
        return;
    }
});
export default drills;