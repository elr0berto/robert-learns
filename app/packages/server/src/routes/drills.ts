import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {getDrillData, getSignedInUser, TypedResponse} from "../common.js";
import {BaseResponseData, ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {
    CreateDrillRequest,
    CreateDrillResponseData,
    GetDrillsResponseData, validateCreateDrillRequest
} from "@elr0berto/robert-learns-shared/api/drills";
import {logWithRequest} from "../logger.js";
import {checkPermissions} from "../permissions.js";
import {Capability} from "@elr0berto/robert-learns-shared/permissions";

const drills = Router();

drills.post('/get-drills', async (req, res : TypedResponse<GetDrillsResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        if (!user) {
            return res.json({
                dataType: true,
                status: ResponseStatus.Success,
                errorMessage: null,
                drillDatas: [],
            });
        }

        const drills = await prisma.drill.findMany({
            where: {
                userId: user.id,
            },
        });

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
            });
        }

        // loop over req.body.cardSetIds
        for (const cardSetId of req.body.cardSetIds) {
            // check if user has permission to edit cardSetId
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
            });

            return res.json({
                dataType: true,
                status: ResponseStatus.Success,
                errorMessage: null,
                drillData: getDrillData(drill),
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
            });

            return res.json({
                dataType: true,
                status: ResponseStatus.Success,
                errorMessage: null,
                drillData: getDrillData(drill),
            });

        }

    } catch (ex) {
        console.error('/drills/create-drill caught ex', ex);
        next(ex);
        return;
    }
});
export default drills;