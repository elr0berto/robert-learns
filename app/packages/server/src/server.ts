import express, { Request, Response, NextFunction } from 'express';
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

import session from './session.js';
import logger from "./logger.js";
import {ResponseStatus} from "@elr0berto/robert-learns-shared/api/models";

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
    }

    setupErrorHandler() {
        this.express.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
            logger.error(`${req.method} - ${req.url} - ${err.message}`);
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: null,
            });
        });
    }
}

const server = new Server();
server.express.listen(3333);