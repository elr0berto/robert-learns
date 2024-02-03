import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {getCardSetCardData, getDrillCardSetData, getDrillData, getSignedInUser, TypedResponse} from "../common.js";
import {BaseResponseData, ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {logWithRequest} from "../logger.js";
import {checkPermissions} from "../permissions.js";
import {Capability} from "@elr0berto/robert-learns-shared/permissions";
import {
    GetDrillCardSetsResponseData,
    validateGetDrillCardSetsRequest
} from "@elr0berto/robert-learns-shared/api/drill-card-sets";

const drillCardSets = Router();

drillCardSets.post('/get-drill-card-sets', async (req, res : TypedResponse<GetDrillCardSetsResponseData>, next) => {
    try {
        const signedInUser = await getSignedInUser(req.session);

        const errors = validateGetDrillCardSetsRequest(req.body);
        if (errors.length > 0) {
            logWithRequest('error', req, 'validateGetDrillCardSetsRequest failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join('\n'),
                drillCardSetDatas: null,
            });
        }

        // check that user is signed in
        if (signedInUser === null) {
            logWithRequest('error', req, 'Guest users are not allowed to view drills. please sign in first!');
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Guest users are not allowed to view drills. please sign in first!',
                drillCardSetDatas: null,
            });
        }

        // check that every drill in req.body.drillIds is owned by the signed in user
        const drills = await prisma.drill.findMany({
            where: {
                id: {
                    in: req.body.drillIds
                },
                userId: signedInUser.id,
            },
            include: {
                drillCardSets: true,
            }
        });

        if (drills.length !== req.body.drillIds.length) {
            logWithRequest('error', req, 'drill ownership check failed', {drills, drillIds: req.body.drillIds});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'You are not authorized to view drills for this drill set',
                drillCardSetDatas: null,
            });
        }

        // get cardSetIds for each drill
        const cardSetIds = drills.map(d => d.drillCardSets.map(dcs => dcs.cardSetId)).flat();

        // loop over req.body.cardSetIds
        for (const cardSetId of cardSetIds) {
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
                    drillCardSetDatas: null,
                });
            }
        }

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            drillCardSetDatas: drills.map(drill => drill.drillCardSets.map(dcs => getDrillCardSetData(dcs))).flat(),
        });
    } catch (ex) {
        console.error('/drill-card-sets/get-drill-card-sets caught ex', ex);
        next(ex);
        return;
    }
});

export default drillCardSets;