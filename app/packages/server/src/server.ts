import express from 'express';

import signIn from './routes/sign-in';
import signOut from "./routes/sign-out";
import signUp from './routes/sign-up';

import session from './session';

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
    }
}

const server = new Server();
server.express.listen(3333);