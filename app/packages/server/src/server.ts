import express from 'express';

import signIn from './routes/sign-in.js';
import signOut from "./routes/sign-out.js";
import signUp from './routes/sign-up.js';
import workspaces from './routes/workspaces.js';
import cardSets from './routes/card-sets.js';

import session from './session.js';

class Server {
    public express;

    constructor() {
        this.express = express();

        this.middlewares();
        this.routes();
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
        this.express.use('/api/card-sets', cardSets);
    }
}

const server = new Server();
server.express.listen(3333);