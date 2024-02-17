import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {getDrillData, getDrillRunData, getSignedInUser, TypedResponse} from "../common.js";
import {ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {logWithRequest} from "../logger.js";
import {
    CreateDrillRunRequest, CreateDrillRunResponseData,
    GetDrillRunsRequest,
    GetDrillRunsResponseData, validateCreateDrillRunRequest
} from "@elr0berto/robert-learns-shared/api/drill-runs";
import {validateGetDrillRunsRequest} from "@elr0berto/robert-learns-shared/api/drill-runs";

const drillRuns = Router();

drillRuns.post('/get-drill-runs', async (req: Request<unknown, unknown, GetDrillRunsRequest>, res : TypedResponse<GetDrillRunsResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        if (!user) {
            return res.json({
                dataType: true,
                status: ResponseStatus.Success,
                errorMessage: null,
                drillDatas: null,
                drillRunDatas: null,
            });
        }

        // validate request
        const errors = validateGetDrillRunsRequest(req.body);
        if (errors.length !== 0) {
            logWithRequest('error', req, 'Get drill runs request validation failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join(', '),
                drillDatas: null,
                drillRunDatas: null,
            });
        }

        const drillRuns = await prisma.drillRun.findMany({
            where: {
                id: {
                    in: req.body.drillRunIds
                }
            },
            include: {
                drill: true,
            }
        });

        // check that all drills are owned by user
        for (const drillRun of drillRuns) {
            if (drillRun.drill.userId !== user.id) {
                logWithRequest('error', req, `User ${user.id} is not allowed to view drill run ${drillRun.id}`);
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    errorMessage: `User ${user.id} is not allowed to view drill run ${drillRun.id}`,
                    drillDatas: null,
                    drillRunDatas: null,
                });
            }
        }

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            drillRunDatas: drillRuns.map(dr => getDrillRunData(dr)),
            drillDatas: drillRuns.map(dr => getDrillData(dr.drill)),
        });
    } catch (ex) {
        console.error('/drill-runs/get-drill-runs caught ex', ex);
        next(ex);
        return;
    }
});

drillRuns.post('/create-drill-run', async (req: Request<unknown, unknown, CreateDrillRunRequest>, res : TypedResponse<CreateDrillRunResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        if (!user) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'User not signed in',
                drillRunData: null,
            });
        }

        // validate request
        const errors = validateCreateDrillRunRequest(req.body);
        if (errors.length !== 0) {
            logWithRequest('error', req, 'Create drill run request validation failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join(', '),
                drillRunData: null,
            });
        }

        const drillRun = await prisma.drillRun.create({
            data: {
                drillId: req.body.drillId,
                // startTime is set to the current time automatically by db.
            },
            include: {
                drill: true,
            }
        });

        // check that the drill exists and is owned by the user
        if (!drillRun.drill) {
            logWithRequest('error', req, `Drill ${req.body.drillId} does not exist`);
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: `Drill ${req.body.drillId} does not exist`,
                drillRunData: null,
            });
        }

        if (drillRun.drill.userId !== user.id) {
            logWithRequest('error', req, `User ${user.id} is not allowed to create a drill run for drill ${req.body.drillId}`);
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: `User ${user.id} is not allowed to create a drill run for drill ${req.body.drillId}`,
                drillRunData: null,
            });
        }

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            drillRunData: getDrillRunData(drillRun),
        });
    } catch (ex) {
        console.error('/drill-runs/create-drill-run caught ex', ex);
        next(ex);
        return;
    }
});

export default drillRuns;