import {Request, Router} from "express";
import {getLogEntryData, getSignedInUser, TypedResponse} from "../common.js";
import {GetLogEntriesRequest, GetLogEntriesResponseData, AddLogEntryRequest} from "@elr0berto/robert-learns-shared/api/logs";
import prisma from "../db/prisma.js";
import {BaseResponseData, ResponseStatus} from "@elr0berto/robert-learns-shared/api/models";
import logger from "../logger.js";

const logs = Router();

logs.post('/get-log-entries', async (req : Request<unknown, unknown, GetLogEntriesRequest>, res : TypedResponse<GetLogEntriesResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        if (!user) {
            throw new Error('User is not signed in');
        }
        if (!user.admin) {
            throw new Error('User is not an admin');
        }

        const fromId: number | null = req.body.fromId;

        let whereCondition = {};

        if (fromId !== null) {
            whereCondition = {
                id: {
                    lt: fromId,
                },
            };
        }

        const logs = await prisma.logs.findMany({
            where: whereCondition,
            take: 100,
            orderBy: {
                id: 'desc', // You might want to adjust this depending on your needs
            },
        });

        const resp : GetLogEntriesResponseData = {
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            logEntryDatas: logs.map(log => getLogEntryData(log)),
        };

        return res.json(resp);

    } catch (ex) {
        console.error('/logs/getLogEntries caught ex', ex);
        next(ex);
        return;
    }
});


logs.post('/add-log-entry', async (req : Request<unknown, unknown, AddLogEntryRequest>, res : TypedResponse<BaseResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        // serialize the request to json-string

        const message = JSON.stringify(req.body);
        const username = user?.username ?? 'guest';

        console.log('req.body', req.body);
        console.log('message', message);

        logger.error(`username: ${username} - ${req.method} - ${req.url} - ${message}`);

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
        });
    } catch (ex) {
        console.error('/logs/addLogEntry caught ex', ex);
        next(ex);
        return;
    }
});

export default logs;