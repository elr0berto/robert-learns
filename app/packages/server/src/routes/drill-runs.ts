import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {getDrillData, getDrillRunData, getDrillRunQuestionData, getSignedInUser, TypedResponse} from "../common.js";
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
                drillRunQuestionDatas: null,
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
                drillRunQuestionDatas: null,
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
                questions: true,
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
                    drillRunQuestionDatas: null,
                });
            }
        }

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            drillRunDatas: drillRuns.map(dr => getDrillRunData(dr)),
            drillDatas: drillRuns.map(dr => getDrillData(dr.drill)),
            drillRunQuestionDatas: drillRuns.flatMap(dr => dr.questions.map(drq => getDrillRunQuestionData(drq))),
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

        const drill = await prisma.drill.findUnique({
            where: {
                id: req.body.drillId
            },
            include: {
                drillCardSets: {
                    include: {
                        cardSet: {
                            include: {
                                cards: true
                            }
                        }
                    }
                }
            }
        });

        if (!drill) {
            logWithRequest('error', req, `Drill ${req.body.drillId} does not exist`);
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: `Drill ${req.body.drillId} does not exist`,
                drillRunData: null,
            });
        }

        // check that the drill is owned by the user
        if (drill.userId !== user.id) {
            logWithRequest('error', req, `User ${user.id} is not allowed to create a drill run for drill ${req.body.drillId}`);
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: `User ${user.id} is not allowed to create a drill run for drill ${req.body.drillId}`,
                drillRunData: null,
            });
        }

        let cardIds = [...new Set(drill.drillCardSets.flatMap(dcs => dcs.cardSet.cards.map(c => c.cardId)))];
        // randomize the order of cardIds
        cardIds = cardIds.sort(() => Math.random() - 0.5);

        const drillRun = await prisma.drillRun.create({
            data: {
                drillId: req.body.drillId,
                questions: {
                    create: cardIds.map((cardId, idx) => ({
                        cardId: cardId,
                        order: idx, // randomized order above
                    })),
                },
            },
            include: {
                drill: true,
                questions: true,
            }
        });

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


drillRuns.post('/answer-question', async (req: Request<unknown, unknown, AnswerQuestionRequest>, res : TypedResponse<AnswerQuestionResponseData>, next) => {
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
        const errors = validateAnswerQuestionRequest(req.body);
        if (errors.length !== 0) {
            logWithRequest('error', req, 'Answer question request validation failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join(', '),
                drillRunData: null,
            });
        }

        const drill = await prisma.drill.findUnique({
            where: {
                id: req.body.drillId
            },
            include: {
                drillCardSets: {
                    include: {
                        cardSet: {
                            include: {
                                cards: true
                            }
                        }
                    }
                }
            }
        });

        if (!drill) {
            logWithRequest('error', req, `Drill ${req.body.drillId} does not exist`);
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: `Drill ${req.body.drillId} does not exist`,
                drillRunData: null,
            });
        }

        // check that the drill is owned by the user
        if (drill.userId !== user.id) {
            logWithRequest('error', req, `User ${user.id} is not allowed to create a drill run for drill ${req.body.drillId}`);
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: `User ${user.id} is not allowed to create a drill run for drill ${req.body.drillId}`,
                drillRunData: null,
            });
        }

        let cardIds = [...new Set(drill.drillCardSets.flatMap(dcs => dcs.cardSet.cards.map(c => c.cardId)))];
        // randomize the order of cardIds
        cardIds = cardIds.sort(() => Math.random() - 0.5);

        const drillRun = await prisma.drillRun.create({
            data: {
                drillId: req.body.drillId,
                questions: {
                    create: cardIds.map((cardId, idx) => ({
                        cardId: cardId,
                        order: idx, // randomized order above
                    })),
                },
            },
            include: {
                drill: true,
                questions: true,
            }
        });

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            drillRunData: getDrillRunData(drillRun),
        });
    } catch (ex) {
        console.error('/drill-runs/answer-question caught ex', ex);
        next(ex);
        return;
    }
});

export default drillRuns;