import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {getDrillData, getSignedInUser, TypedResponse} from "../common.js";
import {BaseResponseData, ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {GetDrillsResponseData} from "@elr0berto/robert-learns-shared/api/drills";

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

export default drills;