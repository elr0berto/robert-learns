import express, {NextFunction, Request, Response} from 'express';
import signIn from './routes/sign-in.js';
import signOut from "./routes/sign-out.js";
import signUp from './routes/sign-up.js';
import workspaces from './routes/workspaces.js';
import workspaceUsers from './routes/workspace-users.js';
import cardSets from './routes/card-sets.js';
import cardSetCards from './routes/card-set-cards.js';
import media from './routes/media.js';
import cards from './routes/cards.js';
import users from './routes/users.js';
import logs from './routes/logs.js';
import drills from './routes/drills.js';
import drillRuns from './routes/drill-runs.js';
import drillCardSets from './routes/drill-card-sets.js';

import session from './session.js';
import logger from "./logger.js";
import {BaseResponseData, ResponseStatus} from "@elr0berto/robert-learns-shared/api/models";
import {TypedResponse} from "./common.js";
import {GetDrillsResponseData} from "@elr0berto/robert-learns-shared/api/drills";
import {GetVersionResponseData} from "@elr0berto/robert-learns-shared/api/version";

class Server {
    public express;

    constructor() {
        this.express = express();

        this.middlewares();
        this.routes();
        this.setupErrorHandler();
    }

    middlewares() {
        this.express.use(session)
        this.express.use(express.json());
    }

    routes() {
        this.express.use('/api/logs', logs);
        this.express.use('/api/sign-in', signIn);
        this.express.use('/api/sign-out', signOut);
        this.express.use('/api/sign-up', signUp);
        this.express.use('/api/workspaces', workspaces);
        this.express.use('/api/workspace-users', workspaceUsers);
        this.express.use('/api/card-sets', cardSets);
        this.express.use('/api/card-set-cards', cardSetCards);
        this.express.use('/api/media', media);
        this.express.use('/api/cards', cards);
        this.express.use('/api/users', users);
        this.express.use('/api/drills', drills);
        this.express.use('/api/drill-runs', drillRuns);
        this.express.use('/api/drill-card-sets', drillCardSets);
        this.express.use('/api/version', (_: Request, res: TypedResponse<GetVersionResponseData>) => {
            return res.json({
                dataType: true,
                status: ResponseStatus.Success,
                errorMessage: null,
                version: process.env.RL_SERVER_VERSION ?? 'und',
            });
        })
    }

    setupErrorHandler() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.express.use((err: Error, req: Request, res: Response, _: NextFunction) => {  // this needs to be 4 params to be an error handler.......
            console.log('inside logger');
            logger.error(`${req.method} - ${req.url} - ${err.message}`);

            const response : BaseResponseData = {
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: null,
            }
            return res.json(response);
        });
    }
}

const server = new Server();
console.log('starting to listen on port 3333');
server.express.listen(3333);